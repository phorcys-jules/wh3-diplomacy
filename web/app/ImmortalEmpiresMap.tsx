"use client";

import { useMemo, useState } from "react";

type MapLord = { id:string; name:string; faction:string; crest:string };
type Position = { x:number; y:number; source:string };

const project = (x:number,y:number): Pick<Position,"x"|"y"> => ({
  x: 8 + ((x - 250) / 500) * 84,
  // WH3 campaign Y increases northward while CSS top increases downward.
  y: 8 + ((780 - y) / 580) * 84,
});
const verified = (x:number,y:number): Position => ({...project(x,y),source:"WH3 cam_gameplay_start"});

// Unknown lords are deliberately omitted rather than placed approximately.
const positions: Record<string, Position> = {
  karl: verified(355.687042,487.026276),
  imrik: verified(573.586609,330.326599),
  malus: verified(393.503754,719.28479),
  kugath: verified(668.102417,288.452148),
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
        {markers.map(({lord,pos})=><button className="map-marker" key={lord.id} style={{left:`${pos.x}%`,top:`${pos.y}%`}} title={`${lord.name} — ${lord.faction}\n${pos.source}`}><span>{lord.crest}</span><b>{lord.name}</b><small>{lord.faction}</small></button>)}
      </div>
    </div>
    {markers.length<lords.length&&<p className="map-warning">{lords.length-markers.length} position(s) encore absente(s) de l'extraction. Aucun marqueur approximatif n'est affiché.</p>}
    <p className="map-source">Fond : image Immortal Empires fournie au projet et hébergée localement. Les marqueurs utilisent uniquement des coordonnées <code>cam_gameplay_start</code> extraites et vérifiées.</p>
  </section>;
}
