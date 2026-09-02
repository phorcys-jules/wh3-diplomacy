export type RosterLord = { id: string; name: string; faction: string; race: string; crest: string };

// Current playable Immortal Empires roster before the announced 24 Sep 2026 End Times release.
// Update 7.0 introduced the 104th Legendary Lord (The Masque); Bhashiva then became #105 in Update 8.0.
const groups: Record<string, [string,string,string][]> = {
  "Empire": [["karl","Karl Franz","Reikland"],["gelt","Balthasar Gelt","The Golden Order"],["volkmar","Volkmar the Grim","Cult of Sigmar"],["markus","Markus Wulfhart","The Huntsmarshal's Expedition"],["elspeth","Elspeth von Draken","Wissenland & Nuln"]],
  "Nains": [["thorgrim","Thorgrim Grudgebearer","Karaz-a-Karak"],["grombrindal","Grombrindal","The Ancestral Throng"],["ungrim","Ungrim Ironfist","Karak Kadrin"],["belegar","Belegar Ironhammer","Clan Angrund"],["thorek","Thorek Ironbrow","Ironbrow's Expedition"],["malakai","Malakai Makaisson","Malakai's Expedition"]],
  "Hauts Elfes": [["tyrion","Tyrion","Eataine"],["teclis","Teclis","Order of Loremasters"],["alarielle","Alarielle the Radiant","Avelorn"],["alith","Alith Anar","Nagarythe"],["eltharion","Eltharion the Grim","Yvresse"],["imrik","Imrik","Knights of Caledor"],["aislinn","Sea Lord Aislinn","The Sea Patrol"]],
  "Elfes Noirs": [["malekith","Malekith","Naggarond"],["morathi","Morathi","Cult of Pleasure"],["hellebron","Crone Hellebron","Har Ganeth"],["lokhir","Lokhir Fellheart","The Blessed Dread"],["malus","Malus Darkblade","Hag Graef"],["rakarth","Rakarth","The Thousand Maws"]],
  "Hommes-lézards": [["mazdamundi","Lord Mazdamundi","Hexoatl"],["kroq","Kroq-Gar","Last Defenders"],["tehenhauin","Tehenhauin","Cult of Sotek"],["tiktaqto","Tiktaq'to","Tlaqua"],["gorrok","Gor-Rok","Itza"],["nakai","Nakai the Wanderer","Spirit of the Jungle"],["oxyotl","Oxyotl","Ghosts of Pahuax"]],
  "Skavens": [["queek","Queek Headtaker","Clan Mors"],["skrolk","Lord Skrolk","Clan Pestilens"],["tretch","Tretch Craventail","Clan Rictus"],["ikit","Ikit Claw","Clan Skryre"],["snikch","Deathmaster Snikch","Clan Eshin"],["throt","Throt the Unclean","Clan Moulder"]],
  "Côte Vampire": [["luthor","Luthor Harkon","The Awakened"],["noctilus","Count Noctilus","The Dreadfleet"],["aranessa","Aranessa Saltspite","Pirates of Sartosa"],["cylostra","Cylostra Direfin","The Drowned"]],
  "Comtes Vampires": [["mannfred","Mannfred von Carstein","The Drakenhof Conclave"],["vlad","Vlad von Carstein","Sylvania"],["isabella","Isabella von Carstein","Sylvania"],["kemmler","Heinrich Kemmler","The Barrow Legion"],["ghorst","Helman Ghorst","Caravan of Blue Roses"]],
  "Rois des Tombes": [["settra","Settra the Imperishable","Khemri"],["arkhan","Arkhan the Black","Followers of Nagash"],["khalida","High Queen Khalida","Court of Lybaras"],["khatep","Grand Hierophant Khatep","Exiles of Nehek"]],
  "Peaux-Vertes": [["grimgor","Grimgor Ironhide","Grimgor's 'Ardboyz"],["azhag","Azhag the Slaughterer","Bonerattlaz"],["skarsnik","Skarsnik","Crooked Moon"],["wurrzag","Wurrzag","The Bloody Handz"],["grom","Grom the Paunch","Broken Axe"],["gorbad","Gorbad Ironclaw","Da Great Green Horde"]],
  "Bretonnie": [["louen","Louen Leoncoeur","Couronne"],["fay","The Fay Enchantress","Carcassonne"],["alberic","Alberic de Bordeleaux","Bordeleaux Errant"],["repanse","Repanse de Lyonesse","Chevaliers de Lyonesse"]],
  "Elfes Sylvains": [["orion","Orion","Talsyn"],["durthu","Durthu","Argwylon"],["sisters","Sisters of Twilight","Heralds of Ariel"],["drycha","Drycha","Wargrove of Woe"]],
  "Hommes-bêtes": [["khazrak","Khazrak the One-Eye","Warherd of the One-Eye"],["malagor","Malagor the Dark Omen","Harbinger of Disaster"],["morghur","Morghur the Shadowgrave","Warherd of the Shadowgrave"],["taurox","Taurox the Brass Bull","Slaughterhorn Tribe"]],
  "Norsca": [["wulfrik","Wulfrik the Wanderer","World Walkers"],["throgg","Throgg","Wintertooth"],["sayl","Sayl the Faithless","Dolgan"]],
  "Kislev": [["katarin","Tzarina Katarin","The Ice Court"],["kostaltyn","Kostaltyn","The Great Orthodoxy"],["boris","Boris Ursus","Ursun Revivalists"],["ostankya","Mother Ostankya","Daughters of the Forest"]],
  "Grand Cathay": [["miao","Miao Ying","The Northern Provinces"],["zhao","Zhao Ming","The Western Provinces"],["yuan","Yuan Bo","Jade Court"],["bhashiva","Bhashiva, the White Tiger","Claws of the White Tiger"]],
  "Khorne": [["skarbrand","Skarbrand the Exiled","Exiles of Khorne"],["skulltaker","Skulltaker","Blooded Wanderers"],["arbaal","Arbaal the Undefeated","Destroyers of Khorne"]],
  "Nurgle": [["kugath","Ku'gath Plaguefather","Poxmakers of Nurgle"],["tamurkhan","Tamurkhan the Maggot Lord","The Maggot Host"],["epidemius","Epidemius","Tallymen of Pestilence"]],
  "Tzeentch": [["kairos","Kairos Fateweaver","Oracles of Tzeentch"],["changeling","The Changeling","The Deceivers"]],
  "Slaanesh": [["nkari","N'Kari","Seducers of Slaanesh"],["dechala","Dechala the Denied One","The Tormentors"],["masque","The Masque of Slaanesh","The Accursed Troupe"]],
  "Ogres": [["greasus","Greasus Goldtooth","Goldtooth"],["skrag","Skrag the Slaughterer","Disciples of the Maw"],["golgfag","Golgfag Maneater","Golgfag's Maneaters"]],
  "Nains du Chaos": [["astragoth","Astragoth Ironhand","Disciples of Hashut"],["drazhoath","Drazhoath the Ashen","The Legion of Azgorh"],["zhatan","Zhatan the Black","The Warhost of Zharr"]],
  "Guerriers du Chaos": [["archaon","Archaon the Everchosen","Warhost of the Apocalypse"],["kholek","Kholek Suneater","Heralds of the Tempest"],["sigvald","Sigvald the Magnificent","The Decadent Host"],["belakor","Be'lakor","Shadow Legion"],["azazel","Azazel","The Ecstatic Legions"],["festus","Festus the Leechlord","The Fecundites"],["vilitch","Vilitch the Curseling","Puppets of Misrule"],["valkia","Valkia the Bloody","Legion of the Gorequeen"]],
  "Démons du Chaos": [["daemon","Prince Démon","Legion of Chaos"]]
};

const crest: Record<string,string> = {"Empire":"♜","Nains":"⛰","Hauts Elfes":"✦","Elfes Noirs":"☾","Hommes-lézards":"◆","Skavens":"♞","Côte Vampire":"☠","Comtes Vampires":"♱","Rois des Tombes":"☥","Peaux-Vertes":"✹","Bretonnie":"⚜","Elfes Sylvains":"❧","Hommes-bêtes":"♈","Norsca":"ᛉ","Kislev":"❄","Grand Cathay":"龍","Khorne":"⚔","Nurgle":"☣","Tzeentch":"◉","Slaanesh":"♢","Ogres":"●","Nains du Chaos":"♨","Guerriers du Chaos":"✠","Démons du Chaos":"◈"};

export const rosterVersion = "WH3 Update 8.0 · 2026-09-02";
export const roster: RosterLord[] = Object.entries(groups).flatMap(([race,lords]) => lords.map(([id,name,faction]) => ({id,name,faction,race,crest:crest[race] ?? "◆"})));
export const rosterByRace = Object.entries(groups).map(([race]) => ({ race, lords: roster.filter(l => l.race === race) }));
