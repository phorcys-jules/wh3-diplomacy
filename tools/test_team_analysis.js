const assert = require('assert');
const {
  analyze,
  compareCandidates,
  prepareAnalysis,
  candidateNpcImpacts,
  suggestTeam,
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
const prepared = prepareAnalysis({
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
const preparedResult = analyze({
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
}, prepared);
assert.deepStrictEqual(preparedResult, result);


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


const candidateFactions = { factions: [
  { factionKey: 'a', subculture: 'one', startingRegions: ['ra'], position: { x: 0, y: 0 } },
  { factionKey: 'b', subculture: 'two', startingRegions: ['rb'], position: { x: 10, y: 0 } },
  { factionKey: 'c', subculture: 'four', startingRegions: ['rc'], position: { x: 20, y: 0 } },
  { factionKey: 'p', subculture: 'three', startingRegions: ['rp'], position: { x: 3, y: 4 } },
] };
const candidateCulture = { relations: [
  { sourceSubculture: 'three', targetSubculture: 'one', attitudeBase: 0, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
  { sourceSubculture: 'three', targetSubculture: 'two', attitudeBase: 0, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
  { sourceSubculture: 'three', targetSubculture: 'four', attitudeBase: 0, positiveAttitudeMultiplier: 1, negativeAttitudeMultiplier: 1, sourceTable: 'culture' },
] };
const compared = compareCandidates({
  team: ['a'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions: candidateFactions,
  culture: candidateCulture,
  relations: { relations: [] },
  startpos: { relations: [{ sourceFaction: 'p', targetFaction: 'c', treaties: [], atWar: true }] },
  cai: {},
  strategic: { factionProfiles: [], strategicStanceWeights: {} },
  teamRules: {},
  restrictions: { restrictions: [] },
}, ['c', 'b']);
assert.equal(compared[0].candidateFaction, 'b');
assert.equal(compared[0].metrics.startingWars, 0);
assert.equal(compared.find(row => row.candidateFaction === 'c').metrics.startingWars, 1);
assert(!('warProbability' in compared[0].metrics));
assert.equal(compared[0].comparisonMode, 'total');
assert.equal(compared[0].deltaMetrics, null);

const suggested = suggestTeam({
  team: ['a'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions: candidateFactions,
  culture: candidateCulture,
  relations: { relations: [] },
  startpos: { relations: [{ sourceFaction: 'p', targetFaction: 'c', treaties: [], atWar: true }] },
  cai: {},
  strategic: { factionProfiles: [], strategicStanceWeights: {} },
  teamRules: {},
  restrictions: { restrictions: [] },
}, ['c', 'b'], 3);
assert.equal(suggested.suggestedTeam.length, 3);
assert.equal(suggested.steps[0].candidateFaction, 'b');
assert.equal(suggested.steps.length, 2);
assert(!('warProbability' in suggested.steps[0].metrics));


const incremental = compareCandidates({
  team: ['a', 'b'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions: candidateFactions,
  culture: candidateCulture,
  relations: { relations: [] },
  startpos: { relations: [{ sourceFaction: 'p', targetFaction: 'c', treaties: [], atWar: true }] },
  cai: {},
  strategic: { factionProfiles: [], strategicStanceWeights: {} },
  teamRules: {},
  restrictions: { restrictions: [] },
}, ['c']);
assert.equal(incremental[0].comparisonMode, 'incremental');
assert.equal(incremental[0].deltaMetrics.startingWars, 1);
assert.equal(incremental[0].npcImpacts.mode, 'incremental');
assert.equal(incremental[0].npcImpacts.worsened[0].npcFaction, 'p');
assert.equal(incremental[0].npcImpacts.worsened[0].delta.startingWar, 1);


const removesHostileNpc = compareCandidates({
  team: ['a', 'b'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions: candidateFactions,
  culture,
  relations: { relations: [] },
  startpos: { relations: [] },
  cai: {},
  strategic: { factionProfiles: [], strategicStanceWeights: {} },
  teamRules: {},
  restrictions: { restrictions: [] },
}, ['p']);
assert(removesHostileNpc[0].deltaMetrics.hostileNpcs < 0);

const syntheticImpacts = candidateNpcImpacts({
  results: [{
    npcFaction: 'q',
    members: [{ relation: { attitudeForSimulation: 0, atWar: false }, restrictions: [] }],
    transitive: [],
    transitiveExposure: null,
  }],
}, {
  results: [{
    npcFaction: 'q',
    members: [
      { relation: { attitudeForSimulation: -20, atWar: false }, restrictions: [] },
      { relation: { attitudeForSimulation: -20, atWar: false }, restrictions: [] },
    ],
    transitive: [],
    transitiveExposure: null,
  }],
}, null);
assert.equal(syntheticImpacts.improved[0].npcFaction, 'q');
assert.equal(syntheticImpacts.improved[0].delta.hostileMembers, -2);



console.log('team analysis fixtures passed');
