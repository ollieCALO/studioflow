import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev: proxy to Vercel function via vite dev server
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const key = process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY
            if (key) {
              proxyReq.setHeader('x-api-key', key)
              proxyReq.setHeader('anthropic-version', '2023-06-01')
            }
          })
        },
      },
    },
  },
})
