// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {loadConfig} from "versapy/config"

export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend
  return {
    plugins: [react()],
    server: { port, host },
    base: "./"
  }
})