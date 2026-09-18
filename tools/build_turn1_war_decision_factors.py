#!/usr/bin/env python3
"""Publish only demonstrated turn-one war-decision inputs."""
import argparse, json
from datetime import datetime, timezone
from pathlib import Path
def load(path):
    if not path.is_file(): raise SystemExit(f'war factors failed: missing {path}')
    return json.loads(path.read_text(encoding='utf-8'))
def main():
    p=argparse.ArgumentParser();p.add_argument('--cai',type=Path,required=True);p.add_argument('--startpos',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
    cai,start=load(a.cai),load(a.startpos);wars=[r for r in start.get('relations',[]) if r.get('atWar')]
    out={'gameVersion':cai.get('gameVersion'),'campaign':cai.get('campaign'),'generatedAt':datetime.now(timezone.utc).isoformat(),'status':'partial','exact':[{'type':'starting-war','relations':wars,'source':'start_pos_diplomacy_tables'},{'type':'starting-personality','profiles':cai.get('factionProfiles',[]),'strategicDesiredAttitudes':cai.get('strategicDesiredAttitudes',[]),'source':'cai_personalities_tables'}],'dynamicUnavailable':['relative military strength','shared borders and accessibility','current wars','corruption','reliability after player actions','strategic threat evaluation'],'semantics':'Starting wars are exact. CAI personalities and desired attitudes are verified inputs, but the CAI declaration decision is dynamic and is not reconstructed as a probability.'}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(f"built {len(wars)} exact starting war factors")
if __name__=='__main__':main()
