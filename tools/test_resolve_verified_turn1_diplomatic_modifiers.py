import json
import subprocess
import sys
from pathlib import Path


def test_verified_turn1_modifier_promotion(tmp_path):
    candidates = {
        'candidates': [
            {
                'sourceFaction': 'wh2_dlc11_cst_vampire_coast',
                'effectBundle': 'bundle_verified',
                'effect': 'effect_followers_of_nagash',
                'value': 60.0,
                'scope': 'faction_to_faction_own_unseen',
                'targets': [{'targetType': 'faction', 'target': 'wh2_dlc09_tmb_followers_of_nagash'}],
                'evidence': {'guardFreeFirstTick': True, 'conditional': False, 'sourceFile': 'sample.lua', 'sourceLine': 10},
            },
            {
                'sourceFaction': 'wh2_dlc11_cst_vampire_coast',
                'effectBundle': 'bundle_guarded',
                'effect': 'effect_lizardmen',
                'value': -60.0,
                'scope': 'faction_to_faction_own_unseen',
                'targets': [{'targetType': 'subculture', 'target': 'wh2_main_sc_lzd_lizardmen'}],
                'evidence': {'guardFreeFirstTick': False, 'conditional': True, 'sourceFile': 'sample.lua', 'sourceLine': 20},
            },
        ]
    }
    source = tmp_path / 'candidates.json'
    output = tmp_path / 'verified.json'
    source.write_text(json.dumps(candidates), encoding='utf-8')
    tool = Path(__file__).with_name('resolve_verified_turn1_diplomatic_modifiers.py')
    subprocess.run([
        sys.executable, str(tool),
        '--candidates', str(source),
        '--output', str(output),
        '--game-version', 'fixture',
    ], check=True)
    data = json.loads(output.read_text(encoding='utf-8'))
    assert data['diagnostics']['verifiedModifierCount'] == 1
    assert data['diagnostics']['rejectedCandidateCount'] == 1
    assert data['modifiers'][0]['effectBundle'] == 'bundle_verified'
    assert data['modifiers'][0]['value'] == 60.0
    assert data['modifiers'][0]['status'] == 'verified-guard-free-first-tick'
