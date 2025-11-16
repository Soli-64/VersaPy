
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

export async function loadUserConfig(): Promise<Config> {
    const res = await fetch('/versapy.config.json')
    if (!res.ok) {
        throw new Error('Failed to load versapy.config.json')
    }
    return await res.json()
}