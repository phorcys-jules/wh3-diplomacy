(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.WH3TeamAnalysis = api;
})(typeof window !== 'undefined' ? window : globalThis, function() {
  function indexBy(rows, key) { return new Map((rows || []).map(row => [key(row), row])); }
  function classify(members) {
    const known = members.filter(member => member.relation);
    if (!known.length) return { id: 'insufficient-data', label: 'Données insuffisantes' };
    if (known.some(member => member.relation.atWar)) return { id: 'starting-war', label: 'Guerre au départ' };
    if (known.filter(member => member.relation.baseAttitude <= -15).length >= 2) return { id: 'hostile-multiple', label: 'Hostilité envers plusieurs membres' };
    if (known.some(member => member.relation.baseAttitude <= -15)) return { id: 'hostile', label: 'Hostilité initiale' };
    if (known.every(member => member.relation.baseAttitude >= 15)) return { id: 'favorable', label: 'Relations favorables' };
    return { id: 'neutral', label: 'Relations neutres ou mixtes' };
  }
  function calculateRelation(source, target, data) {
    const direct = data.relationIndex.get(`${source.factionKey}|${target.factionKey}`);
    if (direct) return { ...direct, provenance: direct.components || [] };
    if (!source.subculture || !target.subculture) return null;
    const base = data.cultureIndex.get(`${source.subculture}|${target.subculture}`);
    if (!base) return null;
    const personality = data.profileIndex.get(source.factionKey);
    const override = data.overrideIndex.get(`${personality?.culturalComponent}|${source.subculture}|${target.subculture}`);
    const selected = override || base;
    const start = data.startIndex.get(`${source.factionKey}|${target.factionKey}`);
    return {
      sourceFaction: source.factionKey, targetFaction: target.factionKey,
      baseAttitude: selected.attitudeBase,
      positiveAttitudeMultiplier: selected.positiveAttitudeMultiplier,
      negativeAttitudeMultiplier: selected.negativeAttitudeMultiplier,
      treaties: start?.treaties || [], atWar: Boolean(start?.atWar), modifiers: [],
      provenance: [{ type: override ? 'cai-personality-cultural-override' : 'cultural-baseline', sourceTable: selected.sourceTable }],
    };
  }
  function analyze(input) {
    const team = input.team || [];
    if (team.length < 2 || team.length > 4) throw new Error('Une équipe doit contenir entre 2 et 4 factions.');
    const factions = input.factions?.factions || [];
    const factionIndex = indexBy(factions, faction => faction.factionKey);
    const players = team.map(key => factionIndex.get(key)).filter(Boolean);
    if (players.length !== team.length) throw new Error('Faction joueur absente du roster actif.');
    const data = {
      relationIndex: indexBy(input.relations?.relations, row => `${row.sourceFaction}|${row.targetFaction}`),
      cultureIndex: indexBy(input.culture?.relations, row => `${row.sourceSubculture}|${row.targetSubculture}`),
      startIndex: indexBy(input.startpos?.relations, row => `${row.sourceFaction}|${row.targetFaction}`),
      profileIndex: indexBy(input.cai?.factionProfiles, row => row.factionKey),
      overrideIndex: indexBy(input.cai?.culturalOverrides, row => `${row.componentId}|${row.sourceSubculture}|${row.targetSubculture}`),
    };
    const results = factions.filter(npc => !team.includes(npc.factionKey)).map(npc => {
      const members = players.map(player => {
        const sharedRegions = (npc.startingRegions || []).filter(region => (player.startingRegions || []).includes(region));
        const distance = npc.position && player.position ? Math.hypot(npc.position.x - player.position.x, npc.position.y - player.position.y) : null;
        return { playerFaction: player.factionKey, relation: calculateRelation(npc, player, data), proximity: { sharedRegions, cameraDistance: distance } };
      });
      const category = classify(members);
      return { npcFaction: npc.factionKey, category, members, teamMode: input.mode === 'same-team' ? 'same-team-unverified-effects-excluded' : 'ffa-no-team-effects', missing: members.filter(member => !member.relation).map(member => member.playerFaction) };
    }).sort((a, b) => a.category.id.localeCompare(b.category.id) || a.npcFaction.localeCompare(b.npcFaction));
    return { mode: input.mode === 'same-team' ? 'same-team' : 'ffa', players: team, results, restrictions: input.restrictions?.restrictions || [], semantics: 'Les catégories sont descriptives. Les effets de même équipe ou de tiers sans source vérifiée sont explicitement exclus.' };
  }
  return { analyze, calculateRelation };
});
