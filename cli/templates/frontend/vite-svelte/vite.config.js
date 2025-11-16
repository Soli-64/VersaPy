// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {loadConfig} from "versapy/config"

export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend
  return {
    plugins: [svelte()],
    server: { port, host },
  }
})
