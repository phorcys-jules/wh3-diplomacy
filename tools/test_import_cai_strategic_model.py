import json
import subprocess
import sys
from pathlib import Path

TABLES = {
    "cai_variables_tables": "key\tvalue\tdescription\nCAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_CURRENT_ATTITUDE\t3\tstance weight\nCAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_DIPLOMATIC_TREATIES_TRANSITIVE\t0.5\ttransitive treaty weight\n",
    "cai_personality_variables_tables": "key\tdefault_value\tdescription\nai_threat_score_attitude_multiplier_max\t3\tmax\nai_threat_score_attitude_multiplier_min\t0.1\tmin\nai_threat_score_attitude_threshold_max\t150\tthreshold max\nai_threat_score_attitude_threshold_min\t-150\tthreshold min\nai_threat_score_direct_actions_mult_max\t1\tmax\nai_threat_score_direct_actions_mult_min\t0.5\tmin\nai_threat_score_personality_multiplier_player\t1\tplayer\nai_threat_score_proximity_multiplier_max\t1\tmax\nai_threat_score_proximity_multiplier_min\t0.25\tmin\n",
    "cai_personality_variable_set_junctions_tables": "personality_variable\tpersonality_variable_set\tvalue\nai_threat_score_attitude_multiplier_max\tset_hard\t4\n",
    "cai_personalities_personality_variable_profiles_tables": "key\tdefault_personality_variable_set\nprofile_a\tset_default\n",
    "cai_personalities_personality_variable_profile_context_overrides_tables": "priority\tprofile\tdefault_variable_group\n2\tprofile_a\tset_hard\n",
    "cai_personalities_personality_variable_profile_context_overrides_junctions_tables": "context\tpriority\tprofile\ncai_difficulty_context_type_hard\t2\tprofile_a\n",
    "cai_personalities_tables": "key\tpersonality_variables_profile\tdeal_evaluation_profile\tstrategic_component\npersonality_a\tprofile_a\tdeal_profile_a\tstrategic_a\n",
    "cai_personality_strategic_components_tables": "id\tfriendly_towards_enemy_multiplier\tfriendly_towards_friend_multiplier\thostile_towards_enemy_multiplier\thostile_towards_friend_multiplier\tmax_friendly_attitude\tmax_hostile_attitude\tenemy_strength_modifier\tenemy_threat_strength_modifier\tstrategic_balance_opportunism_factor\tai_threat_score_threat_treshold\tdead_zone\tcall_to_arms_chance_defensive_war_with_human_players\tcall_to_arms_chance_offensive_war_with_human_players\nstrategic_a\t-0.8\t0.3\t0.3\t-0.8\t100\t-100\t0.8\t0.85\t0.9\t1\t15\t1\t0.1\n",
    "cai_personality_deal_evaluation_profiles_tables": "key\tdefault_deal_evaluation_component\ndeal_profile_a\tdeal_a\n",
    "cai_personality_deal_evaluation_deal_component_values_tables": "deal_component\tpersonality_component\tbest_friends_value\tbitter_enemies_value\tfriendly_value\tneutral_value\tunfriendly_value\tvery_friendly_value\tvery_unfriendly_value\twar_balance_factor\tmain_threat\thave_common_threat\nWAR\tdeal_a\t-100\t10\t-10\t-2\t0\t-20\t5\t12\t8\t-12\n",
}

def test_import_cai_strategic_model(tmp_path):
    db = tmp_path / "db"
    for table, content in TABLES.items():
        folder = db / table
        folder.mkdir(parents=True)
        (folder / "data__.tsv").write_text(content, encoding="utf-8")

    cai = {
        "factionProfiles": [{
            "factionKey": "npc",
            "personalityKey": "personality_a",
            "personalityResolved": True,
        }]
    }
    cai_path = tmp_path / "cai.json"
    cai_path.write_text(json.dumps(cai), encoding="utf-8")
    output = tmp_path / "out.json"

    tool = Path(__file__).with_name("import_cai_strategic_model.py")
    subprocess.run([
        sys.executable, str(tool),
        "--db-dir", str(db),
        "--cai-factors", str(cai_path),
        "--output", str(output),
        "--game-version", "fixture",
    ], check=True)

    data = json.loads(output.read_text(encoding="utf-8"))
    profile = data["factionProfiles"][0]
    assert data["strategicStanceWeights"]["CAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_CURRENT_ATTITUDE"]["value"] == 3
    assert data["strategicStanceWeights"]["CAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_DIPLOMATIC_TREATIES_TRANSITIVE"]["value"] == 0.5
    assert profile["difficultyVariables"]["hard"]["variableSet"] == "set_hard"
    assert profile["difficultyVariables"]["hard"]["values"]["ai_threat_score_attitude_multiplier_max"] == 4
    assert profile["strategicComponentValues"]["strategic_balance_opportunism_factor"] == 0.9
    assert profile["warDealEvaluation"]["WAR"]["main_threat"] == 8
