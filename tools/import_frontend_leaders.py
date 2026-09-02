#!/usr/bin/env python3
"""Import WH3 frontend faction leaders into a compact faction lookup dataset."""
import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path

REQUIRED = {'key', 'agent_subtype_record', 'faction'}


def fail(message: str) -> None:
    raise SystemExit(f'frontend leader import failed: {message}')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--source-ref', required=True)
    args = parser.parse_args()

    if not args.input.is_file():
        fail(f'missing TSV: {args.input}')

    with args.input.open(encoding='utf-8-sig', newline='') as stream:
        reader = csv.DictReader(stream, delimiter='\t')
        fields = set(reader.fieldnames or [])
        if not REQUIRED.issubset(fields):
            fail('missing columns: ' + ', '.join(sorted(REQUIRED - fields)))
        leaders = []
        for row in reader:
            key = (row.get('key') or '').strip()
            agent = (row.get('agent_subtype_record') or '').strip()
            faction = (row.get('faction') or '').strip()
            if not key or key.startswith('#') or not agent or not faction:
                continue
            leaders.append({
                'politicalPartyKey': key,
                'agentSubtype': agent,
                'factionKey': faction,
            })

    if not leaders:
        fail('no playable frontend leaders found')

    unique = {(item['politicalPartyKey'], item['agentSubtype'], item['factionKey']): item for item in leaders}
    output = {
        'gameVersion': args.game_version,
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'sourceRef': args.source_ref,
        'sourceTable': 'frontend_faction_leaders_tables',
        'leaders': [unique[key] for key in sorted(unique)],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"imported {len(output['leaders'])} frontend faction leaders")


if __name__ == '__main__':
    main()
