const WALLET = 'bc1pvje9z6zmrjelcnkcuw0yggh0p9zphjtxchatjwgzvnwll8c6q40qpp5yqg';

module.exports = async function handler(request, response) {
  response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
  try {
    const page = await fetch(`https://ordinals.com/address/${WALLET}`);
    if (!page.ok) throw new Error(`Ordinals explorer returned ${page.status}`);
    const html = await page.text();
    const ids = [...html.matchAll(/\/inscription\/([a-f0-9]{64}i\d+)/g)].map((match) => match[1]);
    const uniqueIds = [...new Set(ids)];
    const items = await Promise.all(uniqueIds.map(async (id) => {
      const content = await fetch(`https://ordinals.com/content/${id}`, { method:'HEAD' });
      return { id, contentType:content.headers.get('content-type') || 'unknown' };
    }));
    response.status(200).json({ wallet:WALLET, count:items.length, items, source:'ordinals.com', updatedAt:new Date().toISOString() });
  } catch (error) {
    response.status(502).json({ error:'Could not refresh treasury inscriptions' });
  }
};
