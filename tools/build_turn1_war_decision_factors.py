#!/usr/bin/env python3
"""Build a turn-one CAI war/stance input report without inventing a probability."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

def load(path, label):
    if not path.is_file():
        raise SystemExit(f"war factors failed: missing {label}: {path}")
    return json.loads(path.read_text(encoding="utf-8"))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cai", type=Path, required=True)
    parser.add_argument("--strategic", type=Path, required=True)
    parser.add_argument("--startpos", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    cai = load(args.cai, "CAI factors")
    strategic = load(args.strategic, "CAI strategic model")
    start = load(args.startpos, "startpos")
    wars = [row for row in start.get("relations", []) if row.get("atWar")]

    output = {
        "gameVersion": cai.get("gameVersion"),
        "campaign": cai.get("campaign"),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "simulable-subset",
        "semantics": (
            "Starting wars/personality/CAI parameters are exact pre-game inputs. "
            "The documented common-threat multiplier can be bounded before launch, "
            "but native base_score, exact proximity/direct-action values and the final declaration choice remain runtime-unknown."
        ),
        "exactPreGame": {
            "startingWars": wars,
            "factionProfiles": strategic.get("factionProfiles", []),
            "strategicStanceWeights": strategic.get("strategicStanceWeights", {}),
        },
        "simulablePreGame": {
            "documentedThreatFormula": strategic.get("documentedThreatFormula", {}),
            "personalityVariableDefaults": strategic.get("personalityVariableDefaults", {}),
        },
        "runtimeUnknown": [
            "common-threat base_score exact native derivation",
            "direct_actions multiplier exact turn-one native value",
            "proximity multiplier exact distance-to-multiplier mapping",
            "native final strategic-stance aggregation",
            "native final war declaration choice",
        ],
        "randomnessAudit": strategic.get("randomnessAudit", []),
        "diagnostics": {
            "startingWarCount": len(wars),
            "factionProfileCount": len(strategic.get("factionProfiles", [])),
            "randomnessVariableCount": len(strategic.get("randomnessAudit", [])),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"built CAI T1 war input report with {len(wars)} starting wars")

if __name__ == "__main__":
    main()
