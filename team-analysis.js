(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.WH3TeamAnalysis = api;
})(typeof window !== 'undefined' ? window : globalThis, function() {
  const HOSTILE_THRESHOLD = -15;
  const FRIENDLY_THRESHOLD = 15;
  const FFA_TREATIES = {
    military_alliance: 'MILITARY_ALLIANCE',
    defensive_alliance: 'DEFENSIVE_ALLIANCE',
    non_aggression_pact: 'NON_AGGRESSION_PACT',
    trade_agreement: 'TRADE_AGREEMENT',
  };

  function indexBy(rows, key) {
    return new Map((rows || []).map(row => [key(row), row]));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function relationValue(relation) {
    if (!relation) return null;
    if (relation.knownAttitudeComponentsTotal !== null && relation.knownAttitudeComponentsTotal !== undefined && Number.isFinite(Number(relation.knownAttitudeComponentsTotal))) return Number(relation.knownAttitudeComponentsTotal);
    if (relation.baseAttitude !== null && relation.baseAttitude !== undefined && Number.isFinite(Number(relation.baseAttitude))) return Number(relation.baseAttitude);
    return null;
  }

  function attitudeCategory(value) {
    if (value === null || !Number.isFinite(value)) return 'unknown';
    if (value >= FRIENDLY_THRESHOLD) return 'friendly';
    if (value <= HOSTILE_THRESHOLD) return 'hostile';
    return 'neutral';
  }

  function attitudeMultiplier(attitude, values) {
    if (!Number.isFinite(attitude) || !values) return null;
    const thresholdMin = Number(values.ai_threat_score_attitude_threshold_min);
    const thresholdMax = Number(values.ai_threat_score_attitude_threshold_max);
    const multiplierMax = Number(values.ai_threat_score_attitude_multiplier_max);
    const multiplierMin = Number(values.ai_threat_score_attitude_multiplier_min);
    if (![thresholdMin, thresholdMax, multiplierMax, multiplierMin].every(Number.isFinite) || thresholdMax === thresholdMin) return null;
    const t = (clamp(attitude, thresholdMin, thresholdMax) - thresholdMin) / (thresholdMax - thresholdMin);
    return multiplierMax + t * (multiplierMin - multiplierMax);
  }

  function strategicProfileFor(factionKey, strategic, difficulty) {
    const profile = (strategic?.factionProfiles || []).find(row => row.factionKey === factionKey);
    if (!profile) return null;
    const difficultyData = profile.difficultyVariables?.[difficulty] || profile.difficultyVariables?.normal || null;
    return { ...profile, difficultyData };
  }

  function buildThreatEnvelope(attitude, strategicProfile) {
    const values = strategicProfile?.difficultyData?.values;
    if (!values) return null;
    const attitudeMult = attitudeMultiplier(attitude, values);
    const directMin = Number(values.ai_threat_score_direct_actions_mult_min);
    const directMax = Number(values.ai_threat_score_direct_actions_mult_max);
    const proximityMin = Number(values.ai_threat_score_proximity_multiplier_min);
    const proximityMax = Number(values.ai_threat_score_proximity_multiplier_max);
    const personality = Number(values.ai_threat_score_personality_multiplier_player ?? 1);
    if (attitudeMult === null || ![directMin, directMax, proximityMin, proximityMax, personality].every(Number.isFinite)) return null;
    return {
      attitudeMultiplier: attitudeMult,
      multiplierEnvelope: {
        min: attitudeMult * Math.min(directMin, directMax) * Math.min(proximityMin, proximityMax) * personality,
        max: attitudeMult * Math.max(directMin, directMax) * Math.max(proximityMin, proximityMax) * personality,
      },
      directActionsRange: [directMin, directMax],
      proximityRange: [proximityMin, proximityMax],
      personalityMultiplierPlayer: personality,
      baseScore: null,
      finalThreat: null,
      reproducibility: 'simulable-pre-game',
      runtimeUnknown: [
        'base_score exact native derivation',
        'direct_actions multiplier exact turn-one value',
        'proximity multiplier exact distance-to-multiplier mapping',
      ],
    };
  }

  function calculateRelation(source, target, data) {
    const direct = data.relationIndex.get(`${source.factionKey}|${target.factionKey}`);
    if (direct) {
      return {
        ...direct,
        attitudeForSimulation: relationValue(direct),
        provenance: direct.components || [],
      };
    }
    if (!source.subculture || !target.subculture) return null;
    const base = data.cultureIndex.get(`${source.subculture}|${target.subculture}`);
    if (!base) return null;
    const personality = data.profileIndex.get(source.factionKey);
    const override = data.overrideIndex.get(`${personality?.culturalComponent}|${source.subculture}|${target.subculture}`);
    const selected = override || base;
    const start = data.startIndex.get(`${source.factionKey}|${target.factionKey}`);
    const relation = {
      sourceFaction: source.factionKey,
      targetFaction: target.factionKey,
      baseAttitude: Number(selected.attitudeBase),
      knownAttitudeComponentsTotal: Number(selected.attitudeBase),
      knownAttitudeTotalReproducibility: 'exact-pre-game',
      positiveAttitudeMultiplier: selected.positiveAttitudeMultiplier,
      negativeAttitudeMultiplier: selected.negativeAttitudeMultiplier,
      treaties: start?.treaties || [],
      atWar: Boolean(start?.atWar),
      components: [{
        type: override ? 'cai-personality-cultural-override' : 'cultural-baseline',
        sourceTable: selected.sourceTable,
        reproducibility: 'exact-pre-game',
      }],
    };
    return { ...relation, attitudeForSimulation: relationValue(relation), provenance: relation.components };
  }

  function restrictionForPair(sourceFaction, targetFaction, restrictions) {
    return (restrictions || []).filter(rule => {
      if (!rule.scopeResolved) return false;
      const sources = new Set(rule.sourceFactions || []);
      const targets = new Set(rule.targetFactions || []);
      if (rule.directionality === 'between-factions') {
        return (sources.has(sourceFaction) && targets.has(targetFaction)) ||
          (sources.has(targetFaction) && targets.has(sourceFaction));
      }
      return sources.has(sourceFaction) && targets.has(targetFaction);
    });
  }

  function teamTreatyScenario(mode, teamTreaty, teamRules) {
    if (mode === 'same-team') {
      const tradeRule = (teamRules?.sameTeamRules || []).find(rule => rule.effect === 'trade-agreement-created-if-missing');
      return {
        treaty: tradeRule ? 'TRADE_AGREEMENT' : null,
        source: tradeRule ? 'wh_campaign_setup.lua' : null,
        reproducibility: tradeRule ? 'exact-pre-game' : 'runtime-unknown',
        note: tradeRule
          ? 'Le script WH3 crée un accord commercial entre coéquipiers s’il manque.'
          : 'Aucun traité automatique de coéquipier n’a été prouvé dans le dataset.',
      };
    }
    const treaty = FFA_TREATIES[teamTreaty] || 'MILITARY_ALLIANCE';
    return {
      treaty,
      source: 'user-scenario',
      reproducibility: 'simulable-pre-game',
      note: 'Scénario FFA : traité que les joueurs prévoient de signer, pas un état imposé au chargement.',
    };
  }

  function transitiveInputs(npc, player, players, data, mode, teamTreaty, teamRules, difficulty) {
    const weightRecord = data.strategic?.strategicStanceWeights?.CAI_VARIABLE_STRATEGIC_STANCE_CONTROL_WEIGHT_FOR_DIPLOMATIC_TREATIES_TRANSITIVE;
    const weight = Number(weightRecord?.value);
    const scenario = teamTreatyScenario(mode, teamTreaty, teamRules);
    const strategicProfile = strategicProfileFor(npc.factionKey, data.strategic, difficulty);
    const strategicValues = strategicProfile?.strategicComponentValues || {};
    const diplomaticComponent = data.profileIndex.get(npc.factionKey)?.diplomaticComponent || null;
    const treatyValue = scenario.treaty && diplomaticComponent
      ? data.treatyValueIndex.get(`${diplomaticComponent}|${scenario.treaty}`)
      : null;
    const treatyInitialValue = Number(treatyValue?.initialValue);
    return players.filter(ally => ally.factionKey !== player.factionKey).map(ally => {
      const allyRelation = calculateRelation(npc, ally, data);
      const allyAttitude = allyRelation?.attitudeForSimulation ?? null;
      const category = attitudeCategory(allyAttitude);
      const coefficientKey = category === 'hostile' ? 'friendly_towards_enemy_multiplier' : category === 'friendly' ? 'friendly_towards_friend_multiplier' : null;
      const networkCoefficient = coefficientKey ? Number(strategicValues[coefficientKey]) : null;
      const weightedNetworkCoefficient = Number.isFinite(weight) && Number.isFinite(networkCoefficient) ? weight * networkCoefficient : null;
      const exposureSignal = Number.isFinite(treatyInitialValue) && Number.isFinite(weightedNetworkCoefficient)
        ? treatyInitialValue * weightedNetworkCoefficient
        : null;
      return {
        allyFaction: ally.factionKey,
        observerAttitudeToAlly: allyAttitude,
        observerAttitudeCategory: category,
        treaty: scenario.treaty,
        transitiveWeight: Number.isFinite(weight) ? weight : null,
        networkCoefficientKey: coefficientKey,
        networkCoefficient: Number.isFinite(networkCoefficient) ? networkCoefficient : null,
        weightedNetworkCoefficient,
        treatyInitialValue: Number.isFinite(treatyInitialValue) ? treatyInitialValue : null,
        treatyValueSource: treatyValue?.sourceTable || null,
        exposureSignal,
        exposureSignalSemantics: exposureSignal === null ? null : 'Derived diagnostic = CAI treaty initial_value × transitive stance weight × strategic friend/enemy network coefficient. It is not the native displayed attitude nor a war probability.',
        direction: category === 'hostile' ? 'tension-with-ally' : category === 'friendly' ? 'friendly-with-ally' : category === 'neutral' ? 'neutral-with-ally' : 'unknown',
        numericContribution: null,
        reproducibility: scenario.reproducibility === 'runtime-unknown' || !Number.isFinite(weight) || !Number.isFinite(networkCoefficient)
          ? 'runtime-unknown'
          : 'simulable-pre-game',
        note: scenario.note,
        runtimeUnknown: 'The derived exposure signal is comparable across team choices, but WH3 does not expose the final native transform from this network input to strategic stance/war declaration.',
      };
    });
  }

  function classify(members, restrictions, transitive) {
    const known = members.filter(member => member.relation);
    if (known.some(member => member.relation.atWar)) return { id: 'starting-war', label: 'Guerre au départ', severity: 0 };
    if (restrictions.length) return { id: 'diplomacy-disabled', label: 'Diplomatie mécaniquement restreinte', severity: 1 };
    if (known.filter(member => attitudeCategory(member.relation.attitudeForSimulation) === 'hostile').length >= 2) {
      return { id: 'hostile-multiple', label: 'Hostilité envers plusieurs membres', severity: 2 };
    }
    if (transitive.some(item => item.direction === 'tension-with-ally')) {
      return { id: 'transitive-tension', label: 'Tension avec un allié de l’équipe', severity: 3 };
    }
    if (known.some(member => attitudeCategory(member.relation.attitudeForSimulation) === 'hostile')) {
      return { id: 'hostile', label: 'Hostilité initiale', severity: 4 };
    }
    if (known.length && known.every(member => attitudeCategory(member.relation.attitudeForSimulation) === 'friendly')) {
      return { id: 'favorable', label: 'Relations favorables', severity: 7 };
    }
    if (!known.length) return { id: 'insufficient-data', label: 'Données insuffisantes', severity: 6 };
    return { id: 'neutral', label: 'Relations neutres ou mixtes', severity: 5 };
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
      treatyValueIndex: indexBy(input.cai?.treatyValues, row => `${row.componentId}|${row.treaty}`),
      strategic: input.strategic || {},
    };
    const mode = input.mode === 'same-team' ? 'same-team' : 'ffa';
    const difficulty = input.difficulty || 'normal';
    const allRestrictions = input.restrictions?.restrictions || [];
    const teamRules = input.teamRules || {};

    const results = factions.filter(npc => !team.includes(npc.factionKey)).map(npc => {
      const strategicProfile = strategicProfileFor(npc.factionKey, input.strategic, difficulty);
      const members = players.map(player => {
        const sharedRegions = (npc.startingRegions || []).filter(region => (player.startingRegions || []).includes(region));
        const cameraDistance = npc.position && player.position
          ? Math.hypot(npc.position.x - player.position.x, npc.position.y - player.position.y)
          : null;
        const relation = calculateRelation(npc, player, data);
        const threatEnvelope = buildThreatEnvelope(relation?.attitudeForSimulation ?? null, strategicProfile);
        const pairRestrictions = restrictionForPair(npc.factionKey, player.factionKey, allRestrictions);
        return {
          playerFaction: player.factionKey,
          relation,
          restrictions: pairRestrictions,
          proximity: {
            sharedRegions,
            cameraDistance,
            reproducibility: cameraDistance === null ? 'runtime-unknown' : 'exact-pre-game',
            note: 'Distance euclidienne entre coordonnées de départ caméra; ce n’est pas une distance de déplacement ni le multiplicateur de proximité CAI.',
          },
          threatEnvelope,
        };
      });

      const transitive = players.flatMap(player =>
        transitiveInputs(npc, player, players, data, mode, input.teamTreaty, teamRules, difficulty)
          .map(item => ({ playerFaction: player.factionKey, ...item }))
      );
      const pairRestrictions = members.flatMap(member => member.restrictions);
      const category = classify(members, pairRestrictions, transitive);
      const transitiveExposure = transitive.reduce((sum, item) => sum + (Number.isFinite(item.exposureSignal) ? item.exposureSignal : 0), 0);
      const exactSignals = [];
      const simulableSignals = [];
      const runtimeUnknown = new Set();

      members.forEach(member => {
        if (member.relation?.atWar) exactSignals.push({ type: 'starting-war', playerFaction: member.playerFaction });
        if (member.relation) {
          exactSignals.push({
            type: 'starting-attitude-inputs',
            playerFaction: member.playerFaction,
            baseAttitude: member.relation.baseAttitude,
            components: member.relation.provenance || member.relation.components || [],
          });
        }
        if (member.proximity.cameraDistance !== null) exactSignals.push({
          type: 'start-position-distance',
          playerFaction: member.playerFaction,
          cameraDistance: member.proximity.cameraDistance,
        });
        if (member.threatEnvelope) {
          simulableSignals.push({
            type: 'threat-multiplier-envelope',
            playerFaction: member.playerFaction,
            ...member.threatEnvelope,
          });
          member.threatEnvelope.runtimeUnknown.forEach(value => runtimeUnknown.add(value));
        }
      });
      transitive.forEach(item => {
        if (item.reproducibility === 'simulable-pre-game') simulableSignals.push({ type: 'transitive-treaty-input', ...item });
        if (item.runtimeUnknown) runtimeUnknown.add(item.runtimeUnknown);
      });
      if (strategicProfile) exactSignals.push({
        type: 'cai-personality',
        personalityKey: strategicProfile.personalityKey,
        strategicComponent: strategicProfile.strategicComponent,
        strategicComponentValues: strategicProfile.strategicComponentValues,
        dealEvaluationComponent: strategicProfile.dealEvaluationComponent,
        warDealEvaluation: strategicProfile.warDealEvaluation,
      });
      if (mode === 'same-team') {
        (teamRules.sameTeamRules || []).forEach(rule => exactSignals.push({ type: 'multiplayer-team-rule', ...rule }));
        (teamRules.runtimeUnknown || []).forEach(value => runtimeUnknown.add(value));
      }
      pairRestrictions.forEach(rule => exactSignals.push({ type: 'mechanical-diplomacy-restriction', ...rule }));
      runtimeUnknown.add('native final war declaration choice');

      return {
        npcFaction: npc.factionKey,
        category,
        members,
        transitive,
        transitiveExposure: transitive.some(item => Number.isFinite(item.exposureSignal)) ? transitiveExposure : null,
        strategicProfile,
        exactSignals,
        simulableSignals,
        runtimeUnknown: [...runtimeUnknown],
        missing: members.filter(member => !member.relation).map(member => member.playerFaction),
      };
    }).sort((a, b) => a.category.severity - b.category.severity || a.npcFaction.localeCompare(b.npcFaction));

    return {
      mode,
      difficulty,
      teamTreaty: teamTreatyScenario(mode, input.teamTreaty, teamRules),
      players: team,
      results,
      semantics: 'Aucune probabilité de guerre n’est inventée. Les entrées exactes, calculs pré-partie et états runtime inconnus sont séparés.',
    };
  }

  return {
    analyze,
    calculateRelation,
    attitudeMultiplier,
    buildThreatEnvelope,
    teamTreatyScenario,
    attitudeCategory,
    relationValue,
  };
});
