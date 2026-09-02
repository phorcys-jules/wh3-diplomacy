#!/usr/bin/env python3
"""Minimal validation for the normalized diplomacy dataset."""
import argparse, json
from pathlib import Path

TOP = {'gameVersion', 'campaign', 'generatedAt', 'relations'}
RELATION = {'sourceFaction', 'targetFaction', 'modifiers', 'treaties', 'atWar'}

def fail(message): raise SystemExit('validation failed: ' + message)

def main():
    p = argparse.ArgumentParser(); p.add_argument('dataset', type=Path); args = p.parse_args()
    try: data = json.loads(args.dataset.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError) as error: fail(str(error))
    if not TOP <= data.keys(): fail('missing top-level fields')
    if not isinstance(data['relations'], list): fail('relations must be an array')
    for index, relation in enumerate(data['relations']):
        if not RELATION <= relation.keys(): fail(f'relation {index} has missing fields')
        if not isinstance(relation['atWar'], bool): fail(f'relation {index} atWar must be boolean')
        if not isinstance(relation['modifiers'], list) or not isinstance(relation['treaties'], list): fail(f'relation {index} has invalid arrays')
    print(f'valid dataset: {len(data["relations"])} relations')

if __name__ == '__main__': main()
