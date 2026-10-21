import { certificateGroups } from '../src/data/certificates.js';
import { experience } from '../src/data/experience.js';
import { projects } from '../src/data/projects.js';
import { skills } from '../src/data/skills.js';
import { profile } from '../src/config/profile.js';

const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_MESSAGES = 12;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map();

const certificateSummary = certificateGroups.flatMap(({ title, certificates: items }) =>
  items.map((certificate) => `- ${certificate.title} — ${certificate.issuer} (${certificate.year}; ${title})`)
).join('\n');
const projectSummary = projects.map((project) =>
  `- ${project.title}: ${project.description} Teknologi: ${project.tech.join(', ')}.`
).join('\n');
const experienceSummary = experience.map((item) =>
  `- ${item.role} di ${item.company} (${item.period}): ${item.description}`
).join('\n');

const portfolioContext = `
Kamu adalah asisten AI untuk website portfolio ${profile.name}, bukan pemiliknya. Jawab ramah, jelas, dan ringkas. Gunakan bahasa pengunjung; utamakan bahasa Indonesia.

PROFIL
- Nama: ${profile.name}
- Peran/judul: ${profile.title}
- Deskripsi: ${profile.description}
- Lokasi: ${profile.location}
- Pendidikan: ${profile.education.univ.major} di ${profile.education.univ.school}; latar belakang ${profile.education.smk.major} dari ${profile.education.smk.school}.

LAYANAN YANG DITAWARKAN
- Website Development: portfolio, company profile, landing page, dashboard, dan sistem informasi.
- Mobile App: aplikasi Android/mobile menggunakan Flutter dan Dart.
- UI/UX Design: desain interface yang fokus pada usability dan visual experience.
- System Information: sistem informasi untuk sekolah, bisnis, dan organisasi.
- Maintenance & Improvement: perbaikan, pengembangan, dan peningkatan aplikasi yang sudah ada.

PROYEK PORTFOLIO
${projectSummary}

KEAHLIAN
${skills.join(', ')}.

PENGALAMAN
${experienceSummary}

SERTIFIKAT DAN PARTISIPASI
${certificateSummary}

KONTAK PUBLIK
- Email: ${profile.email}
- WhatsApp: ${profile.whatsapp}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}
- Instagram: ${profile.instagram}

PANDUAN ESTIMASI HARGA WEBSITE (RUPIAH/IDR)
- Website dengan lingkup sederhana yang hanya dijalankan secara lokal: estimasi awal Rp800.000. Jelaskan bahwa website lokal belum dipublikasikan dan belum dapat diakses umum melalui internet.
- Website sederhana termasuk bantuan deployment/publikasi: estimasi awal Rp1.600.000.
- Sampaikan kedua angka sebagai estimasi awal untuk lingkup sederhana, bukan harga pasti atau penawaran final. Harga final bergantung pada jumlah halaman, fitur, desain, backend/database, autentikasi, integrasi, revisi, tenggat waktu, dan kebutuhan deployment.
- Tanyakan kebutuhan penting yang belum disebutkan sebelum mempersempit estimasi: jenis website, halaman/fitur, apakah perlu admin/login/database, dan apakah perlu online.
- Biaya domain, hosting/server, layanan berbayar, API pihak ketiga, pemeliharaan, atau fitur tambahan tidak otomatis termasuk estimasi. Jangan mengklaim biaya tersebut sudah termasuk; jelaskan bahwa perlu konfirmasi kebutuhan dan biaya aktual.
- Jangan menjanjikan semua jenis sistem atau aplikasi bisa dibuat dengan harga Rp800.000–Rp1.600.000. Untuk sistem kompleks, jelaskan bahwa estimasi awal tersebut hanya berlaku bagi lingkup website sederhana dan sarankan diskusi spesifikasi terlebih dahulu.

ATURAN JAWABAN
- Gunakan informasi dalam konteks ini untuk menjawab pertanyaan tentang seluruh isi portfolio, layanan, teknologi, proyek, pengalaman, sertifikat, dan kontak.
- Jangan mengarang data, hasil, pengalaman, ketersediaan, tautan, atau kemampuan yang tidak tercantum. Jika informasi tidak tersedia, katakan terus terang dan arahkan pengunjung menghubungi Fachriza melalui Contact.
- Jangan mengaku sebagai Fachriza; sebut dirimu asisten AI portfolio.
- Jangan menjanjikan harga final atau timeline sebelum spesifikasi proyek diketahui.
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
    const defaultModel = 'gemini-3.8-flash';
    const fallbackModel = 'gemini-flash-lite-latest';
    const configuredModel = process.env.GEMINI_MODEL || defaultModel;
    const requestModel = (model) => fetch(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          system_instruction: portfolioContext,
          input: messages.map(({ role, content }) =>
            `${role === 'assistant' ? 'Asisten' : 'Pengunjung'}: ${content}`
          ).join('\n\n'),
          store: false
        }),
        signal: controller.signal
      }
    );
    const modelsToTry = [...new Set([configuredModel, defaultModel, fallbackModel])];
    let model = modelsToTry[0];
    let response;
    for (const candidate of modelsToTry) {
      model = candidate;
      response = await requestModel(model);
      if (response.ok || ![404, 503].includes(response.status)) break;
      if (candidate !== modelsToTry.at(-1)) {
        console.error(`Gemini model "${candidate}" returned ${response.status}; trying a fallback model.`);
      }
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
        return sendJson(res, 503, { error: `Model/interaksi Gemini "${model}" tidak tersedia untuk API key ini.${detail} Periksa akses model di Google AI Studio.` });
      }
      const detail = providerMessage ? ` Detail dari Google: ${providerMessage.slice(0, 220)}` : '';
      return sendJson(res, 502, { error: `Gemini API mengembalikan HTTP ${response.status}.${detail} Coba lagi nanti.` });
    }

    const result = await response.json();
    const reply = result.steps
      ?.filter((step) => step.type === 'model_output')
      .flatMap((step) => step.content || [])
      .map((part) => part.text || '')
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
    const diagnostic = String(error.message || 'Unknown error')
      .replaceAll(apiKey, '[redacted]')
      .slice(0, 180);
    console.error('Gemini request could not be completed.', diagnostic);
    return sendJson(res, 502, { error: `Tidak dapat menghubungi Gemini API: ${diagnostic}` });
  } finally {
    clearTimeout(timeout);
  }
}
