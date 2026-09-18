const assert = require('assert');
const { analyze } = require('../team-analysis.js');
const factions = { factions: [
  { factionKey: 'a', subculture: 'one' }, { factionKey: 'b', subculture: 'two' }, { factionKey: 'p', subculture: 'three' },
] };
const culture = { relations: [
  { sourceSubculture: 'three', targetSubculture: 'one', attitudeBase: -20, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
  { sourceSubculture: 'three', targetSubculture: 'two', attitudeBase: -20, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
] };
const result = analyze({ team: ['a', 'b'], mode: 'ffa', factions, culture, relations: { relations: [] }, startpos: { relations: [] }, cai: {} });
assert.equal(result.results[0].category.id, 'hostile-multiple');
assert.equal(result.results[0].members.length, 2);
console.log('team analysis fixture passed');
