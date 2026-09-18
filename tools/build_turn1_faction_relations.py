#!/usr/bin/env python3
"""Build auditable active-NPC to playable-faction turn-one profiles."""
import argparse,json
from datetime import datetime,timezone
from pathlib import Path
def load(path):
    if not path.is_file(): raise SystemExit(f'turn1 relations failed: missing {path}')
    return json.loads(path.read_text(encoding='utf-8'))
def main():
    p=argparse.ArgumentParser();p.add_argument('--factions',type=Path,required=True);p.add_argument('--culture',type=Path,required=True);p.add_argument('--cai',type=Path,required=True);p.add_argument('--startpos',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
    factions,culture,cai,start=load(a.factions),load(a.culture),load(a.cai),load(a.startpos)
    all_factions=factions.get('factions',[]); targets=[f for f in all_factions if f.get('playable')]
    by_culture={(r.get('sourceSubculture'),r.get('targetSubculture')):r for r in culture.get('relations',[])}
    profiles={r.get('factionKey'):r for r in cai.get('factionProfiles',[])}
    overrides={(r.get('componentId'),r.get('sourceSubculture'),r.get('targetSubculture')):r for r in cai.get('culturalOverrides',[])}
    starts={(r.get('sourceFaction'),r.get('targetFaction')):r for r in start.get('relations',[])}
    relations=[]
    for source in all_factions:
      for target in targets:
        if source['factionKey']==target['factionKey']: continue
        cultural=by_culture.get((source.get('subculture'),target.get('subculture')))
        if not cultural: continue
        component=profiles.get(source['factionKey'],{}).get('culturalComponent')
        override=overrides.get((component,source.get('subculture'),target.get('subculture')));selected=override or cultural; explicit=starts.get((source['factionKey'],target['factionKey']),{})
        relations.append({'sourceFaction':source['factionKey'],'targetFaction':target['factionKey'],'baseAttitude':selected['attitudeBase'],'positiveAttitudeMultiplier':selected['positiveAttitudeMultiplier'],'negativeAttitudeMultiplier':selected['negativeAttitudeMultiplier'],'treaties':explicit.get('treaties',[]),'atWar':bool(explicit.get('atWar')),'components':[{'type':'cai-personality-cultural-override' if override else 'cultural-baseline','sourceTable':selected['sourceTable'],'personalityComponent':component if override else None}],'complete':False,'missingComponents':['dynamic campaign state and unverified third-party effects']})
    out={'gameVersion':factions.get('gameVersion'),'campaign':factions.get('campaign'),'generatedAt':datetime.now(timezone.utc).isoformat(),'status':'partial','semantics':'Profiles cover every active Immortal Empires faction as source and every playable start faction as target. Dynamic state is never replaced with zero.','relations':relations,'diagnostics':{'sourceFactionCount':len(all_factions),'playableTargetCount':len(targets),'relationCount':len(relations)}}
    a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(f"built {len(relations)} active-to-playable turn-one profiles")
if __name__=='__main__':main()
