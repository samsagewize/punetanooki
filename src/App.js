import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const WALLET = 'bc1pvje9z6zmrjelcnkcuw0yggh0p9zphjtxchatjwgzvnwll8c6q40qpp5yqg';
const MEMPOOL_API = 'https://mempool.space/api';
const GIFS = [1, 4, 7, 10, 13, 16, 19, 21, 23].map((number) => `/assets/memes/${number}.gif`);

const short = (value, start = 8, end = 7) => `${value.slice(0, start)}…${value.slice(-end)}`;
const satsToBtc = (sats) => (sats / 100000000).toFixed(8);

function App() {
  const [wallet, setWallet] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [copied, setCopied] = useState(false);

  const refreshTreasury = async () => {
    setStatus('loading');
    try {
      const [walletResponse, utxoResponse, txResponse] = await Promise.all([
        fetch(`${MEMPOOL_API}/address/${WALLET}`),
        fetch(`${MEMPOOL_API}/address/${WALLET}/utxo`),
        fetch(`${MEMPOOL_API}/address/${WALLET}/txs`),
      ]);
      if (!walletResponse.ok || !utxoResponse.ok || !txResponse.ok) throw new Error('Radar unavailable');
      const [walletData, utxoData, txData] = await Promise.all([
        walletResponse.json(), utxoResponse.json(), txResponse.json(),
      ]);
      setWallet(walletData);
      setUtxos(utxoData);
      setTransactions(txData.slice(0, 4));
      setStatus('live');
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

  const copyAddress = async () => {
    await navigator.clipboard.writeText(WALLET);
    setCopied(true);
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
          <span className="brand-mark">N</span><span>ORDIN<span className="lime">OO</span>KI</span>
        </a>
        <div className="nav-links">
          <a href="#radar">Treasury</a><a href="#archive">GIF archive</a>
          <a className="nav-pill" href={`https://mempool.space/address/${WALLET}`} target="_blank" rel="noreferrer">Explorer ↗</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><i /> CULTURE, INSCRIBED FOREVER</div>
        <h1>Small creature.<br /><span>Big signal.</span></h1>
        <p className="hero-copy">Ordinoooki lives on Bitcoin. The memes stay weird, the treasury stays transparent, and every sat can be verified.</p>
        <div className="hero-actions">
          <a className="primary" href="#radar">Open treasury radar <b>↓</b></a>
          <a className="text-link" href="#archive">Enter the nookiverse →</a>
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

          <div className="wallet-bar">
            <div><small>TREASURY ADDRESS</small><strong>{short(WALLET, 12, 10)}</strong></div>
            <button onClick={copyAddress}>{copied ? 'Copied!' : 'Copy address'}</button>
          </div>

          {status === 'error' ? <div className="error-card">The radar lost signal. The wallet is safe—check it directly on the explorer or try again.</div> : <>
            <div className="stats-grid">
              <article className="balance-card"><small>CONFIRMED + PENDING BALANCE</small><strong>{status === 'loading' ? '—' : balance.toLocaleString()} <em>sats</em></strong><span>{status === 'loading' ? 'Scanning…' : `₿ ${satsToBtc(balance)}`}</span><div className="pulse-line" /></article>
              <article><small>UNSPENT OUTPUTS</small><strong>{status === 'loading' ? '—' : utxos.length}</strong><span>Pieces in the vault</span></article>
              <article><small>TRANSACTIONS</small><strong>{status === 'loading' ? '—' : wallet?.chain_stats.tx_count}</strong><span>Confirmed on Bitcoin</span></article>
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

      <section className="archive shell" id="archive">
        <div className="section-heading"><div><div className="eyebrow"><i /> THE ORIGINAL ENERGY</div><h2>Still GIF. Still Nooki.</h2></div><p>The classics are not going anywhere.</p></div>
        <div className="gif-strip">{GIFS.map((gif, index) => <figure key={gif} className={index % 3 === 1 ? 'lifted' : ''}><img src={gif} alt={`Nooki GIF ${index + 1}`} loading="lazy" /><figcaption>NOOKI FILE / {String(index + 1).padStart(2, '0')}</figcaption></figure>)}</div>
      </section>

      <footer className="shell"><div className="brand"><span className="brand-mark">N</span><span>ORDIN<span className="lime">OO</span>KI</span></div><p>A strange little signal, forever on Bitcoin.</p><a href={`https://mempool.space/address/${WALLET}`} target="_blank" rel="noreferrer">TREASURY ↗</a></footer>
    </main>
  );
}

export default App;
