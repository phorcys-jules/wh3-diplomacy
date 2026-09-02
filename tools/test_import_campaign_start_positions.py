#!/usr/bin/env python3
import tempfile
import unittest
from pathlib import Path

from import_campaign_start_positions import extract_file


class StartPositionParserTests(unittest.TestCase):
    def parse(self, content: str):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            path = root / 'start.lua'
            path.write_text(content, encoding='utf-8')
            return extract_file(path, root)

    def test_local_faction_key_form(self):
        rows = self.parse('''
if cm:is_new_game() then
  local faction_key = "wh3_dlc23_chd_zhatan";
  local cam_gameplay_start = {
    x = 525.1,
    y = 114.1,
    d = 11.8
  };
end;
''')
        self.assertEqual(1, len(rows))
        self.assertEqual('wh3_dlc23_chd_zhatan', rows[0]['factionKey'])
        self.assertEqual(525.1, rows[0]['x'])
        self.assertEqual(114.1, rows[0]['y'])

    def test_faction_intro_table_form(self):
        rows = self.parse('''
wh2_dlc15_hef_imrik = faction_intro_data:new{
  cam_gameplay_start = {
    x = 573.586609,
    y = 330.326599,
    d = 9
  }
}
''')
        self.assertEqual('wh2_dlc15_hef_imrik', rows[0]['factionKey'])
        self.assertAlmostEqual(573.586609, rows[0]['x'])
        self.assertAlmostEqual(330.326599, rows[0]['y'])

    def test_unrelated_camera_without_faction_is_ignored(self):
        rows = self.parse('cam_gameplay_start = {x=1,y=2}')
        self.assertEqual([], rows)


if __name__ == '__main__':
    unittest.main()
