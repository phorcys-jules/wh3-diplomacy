# Extraction des relations diplomatiques WH3

Le projet ne doit jamais convertir une donnée absente en score `0` ou en relation neutre.

## Export RPFM requis

Exporter au format TSV les tables suivantes en conservant la structure `db/<table>/data__.tsv` :

- `campaign_group_members_tables`
- `campaign_group_member_criteria_factions_tables`
- `campaign_group_member_criteria_cultures_tables`
- `campaign_group_member_criteria_diplomatic_attitudes_tables`
- `effect_bonus_value_faction_junctions_tables`
- `effect_bonus_value_subculture_junctions_tables`
- `factions_tables`
- `cultures_subcultures_tables`
- les tables startpos utilisées par `tools/import_start_pos.py`

Les critères de faction sets, les sources qui appliquent les valeurs des effets et les scripts de campagne restent des entrées complémentaires : tant qu'ils ne sont pas résolus, le rapport reste `partial`.

## Règle de modélisation importante

Les lignes des tables `campaign_group_member_criteria_*` ne sont pas des modificateurs indépendants. Elles décrivent ensemble les critères d'un même `campaign_group_member`.

Il faut donc conserver le `member` et le `context` (`ACTOR`, `RECIPIENT`, etc.) avant de reconstruire une relation directionnelle. Par exemple, une condition de faction côté acteur et une condition de culture côté destinataire peuvent appartenir au même membre. Les aplatir séparément produirait de faux résultats.

De même, un effet diplomatique possède deux informations distinctes :

1. la **valeur** appliquée (`+60`, `-60`, etc.), fournie par le bundle, trait, script ou autre source qui applique l'effet ;
2. la **cible** de cette valeur, définie par les tables `effect_bonus_value_*_junctions`.

Le pipeline ne doit jamais déduire l'une à partir de l'autre.

## Résolution des catégories directes

Le resolver historique reste utile pour établir un rapport rapide des critères faction :

```powershell
python tools/resolve_diplomatic_categories.py `
  --db-dir data/raw/db `
  --game-version "<version WH3>" `
  --output data/generated/diplomatic-categories.json
```

## Jointure correcte des membres diplomatiques

Pour conserver ensemble attitude, critères de faction et critères de culture :

```powershell
python tools/resolve_diplomatic_members.py `
  --db-dir data/raw/db `
  --game-version "<version WH3>" `
  --campaign wh3_main_combi `
  --output data/generated/diplomatic-members.json
```

Cette étape conserve les contextes et ne calcule volontairement aucun score numérique.

## Cibles des effets diplomatiques

Pour reconstruire vers quelles factions s'applique un effet `faction_political_diplomacy_mod_*` :

```powershell
python tools/resolve_diplomatic_effect_targets.py `
  --db-dir data/raw/db `
  --game-version "<version WH3>" `
  --campaign wh3_main_combi `
  --output data/generated/diplomatic-effect-targets.json
```

Le resolver collecte les bonus `diplomatic_mod*` visant une faction ou une sous-culture. Une cible de sous-culture est développée en factions via `factions_tables`. La sortie ne contient pas de valeur : celle-ci devra être jointe ensuite avec la source qui applique l'effet.

C'est notamment la couche nécessaire pour expliquer des effets de faction du type « relations diplomatiques +X avec une faction donnée » ou « -X avec une sous-culture donnée » sans encoder ces valeurs à la main.

## Étapes de reconstruction du tour 1

1. Extraire guerres et traités explicites du startpos.
2. Regrouper les critères par `campaign_group_member`.
3. Résoudre faction, culture et sous-culture en conservant `ACTOR -> RECIPIENT`.
4. Résoudre les faction sets sans casser la logique de membre.
5. Résoudre les cibles des effets `diplomatic_mod*`.
6. Retrouver les valeurs et les sources qui appliquent ces effets au tour 1.
7. Inspecter les scripts de campagne pour les changements/forçages de diplomatie.
8. Produire une relation `sourceFaction -> targetFaction` uniquement lorsque toutes ses composantes sont démontrées.

## Validation

Les premières validations en jeu restent Imrik, Karl Franz, Malus Darkblade et Ku'gath. Les clés doivent provenir des données WH3 actuelles, pas d'une ancienne fixture du prototype.
