# WH3 diplomacy data sources

The application must not invent diplomacy values. Every displayed score should be traceable to game data and a game version.

## Relevant game data

Initial research points to these sources:

- `db/start_pos_diplomacy_tables` — explicit starting diplomatic treaties/relationships between factions.
- `db/campaign_group_member_criteria_diplomatic_attitudes_tables` — diplomatic attitude criteria/modifiers.
- campaign start scripts / `custom_starts` — can force war/peace or restrict diplomacy and therefore may override/complete DB start data.
- faction/culture/subculture sets — required to resolve rules targeting groups rather than one faction.

The public `Shazbot/WH3-Dump` repository is useful for inspecting ordinary DB tables, but start-position state and scripts must also be considered. RPFM or the official Assembly Kit can inspect the installed game packs.

## Important distinction

A legendary lord is not itself the diplomacy entity. Diplomacy is primarily faction-to-faction. The website should therefore model:

`Legendary lord -> starting faction -> diplomatic rules -> target faction -> legendary lord`

This matters for factions with multiple possible leaders and for future patches that move lords between factions.

## Directionality

Do not assume A -> B equals B -> A. Store directional modifiers and only derive a symmetric team-compatibility score at presentation/calculation time.

## Proposed normalized format

```json
{
  "gameVersion": "unknown",
  "campaign": "wh3_main_combi",
  "sourceFaction": "wh2_dlc15_hef_imrik",
  "targetFaction": "wh_main_emp_empire",
  "baseAttitude": null,
  "modifiers": [
    {
      "source": "game-db",
      "key": "example_modifier",
      "value": null
    }
  ],
  "treaties": [],
  "atWar": false
}
```

`null` is intentional until a value has been verified from current game data.

## Extraction strategy

1. Export relevant DB tables from the current WH3 installation with RPFM/Assembly Kit.
2. Export/inspect Immortal Empires campaign start scripts and start-position diplomacy.
3. Normalize faction keys, culture/subculture and faction sets.
4. Resolve group-based attitude rules into directional faction pairs.
5. Apply explicit faction-pair/start-script rules.
6. Produce a generated JSON dataset carrying the WH3 game version and provenance for every modifier.
7. Verify representative pairs in a fresh turn-1 Immortal Empires campaign before publishing a dataset.

## Validation set

The first validation should include the multiplayer example that motivated the project:

- Imrik / Knights of Caledor
- Karl Franz / Reikland
- Malus Darkblade / Hag Graef
- Ku'gath Plaguefather / Poxmakers of Nurgle

We should compare every direction between these four factions against the turn-1 diplomacy UI.
