# Extraction WH3 reproductible

Cette procédure produit le dataset versionné des relations initiales sans modifier les fichiers du jeu.

## Prérequis

- jeu : `C:\program\steam\steamapps\common\Total War WARHAMMER III` ;
- `db.pack` copié dans `data/schema/db.pack` (ce fichier reste ignoré par Git) ;
- RPFM 4.6.100, dont le CLI est utilisé pour l'export TSV.

## Export des tables

```powershell
tools\rpfm-legacy\rpfm_cli.exe --game warhammer_3 schemas update --schema-path data\schema\rpfm-4.6
tools\rpfm-legacy\rpfm_cli.exe --game warhammer_3 pack extract --pack-path data\schema\db.pack --tables-as-tsv data\schema\rpfm-4.6\schema_wh3.ron --file-path "db/start_pos_diplomacy_tables/data__;data\raw\wh3" --file-path "db/start_pos_factions_tables/data__;data\raw\wh3" --file-path "db/campaign_group_member_criteria_diplomatic_attitudes_tables/data__;data\raw\wh3" --file-path "db/campaign_group_member_criteria_factions_tables/data__;data\raw\wh3"
```

Les exports bruts sont ignorés par Git, car ils sont reproductibles depuis le pack local.

## Génération

```powershell
python tools\import_start_pos.py --db-dir data\raw\wh3\db --output data\generated\immortal-empires-startpos.json --game-version "WH3 Steam build <buildid>"
```

Le build ID se lit dans `steamapps\appmanifest_1142710.acf`. L'extraction actuelle provient du build `24237342` et génère 362 relations explicites pour `wh3_main_combi`.

## Couverture actuelle

Le dataset contient les guerres et traités explicites de départ, avec les clés de factions résolues. Les valeurs numériques d'affinité ne sont pas encore publiées : les tables de critères donnent des catégories et seuils, mais pas les scores détaillés. Les scripts de campagne doivent être appliqués ensuite, puis les quatre factions pilotes vérifiées au tour 1.
