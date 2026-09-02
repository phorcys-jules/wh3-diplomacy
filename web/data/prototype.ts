export type Lord = {
  id: string;
  name: string;
  faction: string;
  race: string;
  crest: string;
};
export type Modifier = { label: string; value: number };
export type Relation = {
  from: string;
  to: string;
  modifiers: Modifier[];
  status: "Favorable" | "Neutre" | "Hostile";
};
const lords: Lord[] = [
  {
    id: "imrik",
    name: "Imrik",
    faction: "Knights of Caledor",
    race: "Haut Elfe",
    crest: "✦",
  },
  {
    id: "karl",
    name: "Karl Franz",
    faction: "Reikland",
    race: "Empire",
    crest: "♜",
  },
  {
    id: "malus",
    name: "Malus Darkblade",
    faction: "Hag Graef",
    race: "Elfe Noir",
    crest: "☾",
  },
  {
    id: "kugath",
    name: "Ku'gath Plaguefather",
    faction: "Poxmakers of Nurgle",
    race: "Nurgle",
    crest: "☣",
  },
  {
    id: "tyrion",
    name: "Tyrion",
    faction: "Eataine",
    race: "Haut Elfe",
    crest: "☀",
  },
  {
    id: "thorgrim",
    name: "Thorgrim Grudgebearer",
    faction: "Dwarfs",
    race: "Nain",
    crest: "⛰",
  },
];
const raw = [
  [
    "imrik",
    "karl",
    "Favorable",
    [
      ["Affinité des races", 20],
      ["Confiance lointaine", 5],
    ],
  ],
  ["karl", "imrik", "Favorable", [["Affinité des races", 20]]],
  [
    "imrik",
    "malus",
    "Hostile",
    [
      ["Aversion elfes noirs", -40],
      ["Rivalité historique", -10],
    ],
  ],
  ["malus", "imrik", "Hostile", [["Aversion haut elfes", -45]]],
  ["imrik", "kugath", "Hostile", [["Aversion Chaos", -60]]],
  ["kugath", "imrik", "Hostile", [["Opposition à l’Ordre", -55]]],
  ["karl", "malus", "Hostile", [["Aversion elfes noirs", -30]]],
  ["malus", "karl", "Hostile", [["Mépris de l’Empire", -35]]],
  ["karl", "kugath", "Hostile", [["Aversion Chaos", -60]]],
  ["kugath", "karl", "Hostile", [["Opposition à l’Ordre", -60]]],
  ["malus", "kugath", "Neutre", [["Intérêts divergents", -5]]],
  ["kugath", "malus", "Neutre", [["Indifférence", 0]]],
] as [string, string, Relation["status"], [string, number][]][];
export const dataset = {
  gameVersion: "Immortal Empires · fixture prototype",
  verification: "unverified" as const,
  lords,
  relations: raw.map(([from, to, status, modifiers]) => ({
    from,
    to,
    status,
    modifiers: modifiers.map(([label, value]) => ({ label, value })),
  })),
};
