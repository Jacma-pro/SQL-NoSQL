import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Le navigateur appelle /api/... sur le même port que le front ; Vite relaie
    // vers l'API. Pas de requête vers un autre domaine, donc pas besoin de CORS.
    proxy: {
      '/api': process.env.API_URL || 'http://localhost:3000',
    },
    // Dans Docker, les fichiers du dossier monté depuis Windows ne déclenchent
    // pas d'événement de modification : on les surveille par sondage.
    watch: { usePolling: true },
  },
});
