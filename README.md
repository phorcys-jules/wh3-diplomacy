# WH3 Diplomacy

Outil communautaire pour **Total War: WARHAMMER III – Immortal Empires** permettant de préparer une campagne multijoueur en comparant les affinités diplomatiques initiales des dirigeants/factions.

## Objectif

Avant de lancer une campagne, un groupe de joueurs doit pouvoir :

1. rechercher et sélectionner plusieurs seigneurs légendaires ;
2. voir immédiatement leurs affinités et aversions diplomatiques au début de la campagne ;
3. comprendre l'origine des modificateurs (race, faction, traits/effets spécifiques, etc.) ;
4. obtenir un score de compatibilité pour l'équipe sélectionnée ;
5. repérer les paires qui risquent de rendre la diplomatie de la campagne difficile.

## MVP

- Sélecteur de 2 à 4 dirigeants.
- Matrice de compatibilité entre les dirigeants sélectionnés.
- Vue détaillée d'un dirigeant : relations initiales positives, neutres et négatives.
- Détail des modificateurs qui composent une relation.
- Recherche et filtres par race/faction.
- Données versionnées avec la version du jeu afin de ne pas mélanger des valeurs de patches différents.

## Modèle de données envisagé

Les données distinguent le **dirigeant**, la **faction** et la **race**. Une relation affichée doit être calculable et explicable plutôt que stockée uniquement comme un score opaque.

```ts
type DiplomaticModifier = {
  source: string;
  value: number;
  reason: string;
};

type StartingRelation = {
  fromFactionId: string;
  toFactionId: string;
  modifiers: DiplomaticModifier[];
};
```

## Principe important

Le site affiche les relations **au début d'une nouvelle campagne Immortal Empires**, avant que les guerres, traités et actions du joueur ou de l'IA ne les modifient.

## Statut

Projet en cours d'initialisation. La première étape technique est d'identifier précisément les tables de données WH3 nécessaires pour reconstruire les relations diplomatiques initiales de façon fiable.
