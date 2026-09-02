# Extraction des relations diplomatiques WH3

Le projet ne doit jamais convertir une donnée absente en score `0` ou en relation neutre.

## Export RPFM requis

Exporter au format TSV les tables suivantes en conservant la structure `db/<table>/data__.tsv` :

- `campaign_group_members_tables`
- `campaign_group_member_criteria_factions_tables`
- `campaign_group_member_criteria_cultures_tables`
- `campaign_group_member_criteria_diplomatic_attitudes_tables`
- `factions_tables`
- `cultures_subcultures_tables`
- les tables startpos utilisées par `tools/import_start_pos.py`

Les critères de faction sets, les éventuels critères de sous-culture supplémentaires, les effets de faction et les scripts de campagne restent des sources complémentaires : tant qu'ils ne sont pas résolus, le rapport reste `partial`.

## Règle de modélisation importante

Les lignes des tables `campaign_group_member_criteria_*` ne sont pas des modificateurs indépendants. Elles décrivent ensemble les critères d'un même `campaign_group_member`.

Il faut donc conserver le `member` et le `context` (`ACTOR`, `RECIPIENT`, etc.) avant de reconstruire une relation directionnelle. Par exemple, une condition de faction côté acteur et une condition de culture côté destinataire peuvent appartenir au même membre. Les aplatir séparément produirait de faux résultats.

## Résolution des catégories directes

Le resolver historique reste utile pour établir un rapport rapide des critères faction :

```powershell
python tools/resolve_diplomatic_categories.py `
  --db-dir data/raw/db `
  --game-version "<version WH3>" `
  --output data/generated/diplomatic-categories.json
```

Pour limiter temporairement l'analyse à un ensemble de factions, fournir un fichier texte contenant une clé de faction par ligne avec `--factions`.

## Jointure correcte des membres diplomatiques

Pour conserver ensemble attitude, critères de faction et critères de culture :

```powershell
python tools/resolve_diplomatic_members.py `
  --db-dir data/raw/db `
  --game-version "<version WH3>" `
  --campaign wh3_main_combi `
  --output data/generated/diplomatic-members.json
```

La sortie contient pour chaque membre :

- son groupe ;
- la ou les catégories d'attitude (`friendly`, `hostile`, etc.) ;
- ses critères faction avec leur contexte ;
- ses critères culture avec leur contexte ;
- la liste des factions appartenant à chaque culture, reconstruite via `factions_tables` puis `cultures_subcultures_tables` ;
- la provenance de chaque critère.

Cette étape ne calcule volontairement aucun score numérique.

## Étapes de reconstruction du tour 1

1. Extraire guerres et traités explicites du startpos.
2. Regrouper les critères par `campaign_group_member`.
3. Résoudre faction, culture et sous-culture en conservant `ACTOR -> RECIPIENT`.
4. Résoudre les faction sets sans casser la logique de membre.
5. Appliquer les effets de faction qui modifient les relations diplomatiques.
6. Inspecter les scripts de campagne pour les changements/forçages de diplomatie.
7. Produire une relation `sourceFaction -> targetFaction` uniquement lorsque les critères du membre sont satisfaits.
8. Produire un score seulement lorsque toutes les composantes nécessaires sont démontrées.

## Validation

Les premières validations en jeu restent Imrik, Karl Franz, Malus Darkblade et Ku'gath. Les clés doivent provenir des données WH3 actuelles, pas d'une ancienne fixture du prototype.
