import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import zipPack from "vite-plugin-zip-pack";

const repo_sub_path = "/GameJam"
let base = "/GameJam"
let plugins;

console.log(process.env.APP_ENV)
if(process.env.APP_ENV === "github") {
  base = repo_sub_path
  plugins = [react()]
} else {
  plugins = [react(), zipPack()]
}

// https://vite.dev/config/
export default defineConfig({
  plugins: plugins,
  base: base
})
