import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // запросы /api/* фронтенд отправляет на свой же адрес, а Vite пересылает их на бэкенд.
    // Порт 5050: на macOS порт 5000 занят системным «Приёмником AirPlay».
    proxy: {
      '/api': 'http://localhost:5050',
    },
  },
})
