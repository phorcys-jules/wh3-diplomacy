#!/usr/bin/env python3
"""Extract verified WH3 cam_gameplay_start coordinates from campaign Lua scripts.

The parser preserves the source file for every coordinate. Conflicting coordinates
are excluded from the generated positions dataset and reported separately, so the
site can keep all unambiguous positions without ever guessing an ambiguous one.
"""
import argparse
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

FACTION_LOCAL = re.compile(r'local\s+faction_key\s*=\s*["\'](?P<key>[a-zA-Z0-9_]+)["\']')
FACTION_TABLE = re.compile(r'(?P<key>[a-zA-Z0-9_]+)\s*=\s*faction_intro_data\s*:\s*new\s*\{')
CAMERA = re.compile(r'cam_gameplay_start\s*=\s*\{(?P<body>.*?)\}', re.DOTALL)
NUMBER = r'[-+]?(?:\d+(?:\.\d*)?|\.\d+)'
X_VALUE = re.compile(r'\bx\s*=\s*(?P<value>' + NUMBER + r')')
Y_VALUE = re.compile(r'\by\s*=\s*(?P<value>' + NUMBER + r')')


def fail(message: str) -> None:
    raise SystemExit(f'position import failed: {message}')


def nearest_faction(prefix: str) -> str | None:
    candidates: list[tuple[int, str]] = []
    for pattern in (FACTION_LOCAL, FACTION_TABLE):
        for match in pattern.finditer(prefix):
            candidates.append((match.start(), match.group('key')))
    return max(candidates, default=(-1, ''))[1] or None


def extract_file(path: Path, root: Path) -> list[dict]:
    text = path.read_text(encoding='utf-8-sig', errors='strict')
    results = []
    for camera in CAMERA.finditer(text):
        faction = nearest_faction(text[max(0, camera.start() - 5000):camera.start()])
        if not faction:
            continue
        body = camera.group('body')
        x_match, y_match = X_VALUE.search(body), Y_VALUE.search(body)
        if not x_match or not y_match:
            continue
        results.append({
            'factionKey': faction,
            'x': float(x_match.group('value')),
            'y': float(y_match.group('value')),
            'coordinateType': 'cam_gameplay_start',
            'source': path.relative_to(root).as_posix(),
        })
    return results


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--scripts-dir', type=Path, required=True,
                        help='Campaign-specific WH3 script directory to scan recursively')
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    parser.add_argument('--fail-on-conflict', action='store_true',
                        help='Fail instead of excluding factions that have conflicting coordinates')
    args = parser.parse_args()

    root = args.scripts_dir.resolve()
    if not root.is_dir():
        fail(f'missing scripts directory: {args.scripts_dir}')

    candidates: dict[str, list[dict]] = defaultdict(list)
    scanned = 0
    for path in sorted(root.rglob('*.lua')):
        scanned += 1
        for item in extract_file(path, root):
            candidates[item['factionKey']].append(item)

    if not candidates:
        fail('no faction cam_gameplay_start coordinates found')

    positions = []
    conflicts = []
    for faction, items in sorted(candidates.items()):
        coordinates = {(item['x'], item['y']) for item in items}
        if len(coordinates) > 1:
            conflicts.append({'factionKey': faction, 'candidates': items})
            continue
        representative = items[0].copy()
        representative['sources'] = sorted({item['source'] for item in items})
        representative.pop('source')
        positions.append(representative)

    if conflicts and args.fail_on_conflict:
        details = ', '.join(item['factionKey'] for item in conflicts[:10])
        fail(f'conflicting coordinates for {len(conflicts)} faction(s): {details}')

    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'coordinateType': 'cam_gameplay_start',
        'sourceRoot': root.name,
        'scannedLuaFiles': scanned,
        'positions': positions,
        'conflicts': conflicts,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"generated {len(positions)} verified start positions from {scanned} Lua files; excluded {len(conflicts)} conflicting faction(s)")


if __name__ == '__main__':
    main()
