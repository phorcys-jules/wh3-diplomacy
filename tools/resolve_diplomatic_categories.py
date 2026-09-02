#!/usr/bin/env python3
"""Resolve faction diplomacy category rules from RPFM TSV exports.

This deliberately reports rules and provenance; it does not invent a numeric
turn-1 attitude. Culture/subculture expansion can be supplied when the matching
criteria exports are available.
"""
import argparse, csv, json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES = {
    'members': 'campaign_group_members_tables',
    'factions': 'campaign_group_member_criteria_factions_tables',
    'attitudes': 'campaign_group_member_criteria_diplomatic_attitudes_tables',
}


def read_rows(path):
    with path.open(encoding='utf-8-sig', newline='') as stream:
        return [row for row in csv.DictReader(stream, delimiter='\t')
                if not row.get('member', '').startswith('#')]


def require_columns(rows, columns, label):
    if not rows:
        raise SystemExit(f'resolver failed: {label} export is empty')
    missing = set(columns) - set(rows[0])
    if missing:
        raise SystemExit(f"resolver failed: {label} missing columns: {', '.join(sorted(missing))}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db-dir', type=Path, required=True,
                        help='Directory containing RPFM DB table export folders')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    parser.add_argument('--factions', type=Path,
                        help='Optional text file containing faction keys to keep, one per line')
    args = parser.parse_args()

    paths = {key: args.db_dir / table / 'data__.tsv' for key, table in TABLES.items()}
    missing = [str(path) for path in paths.values() if not path.is_file()]
    if missing:
        raise SystemExit('resolver failed: missing required exported table(s): ' + ', '.join(missing))

    members = read_rows(paths['members'])
    faction_rules = read_rows(paths['factions'])
    attitude_rows = read_rows(paths['attitudes'])
    require_columns(members, {'id', 'group'}, TABLES['members'])
    require_columns(faction_rules, {'member', 'faction', 'context'}, TABLES['factions'])
    require_columns(attitude_rows, {'member', 'attitude'}, TABLES['attitudes'])

    wanted = None
    if args.factions:
        if not args.factions.is_file():
            raise SystemExit(f'resolver failed: faction filter missing: {args.factions}')
        wanted = {line.strip() for line in args.factions.read_text(encoding='utf-8').splitlines()
                  if line.strip() and not line.lstrip().startswith('#')}

    group_for_member = {row['id']: row['group'] for row in members}
    attitudes = defaultdict(list)
    for row in attitude_rows:
        attitudes[row['member']].append(row['attitude'])

    categories = defaultdict(list)
    unresolved_members = set()
    for rule in faction_rules:
        faction = rule['faction']
        if wanted is not None and faction not in wanted:
            continue
        member = rule['member']
        group = group_for_member.get(member)
        member_attitudes = attitudes.get(member, [])
        if not group or not member_attitudes:
            unresolved_members.add(member)
            continue
        for attitude in member_attitudes:
            categories[faction].append({
                'group': group,
                'member': member,
                'context': rule['context'],
                'attitude': attitude,
                'source': 'game-db',
                'sourceTable': TABLES['attitudes'],
            })

    result = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'partial',
        'scope': 'direct faction criteria; culture/subculture, faction-set expansion and campaign-script precedence remain separate inputs',
        'sourceTables': list(TABLES.values()),
        'factions': dict(sorted(categories.items())),
        'diagnostics': {
            'factionCount': len(categories),
            'ruleCount': sum(len(items) for items in categories.values()),
            'unresolvedMembers': sorted(unresolved_members),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"resolved {result['diagnostics']['ruleCount']} direct rules for {len(categories)} factions")


if __name__ == '__main__':
    main()
