


export async function loadUserConfig() {
    const res = await fetch("/versapy.config.json")

    if (!res.ok) throw new Error("Can't find file versapy.config.json")

    const config = await res.json()

    return config
}