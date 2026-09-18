#!/usr/bin/env python3
"""Resolve WH3 mechanical diplomacy restrictions for Immortal Empires.

The source table links a campaign group (originators) to a faction set (targets).
Campaign-group membership is reconstructed conservatively from member criteria.
"""
import argparse
import csv
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

TABLES = {
    "disabled": "diplomacy_disabled_between_factions_tables",
    "sets": "faction_set_items_tables",
    "factions": "factions_tables",
    "subculture_map": "cultures_subcultures_tables",
    "criteria_factions": "campaign_group_member_criteria_factions_tables",
    "criteria_cultures": "campaign_group_member_criteria_cultures_tables",
    "criteria_subcultures": "campaign_group_member_criteria_subcultures_tables",
    "criteria_campaigns": "campaign_group_member_criteria_campaigns_tables",
}

def fail(message):
    raise SystemExit(f"restriction import failed: {message}")

def read(path, required=True):
    if not path.is_file():
        if required:
            fail(f"missing required export: {path}")
        return []
    with path.open(encoding="utf-8-sig", newline="") as stream:
        rows = list(csv.DictReader(stream, delimiter="\t"))
    if not rows:
        return []
    first = next(iter(rows[0]), "")
    return [row for row in rows if not row.get(first, "").startswith("#")]

def truthy(value):
    return str(value or "").strip().lower() in {"1", "true", "yes"}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--game-version", required=True)
    parser.add_argument("--campaign", default="wh3_main_combi")
    args = parser.parse_args()

    rows = {
        key: read(args.db_dir / table / "data__.tsv", required=key in {"disabled", "sets", "factions", "subculture_map"})
        for key, table in TABLES.items()
    }
    if not rows["disabled"] or not {"campaign_group", "faction_set"} <= set(rows["disabled"][0]):
        fail("disabled table lacks required columns")
    if not rows["sets"] or not {"set", "faction", "culture", "subculture", "remove"} <= set(rows["sets"][0]):
        fail("faction set items table lacks required columns")

    faction_rows = [row for row in rows["factions"] if row.get("key")]
    faction_keys = {row["key"] for row in faction_rows}
    culture_by_subculture = {
        row.get("subculture"): row.get("culture")
        for row in rows["subculture_map"]
        if row.get("subculture") and row.get("culture")
    }
    by_culture = defaultdict(set)
    by_subculture = defaultdict(set)
    for row in faction_rows:
        subculture = row.get("subculture")
        culture = culture_by_subculture.get(subculture)
        if culture:
            by_culture[culture].add(row["key"])
        if subculture:
            by_subculture[subculture].add(row["key"])

    # Faction-set membership is ordered data: a later remove=true entry subtracts
    # the faction/culture/subculture expansion instead of naming a faction to remove.
    faction_sets = defaultdict(set)
    for row in rows["sets"]:
        set_key = row.get("set")
        if not set_key:
            continue
        expanded = set()
        if row.get("faction") in faction_keys:
            expanded.add(row["faction"])
        expanded.update(by_culture.get(row.get("culture", ""), set()))
        expanded.update(by_subculture.get(row.get("subculture", ""), set()))
        if truthy(row.get("remove")):
            faction_sets[set_key].difference_update(expanded)
        else:
            faction_sets[set_key].update(expanded)

    criteria_by_member = defaultdict(lambda: {
        "factions": [], "cultures": [], "subcultures": [], "campaigns": []
    })
    for row in rows["criteria_factions"]:
        if row.get("member"):
            criteria_by_member[row["member"]]["factions"].append(row)
    for row in rows["criteria_cultures"]:
        if row.get("member"):
            criteria_by_member[row["member"]]["cultures"].append(row)
    for row in rows["criteria_subcultures"]:
        if row.get("member"):
            criteria_by_member[row["member"]]["subcultures"].append(row)
    for row in rows["criteria_campaigns"]:
        if row.get("member"):
            criteria_by_member[row["member"]]["campaigns"].append(row)

    restrictions = []
    for row in rows["disabled"]:
        group = row.get("campaign_group")
        target_set = row.get("faction_set")
        if not group or not target_set:
            continue

        source_members = sorted(member for member in criteria_by_member if member.startswith(group + "_"))
        source_factions = set()
        source_criteria = []

        for member in source_members:
            criteria = criteria_by_member[member]
            campaigns = {item.get("campaign") for item in criteria["campaigns"] if item.get("campaign")}
            if campaigns and args.campaign not in campaigns:
                continue

            for item in criteria["factions"]:
                if item.get("context") not in {"ORIGINATOR", "ACTOR"}:
                    continue
                key = item.get("faction")
                if key in faction_keys:
                    source_factions.add(key)
                    source_criteria.append({"member": member, "context": item.get("context"), "type": "faction", "value": key})
            for item in criteria["cultures"]:
                if item.get("context") not in {"ORIGINATOR", "ACTOR"}:
                    continue
                key = item.get("culture")
                expanded = sorted(by_culture.get(key, set()))
                source_factions.update(expanded)
                source_criteria.append({"member": member, "context": item.get("context"), "type": "culture", "value": key, "expandedFactionCount": len(expanded)})
            for item in criteria["subcultures"]:
                if item.get("context") not in {"ORIGINATOR", "ACTOR"}:
                    continue
                key = item.get("subculture")
                expanded = sorted(by_subculture.get(key, set()))
                source_factions.update(expanded)
                source_criteria.append({"member": member, "context": item.get("context"), "type": "subculture", "value": key, "expandedFactionCount": len(expanded)})

        target_factions = sorted(faction_sets.get(target_set, set()))
        scope_resolved = bool(source_factions and target_factions)
        restrictions.append({
            "campaignGroup": group,
            "targetFactionSet": target_set,
            "sourceFactions": sorted(source_factions),
            "targetFactions": target_factions,
            "sourceMembers": source_members,
            "sourceCriteria": source_criteria,
            "directionality": "between-factions",
            "agreementTypes": ["all-diplomacy"],
            "effect": "disabled",
            "scopeResolved": scope_resolved,
            "reproducibility": "exact-pre-game" if scope_resolved else "runtime-unknown",
            "sourceTable": TABLES["disabled"],
        })

    output = {
        "gameVersion": args.game_version,
        "campaign": args.campaign,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "resolved-subset",
        "semantics": (
            "diplomacy_disabled_between_factions_tables disables diplomacy between a campaign-group originator "
            "and a faction-set target. Source membership is conservatively expanded from ORIGINATOR/ACTOR criteria; "
            "unresolved scopes remain explicit."
        ),
        "restrictions": restrictions,
        "diagnostics": {
            "restrictionCount": len(restrictions),
            "resolvedScopeCount": sum(1 for item in restrictions if item["scopeResolved"]),
            "unresolvedScopeCount": sum(1 for item in restrictions if not item["scopeResolved"]),
        },
        "sourceTables": list(TABLES.values()),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"imported {len(restrictions)} restrictions; {output['diagnostics']['resolvedScopeCount']} scopes resolved")

if __name__ == "__main__":
    main()
