#!/usr/bin/env python3
"""Normalize RPFM TSV exports without fabricating diplomacy values."""
import argparse, csv, json
from datetime import datetime, timezone
from pathlib import Path

REQUIRED = {"sourceFaction", "targetFaction", "modifierKey", "value", "source", "atWar"}
SOURCES = {"start-pos", "game-db", "campaign-script", "manual-verification"}

def fail(message):
    raise SystemExit(f"import failed: {message}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True, help="RPFM-exported TSV")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--game-version", required=True)
    parser.add_argument("--campaign", default="wh3_main_combi")
    args = parser.parse_args()
    if not args.input.is_file(): fail(f"missing input export: {args.input}")
    with args.input.open(encoding="utf-8-sig", newline="") as stream:
        rows = list(csv.DictReader(stream, delimiter="\t"))
        if not stream or not rows: fail("input export is empty")
        columns = set(rows[0])
    missing = REQUIRED - columns
    if missing: fail("missing required columns: " + ", ".join(sorted(missing)))
    relations = {}
    for index, row in enumerate(rows, 2):
        if row["source"] not in SOURCES: fail(f"line {index}: unknown provenance")
        try: value = float(row["value"])
        except ValueError: fail(f"line {index}: modifier value is not numeric")
        key = (row["sourceFaction"], row["targetFaction"])
        item = relations.setdefault(key, {"sourceFaction": key[0], "targetFaction": key[1], "baseAttitude": None, "modifiers": [], "treaties": [], "atWar": row["atWar"].lower() == "true"})
        item["modifiers"].append({"source": row["source"], "key": row["modifierKey"], "value": value})
    output = {"gameVersion": args.game_version, "campaign": args.campaign, "generatedAt": datetime.now(timezone.utc).isoformat(), "relations": list(relations.values())}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__": main()
