#!/usr/bin/env python3
"""Import provenance-preserving CAI diplomacy factors for starting factions."""
import argparse
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES = {
    'start_factions': 'start_pos_factions_tables',
    'personalities': 'cai_personalities_tables',
    'personality_groups': 'cai_personality_group_junctions_tables',
    'cultural_overrides': 'cai_personality_cultural_relations_overrides_tables',
    'treaty_values': 'cai_personality_diplomatic_treaty_values_tables',
    'event_values': 'cai_personality_diplomatic_event_values_tables',
    'reliability': 'cai_personalities_reliability_policies_tables',
}


def fail(message):
    raise SystemExit(f'CAI diplomacy import failed: {message}')


def read(path):
    if not path.is_file():
        fail(f'missing required export: {path}')
    with path.open(encoding='utf-8-sig', newline='') as stream:
        rows = list(csv.DictReader(stream, delimiter='\t'))
    if not rows:
        fail(f'empty export: {path}')
    first = next(iter(rows[0]), '')
    return [row for row in rows if not row.get(first, '').startswith('#')]


def require(rows, columns, table):
    if not rows or not columns <= set(rows[0]):
        fail(f'{table} missing required columns')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--game-version', required=True)
    parser.add_argument('--campaign', default='wh3_main_combi')
    args = parser.parse_args()
    rows = {key: read(args.db_dir / table / 'data__.tsv') for key, table in TABLES.items()}
    require(rows['start_factions'], {'faction', 'campaign', 'cai_starting_personality', 'cai_personality_group'}, TABLES['start_factions'])
    require(rows['personalities'], {'key', 'cultural_component', 'diplomatic_component', 'reliability_policy_key', 'strategic_component'}, TABLES['personalities'])
    require(rows['personality_groups'], {'group_key', 'personality_key'}, TABLES['personality_groups'])
    require(rows['cultural_overrides'], {'component_id', 'source', 'target', 'attitude_base', 'negative_attitude_multiplier', 'positive_attitude_multiplier'}, TABLES['cultural_overrides'])
    require(rows['treaty_values'], {'component_id', 'treaty', 'initial_value'}, TABLES['treaty_values'])
    require(rows['event_values'], {'component_id', 'event_id', 'value'}, TABLES['event_values'])
    require(rows['reliability'], {'key'}, TABLES['reliability'])

    personalities = {row['key']: row for row in rows['personalities'] if row.get('key')}
    personalities_for_group = defaultdict(list)
    for row in rows['personality_groups']:
        if row.get('group_key') and row.get('personality_key'):
            personalities_for_group[row['group_key']].append(row['personality_key'])
    reliability = {row['key']: row for row in rows['reliability'] if row.get('key')}
    profiles = []
    for row in rows['start_factions']:
        if row.get('campaign') != args.campaign or not row.get('faction'):
            continue
        direct_personality = row.get('cai_starting_personality')
        candidates = [direct_personality] if direct_personality else sorted(set(personalities_for_group.get(row.get('cai_personality_group'), [])))
        personality_key = candidates[0] if len(candidates) == 1 else None
        personality = personalities.get(personality_key)
        profiles.append({
            'factionKey': row['faction'], 'personalityKey': personality_key,
            'personalityCandidates': candidates, 'personalityGroup': row.get('cai_personality_group') or None,
            'culturalComponent': personality.get('cultural_component') if personality else None,
            'diplomaticComponent': personality.get('diplomatic_component') if personality else None,
            'strategicComponent': personality.get('strategic_component') if personality else None,
            'reliabilityPolicy': personality.get('reliability_policy_key') if personality else None,
            'personalityResolved': bool(personality),
        })
    components = {profile['culturalComponent'] for profile in profiles if profile['culturalComponent']}
    diplomatic_components = {profile['diplomaticComponent'] for profile in profiles if profile['diplomaticComponent']}
    output = {
        'gameVersion': args.game_version, 'campaign': args.campaign,
        'generatedAt': datetime.now(timezone.utc).isoformat(), 'status': 'partial',
        'semantics': 'CAI profiles influence AI evaluation. Cultural overrides are explicit starting-faction inputs; treaty, event, strategic and reliability values are retained as factors but are not added to attitude without a demonstrated turn-one trigger.',
        'factionProfiles': sorted(profiles, key=lambda item: item['factionKey']),
        'culturalOverrides': [
            {'componentId': row['component_id'], 'sourceSubculture': row['source'], 'targetSubculture': row['target'], 'attitudeBase': float(row['attitude_base']), 'negativeAttitudeMultiplier': float(row['negative_attitude_multiplier']), 'positiveAttitudeMultiplier': float(row['positive_attitude_multiplier']), 'sourceTable': TABLES['cultural_overrides']}
            for row in rows['cultural_overrides'] if row.get('component_id') in components
        ],
        'treatyValues': [
            {'componentId': row['component_id'], 'treaty': row['treaty'], 'initialValue': float(row['initial_value']), 'value1': row.get('value1'), 'turn1': row.get('turn1'), 'sourceTable': TABLES['treaty_values']}
            for row in rows['treaty_values'] if row.get('component_id') in diplomatic_components
        ],
        'eventValues': [
            {'componentId': row['component_id'], 'eventId': row['event_id'], 'value': float(row['value']), 'falloff': row.get('falloff'), 'sourceTable': TABLES['event_values']}
            for row in rows['event_values'] if row.get('component_id') in diplomatic_components
        ],
        'reliabilityPolicies': [row for row in reliability.values() if row['key'] in {profile['reliabilityPolicy'] for profile in profiles}],
        'diagnostics': {'startingFactionCount': len(profiles), 'unresolvedPersonalityCount': sum(not item['personalityResolved'] for item in profiles), 'ambiguousPersonalityGroupCount': sum(len(item['personalityCandidates']) > 1 for item in profiles), 'resolvedPersonalityCount': sum(item['personalityResolved'] for item in profiles)},
        'sourceTables': list(TABLES.values()),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"imported CAI diplomacy factors for {len(profiles)} starting factions")


if __name__ == '__main__':
    main()
