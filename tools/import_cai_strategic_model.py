#!/usr/bin/env python3
"""Build a provenance-preserving CAI strategic/diplomatic model for turn one.

The game exposes enough data to reproduce some inputs exactly and some formulas
partially. This importer deliberately separates:
- exact-pre-game: deterministic values from DB/start data;
- simulable-pre-game: formula terms whose inputs and mapping are documented;
- runtime-unknown: native-engine state/formulas that are not present in the dump.
"""
import argparse
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES = {
    "cai_variables": "cai_variables_tables",
    "personality_variables": "cai_personality_variables_tables",
    "variable_set_values": "cai_personality_variable_set_junctions_tables",
    "variable_profiles": "cai_personalities_personality_variable_profiles_tables",
    "variable_profile_overrides": "cai_personalities_personality_variable_profile_context_overrides_tables",
    "variable_profile_override_contexts": "cai_personalities_personality_variable_profile_context_overrides_junctions_tables",
    "personalities": "cai_personalities_tables",
    "strategic_components": "cai_personality_strategic_components_tables",
    "deal_profiles": "cai_personality_deal_evaluation_profiles_tables",
    "deal_values": "cai_personality_deal_evaluation_deal_component_values_tables",
}

DIFFICULTY_CONTEXT = {
    "easy": "cai_difficulty_context_type_easy",
    "normal": None,
    "hard": "cai_difficulty_context_type_hard",
    "very_hard": "cai_difficulty_context_type_very_hard",
    "legendary": "cai_difficulty_context_type_legendary",
}

THREAT_KEYS = {
    "ai_threat_score_attitude_multiplier_max",
    "ai_threat_score_attitude_multiplier_min",
    "ai_threat_score_attitude_threshold_max",
    "ai_threat_score_attitude_threshold_min",
    "ai_threat_score_direct_actions_mult_max",
    "ai_threat_score_direct_actions_mult_min",
    "ai_threat_score_personality_multiplier_player",
    "ai_threat_score_proximity_multiplier_max",
    "ai_threat_score_proximity_multiplier_min",
    "coordinator_player_strength_multiplier",
    "diplomacy_distance_goal_priority_modifier",
}

STRATEGIC_FIELDS = {
    "id",
    "friendly_towards_enemy_multiplier",
    "friendly_towards_friend_multiplier",
    "hostile_towards_enemy_multiplier",
    "hostile_towards_friend_multiplier",
    "max_friendly_attitude",
    "max_hostile_attitude",
    "enemy_strength_modifier",
    "enemy_threat_strength_modifier",
    "strategic_balance_opportunism_factor",
    "ai_threat_score_threat_treshold",
    "dead_zone",
    "call_to_arms_chance_defensive_war_with_human_players",
    "call_to_arms_chance_offensive_war_with_human_players",
}

WAR_COMPONENTS = {
    "WAR",
    "OFFER_DECLARE_WAR",
    "REQUEST_DECLARE_WAR",
    "OFFER_JOIN_WAR",
    "REQUEST_JOIN_WAR",
    "STRATEGIC_BALANCE_CHANGE",
}

def fail(message):
    raise SystemExit(f"CAI strategic import failed: {message}")

def read_table(db_dir, table):
    path = db_dir / table / "data__.tsv"
    if not path.is_file():
        fail(f"missing required export: {path}")
    with path.open(encoding="utf-8-sig", newline="") as stream:
        rows = list(csv.DictReader(stream, delimiter="\t"))
    if not rows:
        fail(f"empty export: {path}")
    first = next(iter(rows[0]), "")
    return [row for row in rows if not row.get(first, "").startswith("#")]

def load_json(path, label):
    if not path.is_file():
        fail(f"missing {label}: {path}")
    return json.loads(path.read_text(encoding="utf-8"))

def as_number(value):
    if value in (None, ""):
        return None
    try:
        return float(value)
    except ValueError:
        return None

def compact_numeric(row, fields):
    out = {}
    for key in fields:
        if key not in row:
            continue
        value = row.get(key)
        number = as_number(value)
        out[key] = number if number is not None else value
    return out

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-dir", type=Path, required=True)
    parser.add_argument("--cai-factors", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--game-version", required=True)
    parser.add_argument("--campaign", default="wh3_main_combi")
    args = parser.parse_args()

    tables = {key: read_table(args.db_dir, table) for key, table in TABLES.items()}
    cai = load_json(args.cai_factors, "CAI diplomacy factors")

    global_variables = {}
    randomness_audit = []
    for row in tables["cai_variables"]:
        key = row.get("key")
        if not key:
            continue
        value = as_number(row.get("value"))
        description = row.get("description") or ""
        if key.startswith("CAI_VARIABLE_STRATEGIC_STANCE_CONTROL_") or key.startswith("CAI_VARIABLE_STRATEGIC_BALANCE_"):
            global_variables[key] = {
                "value": value,
                "description": description,
                "sourceTable": TABLES["cai_variables"],
                "reproducibility": "exact-pre-game",
            }
        lower = (key + " " + description).lower()
        if any(word in lower for word in ("random", "chance", "probability")) and any(
            word in lower for word in ("strategic", "diplom", "aggr", "war")
        ):
            randomness_audit.append({
                "key": key,
                "value": value,
                "description": description,
                "sourceTable": TABLES["cai_variables"],
            })

    personality_defaults = {
        row["key"]: as_number(row.get("default_value"))
        for row in tables["personality_variables"]
        if row.get("key") in THREAT_KEYS
    }
    personality_descriptions = {
        row["key"]: row.get("description") or ""
        for row in tables["personality_variables"]
        if row.get("key") in THREAT_KEYS
    }

    set_values = defaultdict(dict)
    for row in tables["variable_set_values"]:
        key = row.get("personality_variable")
        set_key = row.get("personality_variable_set")
        if key in THREAT_KEYS and set_key:
            set_values[set_key][key] = as_number(row.get("value"))

    default_set_by_profile = {
        row.get("key"): row.get("default_personality_variable_set") or None
        for row in tables["variable_profiles"]
        if row.get("key")
    }

    override_set_by_profile_priority = {
        (row.get("profile"), row.get("priority")): row.get("default_variable_group") or None
        for row in tables["variable_profile_overrides"]
        if row.get("profile") and row.get("priority")
    }
    context_priority = defaultdict(dict)
    for row in tables["variable_profile_override_contexts"]:
        profile = row.get("profile")
        context = row.get("context")
        priority = row.get("priority")
        if profile and context and priority:
            context_priority[profile][context] = priority

    personality_rows = {row["key"]: row for row in tables["personalities"] if row.get("key")}
    strategic_components = {
        row["id"]: compact_numeric(row, STRATEGIC_FIELDS)
        for row in tables["strategic_components"]
        if row.get("id")
    }
    deal_component_by_profile = {
        row.get("key"): row.get("default_deal_evaluation_component") or None
        for row in tables["deal_profiles"]
        if row.get("key")
    }
    deal_rows = defaultdict(dict)
    for row in tables["deal_values"]:
        component = row.get("personality_component")
        deal = row.get("deal_component")
        if component and deal in WAR_COMPONENTS:
            deal_rows[component][deal] = {
                key: (as_number(value) if as_number(value) is not None else value)
                for key, value in row.items()
                if key not in {"personality_component"} and value not in (None, "")
            }

    def variable_set_for(profile, difficulty):
        if not profile:
            return None
        context = DIFFICULTY_CONTEXT[difficulty]
        if context:
            priority = context_priority.get(profile, {}).get(context)
            if priority:
                override = override_set_by_profile_priority.get((profile, priority))
                if override:
                    return override
        return default_set_by_profile.get(profile)

    def variables_for(profile, difficulty):
        values = dict(personality_defaults)
        set_key = variable_set_for(profile, difficulty)
        if set_key:
            values.update({k: v for k, v in set_values.get(set_key, {}).items() if v is not None})
        return {
            "variableSet": set_key,
            "values": values,
        }

    profiles = []
    for faction_profile in cai.get("factionProfiles", []):
        personality_key = faction_profile.get("personalityKey")
        personality = personality_rows.get(personality_key, {})
        variable_profile = personality.get("personality_variables_profile") or None
        deal_profile = personality.get("deal_evaluation_profile") or None
        deal_component = deal_component_by_profile.get(deal_profile)
        strategic_component_key = personality.get("strategic_component") or faction_profile.get("strategicComponent")
        difficulties = {
            difficulty: variables_for(variable_profile, difficulty)
            for difficulty in DIFFICULTY_CONTEXT
        }
        profiles.append({
            "factionKey": faction_profile.get("factionKey"),
            "personalityKey": personality_key,
            "personalityResolved": bool(personality_key and personality),
            "personalityVariableProfile": variable_profile,
            "dealEvaluationProfile": deal_profile,
            "dealEvaluationComponent": deal_component,
            "strategicComponent": strategic_component_key,
            "strategicComponentValues": strategic_components.get(strategic_component_key),
            "warDealEvaluation": deal_rows.get(deal_component, {}),
            "difficultyVariables": difficulties,
            "reproducibility": {
                "personality": "exact-pre-game" if faction_profile.get("personalityResolved") else "runtime-unknown",
                "threatParameters": "exact-pre-game",
                "warDealEvaluation": "exact-pre-game" if deal_component else "runtime-unknown",
                "finalWarDecision": "runtime-unknown",
            },
        })

    stance_weights = {
        key: record for key, record in global_variables.items()
        if key.startswith("CAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_")
    }

    output = {
        "gameVersion": args.game_version,
        "campaign": args.campaign,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "partial-native-decision",
        "semantics": (
            "CAI inputs and documented threat formula parameters are extracted from game DB. "
            "The native final strategic-stance/war decision is not claimed as reproduced."
        ),
        "reproducibilityLevels": {
            "exact-pre-game": "deterministic input from WH3 data/start state",
            "simulable-pre-game": "formula or bounded term reproducible before launching the campaign",
            "runtime-unknown": "native runtime state/formula not exposed by the extracted data",
        },
        "documentedThreatFormula": {
            "formula": "base_score * attitude_multiplier * direct_actions_multiplier * proximity_multiplier * personality_multiplier_player",
            "sourceTable": TABLES["personality_variables"],
            "knownBeforeGame": [
                "attitude multiplier from starting attitude and configured thresholds",
                "personality multiplier for the player",
                "configured min/max envelopes for direct-actions and proximity multipliers",
            ],
            "runtimeUnknown": [
                "base_score exact native derivation",
                "direct_actions multiplier exact turn-one native value",
                "proximity multiplier exact distance-to-multiplier mapping",
            ],
        },
        "strategicStanceWeights": stance_weights,
        "globalStrategicVariables": global_variables,
        "personalityVariableDefaults": {
            key: {
                "value": personality_defaults.get(key),
                "description": personality_descriptions.get(key),
                "sourceTable": TABLES["personality_variables"],
            }
            for key in sorted(THREAT_KEYS)
        },
        "factionProfiles": sorted(profiles, key=lambda row: row.get("factionKey") or ""),
        "randomnessAudit": sorted(randomness_audit, key=lambda row: row["key"]),
        "diagnostics": {
            "factionProfileCount": len(profiles),
            "resolvedPersonalityCount": sum(1 for row in profiles if row["personalityResolved"]),
            "strategicStanceWeightCount": len(stance_weights),
            "randomnessVariableCount": len(randomness_audit),
        },
        "sourceTables": list(TABLES.values()),
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"built CAI strategic model for {len(profiles)} factions")

if __name__ == "__main__":
    main()
