# Extraction des relations diplomatiques WH3

Le projet ne doit jamais convertir une donnée absente en score `0` ou en relation neutre.

## Export RPFM requis

Exporter au format TSV les tables suivantes en conservant la structure `db/<table>/data__.tsv` :

- `campaign_group_members_tables`
- `campaign_group_member_criteria_factions_tables`
- `campaign_group_member_criteria_diplomatic_attitudes_tables`
- les tables startpos utilisées par `tools/import_start_pos.py`

Les critères culture/sous-culture, faction sets et scripts de campagne sont des sources complémentaires : tant qu'ils ne sont pas résolus, le rapport reste `partial`.

## Résolution des catégories directes

Depuis PowerShell, à la racine du dépôt :

```powershell
python tools/resolve_diplomatic_categories.py `
  --db-dir data/raw/db `
  --game-version "<version WH3>" `
  --output data/generated/diplomatic-categories.json
```

Pour limiter temporairement l'analyse à un ensemble de factions, fournir un fichier texte contenant une clé de faction par ligne avec `--factions`.

La sortie conserve la table source, le membre de groupe, le contexte et la catégorie d'attitude. Elle n'invente pas de valeur numérique.

## Étapes de reconstruction du tour 1

1. Extraire guerres et traités explicites du startpos.
2. Résoudre les critères directs de faction.
3. Étendre les critères de faction sets, culture et sous-culture.
4. Appliquer les effets de faction qui modifient les relations diplomatiques.
5. Inspecter les scripts de campagne pour les changements/forçages de diplomatie.
6. Conserver la direction `sourceFaction -> targetFaction` à chaque étape.
7. Produire le score seulement lorsque toutes les composantes nécessaires sont démontrées.

## Validation

Les premières validations en jeu restent Imrik, Karl Franz, Malus Darkblade et Ku'gath. Les clés doivent provenir des données WH3 actuelles, pas d'une ancienne fixture du prototype.
