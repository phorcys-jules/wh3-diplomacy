#!/usr/bin/env python3
"""Join playable factions to the directional WH3 cultural diplomacy baseline."""
import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path


def load_json(path):
    if not path.is_file():
        raise SystemExit(f'initial cultural resolver failed: missing {path}')
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--factions', type=Path, required=True)
    parser.add_argument('--leaders', type=Path, required=True)
    parser.add_argument('--cultural-relations', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()
    if not args.factions.is_file():
        raise SystemExit(f'initial cultural resolver failed: missing {args.factions}')
    with args.factions.open(encoding='utf-8-sig', newline='') as stream:
        rows = csv.DictReader(stream, delimiter='\t')
        if not rows.fieldnames or not {'key', 'subculture'} <= set(rows.fieldnames):
            raise SystemExit('initial cultural resolver failed: factions table lacks key/subculture')
        subculture = {row['key']: row['subculture'] for row in rows if row.get('key') and not row['key'].startswith('#') and row.get('subculture')}
    leaders = load_json(args.leaders).get('leaders', [])
    factions = sorted({row.get('factionKey') for row in leaders if row.get('factionKey') in subculture})
    if not factions:
        raise SystemExit('initial cultural resolver failed: no leader faction matched factions table')
    cultural = load_json(args.cultural_relations).get('relations', [])
    by_pair = {(row['sourceSubculture'], row['targetSubculture']): row for row in cultural}
    relations = []
    for source in factions:
        for target in factions:
            if source == target:
                continue
            source_subculture, target_subculture = subculture[source], subculture[target]
            base = by_pair.get((source_subculture, target_subculture))
            if not base:
                continue
            relations.append({
                'sourceFaction': source, 'targetFaction': target,
                'baseAttitude': base['attitudeBase'],
                'positiveAttitudeMultiplier': base['positiveAttitudeMultiplier'],
                'negativeAttitudeMultiplier': base['negativeAttitudeMultiplier'],
                'components': [{'type': 'cultural-baseline', 'sourceTable': base['sourceTable'], 'sourceSubculture': source_subculture, 'targetSubculture': target_subculture}],
            })
    output = {'gameVersion': args.game_version, 'campaign': args.campaign, 'generatedAt': datetime.now(timezone.utc).isoformat(), 'status': 'partial', 'semantics': 'directional cultural baseline resolved to playable factions; explicit treaties, wars and unproven script modifiers are separate components', 'relations': relations}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(f'resolved {len(relations)} faction directional cultural baselines')


if __name__ == '__main__':
    main()
