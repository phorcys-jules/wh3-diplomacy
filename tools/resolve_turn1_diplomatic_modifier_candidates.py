#!/usr/bin/env python3
"""Join first-tick script bundle applications with diplomatic effect values."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


def load(path, label):
    if not path.is_file():
        raise SystemExit(f'turn-1 modifier candidate resolver failed: missing {label}: {path}')
    return json.loads(path.read_text(encoding='utf-8'))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--script-sources', type=Path, required=True)
    parser.add_argument('--effect-values', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()

    sources = load(args.script_sources, 'script source dataset')
    values = load(args.effect_values, 'effect value dataset')
    effects_by_bundle = {item['effectBundle']: item.get('diplomaticEffects', []) for item in values.get('effectBundles', [])}

    candidates = []
    skipped_without_diplomatic_effect = 0
    for assignment in sources.get('assignments', []):
        if not assignment.get('firstTickCallback'):
            continue
        effects = effects_by_bundle.get(assignment.get('effectBundle'), [])
        if not effects:
            skipped_without_diplomatic_effect += 1
            continue
        guard_free = bool(assignment.get('guardFreeFirstTick'))
        for effect in effects:
            candidates.append({
                'sourceFaction': assignment['faction'],
                'effectBundle': assignment['effectBundle'],
                'effect': effect['effect'],
                'value': effect['value'],
                'scope': effect.get('scope'),
                'advancementStage': effect.get('advancementStage'),
                'targets': effect.get('targets', []),
                'evidence': {
                    'kind': 'guard-free-first-tick' if guard_free else 'first-tick-script-candidate',
                    'conditional': not guard_free,
                    'guardFreeFirstTick': guard_free,
                    'sourceFile': assignment.get('sourceFile'),
                    'sourceLine': assignment.get('sourceLine'),
                    'factionResolution': assignment.get('resolution'),
                    'turnsExpression': assignment.get('turnsExpression'),
                },
            })

    candidates.sort(key=lambda x: (x['sourceFaction'], x['effectBundle'], x['effect'], x['value']))
    output = {
        'gameVersion': args.game_version,
        'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'status': 'candidate',
        'semantics': 'first-tick script candidates; guardFreeFirstTick=true is conservative evidence that no visible control-flow guard precedes the call inside the callback',
        'candidates': candidates,
        'diagnostics': {
            'candidateCount': len(candidates),
            'guardFreeCandidateCount': sum(1 for item in candidates if item['evidence']['guardFreeFirstTick']),
            'sourceFactionCount': len({item['sourceFaction'] for item in candidates}),
            'skippedFirstTickBundlesWithoutDiplomaticEffect': skipped_without_diplomatic_effect,
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"resolved {len(candidates)} first-tick diplomatic modifier candidates")


if __name__ == '__main__':
    main()
