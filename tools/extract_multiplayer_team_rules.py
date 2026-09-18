#!/usr/bin/env python3
"""Extract exact multiplayer teammate diplomacy rules from wh_campaign_setup.lua."""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

def fail(message):
    raise SystemExit(f"multiplayer team rule extraction failed: {message}")

def line_number(text, needle):
    index = text.find(needle)
    return None if index < 0 else text.count("\n", 0, index) + 1

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--script", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--game-version", required=True)
    parser.add_argument("--campaign", default="wh3_main_combi")
    args = parser.parse_args()

    if not args.script.is_file():
        fail(f"missing script: {args.script}")
    text = args.script.read_text(encoding="utf-8", errors="replace")

    team_loop = "local team_mates = current_faction:team_mates()"
    payments = 'cm:force_diplomacy("faction:" .. human_player_keys[i], "faction:" .. current_team_mate_name, "payments", true, true, true)'
    trade = "cm:force_make_trade_agreement(human_player_keys[i], current_team_mate_name)"

    if team_loop not in text:
        fail("team_mates loop not found in wh_campaign_setup.lua")

    rules = []
    if payments in text:
        rules.append({
            "id": "teammates-payments-enabled",
            "mode": "same-team",
            "effect": "payments-enabled",
            "reproducibility": "exact-pre-game",
            "sourceFile": args.script.name,
            "sourceLine": line_number(text, payments),
            "evidence": payments,
        })
    if trade in text:
        rules.append({
            "id": "teammates-trade-forced",
            "mode": "same-team",
            "effect": "trade-agreement-created-if-missing",
            "reproducibility": "exact-pre-game",
            "sourceFile": args.script.name,
            "sourceLine": line_number(text, trade),
            "evidence": trade,
        })

    output = {
        "gameVersion": args.game_version,
        "campaign": args.campaign,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "verified-script-subset",
        "semantics": (
            "These are only teammate effects explicitly visible in wh_campaign_setup.lua. "
            "Native lobby/team semantics not expressed in script remain runtime-unknown."
        ),
        "sameTeamRules": rules,
        "ffaRules": [],
        "runtimeUnknown": [
            "whether native team membership itself is exposed to CAI as an alliance-like treaty",
            "native restrictions on war between teammates outside scripted force_diplomacy calls",
            "native third-party attitude treatment of lobby team membership",
        ],
        "diagnostics": {
            "verifiedRuleCount": len(rules),
            "paymentsRuleFound": any(rule["effect"] == "payments-enabled" for rule in rules),
            "tradeRuleFound": any(rule["effect"] == "trade-agreement-created-if-missing" for rule in rules),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"extracted {len(rules)} verified multiplayer teammate rules")

if __name__ == "__main__":
    main()
