import json
import subprocess
import sys
from pathlib import Path


def test_excludes_non_immortal_empires_campaign_dirs(tmp_path):
    scripts = tmp_path / 'scripts'
    (scripts / 'main_warhammer').mkdir(parents=True)
    (scripts / 'wh3_main_chaos').mkdir(parents=True)
    (scripts / 'wh3_main_prologue').mkdir(parents=True)

    (scripts / 'shared.lua').write_text(
        'cm:apply_effect_bundle("bundle_shared", "wh_main_emp_empire", 0)\n',
        encoding='utf-8',
    )
    (scripts / 'main_warhammer' / 'ie.lua').write_text(
        'cm:apply_effect_bundle("bundle_ie", "wh2_main_hef_eataine", 0)\n',
        encoding='utf-8',
    )
    (scripts / 'wh3_main_chaos' / 'roc.lua').write_text(
        'cm:apply_effect_bundle("bundle_roc", "wh3_main_ksl_the_ice_court", 0)\n',
        encoding='utf-8',
    )
    (scripts / 'wh3_main_prologue' / 'prologue.lua').write_text(
        'cm:apply_effect_bundle("bundle_prologue", "wh3_main_ksl_the_ice_court", 0)\n',
        encoding='utf-8',
    )

    output = tmp_path / 'out.json'
    tool = Path(__file__).with_name('resolve_script_effect_bundle_sources.py')
    subprocess.run([
        sys.executable, str(tool),
        '--scripts-dir', str(scripts),
        '--output', str(output),
        '--game-version', 'fixture',
        '--exclude-prefix', 'wh3_main_chaos',
        '--exclude-prefix', 'wh3_main_prologue',
    ], check=True)

    data = json.loads(output.read_text(encoding='utf-8'))
    bundles = {x['effectBundle'] for x in data['assignments']}
    assert bundles == {'bundle_shared', 'bundle_ie'}
    assert data['diagnostics']['excludedLuaFiles'] == 2
    assert data['diagnostics']['excludedPrefixes'] == ['wh3_main_chaos', 'wh3_main_prologue']
