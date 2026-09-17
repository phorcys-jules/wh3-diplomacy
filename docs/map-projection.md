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

Le fichier servi est `web/public/maps/immortal-empires.jpg`, ajouté au dépôt par son mainteneur dans le commit `f5ce4b5`. Sa provenance est donc traçable dans l'historique du projet.

Il est distribué comme un asset du projet WH3 Diplomacy, pour son affichage dans ce dépôt et sur son site GitHub Pages. Tous droits réservés hors de cet usage : il ne doit pas être réutilisé ou redistribué séparément sans l'accord du mainteneur.

Son empreinte SHA-256 est `9ac893954e947faa86981764b8f406def60e98e4615d7ef86e660829fa893d7f`. `tools/validate_map_projection.py` contrôle l'empreinte et les bornes de la projection à chaque déploiement. Tout remplacement impose donc une revue explicite de la licence et de la calibration.
