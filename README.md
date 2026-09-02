# WH3 Diplomacy

Outil communautaire pour préparer des campagnes multijoueur de Total War: Warhammer III — Immortal Empires.

## Interface actuelle

La page principale conserve les fonctionnalités existantes : sélection de plusieurs seigneurs, matrice diplomatique et carte des positions de départ.

## Vue « Accord rapide »

La future vue inspirée de Diplomatie > Accord rapide sera développée comme une page séparée afin de ne pas remplacer ni supprimer l'interface actuelle. Elle permettra de choisir un seigneur puis de classer les partenaires jouables par type d'accord, compatibilité diplomatique et distance de départ.

## Données

Le projet privilégie les données extraites et traçables depuis WH3. Les valeurs inconnues restent explicitement non résolues au lieu d'être inventées.

Les datasets utilisés par GitHub Pages sont générés lors du déploiement et publiés sous `data/runtime/` :

- `immortal-empires-startpos.json`
- `cultural-relations.json`
- `frontend-leaders.json`
- `campaign-start-positions.json`

Voir `docs/data-sources.md` et `docs/diplomacy-extraction.md` pour le détail des sources et limites.
