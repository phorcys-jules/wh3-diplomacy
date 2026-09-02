#!/usr/bin/env python3
"""Join WH3 diplomatic effect target metadata with numeric effect-bundle values.

This does not claim a faction owns a bundle. It only answers:
- which diplomatic effect a bundle contains,
- its numeric value/scope,
- which factions/subcultures that effect targets.

The separate source-assignment step is still required before adding a modifier to a
specific faction's turn-1 attitude.
"""
import argparse
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


def fail(message):
    raise SystemExit(f'diplomatic effect value resolver failed: {message}')


def read_tsv(path):
    if not path.is_file():
        fail(f'missing export: {path}')
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter='\t'))
    if not rows:
        fail(f'empty export: {path}')
    first = next(iter(rows[0]), None)
    return [row for row in rows if not (first and row.get(first, '').startswith('#'))]


def require(rows, columns, label):
    missing = set(columns) - set(rows[0])
    if missing:
        fail(f"{label} missing columns: {', '.join(sorted(missing))}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--bundles', type=Path, required=True,
                        help='effect_bundles_to_effects_junctions_tables/data__.tsv')
    parser.add_argument('--targets', type=Path, required=True,
                        help='JSON produced by resolve_diplomatic_effect_targets.py')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    rows = read_tsv(args.bundles)
    require(rows, {'effect_bundle_key', 'effect_key', 'effect_scope', 'value'}, 'effect bundle junctions')
    if not args.targets.is_file():
        fail(f'missing target report: {args.targets}')
    target_data = json.loads(args.targets.read_text(encoding='utf-8'))
    targets_by_effect = {item['effect']: item.get('targets', []) for item in target_data.get('effects', [])}

    bundles = defaultdict(list)
    for row in rows:
        effect = row['effect_key']
        targets = targets_by_effect.get(effect)
        if not targets:
            continue
        try:
            value = float(row['value'])
        except ValueError:
            fail(f"invalid numeric value {row['value']!r} for {row['effect_bundle_key']} / {effect}")
        bundles[row['effect_bundle_key']].append({
            'effect': effect,
            'scope': row['effect_scope'],
            'value': value,
            'advancementStage': row.get('advancement_stage') or None,
            'targets': targets,
            'sourceTable': 'effect_bundles_to_effects_junctions_tables',
        })

    normalized = [
        {'effectBundle': key, 'diplomaticEffects': effects}
        for key, effects in sorted(bundles.items())
    ]
    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'partial',
        'semantics': 'numeric bundle effects plus verified targets; source-faction ownership/application is not resolved here',
        'sourceTables': [
            'effect_bundles_to_effects_junctions_tables',
            *target_data.get('sourceTables', []),
        ],
        'effectBundles': normalized,
        'diagnostics': {
            'bundleCount': len(normalized),
            'effectCount': sum(len(item['diplomaticEffects']) for item in normalized),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"resolved {output['diagnostics']['effectCount']} diplomatic bundle effects in {len(normalized)} bundles")


if __name__ == '__main__':
    main()
