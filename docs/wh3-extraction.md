# Import WH3 reproductible

Le site publie les données produites par le workflow GitHub Pages depuis une
révision épinglée de `Shazbot/WH3-Dump`. La procédure locale ci-dessous permet
de refaire l'extraction depuis Steam sans modifier les fichiers du jeu.

## Prérequis Windows

- jeu : `C:\program\steam\steamapps\common\Total War WARHAMMER III` ;
- `db.pack` copié dans `data\schema\db.pack` (ignoré par Git) ;
- RPFM 4.6.100 et son CLI ;
- Python 3.10 ou ultérieur.

Le build Steam est lu dans `C:\program\steam\steamapps\appmanifest_1142710.acf`.
Il est passé à `--game-version`, puis enregistré avec l'horodatage UTC dans les JSON.

## Export RPFM

```powershell
tools\rpfm-legacy\rpfm_cli.exe --game warhammer_3 schemas update --schema-path data\schema\rpfm-4.6
tools\rpfm-legacy\rpfm_cli.exe --game warhammer_3 pack extract --pack-path data\schema\db.pack --tables-as-tsv data\schema\rpfm-4.6\schema_wh3.ron --file-path "db/start_pos_diplomacy_tables/data__;data\raw\wh3" --file-path "db/start_pos_factions_tables/data__;data\raw\wh3" --file-path "db/campaign_group_member_criteria_diplomatic_attitudes_tables/data__;data\raw\wh3" --file-path "db/campaign_group_member_criteria_factions_tables/data__;data\raw\wh3" --file-path "db/campaign_group_member_criteria_cultures_tables/data__;data\raw\wh3" --file-path "db/campaign_group_member_criteria_subcultures_tables/data__;data\raw\wh3" --file-path "db/campaign_group_members_tables/data__;data\raw\wh3" --file-path "db/campaign_cultural_relations_tables/data__;data\raw\wh3" --file-path "db/factions_tables/data__;data\raw\wh3" --file-path "db/cultures_subcultures_tables/data__;data\raw\wh3"
```

Les scripts échouent explicitement si un TSV requis ou ses colonnes manquent.
Les exports bruts restent ignorés par Git.

## Génération et validation

```powershell
$version = "WH3 Steam build <buildid>"
python tools\import_start_pos.py --db-dir data\raw\wh3\db --output data\generated\immortal-empires-startpos.json --game-version $version
python tools\resolve_diplomatic_members.py --db-dir data\raw\wh3\db --output data\generated\diplomatic-members.json --game-version $version --campaign wh3_main_combi
python tools\validate_dataset.py data\generated\immortal-empires-startpos.json
python tools\validate_pilot_factions.py --leaders data\generated\frontend-leaders.json --positions data\generated\campaign-start-positions.json --campaign wh3_main_combi
python tools\build_turn1_validation_matrix.py --input data\generated\initial-diplomacy.json --output data\generated\turn1-validation-matrix.json
```

Le validateur contrôle le schéma normalisé (métadonnées, relations, guerres,
traités et modificateurs). La fixture couvre Imrik, Karl Franz, Malus Darkblade
et Ku'gath : identité, clé de faction et position Immortal Empires doivent
rester celles revues. Le workflow exécute ces validations avant le déploiement.

`turn1-validation-matrix.json` contient les 12 directions entre les quatre
factions pilotes et le protocole de relevé dans le jeu. Chaque observation doit
être faite dans une nouvelle campagne Immortal Empires vanilla, au tour 1, avec
la capture du détail d'attitude affiché par le jeu.

Le site affiche la base culturelle directionnelle prouvée et les guerres/traités
explicites de départ. Les modificateurs dont la valeur ou l'ordre d'application
ne sont pas démontrés ne sont pas inventés.
