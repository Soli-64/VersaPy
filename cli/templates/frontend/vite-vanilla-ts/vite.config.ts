// vite.config.ts
import { defineConfig } from 'vite'
import {loadConfig} from "versapy/config"

export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend
  return {
    server: { port, host },
    base: "./"
  }
})