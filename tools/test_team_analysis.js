const assert = require('assert');
const {
  analyze,
  attitudeMultiplier,
  buildThreatEnvelope,
} = require('../team-analysis.js');

const factions = { factions: [
  { factionKey: 'a', subculture: 'one', startingRegions: ['ra'], position: { x: 0, y: 0 } },
  { factionKey: 'b', subculture: 'two', startingRegions: ['rb'], position: { x: 10, y: 0 } },
  { factionKey: 'p', subculture: 'three', startingRegions: ['rp'], position: { x: 3, y: 4 } },
] };
const culture = { relations: [
  { sourceSubculture: 'three', targetSubculture: 'one', attitudeBase: -20, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
  { sourceSubculture: 'three', targetSubculture: 'two', attitudeBase: -20, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
] };
const strategic = {
  strategicStanceWeights: {
    CAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_DIPLOMATIC_TREATIES_TRANSITIVE: { value: 0.5 },
  },
  factionProfiles: [{
    factionKey: 'p',
    personalityKey: 'aggressive',
    strategicComponent: 'strategic_aggressive',
    strategicComponentValues: { strategic_balance_opportunism_factor: 0.9, friendly_towards_enemy_multiplier: -0.8, friendly_towards_friend_multiplier: 0.3 },
    difficultyVariables: {
      normal: { values: {
        ai_threat_score_attitude_threshold_min: -150,
        ai_threat_score_attitude_threshold_max: 150,
        ai_threat_score_attitude_multiplier_max: 3,
        ai_threat_score_attitude_multiplier_min: 0.1,
        ai_threat_score_direct_actions_mult_min: 0.5,
        ai_threat_score_direct_actions_mult_max: 1,
        ai_threat_score_proximity_multiplier_min: 0.25,
        ai_threat_score_proximity_multiplier_max: 1,
        ai_threat_score_personality_multiplier_player: 1,
      } },
    },
  }],
};
const teamRules = {
  sameTeamRules: [{
    effect: 'trade-agreement-created-if-missing',
    reproducibility: 'exact-pre-game',
    sourceFile: 'wh_campaign_setup.lua',
  }],
  runtimeUnknown: ['native team semantics'],
};

assert.equal(attitudeMultiplier(-150, strategic.factionProfiles[0].difficultyVariables.normal.values), 3);
assert(Math.abs(attitudeMultiplier(150, strategic.factionProfiles[0].difficultyVariables.normal.values) - 0.1) < 1e-9);

const envelope = buildThreatEnvelope(-150, {
  difficultyData: strategic.factionProfiles[0].difficultyVariables.normal,
});
assert.equal(envelope.multiplierEnvelope.min, 0.375);
assert.equal(envelope.multiplierEnvelope.max, 3);
assert.equal(envelope.finalThreat, null);

const result = analyze({
  team: ['a', 'b'],
  mode: 'same-team',
  difficulty: 'normal',
  factions,
  culture,
  relations: { relations: [] },
  startpos: { relations: [] },
  cai: { factionProfiles: [{ factionKey: 'p', diplomaticComponent: 'dip' }], treatyValues: [{ componentId: 'dip', treaty: 'TRADE_AGREEMENT', initialValue: 20, sourceTable: 'treaties' }] },
  strategic,
  teamRules,
  restrictions: { restrictions: [] },
});
assert.equal(result.results[0].category.id, 'hostile-multiple');
assert.equal(result.results[0].members.length, 2);
assert.equal(result.results[0].members[0].proximity.cameraDistance, 5);
assert.equal(result.results[0].members[0].threatEnvelope.finalThreat, null);
assert(result.results[0].simulableSignals.some(row => row.type === 'transitive-treaty-input'));
assert.equal(result.results[0].transitive[0].treatyInitialValue, 20);
assert.equal(result.results[0].transitive[0].weightedNetworkCoefficient, -0.4);
assert.equal(result.results[0].transitive[0].exposureSignal, -8);
assert.equal(result.results[0].transitiveExposure, -16);
assert(result.results[0].exactSignals.some(row => row.type === 'multiplayer-team-rule'));
assert(result.results[0].runtimeUnknown.includes('native final war declaration choice'));

const restricted = analyze({
  team: ['a', 'b'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  factions,
  culture: { relations: [
    { sourceSubculture: 'three', targetSubculture: 'one', attitudeBase: 0, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
    { sourceSubculture: 'three', targetSubculture: 'two', attitudeBase: 0, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
  ] },
  relations: { relations: [] },
  startpos: { relations: [] },
  cai: {},
  strategic,
  restrictions: { restrictions: [{
    scopeResolved: true,
    directionality: 'between-factions',
    sourceFactions: ['p'],
    targetFactions: ['a'],
    effect: 'disabled',
  }] },
});
assert.equal(restricted.results[0].category.id, 'diplomacy-disabled');

console.log('team analysis fixtures passed');
