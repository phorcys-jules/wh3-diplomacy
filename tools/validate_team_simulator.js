const fs = require('fs');
const path = require('path');
const analysis = require('../team-analysis.js');

const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'data/generated', name), 'utf8'));

const factions = read('immortal-empires-factions.json');
const culture = read('cultural-relations.json');
const cai = read('cai-diplomacy-factors.json');
const strategic = read('turn1-cai-strategic-model.json');
const relations = read('turn1-faction-relations.json');
const startpos = read('immortal-empires-startpos.json');
const restrictions = read('diplomatic-restrictions.json');
const teamRules = read('multiplayer-team-rules.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const knownKeys = new Set(factions.factions.map(row => row.factionKey));
for (const key of ['wh2_dlc15_hef_imrik', 'wh_main_emp_empire', 'wh2_main_def_hag_graef', 'wh3_main_nur_poxmakers_of_nurgle']) {
  assert(knownKeys.has(key), `missing pilot faction ${key}`);
}

const ffa = analysis.analyze({
  team: ['wh2_dlc15_hef_imrik', 'wh2_main_def_hag_graef'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions,
  culture,
  cai,
  strategic,
  relations,
  startpos,
  restrictions,
  teamRules,
});

assert(ffa.results.length > 400, 'expected active IE NPC coverage');
assert(ffa.results.some(row => row.members.some(member => member.relation)), 'no resolved relations');
assert(ffa.results.some(row => row.transitive.some(item => item.direction === 'tension-with-ally')), 'no transitive hostility detected');
assert(ffa.results.some(row => row.members.some(member => member.threatEnvelope)), 'no CAI threat envelope generated');
assert(strategic.factionProfiles.some(profile => profile.warDealEvaluation?.WAR && profile.strategicComponentValues?.ai_threat_score_threat_treshold !== null && profile.strategicComponentValues?.ai_threat_score_threat_treshold !== undefined), 'no exact CAI WAR evaluation profile/threshold available');
assert(ffa.results.every(row => !Object.prototype.hasOwnProperty.call(row, 'warProbability')), 'war probability must never be fabricated');

const candidates = analysis.compareCandidates({
  team: ['wh2_dlc15_hef_imrik'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions,
  culture,
  cai,
  strategic,
  relations,
  startpos,
  restrictions,
  teamRules,
}, ['wh_main_emp_empire', 'wh2_main_def_hag_graef', 'wh3_main_nur_poxmakers_of_nurgle']);
assert(candidates.length === 3, 'candidate teammate comparison incomplete');
assert(candidates.every(row => Number.isFinite(row.metrics.startingWars)), 'candidate metrics missing');
assert(candidates.every(row => !Object.prototype.hasOwnProperty.call(row.metrics, 'warProbability')), 'candidate ranking must not fabricate war probability');
const incrementalCandidates = analysis.compareCandidates({
  team: ['wh2_dlc15_hef_imrik', 'wh_main_emp_empire'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions,
  culture,
  cai,
  strategic,
  relations,
  startpos,
  restrictions,
  teamRules,
}, ['wh2_main_def_hag_graef']);
assert(incrementalCandidates[0].comparisonMode === 'incremental', 'candidate comparison should switch to incremental mode for existing teams');
assert(incrementalCandidates[0].deltaMetrics, 'incremental candidate deltas missing');
assert(incrementalCandidates[0].npcImpacts?.mode === 'incremental', 'incremental NPC impact analysis missing');
assert(Array.isArray(incrementalCandidates[0].npcImpacts.worsened), 'candidate worsened NPC list missing');
assert(Array.isArray(incrementalCandidates[0].npcImpacts.improved), 'candidate improved NPC list missing');
const suggestedTeam = analysis.suggestTeam({
  team: ['wh2_dlc15_hef_imrik'],
  mode: 'ffa',
  teamTreaty: 'military_alliance',
  difficulty: 'normal',
  factions,
  culture,
  cai,
  strategic,
  relations,
  startpos,
  restrictions,
  teamRules,
}, ['wh_main_emp_empire', 'wh2_main_def_hag_graef', 'wh3_main_nur_poxmakers_of_nurgle'], 4);
assert(suggestedTeam.complete, 'full-team suggestion did not reach target size');
assert(suggestedTeam.steps.length === 3, 'unexpected full-team suggestion step count');
assert(suggestedTeam.steps.every(step => !Object.prototype.hasOwnProperty.call(step.metrics, 'warProbability')), 'full-team suggestion must not fabricate war probability');




const sameTeam = analysis.analyze({
  team: ['wh2_dlc15_hef_imrik', 'wh_main_emp_empire'],
  mode: 'same-team',
  difficulty: 'normal',
  factions,
  culture,
  cai,
  strategic,
  relations,
  startpos,
  restrictions,
  teamRules,
});
assert(sameTeam.teamTreaty.treaty === 'TRADE_AGREEMENT', 'same-team verified trade rule missing');
assert(sameTeam.results.some(row => row.exactSignals.some(signal => signal.type === 'multiplayer-team-rule')), 'same-team script rule not surfaced');

const resolvedRestrictions = (restrictions.restrictions || []).filter(row => row.scopeResolved);
assert(resolvedRestrictions.length > 0, 'expected at least one resolved diplomacy restriction scope');

console.log(`validated team simulator: ${ffa.results.length} NPCs, ${resolvedRestrictions.length} restriction scope(s)`);
