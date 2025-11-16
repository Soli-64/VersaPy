import {resolve} from "path"
import { readFile } from 'fs/promises'

type Config = {
    backend: {
        host: string
        port: number
    }
    frontend: {
        host: string
        port: number
    }
    window: {
        title: string
        widht: number
        height: number
        resizable: boolean
        fullscreen: boolean
    }
}

export async function loadConfig(): Promise<Config> {
    const configPath = resolve(process.cwd(), 'versapy.config.json')
    const raw = await readFile(configPath, 'utf-8')
    const config = JSON.parse(raw)
    return config
}
