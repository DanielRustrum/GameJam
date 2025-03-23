import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import zipPack from "vite-plugin-zip-pack";

// let base = "/GameJam"
// let base = "/"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./"
})
