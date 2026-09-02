# Import WH3

Export the normalized diplomacy rows from RPFM as a TSV with `sourceFaction`, `targetFaction`, `modifierKey`, `value`, `source`, and `atWar` columns. Then run:

```powershell
python tools/import_wh3.py --input exports/diplomacy.tsv --output data/generated/immortal-empires.json --game-version "WH3 <version>"
```

The importer fails when its input is missing, incomplete, or has an unknown provenance. It never substitutes or invents diplomacy values.
