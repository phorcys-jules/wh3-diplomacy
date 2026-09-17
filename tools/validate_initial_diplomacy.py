#!/usr/bin/env python3
"""Validate the demonstrated initial-diplomacy fixture for the four pilots."""
import argparse, json
from pathlib import Path

PILOTS=('wh2_dlc15_hef_imrik','wh_main_emp_empire','wh2_main_def_hag_graef','wh3_main_nur_poxmakers_of_nurgle')

def main():
    p=argparse.ArgumentParser();p.add_argument('dataset',type=Path);a=p.parse_args()
    if not a.dataset.is_file(): raise SystemExit('initial diplomacy validation failed: missing dataset')
    d=json.loads(a.dataset.read_text(encoding='utf-8'))
    if d.get('campaign')!='wh3_main_combi': raise SystemExit('initial diplomacy validation failed: wrong campaign')
    rows={(r.get('sourceFaction'),r.get('targetFaction')):r for r in d.get('relations',[])}
    for source in PILOTS:
        for target in PILOTS:
            if source==target: continue
            row=rows.get((source,target))
            if not row: raise SystemExit(f'initial diplomacy validation failed: missing pilot pair {source} -> {target}')
            if row.get('baseAttitude') is None: raise SystemExit(f'initial diplomacy validation failed: no cultural baseline for {source} -> {target}')
            if not any(c.get('type')=='cultural-baseline' for c in row.get('components',[])): raise SystemExit(f'initial diplomacy validation failed: missing provenance for {source} -> {target}')
    print('validated 12 directional pilot diplomacy relations')

if __name__=='__main__': main()
