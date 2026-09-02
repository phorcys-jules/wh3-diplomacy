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

const factionKeys={imrik:'wh2_dlc15_hef_imrik',karl:'wh_main_emp_empire',malus:'wh2_main_def_hag_graef',kugath:'wh3_main_nur_poxmakers_of_nurgle'};
const positions={imrik:[573.586609,330.326599],karl:[355.687042,487.026276],malus:[393.503754,719.28479],kugath:[668.102417,288.452148]};
const lords=Object.entries(groups).flatMap(([race,a])=>a.map(([id,name,faction])=>({id,name,faction,race,key:factionKeys[id]})));
const roster=document.querySelector('#roster'),selected=document.querySelector('#selected'),matrix=document.querySelector('#matrix'),map=document.querySelector('#map'),mapViewport=document.querySelector('#mapViewport'),mapStatus=document.querySelector('#mapStatus'),search=document.querySelector('#search'),raceFilter=document.querySelector('#raceFilter');
let relations=[],zoom=1,offset={x:0,y:0},drag=null;
const selectedIds=new Set(['imrik','karl']);
const chosen=()=>[...selectedIds];

function initRaceFilter(){
  raceFilter.innerHTML=Object.keys(groups).map(r=>`<option value="${r}">${r}</option>`).join('');
  raceFilter.value=Object.keys(groups)[0];
}
function renderRoster(){
  const q=search.value.trim().toLowerCase(),race=raceFilter.value,all=groups[race]||[];
  const list=all.filter(x=>(race+' '+x[1]+' '+x[2]).toLowerCase().includes(q));
  roster.innerHTML=`<section class="race"><h3>${race} <small>(${list.length}/${all.length})</small></h3><div class="lords">${list.map(([id,n,f])=>`<label class="lord"><input type="checkbox" value="${id}" ${selectedIds.has(id)?'checked':''}><span><strong>${n}</strong><small>${f}</small></span></label>`).join('')}</div>${list.length?'':'<p class="pending">Aucun seigneur ne correspond à la recherche.</p>'}</section>`;
}
function rel(a,b){return relations.find(r=>r.sourceFaction===a&&r.targetFaction===b)}
function applyMapTransform(){map.style.transform=`translate(${offset.x}px,${offset.y}px) scale(${zoom})`}
function renderMap(ids){
  map.innerHTML='';let missing=0;
  ids.forEach(id=>{
    if(!positions[id]){missing++;return}
    const l=lords.find(x=>x.id===id),[x,y]=positions[id],m=document.createElement('div');m.className='marker';
    const left=8+(x-250)/500*84,top=8+(780-y)/580*84;
    m.style.left=`${Math.max(3,Math.min(97,left))}%`;m.style.top=`${Math.max(3,Math.min(97,top))}%`;
    m.innerHTML=`<span class="marker-dot"></span><span class="marker-label"><b>${l.name}</b><small>${l.faction}</small></span>`;map.append(m);
  });
  mapStatus.textContent=missing?`${missing} position(s) sélectionnée(s) restent à extraire. Aucun emplacement approximatif n'est affiché.`:'Toutes les positions sélectionnées sont issues de coordonnées WH3 vérifiées.';
  applyMapTransform();
}
function renderSelected(ids){
  const items=ids.map(id=>lords.find(l=>l.id===id)).filter(Boolean);
  selected.innerHTML=`<p>${items.length} dirigeant${items.length>1?'s':''} sélectionné${items.length>1?'s':''} · aucune limite fixe</p><div class="selected-lords">${items.map(l=>`<span class="selected-chip"><b>${l.name}</b><small>${l.race}</small><button type="button" data-remove="${l.id}" title="Retirer ${l.name}">×</button></span>`).join('')}</div>`;
}
function render(){
  const ids=chosen(),a=ids.map(id=>lords.find(l=>l.id===id)).filter(Boolean);
  renderSelected(ids);renderMap(ids);
  if(ids.length<2){matrix.innerHTML='<p class="pending">Sélectionne au moins deux dirigeants.</p>';return}
  matrix.innerHTML='<table><tr><th>De / vers</th>'+a.map(l=>`<th>${l.name}</th>`).join('')+'</tr>'+a.map(x=>`<tr><th>${x.name}</th>`+a.map(y=>{if(x.id===y.id)return'<td>—</td>';const r=x.key&&y.key?rel(x.key,y.key):null;return r?`<td class="${r.atWar?'bad':''}">${r.atWar?'En guerre':r.treaties.length?'Traité':'Relation explicite'}</td>`:'<td class="pending">Non extraite</td>'}).join('')+'</tr>').join('')+'</table>';
}
roster.addEventListener('change',e=>{if(!e.target.matches('input[type="checkbox"]'))return;e.target.checked?selectedIds.add(e.target.value):selectedIds.delete(e.target.value);render()});
selected.addEventListener('click',e=>{const button=e.target.closest('[data-remove]');if(!button)return;selectedIds.delete(button.dataset.remove);renderRoster();render()});
raceFilter.onchange=()=>{search.value='';renderRoster()};
search.oninput=renderRoster;
plus.onclick=()=>{zoom=Math.min(3,zoom+.25);applyMapTransform()};
minus.onclick=()=>{zoom=Math.max(1,zoom-.25);if(zoom===1)offset={x:0,y:0};applyMapTransform()};
reset.onclick=()=>{zoom=1;offset={x:0,y:0};applyMapTransform()};
mapViewport.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};mapViewport.classList.add('dragging');mapViewport.setPointerCapture(e.pointerId)});
mapViewport.addEventListener('pointermove',e=>{if(!drag)return;offset={x:drag.ox+e.clientX-drag.x,y:drag.oy+e.clientY-drag.y};applyMapTransform()});
mapViewport.addEventListener('pointerup',()=>{drag=null;mapViewport.classList.remove('dragging')});
mapViewport.addEventListener('pointercancel',()=>{drag=null;mapViewport.classList.remove('dragging')});
initRaceFilter();renderRoster();
fetch('./data/generated/immortal-empires-startpos.json').then(r=>r.json()).then(d=>{relations=d.relations;document.querySelector('footer').textContent=`Roster ${lords.length} seigneurs · Dataset ${d.gameVersion} · ${d.relations.length} relations explicites · attitudes en cours de résolution`;render()}).catch(render);render();
