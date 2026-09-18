const groups={
  "L'Empire":[["karl","Empereur Karl Franz","Reikland"],["gelt","Balthasar Gelt","L'Ordre Doré"],["volkmar","Volkmar le Sévère","Culte de Sigmar"],["markus","Markus Wulfhart","L'Expédition du jagdsmarshall"],["elspeth","Elspeth von Draken","Wissenland et Nuln"]],
  "Nains":[["thorgrim","Thorgrim le Rancunier","Karaz-a-Karak"],["grombrindal","Grombrindal","Le Throng ancestral"],["ungrim","Ungrim Poing de Fer","Karak Kadrin"],["belegar","Belegar Marteau-de-fer","Clan Angrund"],["thorek","Thorek Tête en Fer","Expédition de Tête-en-fer"],["malakai","Malakai Makaisson","Maîtres de l'Innovation"]],
  "Hauts Elfes":[["tyrion","Tyrion","Eataine"],["teclis","Teclis","Ordre des maîtres du savoir"],["alarielle","Alarielle la Radieuse","Avelorn"],["alith","Alith Anar","Nagarythe"],["eltharion","Eltharion le Sinistre","Yvresse"],["imrik","Imrik","Chevaliers de Caledor"],["aislinn","Seigneur des Mers Aislinn","Patrouille Maritime des Hauts Elfes"]],
  "Elfes Noirs":[["malekith","Malékith","Naggarond"],["morathi","Morathi","Culte du Plaisir"],["hellebron","Hellebron l'Ancienne","Har Ganeth"],["lokhir","Lokhir Cœur de Pierre","L'Effroi Béni"],["malus","Malus Darkblade","Hag Graef"],["rakarth","Rakarth","Les Mille Gueules"]],
  "Hommes-lézards":[["mazdamundi","Seigneur Mazdamundi","Hexoatl"],["kroq","Kroq-Gar","Ultimes Défenseurs"],["tehenhauin","Tehenhauin","Culte de Sotek"],["tiktaqto","Tiktaq'to","Tlaqua"],["gorrok","Gor-Rok","Itza"],["nakai","Nakai le Vagabond","Esprit de la jungle"],["oxyotl","Oxyotl","Fantômes de Pahuax"]],
  "Skavens":[["queek","Queek Coupe-Têtes","Clan Mors"],["skrolk","Seigneur Skrolk","Clan Pestilens"],["tretch","Tretch la-Queue-qui-Frétille","Clan Rictus"],["ikit","Ikit la Griffe","Clan Skryre"],["snikch","Maître Assassin Snikch","Clan Eshin"],["throt","Throt le Galeux","Clan Moulder"]],
  "Côte Vampire":[["luthor","Luthor Harkon","L'Éveillé"],["noctilus","Comte Noctilus","La Flotte de Terreur"],["aranessa","Aranessa Saumâtre","Pirates de Sartosa"],["cylostra","Cylostra Mauvaileron","Les Noyés"]],
  "Comtes Vampires":[["mannfred","Mannfred von Carstein","Le Conclave de Drakenhof"],["vlad","Vlad von Carstein","Sylvanie"],["isabella","Isabella von Carstein","Sylvanie"],["kemmler","Heinrich Kemmler","La Légion du Tertre"],["ghorst","Helman Ghorst","Caravane des Roses bleues"]],
  "Rois des Tombes":[["settra","Settra l'Impérissable","Khemri"],["arkhan","Arkhan le Noir","Fidèles de Nagash"],["khalida","Haute Reine Khalida","Cour de Lybaras"],["khatep","Khatep le Haut Hiérophante","Exilés de Nehek"]],
  "Peaux-Vertes":[["grimgor","Grimgor Boît'en Fer","Les Durs à Kuir' de Grimgor"],["azhag","Azhag le Massacreur","Zagiteurs d'Os"],["skarsnik","Skarsnik","La Lune Crochue"],["wurrzag","Wurrzag","Les Mains sanglantes"],["grom","Grom la Panse","Haches brisées"],["gorbad","Gorbad Griff' Eud' Fer","Orques de Griff' Eud' Fer"]],
  "Bretonnie":[["louen","Roy Louen Cœur de Lion","Couronne"],["fay","Fée Enchanteresse","Gasconnie"],["alberic","Albéric de Bordeleaux","Errants de Bordeleaux"],["repanse","Jeanne de Lyonesse","Chevaliers de Lyonesse"]],
  "Elfes Sylvains":[["orion","Orion","Talsyn"],["durthu","Durthu","Argwylon"],["sisters","Sœurs du Crépuscule","Hérauts d'Ariel"],["drycha","Drycha","Bosquet de guerre du Malheur"]],
  "Hommes-bêtes":[["khazrak","Khazrak le Borgne","Harde de Khazrak le Borgne"],["malagor","Malagor Mauvais-Présage","Émissaire du Désastre"],["morghur","Morghur l'Enfant de l'Ombre","Harde guerrière de l'Enfant de l'Ombre"],["taurox","Taurox le Taureau d'Airain","Tribu de Cornegouge"]],
  "Norsca":[["wulfrik","Wulfrik le Vagabond","Marche-mondes"],["throgg","Throgg","Croc de l'Hiver"],["sayl","Sayl le Perfide","Dolgans"]],
  "Kislev":[["katarin","Tsarine Katarina","La Cour de Givre"],["kostaltyn","Kostaltyn","La Grande Orthodoxie"],["boris","Boris Ursus","Revivalistes d'Ursun"],["ostankya","Mère Ostankya","Filles de la Forêt"]],
  "Grand Cathay":[["miao","Miao Ying","Provinces du Nord"],["zhao","Zhao Ming","Provinces de l'Ouest"],["yuan","Yuan Bo, le Dragon de Jade","La Cour de Jade"],["bhashiva","Bhashiva, le Tigre Blanc","Griffes du Tigre Blanc"]],
  "Khorne":[["skarbrand","Skarbrand l'Exilé","Exilés de Khorne"],["skulltaker","Preneur de Crânes","Vagabonds rouges"],["arbaal","Arbaal l'Invaincu","Prétendants de Khorne"]],
  "Nurgle":[["kugath","Ku'gath, Père des Épidémies","Véroleurs de Nurgle"],["tamurkhan","Tamurkhan le Seigneur des Vers","L'Ost des Vers"],["epidemius","Epidemius","Intendants de la Pestilence"]],
  "Tzeentch":[["kairos","Kairos Tisseur de Destins","Oracles de Tzeentch"],["changeling","Le Changelin","Les Trompeurs"]],
  "Slaanesh":[["nkari","N'Kari","Séducteurs de Slaanesh"],["dechala","Déchala la Répudiée","Les Tourmenteurs"],["masque","Le Masque de Slaanesh","La Troupe Maudite"]],
  "Royaumes Ogres":[["greasus","Graissus Dent d'Or","Dent d'Or"],["skrag","Skrag le Désosseur","Disciples de La Gueule"],["golgfag","Golgfag Mangeur d'Hommes","Les Mangeurs d'Hommes"]],
  "Nains du Chaos":[["astragoth","Astragoth Main-de-Fer","Disciples d'Hashut"],["drazhoath","Drazhoath le Cendreux","La Légion d'Azgorh"],["zhatan","Zhatan le Noir","L'Ost de guerre de Zharr"]],
  "Guerriers du Chaos":[["archaon","Archaon, Seigneur de la Fin des Temps","Ost de guerre de l'Apocalypse"],["kholek","Kholek Dévore-le-Soleil","Hérauts des Tempêtes"],["sigvald","Prince Sigvald le Magnifique","L'Ost Décadent"],["belakor","Be'lakor","Légion des Ombres"],["azazel","Azazel","Les Légions Extatiques"],["festus","Docteur Festus","Les Fécondés"],["vilitch","Vilitch le Maudit","Marionnettes de l'Anarchie"],["valkia","Valkia la Sanglante","Légion de la Reine du Carnage"]],
  "Démons du Chaos":[["daemon","Prince Démon","Légion du Chaos"]]
};

const fallbackFactionKeys={imrik:'wh2_dlc15_hef_imrik',karl:'wh_main_emp_empire',malus:'wh2_main_def_hag_graef',kugath:'wh3_main_nur_poxmakers_of_nurgle'};
const fallbackPositions={imrik:[573.586609,330.326599],karl:[355.687042,487.026276],malus:[393.503754,719.28479],kugath:[668.102417,288.452148]};
const aliases={karl:['karl','karl_franz'],kroq:['kroq','kroq_gar'],fay:['fay','fay_enchantress'],sisters:['sisters','sisters_of_twilight'],kugath:['kugath','ku_gath'],nkari:['nkari','n_kari'],belakor:['belakor','be_lakor'],daemon:['daemon','daemon_prince']};
const lords=Object.entries(groups).flatMap(([race,a])=>a.map(([id,name,faction])=>({id,name,faction,race,key:fallbackFactionKeys[id]||null})));
const positions={...fallbackPositions};
// Calibrated once against the Immortal Empires background with the reviewed
// camera-start extent from the WH3 dump. Keep this stable when new leaders
// are added: deriving bounds from the current roster would move every marker.
const mapCalibration={minX:11,maxX:899,minY:20.529987,maxY:723.853149};
const roster=document.querySelector('#roster'),selected=document.querySelector('#selected'),matrix=document.querySelector('#matrix'),map=document.querySelector('#map'),mapViewport=document.querySelector('#mapViewport'),mapStatus=document.querySelector('#mapStatus'),search=document.querySelector('#search'),raceFilter=document.querySelector('#raceFilter'),teamMode=document.querySelector('#teamMode'),difficulty=document.querySelector('#difficulty'),teamTreaty=document.querySelector('#teamTreaty'),teamTreatyField=document.querySelector('#teamTreatyField'),teamAnalysis=document.querySelector('#teamAnalysis'),candidateComparison=document.querySelector('#candidateComparison');
let relations=[],turnOneRelations=[],activeFactions=null,culturalData=null,caiData=null,restrictionData=null,strategicData=null,teamRulesData=null,positionRecords=[],positionBounds=mapCalibration,zoom=1,offset={x:0,y:0},drag=null,metadataLoading=true;
const selectedIds=new Set(['imrik','karl']);
const chosen=()=>[...selectedIds];
function initRaceFilter(){raceFilter.innerHTML=Object.keys(groups).map(r=>`<option value="${r}">${r}</option>`).join('');raceFilter.value=Object.keys(groups)[0]}
function renderRoster(){const q=search.value.trim().toLowerCase(),race=raceFilter.value,all=groups[race]||[];const list=all.filter(x=>(race+' '+x[1]+' '+x[2]).toLowerCase().includes(q));roster.innerHTML=`<section class="race"><h3>${race} <small>(${list.length}/${all.length})</small></h3><div class="lords">${list.map(([id,n,f])=>`<label class="lord"><input type="checkbox" value="${id}" ${selectedIds.has(id)?'checked':''}><span><strong>${n}</strong><small>${f}</small></span></label>`).join('')}</div>${list.length?'':'<p class="pending">Aucun seigneur ne correspond à la recherche.</p>'}</section>`}
function rel(a,b){return relations.find(r=>r.sourceFaction===a&&r.targetFaction===b)}
function turnOneRel(a,b){return turnOneRelations.find(r=>r.sourceFaction===a&&r.targetFaction===b)}
function knownRelationValue(row){
  if(!row)return null;
  const value=row.knownAttitudeComponentsTotal??row.baseAttitude;
  return Number.isFinite(Number(value))?Number(value):null
}
function relationStatus(value){
  if(!Number.isFinite(value))return{label:'Données incomplètes',cls:'pending'};
  const id=window.WH3TeamAnalysis?.attitudeCategory?.(value);
  if(id==='hostile')return{label:'Hostile',cls:'bad'};
  if(id==='friendly')return{label:'Favorable',cls:'good'};
  return{label:'Neutre',cls:'neutral'}
}
function knownComponentsLabel(row){
  const components=row?.components||[];
  if(!components.length)return'aucune composante résolue';
  return components.map(component=>{
    const value=Number(component.value);
    const signed=Number.isFinite(value)?`${value>0?'+':''}${fmt(value,0)}`:'—';
    if(component.type==='cultural-baseline')return`culture ${signed}`;
    if(component.type==='cai-personality-cultural-override')return`personnalité/culture ${signed}`;
    if(component.type==='cai-treaty-initial-value')return`${component.treaty||'traité'} ${signed}`;
    if(component.type==='verified-first-tick-diplomatic-modifier')return`effet T1 ${signed}`;
    return`${component.type||'composante'} ${signed}`
  }).join(' · ')
}
function pairExternalMetrics(from,to){
  if(!from?.key||!to?.key||!activeFactions||!culturalData||!caiData||!strategicData||!teamRulesData||!window.WH3TeamAnalysis?.compareCandidates)return null;
  try{
    return window.WH3TeamAnalysis.compareCandidates(analysisInput([from.key]),[to.key])[0]?.metrics||null
  }catch(error){
    console.warn('Comparaison externe indisponible',from.key,to.key,error);
    return null
  }
}
function pairCompatibilityCell(from,to){
  const row=from.key&&to.key?turnOneRel(from.key,to.key):null;
  const value=knownRelationValue(row);
  const status=relationStatus(value);
  const explicit=from.key&&to.key?rel(from.key,to.key):null;
  const metrics=pairExternalMetrics(from,to);
  const headline=row?.atWar||explicit?.atWar?'En guerre':status.label;
  const cls=row?.atWar||explicit?.atWar?'bad':status.cls;
  const valueText=Number.isFinite(value)?`${value>0?'+':''}${fmt(value,0)} connu`:'socle inconnu';
  const treaties=row?.treaties?.length?row.treaties.join(', '):explicit?.treaties?.length?explicit.treaties.join(', '):'';
  const external=metrics
    ? `<small class="pair-external">${metrics.startingWars} guerre(s) PNJ · ${metrics.hostileNpcs} PNJ hostiles · ${metrics.transitiveTensions} tension(s) transitives</small>`
    : '<small class="pair-external pending">impact PNJ en chargement</small>';
  const details=row?knownComponentsLabel(row):'profil T1 non résolu';
  return `<div class="pair-cell"><strong class="${cls}" title="${details}">${headline}</strong><small>${valueText}${treaties?' · '+treaties:''}</small>${external}</div>`
}
function applyMapTransform(){map.style.transform=`translate(${offset.x}px,${offset.y}px) scale(${zoom})`}
function mapPercent(x,y){const b=positionBounds;if(!b||b.maxX===b.minX||b.maxY===b.minY)return[50,50];const pad=2.5;return[pad+(x-b.minX)/(b.maxX-b.minX)*(100-pad*2),pad+(b.maxY-y)/(b.maxY-b.minY)*(100-pad*2)]}
function renderMap(ids){map.innerHTML='';let missing=0;ids.forEach(id=>{if(!positions[id]){missing++;return}const l=lords.find(x=>x.id===id),[x,y]=positions[id],m=document.createElement('div');m.className='marker';const[left,top]=mapPercent(x,y);m.style.left=`${left}%`;m.style.top=`${top}%`;m.innerHTML=`<span class="marker-dot"></span><span class="marker-label"><b>${l.name}</b><small>${l.faction}</small></span>`;map.append(m)});if(metadataLoading)mapStatus.textContent='Chargement des positions WH3 vérifiées…';else if(missing)mapStatus.textContent=`${missing} position(s) sélectionnée(s) non résolue(s) dans le dump courant. Aucun emplacement approximatif n'est inventé.`;else mapStatus.textContent='Toutes les positions sélectionnées proviennent de cam_gameplay_start dans les scripts WH3.';applyMapTransform()}
function renderSelected(ids){const items=ids.map(id=>lords.find(l=>l.id===id)).filter(Boolean);const detail=items[0]?`<a class="selected-detail" href="/wh3-diplomacy/quick-deal.html?leader=${encodeURIComponent(items[0].id)}">Voir la fiche de ${items[0].name} →</a>`:'';selected.innerHTML=`<p>${items.length} dirigeant${items.length>1?'s':''} sélectionné${items.length>1?'s':''} · analyse d’équipe de 2 à 4 joueurs</p><div class="selected-lords">${items.map(l=>`<span class="selected-chip"><b>${l.name}</b><small>${l.race}</small><button type="button" data-remove="${l.id}" title="Retirer ${l.name}">×</button></span>`).join('')}</div>${detail}`}
function displayFactionName(key){const lord=lords.find(item=>item.key===key);if(lord)return lord.faction;const faction=activeFactions?.factions?.find(item=>item.factionKey===key);return faction?.displayName||faction?.name||key}
function reproBadge(level){if(level==='exact-pre-game')return'<span class="repro exact">exact</span>';if(level==='simulable-pre-game')return'<span class="repro sim">simulable</span>';return'<span class="repro unknown">runtime inconnu</span>'}
function fmt(value,digits=1){return Number.isFinite(Number(value))?Number(value).toFixed(digits):'—'}
function analysisInput(keys){return{
  team:keys,
  mode:teamMode.value,
  teamTreaty:teamTreaty.value,
  difficulty:difficulty.value,
  factions:activeFactions,
  culture:culturalData,
  cai:caiData,
  strategic:strategicData,
  teamRules:teamRulesData,
  relations:{relations:turnOneRelations},
  startpos:{relations},
  restrictions:restrictionData
}}
function renderCandidateComparison(ids){
  if(!candidateComparison)return;
  if(ids.length===0){candidateComparison.innerHTML='<p class="pending">Sélectionne un premier dirigeant pour comparer les coéquipiers possibles.</p>';return}
  if(ids.length>=4){candidateComparison.innerHTML='<p class="source">Équipe complète : 4 dirigeants sélectionnés.</p>';return}
  if(!activeFactions||!culturalData||!caiData||!strategicData||!teamRulesData||!window.WH3TeamAnalysis){
    candidateComparison.innerHTML='<p class="pending">Chargement des données nécessaires au comparateur…</p>';return
  }
  const keys=ids.map(id=>lords.find(l=>l.id===id)?.key).filter(Boolean);
  if(keys.length!==ids.length){candidateComparison.innerHTML='<p class="pending">Certaines factions sélectionnées ne sont pas encore résolues.</p>';return}
  const candidateLords=lords.filter(lord=>lord.key&&!ids.includes(lord.id)&&!keys.includes(lord.key));
  const candidateByFaction=new Map(candidateLords.map(lord=>[lord.key,lord]));
  let compared,suggestion;
  try{
    const candidateKeys=[...candidateByFaction.keys()];
    compared=window.WH3TeamAnalysis.compareCandidates(analysisInput(keys),candidateKeys).slice(0,12);
    suggestion=window.WH3TeamAnalysis.suggestTeam(analysisInput(keys),candidateKeys,4)
  }catch(error){candidateComparison.innerHTML=`<p class="pending">${error.message}</p>`;return}
  const incremental=compared[0]?.comparisonMode==='incremental';
  const delta=value=>Number.isFinite(Number(value))?`${Number(value)>0?'+':''}${Number(value).toFixed(Number.isInteger(Number(value))?0:1)}`:'—';
  const intro=incremental
    ? 'Impact ajouté par rapport à l’équipe actuelle. Tri : Δ guerres → Δ restrictions → Δ hostilité multiple → Δ hostilité directe → Δ tensions transitives → Δ exposition négative, puis totaux pour départager.'
    : 'Avec un seul joueur, comparaison des totaux connus. Tri : guerres initiales → restrictions → hostilité multiple → hostilité directe → tensions transitives → exposition négative.';
  const suggestionLords=(suggestion?.steps||[]).map(step=>candidateByFaction.get(step.candidateFaction)).filter(Boolean);
  const suggestionHtml=suggestionLords.length?`<div class="team-suggestion"><div><strong>Proposition jusqu’à 4 joueurs</strong><small>Ajouts recalculés à chaque étape : ${suggestionLords.map(lord=>lord.name).join(' → ')}</small></div><button type="button" data-apply-suggestion="${suggestionLords.map(lord=>lord.id).join(',')}">Appliquer</button></div>`:'';
  candidateComparison.innerHTML=`<p class="source">${intro} Aucun pourcentage de guerre.</p>${suggestionHtml}
    <div class="candidate-list">${compared.map((row,index)=>{
      const lord=candidateByFaction.get(row.candidateFaction),m=row.deltaMetrics||row.metrics,prefix=row.deltaMetrics?'Δ ':'';
      if(!lord)return'';
      const worsened=row.npcImpacts?.worsened||[],improved=row.npcImpacts?.improved||[];
      const affected=worsened.slice(0,3).map(item=>displayFactionName(item.npcFaction));
      const impactLabel=row.npcImpacts?.mode==='incremental'?'PNJ aggravés':'PNJ sensibles';
      const impactText=affected.length?`${impactLabel} : ${affected.join(', ')}${worsened.length>affected.length?` +${worsened.length-affected.length}`:''}`:`${impactLabel} : aucun détecté`;
      const improvedText=improved.length?` · améliorés : ${improved.slice(0,2).map(item=>displayFactionName(item.npcFaction)).join(', ')}${improved.length>2?` +${improved.length-2}`:''}`:'';
      return `<div class="candidate-row"><div><strong>${index+1}. ${lord.name}</strong><small>${lord.race} · ${lord.faction}</small><div class="analysis-meta"><span title="total ${row.metrics.startingWars}">${prefix}guerres ${row.deltaMetrics?delta(m.startingWars):m.startingWars}</span><span title="total ${row.metrics.restrictedNpcs}">${prefix}restrictions ${row.deltaMetrics?delta(m.restrictedNpcs):m.restrictedNpcs}</span><span title="total ${row.metrics.hostileNpcs}">${prefix}PNJ hostiles ${row.deltaMetrics?delta(m.hostileNpcs):m.hostileNpcs}</span><span title="total ${row.metrics.multiHostileNpcs}">${prefix}multi-hostiles ${row.deltaMetrics?delta(m.multiHostileNpcs):m.multiHostileNpcs}</span><span title="total ${row.metrics.transitiveTensions}">${prefix}tensions transitives ${row.deltaMetrics?delta(m.transitiveTensions):m.transitiveTensions}</span><span title="total ${fmt(row.metrics.negativeTransitiveExposure,1)}">${prefix}exposition négative ${row.deltaMetrics?delta(m.negativeTransitiveExposure):fmt(m.negativeTransitiveExposure,1)}</span></div><small class="candidate-impact">${impactText}${improvedText}</small></div><button type="button" data-add-candidate="${lord.id}">Ajouter</button></div>`
    }).join('')||'<p class="pending">Aucun autre seigneur résolu à comparer.</p>'}</div>`;
}
function renderTeamAnalysis(ids){
  if(!teamAnalysis)return;
  teamTreatyField.hidden=teamMode.value!=='ffa';
  if(ids.length<2){teamAnalysis.innerHTML='<p class="pending">Sélectionne 2 à 4 dirigeants pour analyser les PNJ.</p>';return}
  if(ids.length>4){teamAnalysis.innerHTML='<p class="pending">Limite l’équipe à 4 dirigeants pour l’analyse.</p>';return}
  if(!activeFactions||!culturalData||!caiData||!strategicData||!teamRulesData||!window.WH3TeamAnalysis){
    teamAnalysis.innerHTML='<p class="pending">Chargement des facteurs diplomatiques et CAI…</p>';return
  }
  const keys=ids.map(id=>lords.find(l=>l.id===id)?.key).filter(Boolean);
  if(keys.length!==ids.length){teamAnalysis.innerHTML='<p class="pending">Certaines factions sélectionnées ne sont pas encore résolues.</p>';return}
  let report;
  try{
    report=window.WH3TeamAnalysis.analyze(analysisInput(keys))
  }catch(error){teamAnalysis.innerHTML=`<p class="pending">${error.message}</p>`;return}
  const notable=report.results.filter(row=>row.category.id!=='favorable').slice(0,35);
  const treatyText=report.mode==='same-team'
    ? (report.teamTreaty.treaty==='TRADE_AGREEMENT'?'Même équipe : commerce forcé entre coéquipiers vérifié dans wh_campaign_setup.lua.':'Même équipe : règles natives supplémentaires non prouvées.')
    : `FFA : scénario ${report.teamTreaty.treaty||'sans traité'} entre joueurs.`;
  teamAnalysis.innerHTML=`<p class="source">${treatyText} Difficulté : ${difficulty.options[difficulty.selectedIndex].text}. Les enveloppes de menace utilisent les bornes CAI connues, jamais une probabilité de guerre.</p>
    <div class="analysis-list">${notable.map(row=>{
      const hostile=row.members.filter(m=>window.WH3TeamAnalysis.attitudeCategory(m.relation?.attitudeForSimulation??null)==='hostile').length;
      const transitive=row.transitive.filter(t=>t.direction==='tension-with-ally').length;
      const threat=row.members.map(m=>m.threatEnvelope?.multiplierEnvelope?.max).filter(Number.isFinite);
      const maxThreat=threat.length?Math.max(...threat):null;
      const exposure=Number.isFinite(row.transitiveExposure)?row.transitiveExposure:null;
      return `<div class="analysis-row"><div><strong>${displayFactionName(row.npcFaction)}</strong><small>${row.category.label} · ${hostile} relation(s) hostile(s)${transitive?' · '+transitive+' tension(s) transitive(s)':''}</small><div class="analysis-meta"><span>exact ${row.exactSignals.length}</span><span>simulable ${row.simulableSignals.length}</span><span>runtime ${row.runtimeUnknown.length}</span>${exposure!==null?`<span>signal transitif ${exposure>0?'+':''}${fmt(exposure,1)}</span>`:''}${maxThreat!==null?`<span>enveloppe menace ×≤${fmt(maxThreat,2)}</span>`:''}</div></div><button data-npc="${row.npcFaction}">Détails</button></div>`
    }).join('')||'<p class="pending">Aucun PNJ problématique identifié avec les données résolues.</p>'}</div><div id="analysisDetail" class="analysis-detail"></div>`;
  teamAnalysis.querySelectorAll('[data-npc]').forEach(button=>button.onclick=()=>{
    const row=report.results.find(item=>item.npcFaction===button.dataset.npc);
    const detail=teamAnalysis.querySelector('#analysisDetail');
    const memberLines=row.members.map(m=>{
      const r=m.relation,p=m.proximity,t=m.threatEnvelope;
      const value=r?.attitudeForSimulation;
      const source=(r?.provenance||r?.components||[]).map(x=>x.type+(x.sourceTable?' ('+x.sourceTable+')':'')).join(', ');
      const proximity=p.sharedRegions.length?`même région : ${p.sharedRegions.join(', ')}`:p.cameraDistance!==null?`distance coordonnées départ : ${fmt(p.cameraDistance)}`:'position non résolue';
      const threat=t?`enveloppe multiplicateur menace ×${fmt(t.multiplierEnvelope.min,2)}–×${fmt(t.multiplierEnvelope.max,2)} (base_score inconnu)`:'menace non calculable';
      return `<li><b>${displayFactionName(m.playerFaction)}</b> : attitude connue ${value===null||value===undefined?'—':(value>0?'+':'')+fmt(value,0)} · ${r?.atWar?'guerre au départ':r?.treaties?.length?'traités : '+r.treaties.join(', '):'aucun traité initial'} · ${proximity} · ${threat}. ${source}</li>`
    }).join('');
    const transitiveLines=row.transitive.map(t=>`<li>${displayFactionName(t.playerFaction)} allié à ${displayFactionName(t.allyFaction)} via ${t.treaty||'règle non résolue'} : le PNJ voit l’allié à ${t.observerAttitudeToAlly??'—'} (${t.observerAttitudeCategory}), valeur CAI du traité ${t.treatyInitialValue??'—'}, poids transitif ${t.transitiveWeight??'—'}${t.networkCoefficient!==null&&t.networkCoefficient!==undefined?' · coefficient réseau '+t.networkCoefficientKey+' = '+t.networkCoefficient+(t.weightedNetworkCoefficient!==null?' · produit pondéré '+fmt(t.weightedNetworkCoefficient,2):''):''}${t.exposureSignal!==null&&t.exposureSignal!==undefined?' · signal comparatif '+(t.exposureSignal>0?'+':'')+fmt(t.exposureSignal,1):''}. Ce signal combine uniquement des paramètres exposés par WH3 ; ce n’est ni l’attitude finale affichée ni une probabilité de guerre. ${reproBadge(t.reproducibility)}</li>`).join('');
    const profile=row.strategicProfile;
    const strategicValues=profile?.strategicComponentValues||{};
    const warEval=profile?.warDealEvaluation?.WAR||null;
    const personality=profile?`<li>Personnalité : ${profile.personalityKey||'—'} · composante stratégique ${profile.strategicComponent||'—'} · opportunisme ${strategicValues.strategic_balance_opportunism_factor??'—'} · seuil menace ${strategicValues.ai_threat_score_threat_treshold??'—'} · dead zone ${strategicValues.dead_zone??'—'} · appel aux armes offensif contre humain ${strategicValues.call_to_arms_chance_offensive_war_with_human_players??'—'}. ${reproBadge('exact-pre-game')}</li>`:'<li>Personnalité CAI non résolue.</li>';
    const warEvaluation=warEval?`<li>Évaluation CAI <code>WAR</code> (${profile.dealEvaluationComponent||'—'}) : neutre ${warEval.neutral_value??'—'}, amical ${warEval.friendly_value??'—'}, hostile ${warEval.unfriendly_value??'—'}, très hostile ${warEval.very_unfriendly_value??'—'}, ennemi juré ${warEval.bitter_enemies_value??'—'} · facteur équilibre de guerre ${warEval.war_balance_factor??'—'} · menace principale ${warEval.main_threat??'—'} · menace commune ${warEval.have_common_threat??'—'} · pénalité longue distance ${warEval.long_distance_penalty_min??'—'} à ${warEval.long_distance_penalty_max??'—'}. Ce sont les paramètres exacts du profil, pas le score final de décision. ${reproBadge('exact-pre-game')}</li>`:'<li>Paramètres <code>WAR</code> du profil CAI non résolus.</li>';
    const restrictions=row.members.flatMap(m=>m.restrictions||[]);
    detail.innerHTML=`<h3>${displayFactionName(row.npcFaction)} — ${row.category.label}</h3>
      <h4>Exact avant partie ${reproBadge('exact-pre-game')}</h4><ul>${memberLines}${personality}${warEvaluation}${restrictions.map(r=>`<li>Diplomatie désactivée par ${r.campaignGroup} ↔ ${r.targetFactionSet}.</li>`).join('')}</ul>
      <h4>Simulable avant partie ${reproBadge('simulable-pre-game')}</h4><ul>${transitiveLines||'<li>Aucun effet transitif pertinent pour cette composition.</li>'}<li>La formule WH3 de menace expose attitude × actions directes × proximité × personnalité ; lorsque la valeur runtime exacte d’un terme manque, l’outil affiche son enveloppe min/max.</li></ul>
      <h4>Runtime non reproductible exactement ${reproBadge('runtime-unknown')}</h4><ul>${row.runtimeUnknown.map(x=>`<li>${x}</li>`).join('')}</ul>`
  })
}
function render(){const ids=chosen(),a=ids.map(id=>lords.find(l=>l.id===id)).filter(Boolean);renderSelected(ids);renderMap(ids);renderCandidateComparison(ids);renderTeamAnalysis(ids);if(ids.length<2){matrix.innerHTML='<p class="pending">Sélectionne au moins deux dirigeants.</p>';return}matrix.innerHTML='<table><tr><th>De / vers</th>'+a.map(l=>`<th>${l.name}</th>`).join('')+'</tr>'+a.map(x=>`<tr><th>${x.name}</th>`+a.map(y=>x.id===y.id?'<td>—</td>':`<td>${pairCompatibilityCell(x,y)}</td>`).join('')+'</tr>').join('')+'</table><p class="source matrix-source">La ligne principale utilise le socle diplomatique T1 connu/simulable (culture, personnalité culturelle, traités de départ et effets first-tick vérifiés). Le nombre « connu » n’est pas présenté comme l’attitude native finale. La troisième ligne résume l’impact extérieur de cette paire sur les PNJ.</p>'}
function words(value){return String(value||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)}
function scoreLeaderMatch(row,id){const wanted=aliases[id]||[id];const fields=[[row.agentSubtype,30],[row.politicalPartyKey,20],[row.factionKey,10]];let best=0;for(const alias of wanted){const aliasWords=words(alias);for(const[value,weight]of fields){const valueWords=words(value);if(aliasWords.length===1&&valueWords.includes(aliasWords[0]))best=Math.max(best,weight);else if(aliasWords.every(w=>valueWords.includes(w)))best=Math.max(best,weight+aliasWords.length)}}return best}
function applyLeaderMetadata(leadersData,positionsData){const rows=leadersData.leaders||[];positionRecords=positionsData.positions||[];for(const lord of lords){const scored=rows.map(row=>({row,score:scoreLeaderMatch(row,lord.id)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);if(scored.length&&(!scored[1]||scored[0].score>scored[1].score))lord.key=scored[0].row.factionKey;if(lord.key){const pos=positionRecords.find(p=>p.factionKey===lord.key);if(pos)positions[lord.id]=[pos.x,pos.y]}}}
function setFooter(){const keyed=lords.filter(l=>l.key).length,located=lords.filter(l=>positions[l.id]).length;document.querySelector('footer').textContent=`Roster ${lords.length} seigneurs · ${keyed} factions résolues · ${located} positions de départ résolues · ${relations.length} relations explicites`}
roster.addEventListener('change',e=>{if(!e.target.matches('input[type="checkbox"]'))return;if(e.target.checked&&selectedIds.size>=4){e.target.checked=false;return}e.target.checked?selectedIds.add(e.target.value):selectedIds.delete(e.target.value);render()});selected.addEventListener('click',e=>{const button=e.target.closest('[data-remove]');if(!button)return;selectedIds.delete(button.dataset.remove);renderRoster();render()});candidateComparison?.addEventListener('click',e=>{const suggestion=e.target.closest('[data-apply-suggestion]');if(suggestion){for(const id of suggestion.dataset.applySuggestion.split(',').filter(Boolean)){if(selectedIds.size>=4)break;selectedIds.add(id)}renderRoster();render();return}const button=e.target.closest('[data-add-candidate]');if(!button||selectedIds.size>=4)return;selectedIds.add(button.dataset.addCandidate);renderRoster();render()});raceFilter.onchange=()=>{search.value='';renderRoster()};search.oninput=renderRoster;plus.onclick=()=>{zoom=Math.min(3,zoom+.25);applyMapTransform()};minus.onclick=()=>{zoom=Math.max(1,zoom-.25);if(zoom===1)offset={x:0,y:0};applyMapTransform()};reset.onclick=()=>{zoom=1;offset={x:0,y:0};applyMapTransform()};mapViewport.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};mapViewport.classList.add('dragging');mapViewport.setPointerCapture(e.pointerId)});mapViewport.addEventListener('pointermove',e=>{if(!drag)return;offset={x:drag.ox+e.clientX-drag.x,y:drag.oy+e.clientY-drag.y};applyMapTransform()});mapViewport.addEventListener('pointerup',()=>{drag=null;mapViewport.classList.remove('dragging')});mapViewport.addEventListener('pointercancel',()=>{drag=null;mapViewport.classList.remove('dragging')});
initRaceFilter();renderRoster();render();teamMode.onchange=render;difficulty.onchange=render;teamTreaty.onchange=render;
const dataBase='./data/runtime/';
const loadJson=name=>fetch(`${dataBase}${name}?v=20260902-3`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`${name} HTTP ${r.status}`);return r.json()});
Promise.allSettled([loadJson('immortal-empires-startpos.json'),loadJson('frontend-leaders.json'),loadJson('campaign-start-positions.json'),loadJson('immortal-empires-factions.json'),loadJson('cultural-relations.json'),loadJson('cai-diplomacy-factors.json'),loadJson('turn1-faction-relations.json'),loadJson('diplomatic-restrictions.json'),loadJson('turn1-cai-strategic-model.json'),loadJson('multiplayer-team-rules.json')]).then(([relationsResult,leadersResult,positionsResult,factionsResult,cultureResult,caiResult,turnOneResult,restrictionsResult,strategicResult,teamRulesResult])=>{if(relationsResult.status==='fulfilled')relations=relationsResult.value.relations||[];if(leadersResult.status==='fulfilled'&&positionsResult.status==='fulfilled')applyLeaderMetadata(leadersResult.value,positionsResult.value);else console.error('Métadonnées de factions/positions incomplètes',leadersResult,positionsResult);if(factionsResult.status==='fulfilled')activeFactions=factionsResult.value;if(cultureResult.status==='fulfilled')culturalData=cultureResult.value;if(caiResult.status==='fulfilled')caiData=caiResult.value;if(turnOneResult.status==='fulfilled')turnOneRelations=turnOneResult.value.relations||[];if(restrictionsResult.status==='fulfilled')restrictionData=restrictionsResult.value;if(strategicResult.status==='fulfilled')strategicData=strategicResult.value;if(teamRulesResult.status==='fulfilled')teamRulesData=teamRulesResult.value;metadataLoading=false;setFooter();render()});
