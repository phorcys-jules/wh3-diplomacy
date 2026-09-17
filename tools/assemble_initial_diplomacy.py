#!/usr/bin/env python3
"""Assemble only demonstrated turn-1 diplomacy components by direction."""
import argparse, json
from datetime import datetime, timezone
from pathlib import Path

def load(path):
    if not path.is_file(): raise SystemExit(f'initial diplomacy assembly failed: missing {path}')
    return json.loads(path.read_text(encoding='utf-8'))

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--cultural',type=Path,required=True);p.add_argument('--startpos',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True);p.add_argument('--game-version',required=True);p.add_argument('--campaign',default='wh3_main_combi')
    a=p.parse_args(); cultural=load(a.cultural); startpos=load(a.startpos)
    if cultural.get('campaign')!=a.campaign or startpos.get('campaign')!=a.campaign: raise SystemExit('initial diplomacy assembly failed: campaign mismatch')
    explicit={(r['sourceFaction'],r['targetFaction']):r for r in startpos.get('relations',[])}
    relations=[]
    for row in cultural.get('relations',[]):
        key=(row['sourceFaction'],row['targetFaction']); initial=explicit.pop(key,None)
        components=list(row.get('components',[]))
        if initial: components.append({'type':'startpos-relation','sourceTable':'start_pos_diplomacy_tables','atWar':initial['atWar'],'treaties':initial['treaties']})
        relations.append({'sourceFaction':key[0],'targetFaction':key[1],'baseAttitude':row['baseAttitude'],'positiveAttitudeMultiplier':row['positiveAttitudeMultiplier'],'negativeAttitudeMultiplier':row['negativeAttitudeMultiplier'],'modifiers':[],'treaties':initial['treaties'] if initial else [],'atWar':initial['atWar'] if initial else False,'components':components})
    for key,initial in explicit.items():
        relations.append({'sourceFaction':key[0],'targetFaction':key[1],'baseAttitude':None,'positiveAttitudeMultiplier':None,'negativeAttitudeMultiplier':None,'modifiers':[],'treaties':initial['treaties'],'atWar':initial['atWar'],'components':[{'type':'startpos-relation','sourceTable':'start_pos_diplomacy_tables','atWar':initial['atWar'],'treaties':initial['treaties']}]})
    relations.sort(key=lambda r:(r['sourceFaction'],r['targetFaction']))
    out={'gameVersion':a.game_version,'campaign':a.campaign,'generatedAt':datetime.now(timezone.utc).isoformat(),'status':'partial','semantics':'demonstrated directional cultural baseline plus explicit startpos wars/treaties; unproven script and other modifiers are deliberately excluded','relations':relations}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(f'assembled {len(relations)} directional initial diplomacy relations')
if __name__=='__main__': main()
