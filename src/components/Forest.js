import React, { useMemo, useState } from 'react';
import WorldNav from './WorldNav';
import useNookis from './useNookis';
import './World.css';

const renderUrl = (id) => `https://render.ord.net/v6/snapshots/${id}/512.webp`;
const CATEGORIES = ['Background', 'Body color', 'Body', 'Head', 'Face', 'Eyes'];

export default function Forest() {
  const { nookis, loading } = useNookis();
  const [category, setCategory] = useState('Head');
  const [trait, setTrait] = useState('All');
  const [discovered, setDiscovered] = useState(null);
  const traits = useMemo(() => ['All', ...new Set(nookis.flatMap((nooki) => nooki.meta.attributes.filter((item) => item.trait_type === category).map((item) => item.value)))], [nookis, category]);
  const population = useMemo(() => trait === 'All' ? nookis : nookis.filter((nooki) => nooki.meta.attributes.some((item) => item.trait_type === category && item.value === trait)), [nookis, category, trait]);
  const discover = () => { if (population.length) setDiscovered(population[Math.floor(Math.random() * population.length)]); };

  return <main className="world-page forest-page">
    <WorldNav />
    <header className="forest-hero shell">
      <div><div className="eyebrow"><i /> AN INTERACTIVE TRAIT BIOME</div><h1>Nooki<br />Forest.</h1><p>Every trait is a habitat. Choose a layer, tune the signal, and discover who is hiding in the canopy.</p></div>
      <div className="forest-specimen">{discovered ? <><img src={renderUrl(discovered.id)} alt={discovered.meta.name} /><span>{discovered.meta.name}</span></> : <><img src="/assets/memes/nookis.png" alt="Nooki forest guide" /><span>THE FOREST GUIDE</span></>}</div>
    </header>
    <section className="trait-lab shell">
      <div className="lab-heading"><div><small>01 / CHOOSE A LAYER</small><h2>Trait canopy</h2></div><strong>{population.length.toLocaleString()} <span>creatures in range</span></strong></div>
      <div className="category-tabs">{CATEGORIES.map((item) => <button className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setTrait('All'); }} key={item}>{item}</button>)}</div>
      <div className="trait-cloud">{traits.map((item) => <button className={trait === item ? 'active' : ''} onClick={() => setTrait(item)} key={item}>{item}<small>{item === 'All' ? nookis.length : nookis.filter((nooki) => nooki.meta.attributes.some((entry) => entry.trait_type === category && entry.value === item)).length}</small></button>)}</div>
      <button className="discover-button" disabled={loading || !population.length} onClick={discover}>Discover a random Nooki <span>✦</span></button>
    </section>
    <section className="forest-features shell"><article><span>✦</span><h3>Trait telescope</h3><p>Explore six layers and dozens of on-chain attributes.</p></article><article><span>↻</span><h3>Random encounters</h3><p>Let the forest choose a creature from your selected biome.</p></article><article><span>◉</span><h3>Inscription portal</h3><p>Jump from any discovery to its permanent Bitcoin record.</p></article></section>
    {discovered && <a className="forest-portal" href={`https://ordinals.com/inscription/${discovered.id}`} target="_blank" rel="noreferrer">Inspect {discovered.meta.name} on Bitcoin ↗</a>}
  </main>;
}
