import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({command}) => ({
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui': path.resolve(__dirname, 'src/components/UI'),
      '@panels': path.resolve(__dirname, 'src/panels'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@mechanics': path.resolve(__dirname, 'src/mechanics'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
  },
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? './' : '/',
  build: {
    outDir: "release/dist",
    assetsDir: "assets"
  },server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  }
}))
