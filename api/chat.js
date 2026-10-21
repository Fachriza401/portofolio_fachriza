const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_MESSAGES = 12;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map();

const portfolioContext = `
Kamu adalah asisten AI di portfolio Fachriza Taufid Sikumbang. Jawab dengan ramah, ringkas, dan dalam bahasa Indonesia kecuali pengunjung menggunakan bahasa lain.
Informasi pemilik:
- Mahasiswa Sistem Informasi di STMIK Triguna Dharma, berdomisili di Medan, Indonesia.
- Fokus: web development, mobile app, UI/UX, dan teknologi informasi.
- Latar belakang SMK: Teknik Komputer dan Jaringan di SMK Multi Karya.
- Proyek portfolio: Smart Kantin Kampus (Flutter, Dart, Firebase, Web); SIPUS (Laravel, MySQL); SIAKAD Sekolah (Laravel, JavaScript, MySQL); Rumah Makan KK Ros (Web, JavaScript, UI/UX); AromaLux (Laravel, MySQL, Flutter); SIPLAB (Laravel, MySQL, Flutter); Ruang Belajar Mandiri (Laravel, MySQL, responsive UI).
- Pengunjung boleh bertanya tentang portfolio, pengalaman, ide proyek, teknologi, atau meminta saran awal untuk ide mereka.
Jangan mengarang informasi pribadi, tautan, pengalaman, atau detail proyek yang tidak ada di konteks. Jika tidak tahu, katakan dengan jujur dan arahkan pengunjung untuk menghubungi Fachriza melalui bagian Contact. Jangan mengaku sebagai Fachriza; jelaskan bahwa kamu adalah asisten AI portfolio.
`;

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

const readRequestBody = async (req) => {
  if (req.body !== undefined) {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
      const error = new Error('Request terlalu besar.');
      error.statusCode = 413;
      throw error;
    }
    return JSON.parse(body);
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Request terlalu besar.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const isRateLimited = (ip, now = Date.now()) => {
  if (rateBuckets.size > 1_000) {
    for (const [key, bucket] of rateBuckets) {
      if (now - bucket.startedAt >= RATE_WINDOW_MS) rateBuckets.delete(key);
    }
  }

  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.startedAt >= RATE_WINDOW_MS) {
    rateBuckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
};

export default async function chatHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured.');
    return sendJson(res, 503, { error: 'Asisten AI belum dikonfigurasi. Silakan coba lagi nanti.' });
  }

  let payload;
  try {
    payload = await readRequestBody(req);
  } catch (error) {
    return sendJson(res, error.statusCode || 400, { error: 'Format pesan tidak valid.' });
  }

  const messages = payload?.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    messages[0]?.role !== 'user' ||
    messages.some(
      (message) =>
        !message ||
        !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' ||
        !message.content.trim() ||
        message.content.length > MAX_MESSAGE_LENGTH
    )
  ) {
    return sendJson(res, 400, { error: 'Pesan tidak valid atau terlalu panjang.' });
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';

  if (isRateLimited(ip)) {
    return sendJson(res, 429, { error: 'Terlalu banyak pesan. Silakan tunggu sebentar lalu coba lagi.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const defaultModel = 'gemini-2.5-flash';
    const configuredModel = process.env.GEMINI_MODEL || defaultModel;
    const requestModel = (model) => fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: portfolioContext }] },
          contents: messages.map(({ role, content }) => ({
            role: role === 'assistant' ? 'model' : 'user',
            parts: [{ text: content }]
          })),
          generationConfig: {
            maxOutputTokens: 450,
            temperature: 0.7
          }
        }),
        signal: controller.signal
      }
    );
    let model = configuredModel;
    let response = await requestModel(model);
    if (response.status === 404 && model !== defaultModel) {
      console.error(`Configured Gemini model "${model}" was not found; retrying with "${defaultModel}".`);
      model = defaultModel;
      response = await requestModel(model);
    }

    if (!response.ok) {
      let providerMessage = '';
      try {
        const errorResult = await response.json();
        providerMessage = errorResult.error?.message || '';
      } catch (error) {
        console.error('Could not read Gemini error response.', error);
      }
      console.error(`Gemini request failed with status ${response.status}: ${providerMessage.slice(0, 300)}`);
      if (response.status === 429) {
        return sendJson(res, 429, { error: 'Kuota gratis AI sedang mencapai batas. Coba lagi nanti.' });
      }
      if (response.status === 400) {
        return sendJson(res, 502, { error: 'Gemini menolak format percakapan. Coba mulai chat baru.' });
      }
      if (response.status === 401 || response.status === 403) {
        return sendJson(res, 503, { error: 'API key Gemini tidak valid atau belum memiliki akses. Periksa GEMINI_API_KEY di Vercel.' });
      }
      if (response.status === 404) {
        const detail = providerMessage ? ` Detail dari Google: ${providerMessage.slice(0, 220)}` : '';
        return sendJson(res, 503, { error: `Request Gemini untuk model "${model}" tidak ditemukan.${detail} Pastikan Gemini API aktif untuk project API key.` });
      }
      return sendJson(res, 502, { error: 'Asisten AI sedang mengalami kendala. Coba lagi sebentar.' });
    }

    const result = await response.json();
    const reply = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();
    if (!reply) {
      console.error('Gemini response did not contain a message.');
      return sendJson(res, 502, { error: 'Asisten belum bisa menjawab. Silakan coba lagi.' });
    }

    return sendJson(res, 200, { reply });
  } catch (error) {
    if (error.name === 'AbortError') {
      return sendJson(res, 504, { error: 'Asisten AI membutuhkan waktu terlalu lama. Silakan coba lagi.' });
    }
    console.error('Gemini request could not be completed.', error);
    return sendJson(res, 502, { error: 'Tidak dapat menghubungi asisten AI. Periksa koneksi lalu coba lagi.' });
  } finally {
    clearTimeout(timeout);
  }
}
