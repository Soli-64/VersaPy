// vite.config.js
import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import {loadConfig} from "versapy/config"


export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend

  return {
    plugins: [
      qwikVite({
        csr: true,
      }),
    ],
    server: { port, host },
    base: "./"
  }
  
})
