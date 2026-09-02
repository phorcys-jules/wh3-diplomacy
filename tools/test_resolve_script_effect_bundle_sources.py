import json
import subprocess
import sys
from pathlib import Path


def test_static_script_bundle_sources(tmp_path):
    scripts = tmp_path / 'scripts'
    scripts.mkdir()
    (scripts / 'sample.lua').write_text(
        '''
local faction_key = "wh3_main_ksl_the_ice_court"
cm:apply_effect_bundle("bundle_literal", "wh_main_emp_empire", 0)
cm:apply_effect_bundle("bundle_variable", faction_key, -1)
local ambiguous = "wh2_main_hef_eataine"
ambiguous = "wh2_main_hef_avelorn"
cm:apply_effect_bundle("bundle_ambiguous", ambiguous, 3)
cm:apply_effect_bundle("bundle_dynamic_" .. suffix, faction_key, 0)
''',
        encoding='utf-8',
    )
    output = tmp_path / 'out.json'
    tool = Path(__file__).with_name('resolve_script_effect_bundle_sources.py')
    subprocess.run([
        sys.executable, str(tool),
        '--scripts-dir', str(scripts),
        '--output', str(output),
        '--game-version', 'fixture',
    ], check=True)
    data = json.loads(output.read_text(encoding='utf-8'))
    pairs = {(x['faction'], x['effectBundle']) for x in data['assignments']}
    assert ('wh_main_emp_empire', 'bundle_literal') in pairs
    assert ('wh3_main_ksl_the_ice_court', 'bundle_variable') in pairs
    assert ('wh2_main_hef_eataine', 'bundle_ambiguous') not in pairs
    assert ('wh2_main_hef_avelorn', 'bundle_ambiguous') not in pairs
    assert data['diagnostics']['unresolvedCalls'] == 1
