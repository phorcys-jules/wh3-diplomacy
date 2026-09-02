#!/usr/bin/env python3
"""Import WH3 campaign cultural relations into a compact directional JSON dataset."""
import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path

REQUIRED = {
    'campaign', 'source', 'target', 'attitude_base',
    'negative_attitude_multiplier', 'positive_attitude_multiplier'
}


def fail(message: str) -> None:
    raise SystemExit(f'cultural relations import failed: {message}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--source-ref', required=True)
    args = parser.parse_args()

    if not args.input.is_file():
        fail(f'missing TSV: {args.input}')

    with args.input.open(encoding='utf-8-sig', newline='') as stream:
        reader = csv.DictReader(stream, delimiter='\t')
        if not reader.fieldnames or not REQUIRED.issubset(reader.fieldnames):
            missing = REQUIRED - set(reader.fieldnames or [])
            fail('missing columns: ' + ', '.join(sorted(missing)))
        rows = [row for row in reader if row.get('source') and not row['source'].startswith('#')]

    # Generic rows have an empty campaign. A campaign-specific row overrides the
    # generic source -> target pair when present.
    selected = {}
    for row in rows:
        campaign = (row.get('campaign') or '').strip()
        if campaign not in ('', args.campaign):
            continue
        key = (row['source'], row['target'])
        priority = 1 if campaign == args.campaign else 0
        current = selected.get(key)
        if current and current[0] > priority:
            continue
        selected[key] = (priority, {
            'sourceSubculture': row['source'],
            'targetSubculture': row['target'],
            'attitudeBase': float(row['attitude_base']),
            'negativeAttitudeMultiplier': float(row['negative_attitude_multiplier']),
            'positiveAttitudeMultiplier': float(row['positive_attitude_multiplier']),
            'campaign': campaign or None,
            'source': 'game-db',
            'sourceTable': 'campaign_cultural_relations_tables',
        })

    relations = [value[1] for _, value in sorted(selected.items())]
    if not relations:
        fail('no cultural relations matched the requested campaign')

    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'sourceRef': args.source_ref,
        'sourceTable': 'campaign_cultural_relations_tables',
        'semantics': 'directional cultural baseline only; not the complete turn-1 diplomatic score',
        'relations': relations,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'imported {len(relations)} directional cultural relations')


if __name__ == '__main__':
    main()
