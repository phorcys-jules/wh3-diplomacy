import json
import subprocess
import sys
import tempfile
from pathlib import Path


def test_resolver_joins_values_and_targets():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        bundles = root / 'bundles.tsv'
        targets = root / 'targets.json'
        output = root / 'out.json'
        bundles.write_text(
            'effect_bundle_key\teffect_key\teffect_scope\tvalue\tadvancement_stage\n'
            '#meta\t\t\t\t\n'
            'bundle_a\teffect_diplomacy\tfaction_to_faction_own\t60.0000\tstart_turn_completed\n'
            'bundle_a\teffect_unrelated\tfaction_to_faction_own\t5.0000\tstart_turn_completed\n',
            encoding='utf-8',
        )
        targets.write_text(json.dumps({
            'sourceTables': ['effect_bonus_value_faction_junctions_tables'],
            'effects': [{
                'effect': 'effect_diplomacy',
                'targets': [{
                    'bonusValueId': 'diplomatic_mod',
                    'targetType': 'faction',
                    'target': 'target_faction',
                    'matchingFactions': ['target_faction'],
                }],
            }],
        }), encoding='utf-8')

        subprocess.run([
            sys.executable,
            str(Path(__file__).with_name('resolve_diplomatic_effect_values.py')),
            '--bundles', str(bundles),
            '--targets', str(targets),
            '--output', str(output),
            '--game-version', 'test',
        ], check=True)

        data = json.loads(output.read_text(encoding='utf-8'))
        assert data['diagnostics'] == {'bundleCount': 1, 'effectCount': 1}
        effect = data['effectBundles'][0]['diplomaticEffects'][0]
        assert effect['value'] == 60.0
        assert effect['targets'][0]['target'] == 'target_faction'
