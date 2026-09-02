const groups={
  "Empire":[["karl","Karl Franz","Reikland"],["gelt","Balthasar Gelt","The Golden Order"],["volkmar","Volkmar the Grim","Cult of Sigmar"],["markus","Markus Wulfhart","The Huntsmarshal's Expedition"],["elspeth","Elspeth von Draken","Wissenland & Nuln"]],
  "Nains":[["thorgrim","Thorgrim Grudgebearer","Karaz-a-Karak"],["grombrindal","Grombrindal","The Ancestral Throng"],["ungrim","Ungrim Ironfist","Karak Kadrin"],["belegar","Belegar Ironhammer","Clan Angrund"],["thorek","Thorek Ironbrow","Ironbrow's Expedition"],["malakai","Malakai Makaisson","Malakai's Expedition"]],
  "Hauts Elfes":[["tyrion","Tyrion","Eataine"],["teclis","Teclis","Order of Loremasters"],["alarielle","Alarielle the Radiant","Avelorn"],["alith","Alith Anar","Nagarythe"],["eltharion","Eltharion the Grim","Yvresse"],["imrik","Imrik","Knights of Caledor"],["aislinn","Sea Lord Aislinn","The Sea Patrol"]],
  "Elfes Noirs":[["malekith","Malekith","Naggarond"],["morathi","Morathi","Cult of Pleasure"],["hellebron","Crone Hellebron","Har Ganeth"],["lokhir","Lokhir Fellheart","The Blessed Dread"],["malus","Malus Darkblade","Hag Graef"],["rakarth","Rakarth","The Thousand Maws"]],
  "Hommes-lézards":[["mazdamundi","Lord Mazdamundi","Hexoatl"],["kroq","Kroq-Gar","Last Defenders"],["tehenhauin","Tehenhauin","Cult of Sotek"],["tiktaqto","Tiktaq'to","Tlaqua"],["gorrok","Gor-Rok","Itza"],["nakai","Nakai the Wanderer","Spirit of the Jungle"],["oxyotl","Oxyotl","Ghosts of Pahuax"]],
  "Skavens":[["queek","Queek Headtaker","Clan Mors"],["skrolk","Lord Skrolk","Clan Pestilens"],["tretch","Tretch Craventail","Clan Rictus"],["ikit","Ikit Claw","Clan Skryre"],["snikch","Deathmaster Snikch","Clan Eshin"],["throt","Throt the Unclean","Clan Moulder"]],
  "Côte Vampire":[["luthor","Luthor Harkon","The Awakened"],["noctilus","Count Noctilus","The Dreadfleet"],["aranessa","Aranessa Saltspite","Pirates of Sartosa"],["cylostra","Cylostra Direfin","The Drowned"]],
  "Comtes Vampires":[["mannfred","Mannfred von Carstein","The Drakenhof Conclave"],["vlad","Vlad von Carstein","Sylvania"],["isabella","Isabella von Carstein","Sylvania"],["kemmler","Heinrich Kemmler","The Barrow Legion"],["ghorst","Helman Ghorst","Caravan of Blue Roses"]],
  "Rois des Tombes":[["settra","Settra the Imperishable","Khemri"],["arkhan","Arkhan the Black","Followers of Nagash"],["khalida","High Queen Khalida","Court of Lybaras"],["khatep","Grand Hierophant Khatep","Exiles of Nehek"]],
  "Peaux-Vertes":[["grimgor","Grimgor Ironhide","Grimgor's 'Ardboyz"],["azhag","Azhag the Slaughterer","Bonerattlaz"],["skarsnik","Skarsnik","Crooked Moon"],["wurrzag","Wurrzag","The Bloody Handz"],["grom","Grom the Paunch","Broken Axe"],["gorbad","Gorbad Ironclaw","Da Great Green Horde"]],
  "Bretonnie":[["louen","Louen Leoncoeur","Couronne"],["fay","The Fay Enchantress","Carcassonne"],["alberic","Alberic de Bordeleaux","Bordeleaux Errant"],["repanse","Repanse de Lyonesse","Chevaliers de Lyonesse"]],
  "Elfes Sylvains":[["orion","Orion","Talsyn"],["durthu","Durthu","Argwylon"],["sisters","Sisters of Twilight","Heralds of Ariel"],["drycha","Drycha","Wargrove of Woe"]],
  "Hommes-bêtes":[["khazrak","Khazrak the One-Eye","Warherd of the One-Eye"],["malagor","Malagor the Dark Omen","Harbinger of Disaster"],["morghur","Morghur the Shadowgrave","Warherd of the Shadowgrave"],["taurox","Taurox the Brass Bull","Slaughterhorn Tribe"]],
  "Norsca":[["wulfrik","Wulfrik the Wanderer","World Walkers"],["throgg","Throgg","Wintertooth"],["sayl","Sayl the Faithless","Dolgan"]],
  "Kislev":[["katarin","Tzarina Katarin","The Ice Court"],["kostaltyn","Kostaltyn","The Great Orthodoxy"],["boris","Boris Ursus","Ursun Revivalists"],["ostankya","Mother Ostankya","Daughters of the Forest"]],
  "Grand Cathay":[["miao","Miao Ying","The Northern Provinces"],["zhao","Zhao Ming","The Western Provinces"],["yuan","Yuan Bo","Jade Court"],["bhashiva","Bhashiva, the White Tiger","Claws of the White Tiger"]],
  "Khorne":[["skarbrand","Skarbrand the Exiled","Exiles of Khorne"],["skulltaker","Skulltaker","Blooded Wanderers"],["arbaal","Arbaal the Undefeated","Destroyers of Khorne"]],
  "Nurgle":[["kugath","Ku'gath Plaguefather","Poxmakers of Nurgle"],["tamurkhan","Tamurkhan the Maggot Lord","The Maggot Host"],["epidemius","Epidemius","Tallymen of Pestilence"]],
  "Tzeentch":[["kairos","Kairos Fateweaver","Oracles of Tzeentch"],["changeling","The Changeling","The Deceivers"]],
  "Slaanesh":[["nkari","N'Kari","Seducers of Slaanesh"],["dechala","Dechala the Denied One","The Tormentors"],["masque","The Masque of Slaanesh","The Accursed Troupe"]],
  "Ogres":[["greasus","Greasus Goldtooth","Goldtooth"],["skrag","Skrag the Slaughterer","Disciples of the Maw"],["golgfag","Golgfag Maneater","Golgfag's Maneaters"]],
  "Nains du Chaos":[["astragoth","Astragoth Ironhand","Disciples of Hashut"],["drazhoath","Drazhoath the Ashen","The Legion of Azgorh"],["zhatan","Zhatan the Black","The Warhost of Zharr"]],
  "Guerriers du Chaos":[["archaon","Archaon the Everchosen","Warhost of the Apocalypse"],["kholek","Kholek Suneater","Heralds of the Tempest"],["sigvald","Sigvald the Magnificent","The Decadent Host"],["belakor","Be'lakor","Shadow Legion"],["azazel","Azazel","The Ecstatic Legions"],["festus","Festus the Leechlord","The Fecundites"],["vilitch","Vilitch the Curseling","Puppets of Misrule"],["valkia","Valkia the Bloody","Legion of the Gorequeen"]],
  "Démons du Chaos":[["daemon","Prince Démon","Legion of Chaos"]]
};

const factionKeys={imrik:'wh2_dlc15_hef_imrik',karl:'wh_main_emp_empire',malus:'wh2_main_def_hag_graef',kugath:'wh3_main_nur_poxmakers_of_nurgle'};
const positions={imrik:[573.586609,330.326599],karl:[355.687042,487.026276],malus:[393.503754,719.28479],kugath:[668.102417,288.452148]};
const lords=Object.entries(groups).flatMap(([race,a])=>a.map(([id,name,faction])=>({id,name,faction,race,key:factionKeys[id]})));
const roster=document.querySelector('#roster'),selected=document.querySelector('#selected'),matrix=document.querySelector('#matrix'),map=document.querySelector('#map'),mapViewport=document.querySelector('#mapViewport'),mapStatus=document.querySelector('#mapStatus'),search=document.querySelector('#search');
let relations=[],zoom=1,offset={x:0,y:0},drag=null;

const chosen=()=>[...document.querySelectorAll('#roster input:checked')].map(x=>x.value);
function renderRoster(){
  const q=search.value.toLowerCase(),old=chosen();roster.innerHTML='';
  Object.entries(groups).forEach(([race,all])=>{
    const list=all.filter(x=>(race+' '+x[1]+' '+x[2]).toLowerCase().includes(q));if(!list.length)return;
    const section=document.createElement('section');section.className='race';
    section.innerHTML=`<h3>${race} <small>(${list.length})</small></h3><div class="lords">${list.map(([id,n,f])=>`<label class="lord"><input type="checkbox" value="${id}" ${old.includes(id)?'checked':''}><span><strong>${n}</strong><small>${f}</small></span></label>`).join('')}</div>`;
    roster.append(section);
  });
}
function rel(a,b){return relations.find(r=>r.sourceFaction===a&&r.targetFaction===b)}
function applyMapTransform(){map.style.transform=`translate(${offset.x}px,${offset.y}px) scale(${zoom})`}
function renderMap(ids){
  map.innerHTML='';let missing=0;
  ids.forEach(id=>{
    if(!positions[id]){missing++;return}
    const l=lords.find(x=>x.id===id),[x,y]=positions[id],m=document.createElement('div');m.className='marker';
    const left=8+(x-250)/500*84;
    const top=8+(780-y)/580*84;
    m.style.left=`${Math.max(3,Math.min(97,left))}%`;m.style.top=`${Math.max(3,Math.min(97,top))}%`;
    m.innerHTML=`<span class="marker-dot"></span><span class="marker-label"><b>${l.name}</b><small>${l.faction}</small></span>`;map.append(m);
  });
  mapStatus.textContent=missing?`${missing} position(s) sélectionnée(s) restent à extraire. Aucun emplacement approximatif n'est affiché.`:'Toutes les positions sélectionnées sont issues de coordonnées WH3 vérifiées.';
  applyMapTransform();
}
function render(){
  const ids=chosen(),a=ids.map(id=>lords.find(l=>l.id===id));
  selected.textContent=`${ids.length} dirigeant${ids.length>1?'s':''} sélectionné${ids.length>1?'s':''} sur 4 · ${lords.length} jouables dans le roster`;
  renderMap(ids);
  if(ids.length<2){matrix.innerHTML='<p class="pending">Sélectionne au moins deux dirigeants.</p>';return}
  matrix.innerHTML='<table><tr><th>De / vers</th>'+a.map(l=>`<th>${l.name}</th>`).join('')+'</tr>'+a.map(x=>`<tr><th>${x.name}</th>`+a.map(y=>{if(x.id===y.id)return'<td>—</td>';const r=x.key&&y.key?rel(x.key,y.key):null;return r?`<td class="${r.atWar?'bad':''}">${r.atWar?'En guerre':r.treaties.length?'Traité':'Relation explicite'}</td>`:'<td class="pending">Non extraite</td>'}).join('')+'</tr>').join('')+'</table>';
}
roster.addEventListener('change',e=>{if(chosen().length>4)e.target.checked=false;render()});
search.oninput=()=>{renderRoster();render()};
plus.onclick=()=>{zoom=Math.min(3,zoom+.25);applyMapTransform()};
minus.onclick=()=>{zoom=Math.max(1,zoom-.25);if(zoom===1)offset={x:0,y:0};applyMapTransform()};
reset.onclick=()=>{zoom=1;offset={x:0,y:0};applyMapTransform()};
mapViewport.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};mapViewport.classList.add('dragging');mapViewport.setPointerCapture(e.pointerId)});
mapViewport.addEventListener('pointermove',e=>{if(!drag)return;offset={x:drag.ox+e.clientX-drag.x,y:drag.oy+e.clientY-drag.y};applyMapTransform()});
mapViewport.addEventListener('pointerup',()=>{drag=null;mapViewport.classList.remove('dragging')});
mapViewport.addEventListener('pointercancel',()=>{drag=null;mapViewport.classList.remove('dragging')});
renderRoster();['imrik','karl'].forEach(id=>{const e=document.querySelector(`input[value="${id}"]`);if(e)e.checked=true});
fetch('./data/generated/immortal-empires-startpos.json').then(r=>r.json()).then(d=>{relations=d.relations;document.querySelector('footer').textContent=`Roster ${lords.length} seigneurs · Dataset ${d.gameVersion} · ${d.relations.length} relations explicites · attitudes en cours de résolution`;render()}).catch(render);render();
