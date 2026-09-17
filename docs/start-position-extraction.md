# Extraction des positions de départ Immortal Empires

Les marqueurs cartographiques utilisent `cam_gameplay_start` provenant des scripts de campagne WH3. Ce sont des coordonnées de caméra de départ, pas des coordonnées de colonie.

## Commande

Exporter/copier les scripts de la campagne ciblée dans un répertoire local puis lancer, depuis PowerShell :

```powershell
python tools/import_campaign_start_positions.py `
  --scripts-dir "C:\chemin\vers\script\campaign\main_warhammer" `
  --game-version "<version WH3>" `
  --campaign wh3_main_combi `
  --output data/generated/immortal-empires-positions.json
```

Le scanner accepte les deux formes actuellement observées dans les scripts WH3 :

- `local faction_key = "..."` suivi d'un `local cam_gameplay_start = {...}` ;
- `<faction_key> = faction_intro_data:new{ ... cam_gameplay_start = {...} }`.

## Garanties

- chaque position conserve la liste des fichiers sources ;
- aucune coordonnée n'est inventée ;
- deux coordonnées différentes pour une même faction font échouer l'import afin d'éviter de mélanger plusieurs campagnes ;
- un répertoire sans position exploitable fait également échouer l'import.

Le JSON produit doit ensuite être relié au mapping `seigneur légendaire -> faction de départ`. La projection sur l'image inverse l'axe Y, car Y augmente vers le nord dans les coordonnées de campagne alors que `top` augmente vers le bas en CSS.

## Fixture des factions pilotes

Le pipeline valide Imrik, Karl Franz, Malus Darkblade et Ku'gath après chaque import. Cette vérification contrôle à la fois le mapping dirigeant → faction et les coordonnées `cam_gameplay_start` revues pour ces quatre départs :

```powershell
python tools/validate_pilot_factions.py `
  --leaders data/generated/frontend-leaders.json `
  --positions data/generated/campaign-start-positions.json
```

Elle échoue volontairement si un fichier est absent, si la campagne n'est pas Immortal Empires, si une faction est ambiguë ou si ses coordonnées changent. Il faut alors revoir la mise à jour du jeu avant de remplacer la fixture.
