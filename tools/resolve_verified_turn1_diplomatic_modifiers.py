#!/usr/bin/env python3
"""Promote only guard-free first-tick diplomatic candidates to verified data.

This verifier is deliberately conservative. It accepts a candidate only when:
- it comes from a statically resolved faction -> bundle assignment;
- the bundle call is inside a first-tick callback;
- no visible `if`, `for`, `while` or `repeat` guard precedes the call inside
  that callback (`guardFreeFirstTick=true`).

This is sufficient to remove obvious conditionally executed candidates. It does
not attempt to prove hidden engine prerequisites or semantics outside the Lua
source, so provenance is retained for every promoted modifier.
"""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


def load(path):
    if not path.is_file():
        raise SystemExit(f'verified turn-1 modifier resolver failed: missing input {path}')
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--candidates', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    data = load(args.candidates)
    verified = []
    rejected = []
    for item in data.get('candidates', []):
        evidence = item.get('evidence') or {}
        if evidence.get('guardFreeFirstTick') is True and evidence.get('conditional') is False:
            promoted = dict(item)
            promoted['status'] = 'verified-guard-free-first-tick'
            verified.append(promoted)
        else:
            rejected.append({
                'sourceFaction': item.get('sourceFaction'),
                'effectBundle': item.get('effectBundle'),
                'effect': item.get('effect'),
                'reason': 'conditional-or-not-guard-free',
                'sourceFile': evidence.get('sourceFile'),
                'sourceLine': evidence.get('sourceLine'),
            })

    verified.sort(key=lambda x: (x['sourceFaction'], x['effectBundle'], x['effect'], x['value']))
    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'verified-subset',
        'semantics': 'conservative subset of first-tick diplomatic modifiers with statically resolved faction and no visible control-flow guard before the bundle call inside its first-tick callback',
        'modifiers': verified,
        'diagnostics': {
            'verifiedModifierCount': len(verified),
            'verifiedSourceFactionCount': len({item['sourceFaction'] for item in verified}),
            'rejectedCandidateCount': len(rejected),
            'rejected': rejected,
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"promoted {len(verified)} guard-free first-tick diplomatic modifiers")


if __name__ == '__main__':
    main()
