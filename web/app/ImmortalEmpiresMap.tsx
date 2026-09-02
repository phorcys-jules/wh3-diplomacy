"use client";

import { useMemo, useState } from "react";

type MapLord = { id:string; name:string; faction:string; crest:string };
type Position = { x:number; y:number; source:string };

// Coordinates are normalized from verified cam_gameplay_start points. Unknown lords are
// deliberately omitted rather than placed approximately. The importer will expand this map.
const positions: Record<string, Position> = {
  karl: { x:46.5, y:45.5, source:"WH3 cam_gameplay_start" },
  imrik: { x:57.5, y:62.5, source:"WH3 cam_gameplay_start" },
  malus: { x:55.0, y:20.0, source:"WH3 cam_gameplay_start" },
  kugath: { x:72.5, y:61.0, source:"WH3 cam_gameplay_start" },
};

export default function ImmortalEmpiresMap({ lords }:{ lords:MapLord[] }) {
  const [zoom,setZoom]=useState(1);
  const [offset,setOffset]=useState({x:0,y:0});
  const [drag,setDrag]=useState<{x:number;y:number;ox:number;oy:number}|null>(null);
  const markers=useMemo(()=>lords.flatMap(l=>positions[l.id]?[{lord:l,pos:positions[l.id]}]:[]),[lords]);
  return <section className="campaign-map-section">
    <header className="section-head"><div><p className="eyebrow">05 · Carte</p><h2>Positions de départ</h2></div><p className="matrix-help">Immortal Empires · sélection actuelle</p></header>
    <div className="campaign-map-toolbar"><button onClick={()=>setZoom(z=>Math.max(1,z-.25))}>−</button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(z=>Math.min(3,z+.25))}>+</button><button onClick={()=>{setZoom(1);setOffset({x:0,y:0})}}>Recentrer</button></div>
    <div className="campaign-map-viewport" onPointerDown={e=>setDrag({x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y})} onPointerMove={e=>{if(drag)setOffset({x:drag.ox+e.clientX-drag.x,y:drag.oy+e.clientY-drag.y})}} onPointerUp={()=>setDrag(null)} onPointerLeave={()=>setDrag(null)}>
      <div className="campaign-map" style={{transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`}}>
        <div className="map-land land-west"/><div className="map-land land-center"/><div className="map-land land-east"/><div className="map-land land-south"/>
        <span className="map-label old-world">Vieux Monde</span><span className="map-label ulthuan">Ulthuan</span><span className="map-label cathay">Grand Cathay</span><span className="map-label southlands">Terres du Sud</span>
        {markers.map(({lord,pos})=><button className="map-marker" key={lord.id} style={{left:`${pos.x}%`,top:`${pos.y}%`}} title={`${lord.name} — ${lord.faction}\n${pos.source}`}><span>{lord.crest}</span><b>{lord.name}</b><small>{lord.faction}</small></button>)}
      </div>
    </div>
    {markers.length<lords.length&&<p className="map-warning">{lords.length-markers.length} position(s) encore absente(s) de l'extraction. Aucun marqueur approximatif n'est affiché.</p>}
    <p className="map-source">Fond cartographique web original inspiré de la géographie d'Immortal Empires ; aucun asset graphique du jeu n'est redistribué. Les marqueurs utilisent uniquement des coordonnées extraites et vérifiées.</p>
  </section>;
}
