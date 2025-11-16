// vite.config.js
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import {loadConfig} from "versapy/config"

export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend
  return {
    plugins: [solid()],
    server: { port, host },
  }
})
