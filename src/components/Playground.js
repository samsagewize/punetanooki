import React from 'react';
import WorldNav from './WorldNav';
import './World.css';

const QUESTS = [
  { name:'Signal check', detail:'Connect your Xverse wallet on Bitcoin Mainnet.', reward:40 },
  { name:'Forest scout', detail:'Discover a Nooki hiding in the trait canopy.', reward:25 },
  { name:'Gallery drift', detail:'Find a Nooki with a trait you love.', reward:25 },
];

export default function Playground() {
  return <main className="world-page playground-page">
    <WorldNav />
    <header className="play-hero shell">
      <div><div className="eyebrow"><i /> CURRENTLY GROWING</div><div className="coming-pill">COMING SOON</div><h1>The Nooki<br /><span>Playground.</span></h1><p>A wallet-connected world of tiny missions, forest loot, and community signals is being built behind the trees.</p></div>
      <div className="wallet-console coming-console"><small>XVERSE SIGNAL / PREVIEW</small><div className="console-light connecting" /><h2>Wallet portal warming up</h2><p>Xverse connection will open when the Playground officially launches. No wallet action is available yet.</p><button disabled>Connect wallet · coming soon <span>⌛</span></button><a href="https://www.xverse.app/download" target="_blank" rel="noreferrer">Get Xverse while you wait ↗</a></div>
    </header>
    <section className="quest-board shell"><div className="quest-title"><div><small>PLAYGROUND / SNEAK PEEK</small><h2>Future signals</h2></div><strong>SOON</strong></div>{QUESTS.map((quest, index) => <article key={quest.name}><span>0{index + 1}</span><div><h3>{quest.name}</h3><p>{quest.detail}</p></div><b>+{quest.reward}</b><em>Preview</em></article>)}</section>
    <section className="capsule shell"><div className="capsule-orb">?</div><div><small>SEALED UNTIL LAUNCH</small><h2>Mystery signal capsule</h2><p>The first capsule will unlock when the Nooki Playground goes live.</p></div><button disabled>Coming soon</button></section>
  </main>;
}
