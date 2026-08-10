import React, { useState } from 'react';
import { request } from 'sats-connect';
import WorldNav from './WorldNav';
import './World.css';

const QUESTS = [
  { id:'signal', name:'Signal check', detail:'Connect an Xverse wallet on Bitcoin Mainnet.', reward:40 },
  { id:'forest', name:'Forest scout', detail:'Discover a Nooki hiding in the trait canopy.', reward:25, link:'/forest' },
  { id:'gallery', name:'Gallery drift', detail:'Find a Nooki with a trait you love.', reward:25, link:'/gallery' },
];

export default function Playground() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('The playground is read-only. Connecting never moves your assets.');
  const [points, setPoints] = useState(0);
  const [opened, setOpened] = useState(false);

  const connectWallet = async () => {
    setStatus('connecting'); setMessage('Waiting for Xverse approval…');
    try {
      const response = await request('wallet_connect', { addresses:['ordinals','payment'], message:'Enter the Nooki Playground', network:'Mainnet' });
      if (response.status === 'error') throw new Error(response.error?.message || 'Connection declined');
      const addresses = Array.isArray(response.result) ? response.result : response.result?.addresses || [];
      const ordinal = addresses.find((item) => item.purpose === 'ordinals') || addresses[0];
      setWallet(ordinal?.address || 'Connected'); setStatus('connected'); setPoints((value) => value + (value === 0 ? 40 : 0)); setMessage('Signal locked. Welcome to the playground.');
    } catch (error) { setStatus('error'); setMessage(error.message || 'Could not connect. Install or unlock Xverse and try again.'); }
  };
  const openCapsule = () => {
    if (opened) return;
    const rewards = ['Golden Leaf', 'Puni Bell', 'Pixel Acorn', '80 signal points'];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setOpened(true); setPoints((value) => value + 20); setMessage(`Capsule opened: ${reward}. +20 signal points.`);
  };

  return <main className="world-page playground-page">
    <WorldNav />
    <header className="play-hero shell"><div><div className="eyebrow"><i /> WALLET-GATED, ASSET-SAFE FUN</div><h1>The Nooki<br /><span>Playground.</span></h1><p>Connect, complete tiny missions, and collect imaginary forest loot. No transaction or signature is requested.</p></div><div className="wallet-console"><small>XVERSE SIGNAL</small><div className={`console-light ${status}`} /><h2>{wallet ? `${wallet.slice(0,8)}…${wallet.slice(-6)}` : 'No wallet detected'}</h2><p>{message}</p><button onClick={connectWallet} disabled={status === 'connecting'}>{status === 'connecting' ? 'Connecting…' : wallet ? 'Reconnect Xverse' : 'Connect Xverse wallet'} <span>↗</span></button><a href="https://www.xverse.app/download" target="_blank" rel="noreferrer">Get Xverse</a></div></header>
    <section className="quest-board shell"><div className="quest-title"><div><small>PLAYGROUND / QUEST LOG</small><h2>Daily signals</h2></div><strong>{points}<span>PTS</span></strong></div>{QUESTS.map((quest, index) => <article key={quest.id}><span>0{index + 1}</span><div><h3>{quest.name}</h3><p>{quest.detail}</p></div><b>+{quest.reward}</b>{quest.link ? <a href={quest.link}>Enter →</a> : <em className={wallet ? 'done' : ''}>{wallet ? 'Complete' : 'Locked'}</em>}</article>)}</section>
    <section className="capsule shell"><div className="capsule-orb">?</div><div><small>ONE OPEN PER VISIT</small><h2>Mystery signal capsule</h2><p>Contains no token, monetary value, or financial promise. Just Nooki-flavored internet fun.</p></div><button disabled={!wallet || opened} onClick={openCapsule}>{!wallet ? 'Connect to unlock' : opened ? 'Capsule opened' : 'Crack it open'}</button></section>
  </main>;
}
