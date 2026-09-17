# Projection de la carte Immortal Empires

Les positions affichées par le comparateur sont des coordonnées `cam_gameplay_start` extraites de `main_warhammer_faction_intro.lua`. Elles sont projetées linéairement sur le fond de carte versionné dans le dépôt.

## Calibration revue

La fenêtre de coordonnées est figée pour éviter qu'un ajout de seigneur ne déplace les marqueurs déjà validés :

| Axe | Minimum | Maximum |
| --- | ---: | ---: |
| X | 11 | 899 |
| Y | 20.529987 | 723.853149 |

L'axe Y est inversé lors de l'affichage CSS : dans les données de campagne, Y augmente vers le nord ; dans une page web, `top` augmente vers le bas.

Les quatre points de contrôle sont Imrik `(573.586609, 330.326599)`, Karl Franz `(355.687042, 487.026276)`, Malus Darkblade `(393.503754, 719.284790)` et Ku'gath `(668.102417, 288.452148)`. Ils sont validés par `tools/validate_pilot_factions.py` à chaque import.

## Fond de carte

Le fichier servi est `web/public/maps/immortal-empires.jpg`, ajouté au dépôt par son mainteneur dans le commit `f5ce4b5`. Sa provenance est donc traçable dans l'historique du projet. Une confirmation de licence de redistribution reste nécessaire avant de déclarer le ticket carte entièrement terminé.
