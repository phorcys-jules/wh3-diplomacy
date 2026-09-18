# WH3 Diplomacy

Outil communautaire pour préparer une campagne multijoueur Total War: WARHAMMER III — Immortal Empires avant de lancer la partie.

## Page d'accueil : composeur d'équipe

La page principale est le cœur du produit. Elle permet de sélectionner **2 à 4 Seigneurs légendaires**, puis affiche :

- leur compatibilité diplomatique ;
- les factions PNJ actives susceptibles de poser problème ;
- les guerres et traités de départ ;
- les restrictions mécaniques de diplomatie ;
- les positions de départ ;
- les personnalités et facteurs CAI connus ;
- les effets transitifs pertinents lorsqu'un PNJ déteste un allié de l'équipe ;
- une enveloppe des multiplicateurs de menace quand le moteur expose les bornes mais pas la valeur runtime exacte.

Deux scénarios sont distingués : **même équipe dans le lobby** et **FFA + traité choisi entre joueurs**.

La page ne produit pas de fausse probabilité de guerre.

## Trois niveaux de reproductibilité

Chaque donnée utilisée par le simulateur est classée :

- **exact-pre-game** : déterministe depuis les DB, startpos ou scripts vanilla ;
- **simulable-pre-game** : formule/terme CAI reconstructible avant de lancer la campagne ;
- **runtime-unknown** : état ou agrégation finale du moteur natif qui n'est pas exposé par les packs.

Le modèle de menace documenté dans les données WH3 est conservé avec ses limites : le jeu expose les multiplicateurs attitude/actions/proximité/personnalité, mais pas encore la dérivation native complète de `base_score` ni le choix final de déclaration de guerre. Le détail PNJ affiche désormais aussi les paramètres exacts du profil CAI `WAR` (valeurs selon la stance, équilibre de guerre, menace principale/commune, longue distance), ainsi que le seuil de menace et les paramètres stratégiques disponibles.

Pour les alliances entre joueurs, le simulateur expose aussi un **signal transitif comparatif** dérivé uniquement de paramètres vanilla connus : `initial_value du traité × poids transitive × coefficient réseau ami/ennemi`. Ce signal sert à comparer des compositions d'équipe ; il n'est jamais présenté comme l'attitude finale du jeu ni comme une probabilité de guerre.

## Accord rapide

`quick-deal.html` reste une vue secondaire pour examiner un Seigneur légendaire et ses partenaires possibles. Elle ne remplace pas le composeur d'équipe de l'accueil.

## Données générées

Le workflow GitHub Pages reconstruit les datasets depuis un commit épinglé de `Shazbot/WH3-Dump`. Parmi les sorties principales :

- `immortal-empires-factions.json` — toutes les factions actives au startpos IE ;
- `turn1-faction-relations.json` — composantes diplomatiques T1 connues ;
- `cai-diplomacy-factors.json` — profils et facteurs CAI ;
- `turn1-cai-strategic-model.json` — variables de strategic stance, menace et évaluation de guerre ;
- `multiplayer-team-rules.json` — règles de coéquipiers prouvées dans `wh_campaign_setup.lua` ;
- `diplomatic-restrictions.json` — restrictions mécaniques avec source/cible résolues quand possible ;
- `campaign-start-positions.json` — positions de départ ;
- `verified-turn1-diplomatic-modifiers.json` — sous-ensemble conservateur de modificateurs scriptés vérifiés.

Les valeurs manquantes restent explicites au lieu d'être remplacées par des estimations silencieuses.

Voir `docs/data-sources.md` et `docs/diplomacy-extraction.md` pour les sources et limites.


## Comparaison de coéquipiers

La page d'accueil compare automatiquement les Seigneurs légendaires encore disponibles et les trie selon des signaux explicites (guerres initiales, restrictions, hostilités directes/multiples et tensions transitives), sans probabilité de guerre.
