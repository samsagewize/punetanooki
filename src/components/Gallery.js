import React, { useMemo, useState } from 'react';
import WorldNav from './WorldNav';
import useNookis from './useNookis';
import './World.css';

const renderUrl = (id) => `https://render.ord.net/v6/snapshots/${id}/512.webp`;

export default function Gallery() {
  const { nookis, loading } = useNookis();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return nookis;
    return nookis.filter((nooki) => nooki.meta.name.toLowerCase().includes(term) || nooki.meta.attributes.some((trait) => `${trait.trait_type} ${trait.value}`.toLowerCase().includes(term)));
  }, [nookis, query]);
  const visible = matches.slice(page * 18, page * 18 + 18);

  return <main className="world-page gallery-page">
    <WorldNav />
    <header className="world-hero shell">
      <div className="eyebrow"><i /> 2,900+ BITCOIN CREATURES</div>
      <h1>The Nooki<br /><span>signal wall.</span></h1>
      <p>Search by number, color, clothes, face, eyes, or whatever strange signal calls to you.</p>
    </header>
    <section className="gallery-controls shell">
      <label><span>SEARCH THE COLLECTION</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Try ‘Laser Eyes’ or ‘Top Hat’" /></label>
      <div><strong>{matches.length.toLocaleString()}</strong><small>NOOKIS FOUND</small></div>
    </section>
    <section className="nooki-grid shell">
      {loading && <p className="world-loading">Growing the gallery…</p>}
      {visible.map((nooki, index) => <button className={`nooki-tile tile-${index % 6}`} key={nooki.id} onClick={() => setSelected(nooki)}>
        <img src={renderUrl(nooki.id)} alt={nooki.meta.name} loading="lazy" />
        <span><b>{nooki.meta.name}</b><small>{nooki.meta.attributes[3]?.value || 'Wild trait'}</small></span>
      </button>)}
    </section>
    {!loading && <div className="gallery-pages shell"><button disabled={page === 0} onClick={() => setPage((value) => value - 1)}>← Previous signal</button><span>{page + 1} / {Math.max(1, Math.ceil(matches.length / 18))}</span><button disabled={(page + 1) * 18 >= matches.length} onClick={() => setPage((value) => value + 1)}>Next signal →</button></div>}
    {selected && <div className="nooki-drawer" role="dialog" aria-modal="true" aria-label={`${selected.meta.name} traits`}><button className="drawer-close" onClick={() => setSelected(null)}>×</button><img src={renderUrl(selected.id)} alt={selected.meta.name} /><div><div className="eyebrow dark"><i /> INSCRIBED ON BITCOIN</div><h2>{selected.meta.name}</h2><div className="trait-list">{selected.meta.attributes.map((trait) => <p key={trait.trait_type}><small>{trait.trait_type}</small><strong>{trait.value}</strong></p>)}</div><a href={`https://ordinals.com/inscription/${selected.id}`} target="_blank" rel="noreferrer">View inscription ↗</a></div></div>}
  </main>;
}
