import json
import subprocess
import sys
from pathlib import Path

def test_extract_multiplayer_team_rules(tmp_path):
    script = tmp_path / "wh_campaign_setup.lua"
    script.write_text(
        """
local team_mates = current_faction:team_mates();
cm:force_diplomacy("faction:" .. human_player_keys[i], "faction:" .. current_team_mate_name, "payments", true, true, true);
if not current_faction:trade_agreement_with(current_team_mate) then
    cm:force_make_trade_agreement(human_player_keys[i], current_team_mate_name);
end;
""",
        encoding="utf-8",
    )
    output = tmp_path / "out.json"
    tool = Path(__file__).with_name("extract_multiplayer_team_rules.py")
    subprocess.run([
        sys.executable, str(tool),
        "--script", str(script),
        "--output", str(output),
        "--game-version", "fixture",
    ], check=True)
    data = json.loads(output.read_text(encoding="utf-8"))
    effects = {row["effect"] for row in data["sameTeamRules"]}
    assert effects == {"payments-enabled", "trade-agreement-created-if-missing"}
    assert all(row["reproducibility"] == "exact-pre-game" for row in data["sameTeamRules"])
    assert data["runtimeUnknown"]
