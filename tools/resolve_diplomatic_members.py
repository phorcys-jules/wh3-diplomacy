#!/usr/bin/env python3
"""Join WH3 diplomatic-attitude members with their faction/culture criteria.

Campaign group criteria are attributes of a *member*. They must be kept together:
for example an ACTOR faction criterion and a RECIPIENT culture criterion describe
one directional diplomacy rule. This tool therefore does not flatten individual
criteria into independent faction attitudes.
"""
import argparse
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES = {
    'members': 'campaign_group_members_tables',
    'attitudes': 'campaign_group_member_criteria_diplomatic_attitudes_tables',
    'factions': 'campaign_group_member_criteria_factions_tables',
    'cultures': 'campaign_group_member_criteria_cultures_tables',
    'faction_metadata': 'factions_tables',
    'subculture_metadata': 'cultures_subcultures_tables',
}


def fail(message):
    raise SystemExit(f'diplomatic member resolver failed: {message}')


def read_table(path):
    if not path.is_file():
        fail(f'missing required export: {path}')
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter='\t'))
    if not rows:
        fail(f'empty export: {path}')
    first_column = next(iter(rows[0]), None)
    return [row for row in rows if not (first_column and row.get(first_column, '').startswith('#'))]


def require(rows, columns, label):
    if not rows:
        fail(f'{label} has no data rows')
    missing = set(columns) - set(rows[0])
    if missing:
        fail(f"{label} missing columns: {', '.join(sorted(missing))}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    paths = {name: args.db_dir / table / 'data__.tsv' for name, table in TABLES.items()}
    rows = {name: read_table(path) for name, path in paths.items()}
    require(rows['members'], {'id', 'group'}, TABLES['members'])
    require(rows['attitudes'], {'member', 'attitude'}, TABLES['attitudes'])
    require(rows['factions'], {'member', 'context', 'faction'}, TABLES['factions'])
    require(rows['cultures'], {'member', 'context', 'culture'}, TABLES['cultures'])
    require(rows['faction_metadata'], {'key', 'subculture'}, TABLES['faction_metadata'])
    require(rows['subculture_metadata'], {'subculture', 'culture'}, TABLES['subculture_metadata'])

    group_for_member = {row['id']: row['group'] for row in rows['members']}
    faction_subculture = {row['key']: row['subculture'] for row in rows['faction_metadata'] if row['key']}
    subculture_culture = {row['subculture']: row['culture'] for row in rows['subculture_metadata'] if row['subculture']}
    factions_by_culture = defaultdict(list)
    unresolved_subcultures = set()
    for faction, subculture in faction_subculture.items():
        culture = subculture_culture.get(subculture)
        if culture:
            factions_by_culture[culture].append(faction)
        elif subculture:
            unresolved_subcultures.add(subculture)

    members = {}
    for row in rows['attitudes']:
        member = row['member']
        item = members.setdefault(member, {
            'member': member,
            'group': group_for_member.get(member),
            'attitudes': [],
            'criteria': {'factions': [], 'cultures': []},
        })
        if row['attitude'] not in item['attitudes']:
            item['attitudes'].append(row['attitude'])

    for row in rows['factions']:
        item = members.get(row['member'])
        if not item:
            continue
        item['criteria']['factions'].append({
            'context': row['context'],
            'faction': row['faction'],
            'sourceTable': TABLES['factions'],
        })

    unknown_cultures = set()
    for row in rows['cultures']:
        item = members.get(row['member'])
        if not item:
            continue
        culture = row['culture']
        matches = sorted(factions_by_culture.get(culture, []))
        if not matches:
            unknown_cultures.add(culture)
        item['criteria']['cultures'].append({
            'context': row['context'],
            'culture': culture,
            'matchingFactions': matches,
            'sourceTable': TABLES['cultures'],
        })

    unresolved_groups = sorted(member for member, item in members.items() if not item['group'])
    resolved = sorted(members.values(), key=lambda item: item['member'])
    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'partial',
        'semantics': 'criteria are grouped by campaign group member; contexts are preserved and are not treated as independent attitude modifiers',
        'sourceTables': list(TABLES.values()),
        'members': resolved,
        'diagnostics': {
            'attitudeMemberCount': len(resolved),
            'membersWithFactionCriteria': sum(bool(item['criteria']['factions']) for item in resolved),
            'membersWithCultureCriteria': sum(bool(item['criteria']['cultures']) for item in resolved),
            'unresolvedMemberGroups': unresolved_groups,
            'unknownCultures': sorted(unknown_cultures),
            'unresolvedSubcultures': sorted(unresolved_subcultures),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"joined {len(resolved)} diplomatic attitude members")


if __name__ == '__main__':
    main()
