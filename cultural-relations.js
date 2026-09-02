(() => {
  const raceToSubculture = {
    "L'Empire": 'wh_main_sc_emp_empire',
    'Nains': 'wh_main_sc_dwf_dwarfs',
    'Hauts Elfes': 'wh2_main_sc_hef_high_elves',
    'Elfes Noirs': 'wh2_main_sc_def_dark_elves',
    'Hommes-lézards': 'wh2_main_sc_lzd_lizardmen',
    'Skavens': 'wh2_main_sc_skv_skaven',
    'Côte Vampire': 'wh2_dlc11_sc_cst_vampire_coast',
    'Comtes Vampires': 'wh_main_sc_vmp_vampire_counts',
    'Rois des Tombes': 'wh2_dlc09_sc_tmb_tomb_kings',
    'Peaux-Vertes': 'wh_main_sc_grn_greenskins',
    'Bretonnie': 'wh_main_sc_brt_bretonnia',
    'Elfes Sylvains': 'wh_dlc05_sc_wef_wood_elves',
    'Hommes-bêtes': 'wh_dlc03_sc_bst_beastmen',
    'Norsca': 'wh_dlc08_sc_nor_norsca',
    'Kislev': 'wh3_main_sc_ksl_kislev',
    'Grand Cathay': 'wh3_main_sc_cth_cathay',
    'Khorne': 'wh3_main_sc_kho_khorne',
    'Nurgle': 'wh3_main_sc_nur_nurgle',
    'Tzeentch': 'wh3_main_sc_tze_tzeentch',
    'Slaanesh': 'wh3_main_sc_sla_slaanesh',
    'Royaumes Ogres': 'wh3_main_sc_ogr_ogre_kingdoms',
    'Nains du Chaos': 'wh3_dlc23_sc_chd_chaos_dwarfs',
    'Guerriers du Chaos': 'wh_main_sc_chs_chaos',
    'Démons du Chaos': 'wh3_main_sc_dae_daemons',
  };

  let culturalRelations = [];
  let culturalMeta = null;

  const originalRender = render;

  function culturalRelation(from, to) {
    const source = raceToSubculture[from.race];
    const target = raceToSubculture[to.race];
    if (!source || !target) return null;
    return culturalRelations.find(r => r.sourceSubculture === source && r.targetSubculture === target) || null;
  }

  function scoreClass(value) {
    if (value < 0) return 'cultural-negative';
    if (value > 0) return 'cultural-positive';
    return 'cultural-neutral';
  }

  function culturalCell(from, to) {
    const explicit = from.key && to.key ? rel(from.key, to.key) : null;
    const cultural = culturalRelation(from, to);
    const culturalHtml = cultural
      ? `<span class="cultural-score ${scoreClass(cultural.attitudeBase)}" title="Base culturelle WH3 : ${cultural.attitudeBase}; évolution négative ×${cultural.negativeAttitudeMultiplier}; évolution positive ×${cultural.positiveAttitudeMultiplier}">${cultural.attitudeBase > 0 ? '+' : ''}${cultural.attitudeBase}</span><small class="cultural-label">base culturelle</small>`
      : '<span class="pending">Base culturelle non disponible</span>';

    if (!explicit) return culturalHtml;
    if (explicit.atWar) return `<span class="bad">En guerre</span>${cultural ? `<small class="cultural-label">${cultural.attitudeBase > 0 ? '+' : ''}${cultural.attitudeBase} culturel</small>` : ''}`;
    if (explicit.treaties?.length) return `<span>Traité</span>${cultural ? `<small class="cultural-label">${cultural.attitudeBase > 0 ? '+' : ''}${cultural.attitudeBase} culturel</small>` : ''}`;
    return culturalHtml;
  }

  function renderCulturalMatrix() {
    const ids = chosen();
    const selectedLords = ids.map(id => lords.find(l => l.id === id)).filter(Boolean);
    if (selectedLords.length < 2 || !culturalRelations.length) return;

    matrix.innerHTML = '<table><tr><th>De / vers</th>' +
      selectedLords.map(l => `<th>${l.name}</th>`).join('') + '</tr>' +
      selectedLords.map(from => `<tr><th>${from.name}</th>` + selectedLords.map(to => {
        if (from.id === to.id) return '<td>—</td>';
        return `<td>${culturalCell(from, to)}</td>`;
      }).join('') + '</tr>').join('') + '</table>' +
      '<p class="source matrix-source">Valeurs numériques : <code>campaign_cultural_relations_tables.attitude_base</code>. Il s’agit de la base culturelle directionnelle du jeu, avant les effets propres à la faction, les scripts et les événements.</p>';
  }

  render = function () {
    originalRender();
    renderCulturalMatrix();
  };

  const style = document.createElement('style');
  style.textContent = `.cultural-score{display:block;font-weight:800;font-size:16px}.cultural-negative{color:var(--bad)}.cultural-positive{color:var(--good)}.cultural-neutral{color:var(--text)}.cultural-label{display:block;color:var(--muted);font-size:9px;margin-top:3px}.matrix-source{margin:10px 0 0;font-size:11px}.data-error{color:var(--bad);font-weight:700}`;
  document.head.append(style);

  fetch('./data/generated/cultural-relations.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      culturalRelations = data.relations || [];
      culturalMeta = data;
      render();
      const footer = document.querySelector('footer');
      if (footer && culturalMeta) {
        footer.textContent += ` · ${culturalRelations.length} bases culturelles directionnelles`;
      }
    })
    .catch(error => {
      console.error('Impossible de charger la base culturelle WH3', error);
      const warning = document.createElement('p');
      warning.className = 'source data-error';
      warning.textContent = `Erreur de chargement des données diplomatiques (${error.message}).`;
      matrix.after(warning);
    });
})();
