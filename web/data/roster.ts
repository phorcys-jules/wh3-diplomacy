export type RosterLord = { id: string; name: string; faction: string; race: string; crest: string };

// Roster Immortal Empires jouable au 2026-09-02. Les libellés visibles utilisent la localisation française du jeu.
const groups: Record<string, [string,string,string][]> = {
  "L'Empire": [["karl","Empereur Karl Franz","Reikland"],["gelt","Balthasar Gelt","L'Ordre Doré"],["volkmar","Volkmar le Sévère","Culte de Sigmar"],["markus","Markus Wulfhart","L'Expédition du jagdsmarshall"],["elspeth","Elspeth von Draken","Wissenland et Nuln"]],
  "Nains": [["thorgrim","Thorgrim le Rancunier","Karaz-a-Karak"],["grombrindal","Grombrindal","Le Throng ancestral"],["ungrim","Ungrim Poing de Fer","Karak Kadrin"],["belegar","Belegar Marteau-de-fer","Clan Angrund"],["thorek","Thorek Tête en Fer","Expédition de Tête-en-fer"],["malakai","Malakai Makaisson","Maîtres de l'Innovation"]],
  "Hauts Elfes": [["tyrion","Tyrion","Eataine"],["teclis","Teclis","Ordre des maîtres du savoir"],["alarielle","Alarielle la Radieuse","Avelorn"],["alith","Alith Anar","Nagarythe"],["eltharion","Eltharion le Sinistre","Yvresse"],["imrik","Imrik","Chevaliers de Caledor"],["aislinn","Seigneur des Mers Aislinn","Patrouille Maritime des Hauts Elfes"]],
  "Elfes Noirs": [["malekith","Malékith","Naggarond"],["morathi","Morathi","Culte du Plaisir"],["hellebron","Hellebron l'Ancienne","Har Ganeth"],["lokhir","Lokhir Cœur de Pierre","L'Effroi Béni"],["malus","Malus Darkblade","Hag Graef"],["rakarth","Rakarth","Les Mille Gueules"]],
  "Hommes-lézards": [["mazdamundi","Seigneur Mazdamundi","Hexoatl"],["kroq","Kroq-Gar","Ultimes Défenseurs"],["tehenhauin","Tehenhauin","Culte de Sotek"],["tiktaqto","Tiktaq'to","Tlaqua"],["gorrok","Gor-Rok","Itza"],["nakai","Nakai le Vagabond","Esprit de la jungle"],["oxyotl","Oxyotl","Fantômes de Pahuax"]],
  "Skavens": [["queek","Queek Coupe-Têtes","Clan Mors"],["skrolk","Seigneur Skrolk","Clan Pestilens"],["tretch","Tretch la-Queue-qui-Frétille","Clan Rictus"],["ikit","Ikit la Griffe","Clan Skryre"],["snikch","Maître Assassin Snikch","Clan Eshin"],["throt","Throt le Galeux","Clan Moulder"]],
  "Côte Vampire": [["luthor","Luthor Harkon","L'Éveillé"],["noctilus","Comte Noctilus","La Flotte de Terreur"],["aranessa","Aranessa Saumâtre","Pirates de Sartosa"],["cylostra","Cylostra Mauvaileron","Les Noyés"]],
  "Comtes Vampires": [["mannfred","Mannfred von Carstein","Le Conclave de Drakenhof"],["vlad","Vlad von Carstein","Sylvanie"],["isabella","Isabella von Carstein","Sylvanie"],["kemmler","Heinrich Kemmler","La Légion du Tertre"],["ghorst","Helman Ghorst","Caravane des Roses bleues"]],
  "Rois des Tombes": [["settra","Settra l'Impérissable","Khemri"],["arkhan","Arkhan le Noir","Fidèles de Nagash"],["khalida","Haute Reine Khalida","Cour de Lybaras"],["khatep","Khatep le Haut Hiérophante","Exilés de Nehek"]],
  "Peaux-Vertes": [["grimgor","Grimgor Boît'en Fer","Les Durs à Kuir' de Grimgor"],["azhag","Azhag le Massacreur","Zagiteurs d'Os"],["skarsnik","Skarsnik","La Lune Crochue"],["wurrzag","Wurrzag","Les Mains sanglantes"],["grom","Grom la Panse","Haches brisées"],["gorbad","Gorbad Griff' Eud' Fer","Orques de Griff' Eud' Fer"]],
  "Bretonnie": [["louen","Roy Louen Cœur de Lion","Couronne"],["fay","Fée Enchanteresse","Gasconnie"],["alberic","Albéric de Bordeleaux","Errants de Bordeleaux"],["repanse","Jeanne de Lyonesse","Chevaliers de Lyonesse"]],
  "Elfes Sylvains": [["orion","Orion","Talsyn"],["durthu","Durthu","Argwylon"],["sisters","Sœurs du Crépuscule","Hérauts d'Ariel"],["drycha","Drycha","Bosquet de guerre du Malheur"]],
  "Hommes-bêtes": [["khazrak","Khazrak le Borgne","Harde de Khazrak le Borgne"],["malagor","Malagor Mauvais-Présage","Émissaire du Désastre"],["morghur","Morghur l'Enfant de l'Ombre","Harde guerrière de l'Enfant de l'Ombre"],["taurox","Taurox le Taureau d'Airain","Tribu de Cornegouge"]],
  "Norsca": [["wulfrik","Wulfrik le Vagabond","Marche-mondes"],["throgg","Throgg","Croc de l'Hiver"],["sayl","Sayl le Perfide","Dolgans"]],
  "Kislev": [["katarin","Tsarine Katarina","La Cour de Givre"],["kostaltyn","Kostaltyn","La Grande Orthodoxie"],["boris","Boris Ursus","Revivalistes d'Ursun"],["ostankya","Mère Ostankya","Filles de la Forêt"]],
  "Grand Cathay": [["miao","Miao Ying","Provinces du Nord"],["zhao","Zhao Ming","Provinces de l'Ouest"],["yuan","Yuan Bo, le Dragon de Jade","La Cour de Jade"],["bhashiva","Bhashiva, le Tigre Blanc","Griffes du Tigre Blanc"]],
  "Khorne": [["skarbrand","Skarbrand l'Exilé","Exilés de Khorne"],["skulltaker","Preneur de Crânes","Vagabonds rouges"],["arbaal","Arbaal l'Invaincu","Prétendants de Khorne"]],
  "Nurgle": [["kugath","Ku'gath, Père des Épidémies","Véroleurs de Nurgle"],["tamurkhan","Tamurkhan le Seigneur des Vers","L'Ost des Vers"],["epidemius","Epidemius","Intendants de la Pestilence"]],
  "Tzeentch": [["kairos","Kairos Tisseur de Destins","Oracles de Tzeentch"],["changeling","Le Changelin","Les Trompeurs"]],
  "Slaanesh": [["nkari","N'Kari","Séducteurs de Slaanesh"],["dechala","Déchala la Répudiée","Les Tourmenteurs"],["masque","Le Masque de Slaanesh","La Troupe Maudite"]],
  "Royaumes Ogres": [["greasus","Graissus Dent d'Or","Dent d'Or"],["skrag","Skrag le Désosseur","Disciples de La Gueule"],["golgfag","Golgfag Mangeur d'Hommes","Les Mangeurs d'Hommes"]],
  "Nains du Chaos": [["astragoth","Astragoth Main-de-Fer","Disciples d'Hashut"],["drazhoath","Drazhoath le Cendreux","La Légion d'Azgorh"],["zhatan","Zhatan le Noir","L'Ost de guerre de Zharr"]],
  "Guerriers du Chaos": [["archaon","Archaon, Seigneur de la Fin des Temps","Ost de guerre de l'Apocalypse"],["kholek","Kholek Dévore-le-Soleil","Hérauts des Tempêtes"],["sigvald","Prince Sigvald le Magnifique","L'Ost Décadent"],["belakor","Be'lakor","Légion des Ombres"],["azazel","Azazel","Les Légions Extatiques"],["festus","Docteur Festus","Les Fécondés"],["vilitch","Vilitch le Maudit","Marionnettes de l'Anarchie"],["valkia","Valkia la Sanglante","Légion de la Reine du Carnage"]],
  "Démons du Chaos": [["daemon","Prince Démon","Légion du Chaos"]]
};

const crest: Record<string,string> = {"L'Empire":"♜","Nains":"⛰","Hauts Elfes":"✦","Elfes Noirs":"☾","Hommes-lézards":"◆","Skavens":"♞","Côte Vampire":"☠","Comtes Vampires":"♱","Rois des Tombes":"☥","Peaux-Vertes":"✹","Bretonnie":"⚜","Elfes Sylvains":"❧","Hommes-bêtes":"♈","Norsca":"ᛉ","Kislev":"❄","Grand Cathay":"龍","Khorne":"⚔","Nurgle":"☣","Tzeentch":"◉","Slaanesh":"♢","Royaumes Ogres":"●","Nains du Chaos":"♨","Guerriers du Chaos":"✠","Démons du Chaos":"◈"};

export const rosterVersion = "WH3 Update 8.0 · 2026-09-02 · localisation FR";
export const roster: RosterLord[] = Object.entries(groups).flatMap(([race,lords]) => lords.map(([id,name,faction]) => ({id,name,faction,race,crest:crest[race] ?? "◆"})));
export const rosterByRace = Object.entries(groups).map(([race]) => ({ race, lords: roster.filter(l => l.race === race) }));
