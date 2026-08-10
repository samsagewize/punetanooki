import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Gallery from './components/Gallery';
import Forest from './components/Forest';
import Playground from './components/Playground';
import ThemeToggle from './components/ThemeToggle';

const WALLET = 'bc1pvje9z6zmrjelcnkcuw0yggh0p9zphjtxchatjwgzvnwll8c6q40qpp5yqg';
const BITCOIN_TREASURY = '3CvY72gQVJ8qS2jVmSbSSzTJBnWqCVPcK3';
const MEMPOOL_API = 'https://mempool.space/api';
const PARENT_INSCRIPTION = '00e0de1f95169a475e088ebdcdb934d7aba263b578e14027b7db2a3c5637c844i0';
const ORDINAL_FALLBACK = [
  ['038d4fe6c395b6d6951ac19a4653dba2e9c9d5685185d96877f190f9bb273b81i0','image/png'],
  ['0c6a46e4548fd285a13dc589e78f6d993cf89249bed054bcb3990a244da18716i0','image/png'],
  ['21c0afd7285ee488164f8c6d3077b9c748c1d77e216f06ee9b79f7f059013aa9i0','image/png'],
  ['483ff31234a2da893333e602eefbcd3ab74f8ca159ff627003c2fc966b8db17ai0','text/plain'],
  ['2319501f7de02faf03f9e29a29ece478c72feaa7fda011943b0aab6726a8e51di0','image/png'],
  ['5f13643c44dc93b80a6ef5fae1036b7aaf8e3ed54688dce6fc1c7fefe155e837i0','image/png'],
  ['4aedb33242fe58ea0982c59096ecceb936117aa28e1ad323eec47ab575ad9554i0','image/png'],
].map(([id, contentType]) => ({ id, contentType }));
const GIFS = [1, 4, 7, 10, 13, 16, 19, 21, 23].map((number) => `/assets/memes/${number}.gif`);

const short = (value, start = 8, end = 7) => `${value.slice(0, start)}…${value.slice(-end)}`;
const satsToBtc = (sats) => (sats / 100000000).toFixed(8);

function Home() {
  const [wallet, setWallet] = useState(null);
  const [bitcoinTreasury, setBitcoinTreasury] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ordinals, setOrdinals] = useState(ORDINAL_FALLBACK);
  const [status, setStatus] = useState('loading');
  const [copied, setCopied] = useState(false);

  const refreshTreasury = async () => {
    setStatus('loading');
    try {
      const [walletResponse, bitcoinResponse, utxoResponse, txResponse] = await Promise.all([
        fetch(`${MEMPOOL_API}/address/${WALLET}`),
        fetch(`${MEMPOOL_API}/address/${BITCOIN_TREASURY}`),
        fetch(`${MEMPOOL_API}/address/${WALLET}/utxo`),
        fetch(`${MEMPOOL_API}/address/${WALLET}/txs`),
      ]);
      if (!walletResponse.ok || !bitcoinResponse.ok || !utxoResponse.ok || !txResponse.ok) throw new Error('Radar unavailable');
      const [walletData, bitcoinData, utxoData, txData] = await Promise.all([
        walletResponse.json(), bitcoinResponse.json(), utxoResponse.json(), txResponse.json(),
      ]);
      setWallet(walletData);
      setBitcoinTreasury(bitcoinData);
      setUtxos(utxoData);
      setTransactions(txData.slice(0, 4));
      setStatus('live');
      fetch('/api/treasury-ordinals').then((response) => response.ok ? response.json() : null).then((data) => {
        if (data?.items?.length) setOrdinals(data.items);
      }).catch(() => {});
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => { refreshTreasury(); }, []);

  const balance = useMemo(() => {
    if (!wallet) return 0;
    const confirmed = wallet.chain_stats.funded_txo_sum - wallet.chain_stats.spent_txo_sum;
    const pending = wallet.mempool_stats.funded_txo_sum - wallet.mempool_stats.spent_txo_sum;
    return confirmed + pending;
  }, [wallet]);

  const bitcoinBalance = useMemo(() => {
    if (!bitcoinTreasury) return 0;
    const confirmed = bitcoinTreasury.chain_stats.funded_txo_sum - bitcoinTreasury.chain_stats.spent_txo_sum;
    const pending = bitcoinTreasury.mempool_stats.funded_txo_sum - bitcoinTreasury.mempool_stats.spent_txo_sum;
    return confirmed + pending;
  }, [bitcoinTreasury]);

  const copyAddress = async (address, key) => {
    await navigator.clipboard.writeText(address);
    setCopied(key);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const transactionValue = (tx) => {
    const received = tx.vout.reduce((sum, output) => output.scriptpubkey_address === WALLET ? sum + output.value : sum, 0);
    const sent = tx.vin.reduce((sum, input) => input.prevout?.scriptpubkey_address === WALLET ? sum + input.prevout.value : sum, 0);
    return received - sent;
  };

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="Ordinoooki home">
          <span className="brand-mark"><img src="/ordinooki-icon.png" alt="" /></span><span>ORDIN<span className="lime">OO</span>KI</span>
        </a>
        <div className="nav-links">
          <a href="#radar">Treasury</a><Link to="/gallery">Gallery</Link><Link to="/forest">Forest</Link><Link to="/playground">Playground · soon</Link>
          <a className="x-nav-button" href="https://x.com/Ordinooki" target="_blank" rel="noreferrer">𝕏 Follow</a><ThemeToggle />
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><i /> CULTURE, INSCRIBED FOREVER</div>
        <h1>Small creature.<br /><span>Big signal.</span></h1>
        <p className="hero-copy">Ordinoooki lives on Bitcoin. The memes stay weird, the treasury stays transparent, and every sat can be verified.</p>
        <div className="hero-actions">
          <a className="primary" href="#radar">Open treasury radar <b>↓</b></a>
          <a className="text-link" href="#marketplaces">Find an Ordinooki →</a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <img src="/assets/memes/nookis.png" alt="" />
          <span className="signal signal-a">SAT 01</span><span className="signal signal-b">BLOCK 840K+</span>
        </div>
        <div className="ticker"><span>NOOKI IS WATCHING THE CHAIN</span><span>•</span><span>100% PUBLIC TREASURY</span><span>•</span><span>BITCOIN NATIVE</span></div>
      </section>

      <section className="radar-section" id="radar">
        <div className="shell">
          <div className="section-heading">
            <div><div className="eyebrow dark"><i /> LIVE ON-CHAIN DATA</div><h2>Nooki treasury radar</h2></div>
            <button className={`status ${status}`} onClick={refreshTreasury}><i /> {status === 'live' ? 'Live · refresh' : status === 'loading' ? 'Scanning chain…' : 'Retry scan'}</button>
          </div>

          <div className="wallet-bars">
            <div className="wallet-bar">
              <div><small>ORDINALS VAULT</small><strong>{short(WALLET, 12, 10)}</strong></div>
              <span><a href={`https://ordinals.com/address/${WALLET}`} target="_blank" rel="noreferrer">View ↗</a><button onClick={() => copyAddress(WALLET, 'ordinals')}>{copied === 'ordinals' ? 'Copied!' : 'Copy'}</button></span>
            </div>
            <div className="wallet-bar">
              <div><small>BITCOIN TREASURY</small><strong>{short(BITCOIN_TREASURY, 12, 10)}</strong></div>
              <span><a href={`https://mempool.space/address/${BITCOIN_TREASURY}`} target="_blank" rel="noreferrer">View ↗</a><button onClick={() => copyAddress(BITCOIN_TREASURY, 'bitcoin')}>{copied === 'bitcoin' ? 'Copied!' : 'Copy'}</button></span>
            </div>
          </div>

          {status === 'error' ? <div className="error-card">The radar lost signal. The wallet is safe—check it directly on the explorer or try again.</div> : <>
            <div className="stats-grid">
              <article className="balance-card"><small>COMBINED COMMUNITY TREASURY</small><strong>{status === 'loading' ? '—' : (balance + bitcoinBalance).toLocaleString()} <em>sats</em></strong><span>{status === 'loading' ? 'Scanning…' : `₿ ${satsToBtc(balance + bitcoinBalance)}`}</span><div className="pulse-line" /></article>
              <article><small>BITCOIN TREASURY</small><strong>{status === 'loading' ? '—' : bitcoinBalance.toLocaleString()}</strong><span>sats · {bitcoinTreasury?.chain_stats.tx_count || 0} transactions</span></article>
              <article><small>ORDINALS VAULT BTC</small><strong>{status === 'loading' ? '—' : balance.toLocaleString()}</strong><span>sats · {utxos.length} protected outputs</span></article>
              <article><small>TREASURE ORDINALS</small><strong>{ordinals.length}</strong><span>Artifacts held on Bitcoin</span></article>
            </div>

            <div className="treasure-ordinals">
              <div className="ordinal-title"><div><small>COMMUNITY TREASURE / ORDINALS</small><h3>Artifacts in the Nooki vault</h3></div><p>These inscriptions and the sats carrying them are held at the public treasury address. Verify every artifact on Bitcoin.</p></div>
              <div className="ordinal-reel">{ordinals.map((item, index) => <a href={`https://ordinals.com/inscription/${item.id}`} target="_blank" rel="noreferrer" key={item.id}>
                {item.contentType.startsWith('image/') ? <img src={`https://ordinals.com/content/${item.id}`} alt={`Nooki treasury ordinal ${index + 1}`} loading="lazy" /> : <div className="text-ordinal">TXT<span>ON-CHAIN</span></div>}
                <span><b>TREASURE #{String(index + 1).padStart(2,'0')}</b><small>{short(item.id)}</small></span>
              </a>)}</div>
              <div className="treasure-note"><span>₿</span><p><strong>Bitcoin is the vault.</strong> Ordinals are digital artifacts inscribed onto individual satoshis. The radar shows both the spendable sat balance and the inscriptions currently held by the same public treasury address.</p><a href={`https://ordinals.com/address/${WALLET}`} target="_blank" rel="noreferrer">Verify all treasure ↗</a></div>
            </div>

            <div className="activity-grid">
              <div className="activity-list">
                <div className="list-head"><h3>Recent signals</h3><span>Newest first</span></div>
                {status === 'loading' && <div className="skeleton">Listening for blocks…</div>}
                {transactions.map((tx) => {
                  const value = transactionValue(tx);
                  return <a className="tx" href={`https://mempool.space/tx/${tx.txid}`} target="_blank" rel="noreferrer" key={tx.txid}>
                    <span className={value >= 0 ? 'tx-icon incoming' : 'tx-icon'}>{value >= 0 ? '↓' : '↑'}</span>
                    <span><strong>{value >= 0 ? 'Received' : 'Sent'}</strong><small>{short(tx.txid)} · {tx.status.confirmed ? `Block ${tx.status.block_height}` : 'Pending'}</small></span>
                    <b className={value >= 0 ? 'positive' : ''}>{value >= 0 ? '+' : '−'}{Math.abs(value).toLocaleString()} sats</b>
                  </a>;
                })}
              </div>
              <aside className="verify-card"><span className="radar-rings"><i /></span><small>DON'T TRUST. VERIFY.</small><h3>Every treasury move is public.</h3><p>Inspect the address, UTXOs, fees and confirmations straight from the Bitcoin network.</p><a href={`https://mempool.space/address/${WALLET}`} target="_blank" rel="noreferrer">View full wallet ↗</a></aside>
            </div>
          </>}
        </div>
      </section>

      <section className="marketplaces" id="marketplaces">
        <div className="shell market-grid">
          <div className="market-intro">
            <div className="eyebrow"><i /> OFFICIAL COLLECTION LINKS</div>
            <h2>Find your<br />Ordinoooki.</h2>
            <p>Browse the collection and current listings through these Bitcoin Ordinals marketplaces.</p>
          </div>
          <div className="market-links">
            <a href="https://ord.net/collection/ordinooki" target="_blank" rel="noreferrer">
              <span className="market-number">01</span>
              <span><small>EXPLORE ON</small><strong>ord.net</strong></span>
              <b>↗</b>
            </a>
            <a href="https://www.satflow.com/ordinals/ordinookis" target="_blank" rel="noreferrer">
              <span className="market-number">02</span>
              <span><small>EXPLORE ON</small><strong>Satflow</strong></span>
              <b>↗</b>
            </a>
          </div>
        </div>
      </section>

      <section className="parent-section shell">
        <div className="parent-art"><img src={`https://render.ord.net/v6/snapshots/${PARENT_INSCRIPTION}/512.webp`} alt="Ordinoooki parent gallery inscription" /><span>INSCRIPTION #122453251</span></div>
        <div className="parent-copy"><div className="eyebrow"><i /> COLLECTION PROVENANCE</div><h2>The parent<br />signal.</h2><p>This verified gallery inscription is the on-chain source connecting the Ordinoooki collection. One permanent artifact pointing the way to thousands of Nookis.</p><code>{short(PARENT_INSCRIPTION, 12, 10)}</code><div><a href={`https://ordinals.com/inscription/${PARENT_INSCRIPTION}`} target="_blank" rel="noreferrer">View inscription ↗</a><Link to="/gallery">Open signal gallery →</Link></div></div>
      </section>

      <section className="archive shell" id="archive">
        <div className="section-heading"><div><div className="eyebrow"><i /> THE ORIGINAL ENERGY</div><h2>Still GIF. Still Nooki.</h2></div><p>The classics are not going anywhere.</p></div>
        <div className="gif-strip">{GIFS.map((gif, index) => <figure key={gif} className={index % 3 === 1 ? 'lifted' : ''}><img src={gif} alt={`Nooki GIF ${index + 1}`} loading="lazy" /><figcaption>NOOKI FILE / {String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div>
      </section>

      <footer className="shell"><div className="brand"><span className="brand-mark"><img src="/ordinooki-icon.png" alt="" /></span><span>ORDIN<span className="lime">OO</span>KI</span></div><p>A strange little signal, forever on Bitcoin.</p><div className="footer-links"><a href="https://x.com/Ordinooki" target="_blank" rel="noreferrer">𝕏 FOLLOW</a><a href={`https://mempool.space/address/${WALLET}`} target="_blank" rel="noreferrer">TREASURY ↗</a></div></footer>
    </main>
  );
}

function App() {
  return <BrowserRouter><div className="ambient-gifs" aria-hidden="true"><img src="/assets/memes/1.gif" alt="" /><img src="/assets/memes/7.gif" alt="" /><img src="/assets/memes/13.gif" alt="" /><img src="/assets/memes/21.gif" alt="" /></div><Routes><Route path="/" element={<Home />} /><Route path="/gallery" element={<Gallery />} /><Route path="/forest" element={<Forest />} /><Route path="/playground" element={<Playground />} /></Routes></BrowserRouter>;
}

export default App;
