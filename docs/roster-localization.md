# Localisation du roster

L'interface affiche les noms français des races, factions et Seigneurs légendaires.

## Sources

Les identifiants techniques restent ceux des tables WH3. Le mapping dirigeant → faction est vérifié à partir de `frontend_faction_leaders_tables` et les libellés visibles sont alignés sur la localisation française exposée par les données de jeu (notamment via le miroir Honga.net).

Ne jamais traduire les clés de faction (`wh_*`) : elles servent aux jointures avec les données diplomatiques et les positions de départ.

Lors d'une mise à jour WH3, vérifier séparément :

1. le roster jouable ;
2. la clé de faction ;
3. le nom français du Seigneur légendaire ;
4. le nom français de sa faction ;
5. le groupe/race affiché dans le sélecteur.

Les noms de l'interface peuvent donc évoluer sans modifier les clés utilisées par les importeurs.
