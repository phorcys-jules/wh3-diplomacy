#!/usr/bin/env python3
"""Build auditable turn-one diplomacy profiles for active IE factions.

This dataset is intentionally split between exact inputs and a conservative
pre-game sum of known attitude components. It is not labelled as the native
displayed attitude unless every engine-side transform becomes known.
"""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

TREATY_KEYS = {
    "non_aggression_pact": "NON_AGGRESSION_PACT",
    "trade_agreement": "TRADE_AGREEMENT",
    "military_access": "MILITARY_ACCESS",
    "defensive_alliance": "DEFENSIVE_ALLIANCE",
    "military_alliance": "MILITARY_ALLIANCE",
    "vassalage": "VASSALAGE_VASSAL",
    "client_state": "CLIENT_STATE_CLIENT",
}

def load(path, label, optional=False):
    if path is None:
        return {}
    if not path.is_file():
        if optional:
            return {}
        raise SystemExit(f"turn1 relations failed: missing {label}: {path}")
    return json.loads(path.read_text(encoding="utf-8"))

def target_matches(modifier, target):
    for item in modifier.get("targets", []):
        target_type = item.get("targetType")
        key = item.get("target")
        if target_type == "faction" and key == target.get("factionKey"):
            return True
        if target_type == "subculture" and key == target.get("subculture"):
            return True
        if target_type == "culture" and key == target.get("culture"):
            return True
    return False

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--factions", type=Path, required=True)
    parser.add_argument("--culture", type=Path, required=True)
    parser.add_argument("--cai", type=Path, required=True)
    parser.add_argument("--startpos", type=Path, required=True)
    parser.add_argument("--verified-modifiers", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    factions = load(args.factions, "factions")
    culture = load(args.culture, "culture")
    cai = load(args.cai, "CAI")
    start = load(args.startpos, "startpos")
    verified = load(args.verified_modifiers, "verified modifiers", optional=True)

    all_factions = factions.get("factions", [])
    targets = [faction for faction in all_factions if faction.get("playable")]
    by_culture = {
        (row.get("sourceSubculture"), row.get("targetSubculture")): row
        for row in culture.get("relations", [])
    }
    profiles = {row.get("factionKey"): row for row in cai.get("factionProfiles", [])}
    overrides = {
        (row.get("componentId"), row.get("sourceSubculture"), row.get("targetSubculture")): row
        for row in cai.get("culturalOverrides", [])
    }
    starts = {
        (row.get("sourceFaction"), row.get("targetFaction")): row
        for row in start.get("relations", [])
    }
    treaty_values = {
        (row.get("componentId"), row.get("treaty")): row
        for row in cai.get("treatyValues", [])
    }
    verified_by_source = {}
    for modifier in verified.get("modifiers", []):
        verified_by_source.setdefault(modifier.get("sourceFaction"), []).append(modifier)

    relations = []
    for source in all_factions:
        source_key = source.get("factionKey")
        profile = profiles.get(source_key, {})
        component = profile.get("culturalComponent")
        diplomatic_component = profile.get("diplomaticComponent")

        for target in targets:
            target_key = target.get("factionKey")
            if not source_key or source_key == target_key:
                continue

            cultural = by_culture.get((source.get("subculture"), target.get("subculture")))
            if not cultural:
                continue
            override = overrides.get((component, source.get("subculture"), target.get("subculture")))
            selected = override or cultural
            explicit = starts.get((source_key, target_key), {})

            known_components = [{
                "type": "cai-personality-cultural-override" if override else "cultural-baseline",
                "value": selected.get("attitudeBase"),
                "sourceTable": selected.get("sourceTable"),
                "personalityComponent": component if override else None,
                "reproducibility": "exact-pre-game",
            }]

            treaty_component_total = 0.0
            treaty_components = []
            treaty_names = list(explicit.get("treaties", []))
            if explicit.get("atWar"):
                treaty_names.append("war")

            for treaty in treaty_names:
                cai_key = "WAR" if treaty == "war" else TREATY_KEYS.get(treaty)
                if not cai_key or not diplomatic_component:
                    continue
                value_row = treaty_values.get((diplomatic_component, cai_key))
                if not value_row:
                    continue
                value = float(value_row.get("initialValue", 0))
                treaty_component_total += value
                treaty_components.append({
                    "type": "cai-treaty-initial-value",
                    "treaty": cai_key,
                    "value": value,
                    "sourceTable": value_row.get("sourceTable"),
                    "diplomaticComponent": diplomatic_component,
                    "reproducibility": "simulable-pre-game",
                    "note": "DB initial_value is retained as a known CAI attitude component; native final attitude composition is not claimed exact.",
                })
            known_components.extend(treaty_components)

            modifier_total = 0.0
            applied_modifiers = []
            for modifier in verified_by_source.get(source_key, []):
                if not target_matches(modifier, target):
                    continue
                value = float(modifier.get("value", 0))
                modifier_total += value
                applied_modifiers.append({
                    "type": "verified-first-tick-diplomatic-modifier",
                    "effect": modifier.get("effect"),
                    "effectBundle": modifier.get("effectBundle"),
                    "value": value,
                    "targets": modifier.get("targets", []),
                    "evidence": modifier.get("evidence"),
                    "reproducibility": "exact-pre-game",
                })
            known_components.extend(applied_modifiers)

            base = float(selected.get("attitudeBase", 0))
            known_sum = base + treaty_component_total + modifier_total
            missing = [
                "native final attitude composition/rounding",
                "third-party treaty transitivity (modelled separately)",
                "runtime diplomatic events after campaign start",
            ]

            relations.append({
                "sourceFaction": source_key,
                "targetFaction": target_key,
                "baseAttitude": base,
                "knownAttitudeComponentsTotal": known_sum,
                "knownAttitudeTotalReproducibility": "simulable-pre-game",
                "positiveAttitudeMultiplier": selected.get("positiveAttitudeMultiplier"),
                "negativeAttitudeMultiplier": selected.get("negativeAttitudeMultiplier"),
                "treaties": explicit.get("treaties", []),
                "atWar": bool(explicit.get("atWar")),
                "components": known_components,
                "complete": False,
                "missingComponents": missing,
            })

    output = {
        "gameVersion": factions.get("gameVersion"),
        "campaign": factions.get("campaign"),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "simulable-subset",
        "semantics": (
            "Profiles cover active Immortal Empires factions as sources and playable factions as targets. "
            "baseAttitude is exact DB/start input. knownAttitudeComponentsTotal is a conservative pre-game sum "
            "of known components and must not be presented as the exact native displayed attitude."
        ),
        "relations": relations,
        "diagnostics": {
            "sourceFactionCount": len(all_factions),
            "playableTargetCount": len(targets),
            "relationCount": len(relations),
            "relationsWithTreatyComponents": sum(
                any(component.get("type") == "cai-treaty-initial-value" for component in row["components"])
                for row in relations
            ),
            "relationsWithVerifiedModifiers": sum(
                any(component.get("type") == "verified-first-tick-diplomatic-modifier" for component in row["components"])
                for row in relations
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"built {len(relations)} active-to-playable turn-one profiles")

if __name__ == "__main__":
    main()
