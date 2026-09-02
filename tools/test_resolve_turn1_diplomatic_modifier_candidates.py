import json
import subprocess
import sys
from pathlib import Path


def test_turn1_candidate_join(tmp_path):
    sources = tmp_path / 'sources.json'
    values = tmp_path / 'values.json'
    output = tmp_path / 'out.json'
    sources.write_text(json.dumps({
        'assignments': [
            {
                'faction': 'wh_main_emp_empire',
                'effectBundle': 'bundle_diplomacy',
                'firstTickCallback': True,
                'resolution': 'literal',
                'turnsExpression': '0',
                'sourceFile': 'sample.lua',
                'sourceLine': 12,
            },
            {
                'faction': 'wh2_main_hef_eataine',
                'effectBundle': 'bundle_later',
                'firstTickCallback': False,
            },
        ]
    }), encoding='utf-8')
    values.write_text(json.dumps({
        'effectBundles': [
            {
                'effectBundle': 'bundle_diplomacy',
                'diplomaticEffects': [
                    {
                        'effect': 'effect_relations',
                        'value': 60.0,
                        'scope': 'faction_to_faction_own_unseen',
                        'advancementStage': 'start_round_completed',
                        'targets': [
                            {'targetType': 'subculture', 'target': 'wh_main_sc_dwf_dwarfs'}
                        ],
                    }
                ],
            },
            {
                'effectBundle': 'bundle_later',
                'diplomaticEffects': [{'effect': 'should_not_emit', 'value': -40.0}],
            },
        ]
    }), encoding='utf-8')

    tool = Path(__file__).with_name('resolve_turn1_diplomatic_modifier_candidates.py')
    subprocess.run([
        sys.executable, str(tool),
        '--script-sources', str(sources),
        '--effect-values', str(values),
        '--output', str(output),
        '--game-version', 'fixture',
    ], check=True)

    data = json.loads(output.read_text(encoding='utf-8'))
    assert data['status'] == 'candidate'
    assert data['diagnostics']['candidateCount'] == 1
    candidate = data['candidates'][0]
    assert candidate['sourceFaction'] == 'wh_main_emp_empire'
    assert candidate['value'] == 60.0
    assert candidate['targets'][0]['target'] == 'wh_main_sc_dwf_dwarfs'
    assert candidate['evidence']['kind'] == 'first-tick-script-candidate'
    assert candidate['evidence']['conditional'] is True
