// vite.config.js
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import {loadConfig} from "versapy/config"

export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend

  return {
    plugins: [preact()],
    server: { port, host },
    base: "./"
  }
})