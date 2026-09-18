#!/usr/bin/env python3
"""Normalize WH3 mechanical diplomacy restrictions without guessing their scope."""
import argparse, csv, json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES={'disabled':'diplomacy_disabled_between_factions_tables','sets':'faction_set_items_tables','factions':'factions_tables'}
def fail(message): raise SystemExit(f'restriction import failed: {message}')
def read(path):
    if not path.is_file(): fail(f'missing required export: {path}')
    with path.open(encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f,delimiter='\t'))
    if not rows: fail(f'empty export: {path}')
    first=next(iter(rows[0]),''); return [r for r in rows if not r.get(first,'').startswith('#')]
def main():
    p=argparse.ArgumentParser();p.add_argument('--db-dir',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--game-version',required=True);p.add_argument('--campaign',default='wh3_main_combi');a=p.parse_args()
    rows={k:read(a.db_dir/v/'data__.tsv') for k,v in TABLES.items()}
    if not {'campaign_group','faction_set'} <= set(rows['disabled'][0]): fail('disabled table lacks columns')
    if not {'set','faction','culture','subculture'} <= set(rows['sets'][0]): fail('set items table lacks columns')
    factions=rows['factions']; by_culture=defaultdict(list);by_subculture=defaultdict(list);keys=set()
    for row in factions:
        if not row.get('key'): continue
        keys.add(row['key']);by_culture[row.get('culture','')].append(row['key']);by_subculture[row.get('subculture','')].append(row['key'])
    items=defaultdict(set)
    for row in rows['sets']:
        target=items[row.get('set','')]
        if row.get('faction') in keys: target.add(row['faction'])
        target.update(by_culture.get(row.get('culture',''),[]));target.update(by_subculture.get(row.get('subculture',''),[]))
        if row.get('remove') in target: target.discard(row['remove'])
    restrictions=[{'campaignGroup':r['campaign_group'],'targetFactionSet':r['faction_set'],'targetFactions':sorted(items.get(r['faction_set'],set())),'agreementTypes':'unspecified by source table','effect':'disabled','sourceTable':TABLES['disabled']} for r in rows['disabled']]
    out={'gameVersion':a.game_version,'campaign':a.campaign,'generatedAt':datetime.now(timezone.utc).isoformat(),'status':'partial','semantics':'The source table proves that diplomacy is disabled for a campaign group and faction set. It does not name individual agreement types or resolve campaign-group membership, so those fields are explicitly retained as incomplete.','restrictions':restrictions,'sourceTables':list(TABLES.values())}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(f'imported {len(restrictions)} mechanical diplomacy restrictions')
if __name__=='__main__': main()
