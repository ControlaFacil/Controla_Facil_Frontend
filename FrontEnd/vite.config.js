// Arquivo: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // CORRIGIDO: Deve ser apenas a URL base sem /api-docs/
        target: 'https://controlafacilbackend-production.up.railway.app', 
        changeOrigin: true,
        // Mantém o '/api' no path enviado ao backend (ex: /api/usuarios)
        rewrite: (path) => path.replace(/^\/api/, '/api') 
      }
    }
  }
});