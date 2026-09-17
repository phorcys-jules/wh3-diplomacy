#!/usr/bin/env python3
"""Keep the reviewed Immortal Empires map asset and coordinate window in sync."""
import argparse
import hashlib
import json
from pathlib import Path


CALIBRATION = {'minX': 11, 'maxX': 899, 'minY': 20.529987, 'maxY': 723.853149}
MAP_SHA256 = '9ac893954e947faa86981764b8f406def60e98e4615d7ef86e660829fa893d7f'


def fail(message: str) -> None:
    raise SystemExit(f'map projection validation failed: {message}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--positions', type=Path, required=True)
    parser.add_argument('--map', type=Path, required=True)
    args = parser.parse_args()

    if not args.positions.is_file() or not args.map.is_file():
        fail('missing positions dataset or map asset')
    try:
        positions = json.loads(args.positions.read_text(encoding='utf-8')).get('positions')
    except json.JSONDecodeError as error:
        fail(f'invalid positions JSON: {error}')
    if not isinstance(positions, list) or not positions:
        fail('positions dataset is empty')

    observed = {
        'minX': min(float(row['x']) for row in positions),
        'maxX': max(float(row['x']) for row in positions),
        'minY': min(float(row['y']) for row in positions),
        'maxY': max(float(row['y']) for row in positions),
    }
    for key, expected in CALIBRATION.items():
        if abs(observed[key] - expected) > 0.0001:
            fail(f'{key} changed from reviewed calibration {expected} to {observed[key]}')

    digest = hashlib.sha256(args.map.read_bytes()).hexdigest()
    if digest != MAP_SHA256:
        fail('map asset changed; review its licence and recalibrate before updating the fingerprint')
    if not args.map.read_bytes().startswith(b'\xff\xd8\xff'):
        fail('map asset is not a JPEG')
    print(f"validated map projection for {len(positions)} positions")


if __name__ == '__main__':
    main()
