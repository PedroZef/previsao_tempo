import { defineConfig } from 'vite'

// Configurações do Vite para desenvolvimento e build de produção
export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
})
