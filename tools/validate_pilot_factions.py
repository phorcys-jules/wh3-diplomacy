#!/usr/bin/env python3
"""Validate the four Immortal Empires pilot factions across public datasets."""
import argparse
import json
from pathlib import Path


PILOTS = {
    'Imrik': {
        'faction': 'wh2_dlc15_hef_imrik',
        'agent': 'wh2_dlc15_hef_imrik',
        'position': (573.586609, 330.326599),
    },
    'Karl Franz': {
        'faction': 'wh_main_emp_empire',
        'agent': 'wh_main_emp_karl_franz',
        'position': (355.687042, 487.026276),
    },
    'Malus Darkblade': {
        'faction': 'wh2_main_def_hag_graef',
        'agent': 'wh2_dlc14_def_malus_darkblade',
        'position': (393.503754, 719.284790),
    },
    "Ku'gath": {
        'faction': 'wh3_main_nur_poxmakers_of_nurgle',
        'agent': 'wh3_main_nur_kugath',
        'position': (668.102417, 288.452148),
    },
}


def load(path: Path) -> dict:
    if not path.is_file():
        raise SystemExit(f'pilot validation failed: missing dataset {path}')
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError as error:
        raise SystemExit(f'pilot validation failed: invalid JSON in {path}: {error}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--leaders', type=Path, required=True)
    parser.add_argument('--positions', type=Path, required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    leaders = load(args.leaders)
    positions = load(args.positions)
    if positions.get('campaign') != args.campaign:
        raise SystemExit(f"pilot validation failed: expected campaign {args.campaign}, got {positions.get('campaign')}")
    if positions.get('coordinateType') != 'cam_gameplay_start':
        raise SystemExit('pilot validation failed: positions must use cam_gameplay_start')

    leader_rows = leaders.get('leaders')
    position_rows = positions.get('positions')
    if not isinstance(leader_rows, list) or not isinstance(position_rows, list):
        raise SystemExit('pilot validation failed: malformed leader or position list')

    for name, expected in PILOTS.items():
        matching_leaders = [row for row in leader_rows if row.get('factionKey') == expected['faction']]
        if not any(row.get('agentSubtype') == expected['agent'] for row in matching_leaders):
            raise SystemExit(f"pilot validation failed: {name} mapping is missing or changed")
        matching_positions = [row for row in position_rows if row.get('factionKey') == expected['faction']]
        if len(matching_positions) != 1:
            raise SystemExit(f"pilot validation failed: {name} requires exactly one start position")
        row = matching_positions[0]
        if abs(float(row.get('x', 0)) - expected['position'][0]) > 0.0001 or abs(float(row.get('y', 0)) - expected['position'][1]) > 0.0001:
            raise SystemExit(f"pilot validation failed: {name} start position differs from the reviewed fixture")

    print(f"validated {len(PILOTS)} Immortal Empires pilot factions")


if __name__ == '__main__':
    main()
