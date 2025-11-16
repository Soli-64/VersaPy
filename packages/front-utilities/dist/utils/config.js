export async function loadUserConfig() {
    const res = await fetch('/versapy.config.json');
    if (!res.ok) {
        throw new Error('Failed to load versapy.config.json');
    }
    return await res.json();
}
