#!/usr/bin/env python3
"""Create a provenance-preserving dataset from WH3 start_pos diplomacy TSV."""
import argparse, csv, json
from datetime import datetime, timezone
from pathlib import Path

def read_rows(path):
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = csv.DictReader(stream, delimiter='\t')
        return [row for row in rows if not row.get(next(iter(row), ''), '').startswith('#')]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    args = parser.parse_args()
    diplomacy = args.db_dir / 'start_pos_diplomacy_tables' / 'data__.tsv'
    factions = args.db_dir / 'start_pos_factions_tables' / 'data__.tsv'
    if not diplomacy.is_file() or not factions.is_file():
        raise SystemExit('import failed: missing start_pos_diplomacy or start_pos_factions export')
    faction_by_index = {row['ID']: row['faction'] for row in read_rows(factions)}
    relations = []
    for row in read_rows(diplomacy):
        source, target = faction_by_index.get(row['faction1']), faction_by_index.get(row['faction2'])
        if not source or not target:
            continue
        treaties = []
        if row['grants_military_access'] == 'true': treaties.append('military_access')
        if row['grants_trade_agreement'] == 'true': treaties.append('trade_agreement')
        if row['non_aggression_pact'] == 'true': treaties.append('non_aggression_pact')
        relations.append({'sourceFaction': source, 'targetFaction': target, 'baseAttitude': None, 'modifiers': [], 'treaties': treaties, 'atWar': row['stance'] == 'war'})
    output = {'gameVersion': args.game_version, 'campaign': 'wh3_main_combi', 'generatedAt': datetime.now(timezone.utc).isoformat(), 'relations': relations}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'generated {len(relations)} explicit starting relations')

if __name__ == '__main__': main()
