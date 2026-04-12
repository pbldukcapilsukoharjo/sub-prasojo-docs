import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Yumel from '@modyfi/vite-plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), Yumel()],
})
