#!/usr/bin/env python3
"""Extract the auditable turn-one matrix for the four diplomacy pilots."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

PILOTS = {
    'Imrik': 'wh2_dlc15_hef_imrik',
    'Karl Franz': 'wh_main_emp_empire',
    'Malus Darkblade': 'wh2_main_def_hag_graef',
    "Ku'gath": 'wh3_main_nur_poxmakers_of_nurgle',
}


def fail(message):
    raise SystemExit(f'turn-one matrix failed: {message}')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    try:
        source = json.loads(args.input.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error:
        fail(error)
    relations = source.get('relations')
    if not isinstance(relations, list):
        fail('input has no relation array')
    pilot_keys = set(PILOTS.values())
    selected = [row for row in relations if row.get('sourceFaction') in pilot_keys and row.get('targetFaction') in pilot_keys and row.get('sourceFaction') != row.get('targetFaction')]
    if len(selected) != 12:
        fail(f'expected 12 directional pilot relations, got {len(selected)}')
    selected.sort(key=lambda row: (row['sourceFaction'], row['targetFaction']))
    output = {
        'gameVersion': source.get('gameVersion'),
        'campaign': source.get('campaign'),
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'awaiting-in-game-observation',
        'pilots': PILOTS,
        'relations': selected,
        'observationProtocol': 'Start a fresh vanilla Immortal Empires campaign on turn 1, open diplomacy, record the visible attitude breakdown for each encountered pair, and attach a screenshot plus the observed value before marking this matrix verified.',
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('built 12 directional pilot relations for in-game verification')


if __name__ == '__main__':
    main()
