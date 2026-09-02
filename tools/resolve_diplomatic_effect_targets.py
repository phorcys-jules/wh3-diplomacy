#!/usr/bin/env python3
"""Resolve which factions/subcultures a WH3 diplomatic effect targets.

Effect values (for example +60 or -60) live in the source that applies the effect.
The bonus-value junction tables describe *who that effect applies against*. This
resolver keeps those two concerns separate so values are never guessed.
"""
import argparse
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES = {
    'faction_targets': 'effect_bonus_value_faction_junctions_tables',
    'subculture_targets': 'effect_bonus_value_subculture_junctions_tables',
    'factions': 'factions_tables',
}


def fail(message):
    raise SystemExit(f'diplomatic effect resolver failed: {message}')


def read(path):
    if not path.is_file():
        fail(f'missing required export: {path}')
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter='\t'))
    if not rows:
        fail(f'empty export: {path}')
    first = next(iter(rows[0]), None)
    return [row for row in rows if not (first and row.get(first, '').startswith('#'))]


def require(rows, columns, label):
    if not rows:
        fail(f'{label} has no data rows')
    missing = set(columns) - set(rows[0])
    if missing:
        fail(f"{label} missing columns: {', '.join(sorted(missing))}")


def is_diplomacy_bonus(row):
    return row.get('bonus_value_id', '').startswith('diplomatic_mod')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    paths = {key: args.db_dir / table / 'data__.tsv' for key, table in TABLES.items()}
    faction_rows = read(paths['faction_targets'])
    subculture_rows = read(paths['subculture_targets'])
    faction_metadata = read(paths['factions'])
    require(faction_rows, {'bonus_value_id', 'effect', 'faction'}, TABLES['faction_targets'])
    require(subculture_rows, {'bonus_value_id', 'effect', 'subculture'}, TABLES['subculture_targets'])
    require(faction_metadata, {'key', 'subculture'}, TABLES['factions'])

    factions_by_subculture = defaultdict(list)
    for row in faction_metadata:
        if row['key'] and row['subculture']:
            factions_by_subculture[row['subculture']].append(row['key'])

    effects = defaultdict(list)
    for row in faction_rows:
        if not is_diplomacy_bonus(row):
            continue
        effects[row['effect']].append({
            'bonusValueId': row['bonus_value_id'],
            'targetType': 'faction',
            'target': row['faction'],
            'matchingFactions': [row['faction']],
            'sourceTable': TABLES['faction_targets'],
        })

    unknown_subcultures = set()
    for row in subculture_rows:
        if not is_diplomacy_bonus(row):
            continue
        matches = sorted(factions_by_subculture.get(row['subculture'], []))
        if not matches:
            unknown_subcultures.add(row['subculture'])
        effects[row['effect']].append({
            'bonusValueId': row['bonus_value_id'],
            'targetType': 'subculture',
            'target': row['subculture'],
            'matchingFactions': matches,
            'sourceTable': TABLES['subculture_targets'],
        })

    normalized = [
        {'effect': effect, 'targets': targets}
        for effect, targets in sorted(effects.items())
    ]
    result = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'partial',
        'semantics': 'target metadata only; numeric values must come from the effect source/bundle/trait that applies each effect',
        'sourceTables': list(TABLES.values()),
        'effects': normalized,
        'diagnostics': {
            'effectCount': len(normalized),
            'targetCount': sum(len(item['targets']) for item in normalized),
            'unknownSubcultures': sorted(unknown_subcultures),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"resolved {result['diagnostics']['targetCount']} diplomatic targets for {len(normalized)} effects")


if __name__ == '__main__':
    main()
