import React, { useMemo, useState } from 'react';
import WorldNav from './WorldNav';
import useNookis from './useNookis';
import './World.css';

const renderUrl = (id) => `https://render.ord.net/v6/snapshots/${id}/512.webp`;

export default function Gallery() {
  const { nookis, loading } = useNookis();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return nookis;
    return nookis.filter((nooki) => nooki.meta.name.toLowerCase().includes(term) || nooki.meta.attributes.some((trait) => `${trait.trait_type} ${trait.value}`.toLowerCase().includes(term)));
  }, [nookis, query]);
  return <main className="world-page gallery-page">
    <WorldNav />
    <header className="world-hero gallery-hero shell">
      <div><div className="eyebrow"><i /> EVERY NOOKI · INSCRIBED ON BITCOIN</div>
      <h1>The on-chain<br /><span>Nooki wall.</span></h1></div>
      <p>2,914 permanent creatures. Every tile below is an actual Ordinooki inscription—not a generated placeholder.</p>
    </header>
    <section className="gallery-controls shell">
      <label><span>SEARCH THE ON-CHAIN COLLECTION</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Number, Laser Eyes, Top Hat…" /></label>
      <div><strong>{matches.length.toLocaleString()}</strong><small>INSCRIPTIONS SIGNALING</small></div>
    </section>
    <section className="nooki-grid nooki-mosaic" aria-label="All on-chain Ordinookis">
      {loading && <p className="world-loading">Growing the gallery…</p>}
      {matches.map((nooki) => <button className="nooki-tile" key={nooki.id} onClick={() => setSelected(nooki)} title={`${nooki.meta.name} · View on-chain traits`}>
        <img src={renderUrl(nooki.id)} alt={nooki.meta.name} loading="lazy" decoding="async" />
        <span><b>{nooki.meta.name}</b><small>ON-CHAIN ↗</small></span>
      </button>)}
    </section>
    {!loading && <footer className="mosaic-footer shell"><span>◉ END OF SIGNAL</span><strong>{nookis.length.toLocaleString()} ORDINOOKIS · FOREVER ON BITCOIN</strong></footer>}
    {selected && <div className="nooki-drawer" role="dialog" aria-modal="true" aria-label={`${selected.meta.name} traits`}><button className="drawer-close" onClick={() => setSelected(null)}>×</button><img src={renderUrl(selected.id)} alt={selected.meta.name} /><div><div className="eyebrow dark"><i /> INSCRIBED ON BITCOIN</div><h2>{selected.meta.name}</h2><div className="trait-list">{selected.meta.attributes.map((trait) => <p key={trait.trait_type}><small>{trait.trait_type}</small><strong>{trait.value}</strong></p>)}</div><a href={`https://ordinals.com/inscription/${selected.id}`} target="_blank" rel="noreferrer">View inscription ↗</a></div></div>}
  </main>;
}
