import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
// import zipPack from "vite-plugin-zip-pack";

// let base = "/GameJam"
// let base = "/"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@scenes': path.resolve(__dirname, 'src/scenes'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@mechanics': path.resolve(__dirname, 'src/mechanics'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
  },
  plugins: [react()],
  base: "./"
})
