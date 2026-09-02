#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('import_cultural_relations.py')


class CulturalRelationsImporterTest(unittest.TestCase):
    def test_campaign_specific_row_overrides_generic_row(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'relations.tsv'
            output = root / 'out.json'
            source.write_text(
                'campaign\tsource\ttarget\tattitude_base\tnegative_attitude_multiplier\tpositive_attitude_multiplier\n'
                '#campaign_cultural_relations_tables;0;db/campaign_cultural_relations_tables/data__\t\t\t\t\t\n'
                '\twh2_main_sc_hef_high_elves\twh_main_sc_emp_empire\t0\t1\t1\n'
                'wh3_main_combi\twh2_main_sc_hef_high_elves\twh_main_sc_emp_empire\t5\t1.1\t0.9\n'
                'another_campaign\twh2_main_sc_hef_high_elves\twh2_main_sc_def_dark_elves\t-999\t2\t0.1\n',
                encoding='utf-8',
            )
            result = subprocess.run(
                [sys.executable, str(SCRIPT), '--input', str(source), '--output', str(output),
                 '--campaign', 'wh3_main_combi', '--game-version', 'test', '--source-ref', 'fixture'],
                check=False, capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            data = json.loads(output.read_text(encoding='utf-8'))
            self.assertEqual(len(data['relations']), 1)
            relation = data['relations'][0]
            self.assertEqual(relation['attitudeBase'], 5.0)
            self.assertEqual(relation['negativeAttitudeMultiplier'], 1.1)
            self.assertEqual(relation['positiveAttitudeMultiplier'], 0.9)
            self.assertEqual(relation['campaign'], 'wh3_main_combi')


if __name__ == '__main__':
    unittest.main()
