#!/usr/bin/env python3
"""Report direct faction-based diplomacy categories from exported WH3 tables."""
import argparse, csv, json
from collections import defaultdict
from pathlib import Path

PILOTS = ['wh2_dlc15_hef_imrik', 'wh_main_emp_reikland', 'wh2_dlc14_def_hag_graef', 'wh3_main_nur_poxmakers_of_nurgle']

def rows(path):
    with path.open(encoding='utf-8-sig', newline='') as f:
        return [r for r in csv.DictReader(f, delimiter='\t') if not r.get('member', '').startswith('#')]

def main():
    p = argparse.ArgumentParser(); p.add_argument('--db-dir', type=Path, required=True); p.add_argument('--output', type=Path, required=True); args = p.parse_args()
    base = args.db_dir
    files = {name: base / name / 'data__.tsv' for name in ['campaign_group_members_tables', 'campaign_group_member_criteria_factions_tables', 'campaign_group_member_criteria_diplomatic_attitudes_tables']}
    if any(not path.is_file() for path in files.values()): raise SystemExit('resolver failed: missing required exported table')
    group_for_member = {r['id']: r['group'] for r in rows(files['campaign_group_members_tables'])}
    attitudes = {r['member']: r['attitude'] for r in rows(files['campaign_group_member_criteria_diplomatic_attitudes_tables'])}
    categories = defaultdict(list)
    for rule in rows(files['campaign_group_member_criteria_factions_tables']):
        if rule['faction'] not in PILOTS: continue
        group = group_for_member.get(rule['member'])
        attitude = attitudes.get(rule['member'])
        if group and attitude: categories[rule['faction']].append({'group': group, 'member': rule['member'], 'context': rule['context'], 'attitude': attitude, 'source': 'game-db'})
    result = {'status': 'partial', 'scope': 'direct faction criteria only; culture/subculture and script precedence remain unresolved', 'factions': categories}
    args.output.parent.mkdir(parents=True, exist_ok=True); args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('resolved', sum(map(len, categories.values())), 'category rules')

if __name__ == '__main__': main()
