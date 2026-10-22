const VISIT_COUNTER_KEY = 'portfolio:visits';

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

export default async function visitsHandler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Metode request tidak didukung.' });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return sendJson(res, 403, { error: 'Request tidak diizinkan.' });
      }
    } catch {
      return sendJson(res, 403, { error: 'Request tidak diizinkan.' });
    }
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!redisUrl || !redisToken) {
    return sendJson(res, 503, { error: 'Penghitung kunjungan belum dikonfigurasi.' });
  }

  const command = req.method === 'POST' ? 'incr' : 'get';
  const url = `${redisUrl.replace(/\/+$/, '')}/${command}/${encodeURIComponent(VISIT_COUNTER_KEY)}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${redisToken}` },
      signal: AbortSignal.timeout(5_000)
    });

    if (!response.ok) {
      console.error(`Visitor counter store returned HTTP ${response.status}.`);
      return sendJson(res, 502, { error: 'Penghitung kunjungan sedang bermasalah.' });
    }

    const result = await response.json();
    const visits = Number(result.result);
    if (!Number.isSafeInteger(visits) || visits < 0) {
      console.error('Visitor counter store returned an invalid count.');
      return sendJson(res, 502, { error: 'Data penghitung kunjungan tidak valid.' });
    }

    return sendJson(res, 200, { visits });
  } catch (error) {
    console.error('Visitor counter store request failed.', error);
    return sendJson(res, 502, { error: 'Tidak dapat memuat penghitung kunjungan.' });
  }
}
