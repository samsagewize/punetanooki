import React, { useCallback, useEffect, useState } from 'react';
import { request } from 'sats-connect';
import WorldNav from './WorldNav';
import PixelAvatar from './PixelAvatar';
import './World.css';

const DEMO_NOOKI = '72714c504539a8699bce10b02c831a434a25a3fb79b9ab3b99456cef94103d50i0';
const contentUrl = (id) => `https://ordinals.com/content/${id}`;
const TREES = [
  [7,12],[18,72],[29,26],[43,8],[55,66],[67,20],[81,73],[91,32],[9,48],[37,78],[73,47],[94,84],
];

export default function Playground() {
  const [position, setPosition] = useState({ x:48, y:58 });
  const [wallet, setWallet] = useState('');
  const [inscriptions, setInscriptions] = useState([]);
  const [selectedId, setSelectedId] = useState(DEMO_NOOKI);
  const [status, setStatus] = useState('Demo Nooki loaded. Connect Xverse to use one from your wallet.');
  const [connecting, setConnecting] = useState(false);
  const [steps, setSteps] = useState(0);

  const move = useCallback((dx, dy) => {
    setPosition((current) => ({ x:Math.max(3, Math.min(92, current.x + dx)), y:Math.max(8, Math.min(82, current.y + dy)) }));
    setSteps((value) => value + 1);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const directions = { ArrowUp:[0,-3], w:[0,-3], W:[0,-3], ArrowDown:[0,3], s:[0,3], S:[0,3], ArrowLeft:[-3,0], a:[-3,0], A:[-3,0], ArrowRight:[3,0], d:[3,0], D:[3,0] };
      if (!directions[event.key]) return;
      event.preventDefault();
      move(...directions[event.key]);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  const connectWallet = async () => {
    setConnecting(true); setStatus('Waiting for Xverse…');
    try {
      const connected = await request('wallet_connect', { addresses:['ordinals'], message:'Choose an Ordinoooki for the pixel forest', network:'Mainnet' });
      if (connected.status === 'error') throw new Error(connected.error?.message || 'Connection declined');
      const addresses = connected.result?.addresses || connected.result || [];
      const ordinalAddress = addresses.find((item) => item.purpose === 'ordinals')?.address;
      setWallet(ordinalAddress || 'Connected');
      const owned = await request('ord_getInscriptions', { limit:100, offset:0 });
      if (owned.status === 'error') throw new Error(owned.error?.message || 'Could not read inscriptions');
      const all = owned.result?.inscriptions || owned.result?.items || [];
      const nookis = all.filter((item) => /ordinooki/i.test(item.collectionName || '') || item.parentInscriptionId === '00e0de1f95169a475e088ebdcdb934d7aba263b578e14027b7db2a3c5637c844i0');
      const playable = nookis.length ? nookis : all.filter((item) => String(item.contentType || '').includes('image'));
      setInscriptions(playable);
      if (playable[0]?.inscriptionId) setSelectedId(playable[0].inscriptionId);
      setStatus(playable.length ? `${playable.length} playable inscription${playable.length === 1 ? '' : 's'} found.` : 'No image inscriptions found, so the demo Nooki is staying with you.');
    } catch (error) {
      setStatus(error.message || 'Could not connect to Xverse.');
    } finally { setConnecting(false); }
  };

  return <main className="world-page playground-page">
    <WorldNav />
    <header className="pixel-play-header shell"><div><div className="eyebrow"><i /> PLAYGROUND BETA</div><h1>Roam the<br /><span>pixel forest.</span></h1><p>Turn an Ordinoooki from your Xverse wallet into a forest explorer. Movement stays in your browser—nothing is signed, sent, or changed on-chain.</p></div><div className="play-wallet"><small>PLAYER SIGNAL</small><strong>{wallet ? `${wallet.slice(0,8)}…${wallet.slice(-6)}` : 'DEMO MODE'}</strong><p>{status}</p><button onClick={connectWallet} disabled={connecting}>{connecting ? 'Connecting…' : 'Connect Xverse + load Nookis'} <span>↗</span></button></div></header>

    <section className="pixel-game-shell shell">
      <div className="game-toolbar"><div><span className="live-dot" /> FOREST ONLINE</div><p>WASD / ARROW KEYS TO MOVE</p><strong>{steps} STEPS</strong></div>
      <div className="pixel-forest" tabIndex="0" aria-label="Playable pixel forest">
        <div className="pixel-sky"><i /><i /><i /></div><div className="pixel-mountains" /><div className="pixel-ground" />
        {TREES.map(([x,y], index) => <div className={`pixel-tree tree-${index % 3}`} style={{ left:`${x}%`, top:`${y}%` }} key={`${x}-${y}`}><b /><span /></div>)}
        <div className="pixel-pond"><i /><i /><i /></div><div className="forest-sign">NOOKI<br />FOREST</div>
        <div className={`player-sprite step-${steps % 2}`} style={{ left:`${position.x}%`, top:`${position.y}%` }}><PixelAvatar src={contentUrl(selectedId)} /></div>
      </div>
      <div className="touch-controls" aria-label="Movement controls"><span /><button onClick={() => move(0,-3)}>▲</button><span /><button onClick={() => move(-3,0)}>◀</button><button onClick={() => move(0,3)}>▼</button><button onClick={() => move(3,0)}>▶</button></div>
    </section>

    {inscriptions.length > 0 && <section className="character-picker shell"><div><small>YOUR WALLET CREW</small><h2>Choose your explorer</h2></div><div>{inscriptions.map((item) => <button className={selectedId === item.inscriptionId ? 'active' : ''} onClick={() => setSelectedId(item.inscriptionId)} key={item.inscriptionId}><img src={contentUrl(item.inscriptionId)} alt={`Wallet inscription ${item.inscriptionNumber || ''}`} /><span>#{item.inscriptionNumber || item.inscriptionId.slice(0,6)}</span></button>)}</div></section>}
  </main>;
}
