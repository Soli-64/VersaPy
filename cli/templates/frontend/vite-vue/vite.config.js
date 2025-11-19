// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {loadConfig} from "versapy/config"

// https://vite.dev/config/
export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend
  return {
    plugins: [vue()],
    server: { port, host },
    base: "./"
  }
})