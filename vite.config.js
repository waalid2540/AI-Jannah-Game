import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['three', 'gsap']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'gsap']
  }
})