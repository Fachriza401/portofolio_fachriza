import react from '@vitejs/plugin-react'
import chatHandler from './api/chat.js'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-chat-api',
      configureServer(server) {
        server.middlewares.use('/api/chat', chatHandler)
      }
    }
  ],
})
