# Outils d'import WH3

Les scripts de ce dossier transforment des exports vanilla de Total War: WARHAMMER III en données traçables consommables par le site.

## Base culturelle diplomatique

`import_cultural_relations.py` importe `campaign_cultural_relations_tables` et produit les valeurs directionnelles `attitude_base` ainsi que les multiplicateurs positif/négatif. Ces valeurs constituent la base culturelle de l'attitude, pas le score diplomatique final.

Exemple :

```powershell
python tools/import_cultural_relations.py `
  --input data/raw/db/campaign_cultural_relations_tables/data__.tsv `
  --output data/generated/cultural-relations.json `
  --campaign wh3_main_combi `
  --game-version "<version WH3>" `
  --source-ref "RPFM export local"
```

Le déploiement GitHub Pages génère également ce dataset depuis une révision WH3-Dump épinglée afin que la matrice publique dispose de cette composante réelle.
