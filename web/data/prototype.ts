import { roster } from "./roster";
export type Lord = { id:string; name:string; faction:string; race:string; crest:string };
export type Modifier = { label:string; value:number };
export type Relation = { from:string; to:string; modifiers:Modifier[]; status:"Favorable"|"Neutre"|"Hostile" };

// The selectable roster is independent from diplomacy extraction. Relations remain empty
// until #1/#5 can prove their values from current WH3 data; the UI must never fabricate them.
export const dataset = {
  gameVersion: "Immortal Empires · roster 2026",
  verification: "partial" as const,
  lords: roster satisfies Lord[],
  relations: [] as Relation[],
};
