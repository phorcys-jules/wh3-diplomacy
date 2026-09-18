#!/usr/bin/env python3
"""Create the auditable Immortal Empires start-faction roster."""
import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path


def fail(message):
    raise SystemExit(f'Immortal Empires faction import failed: {message}')


def table(path, columns):
    if not path.is_file():
        fail(f'missing required export: {path}')
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter='\t'))
    if not rows or not columns <= set(rows[0]):
        fail(f'{path.parent.name} lacks required columns')
    first = next(iter(rows[0]), '')
    return [row for row in rows if not row.get(first, '').startswith('#')]


def load(path):
    if not path.is_file():
        fail(f'missing required dataset: {path}')
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db-dir', type=Path, required=True)
    parser.add_argument('--cai-factors', type=Path, required=True)
    parser.add_argument('--leaders', type=Path, required=True)
    parser.add_argument('--positions', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()
    starts = table(args.db_dir / 'start_pos_factions_tables' / 'data__.tsv', {'ID', 'faction', 'campaign', 'playable', 'is_major', 'faction_potential'})
    regions = table(args.db_dir / 'start_pos_regions_tables' / 'data__.tsv', {'region', 'campaign', 'owning_faction'})
    factions = table(args.db_dir / 'factions_tables' / 'data__.tsv', {'key', 'subculture', 'name_group'})
    faction_metadata = {row['key']: row for row in factions if row.get('key')}
    profiles = {row.get('factionKey'): row for row in load(args.cai_factors).get('factionProfiles', [])}
    leaders = {}
    for row in load(args.leaders).get('leaders', []):
        leaders.setdefault(row.get('factionKey'), []).append(row.get('agentSubtype'))
    positions = {row.get('factionKey'): row for row in load(args.positions).get('positions', [])}
    faction_by_id = {row['ID']: row['faction'] for row in starts if row.get('ID') and row.get('faction')}
    regions_by_faction = {}
    for row in regions:
        if row.get('campaign') != args.campaign:
            continue
        faction = faction_by_id.get(row.get('owning_faction'))
        if faction:
            regions_by_faction.setdefault(faction, []).append(row['region'])
    items = []
    for row in starts:
        key = row.get('faction')
        if row.get('campaign') != args.campaign or not key:
            continue
        meta, profile = faction_metadata.get(key, {}), profiles.get(key, {})
        position = positions.get(key)
        items.append({
            'factionKey': key, 'nameGroup': meta.get('name_group') or None,
            'subculture': meta.get('subculture') or None,
            'playable': row.get('playable') == 'true', 'major': row.get('is_major') == 'true',
            'factionPotential': row.get('faction_potential') or None,
            'startingLeaders': sorted(filter(None, leaders.get(key, []))),
            'startingRegions': sorted(regions_by_faction.get(key, [])),
            'position': {'x': position['x'], 'y': position['y'], 'source': 'cam_gameplay_start'} if position else None,
            'personality': {'key': profile.get('personalityKey'), 'candidates': profile.get('personalityCandidates', []), 'group': profile.get('personalityGroup'), 'resolved': profile.get('personalityResolved', False)},
            'includedBecause': 'start_pos_factions_tables entry for wh3_main_combi',
        })
    if not items:
        fail('no wh3_main_combi factions found')
    output = {'gameVersion': args.game_version, 'campaign': args.campaign, 'generatedAt': datetime.now(timezone.utc).isoformat(), 'status': 'partial', 'semantics': 'Every entry is explicitly active in the Immortal Empires start-position table. A start region is retained when a camera coordinate is unavailable; missing values remain null rather than inferred.', 'factions': sorted(items, key=lambda item: item['factionKey']), 'diagnostics': {'activeFactionCount': len(items), 'playableFactionCount': sum(item['playable'] for item in items), 'positionedFactionCount': sum(item['position'] is not None for item in items), 'regionedFactionCount': sum(bool(item['startingRegions']) for item in items), 'unresolvedSubcultureCount': sum(item['subculture'] is None for item in items)}}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"imported {len(items)} active Immortal Empires factions")


if __name__ == '__main__':
    main()
