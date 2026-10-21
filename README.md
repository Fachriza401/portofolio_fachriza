# Portfolio Fachriza

## Asisten AI

Widget asisten menggunakan endpoint serverless `api/chat.js` dan Gemini Interactions API (`gemini-3.8-flash`). Gemini menyediakan free tier dengan kuota dan ketersediaan yang dapat berubah. Penggunaan layanan gratis dapat tunduk pada kebijakan Google terkait penggunaan data; jangan kirim informasi sensitif.

Buat API key gratis di [Google AI Studio](https://aistudio.google.com/app/apikey), lalu simpan sebagai environment variable `GEMINI_API_KEY` di project Vercel. Jangan menaruh key di frontend atau di variable yang diawali `VITE_`. `GEMINI_MODEL` bersifat opsional; default-nya `gemini-3.8-flash`.

Untuk menjalankan secara lokal di PowerShell:

```powershell
$env:GEMINI_API_KEY = "isi-api-key-anda"
npm run dev
```

Di Vercel, tambahkan `GEMINI_API_KEY` pada Project Settings → Environment Variables, lalu deploy ulang. Endpoint chat membatasi panjang pesan dan jumlah pesan per request serta menerapkan rate limit sederhana per IP.

Konteks asisten dirangkai dari data profil, proyek, skill, pengalaman, dan sertifikat di `src/`, sehingga mengikuti isi portfolio. Estimasi awal untuk website sederhana adalah Rp800.000 untuk penggunaan lokal saja atau Rp1.600.000 termasuk deployment. Harga final, kebutuhan fitur, dan biaya domain/hosting harus dikonfirmasi terpisah dengan Fachriza.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
# portofolio_fachriza
