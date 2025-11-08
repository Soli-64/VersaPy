#!/usr/bin/env node

import { spawn } from "child_process";

function detectPackageManager() {
        const ua = process.env.npm_config_user_agent || "";
        if (ua.startsWith("yarn")) return "yarn";
        if (ua.startsWith("pnpm")) return "pnpm";
        if (ua.startsWith("bun")) return "bun";
        return "npm";
}

const pkgManager = detectPackageManager();

const vite = spawn(pkgManager, ["run", "vite"], {
    stdio: "ignore",
    shell: true
});


let backend;
let python;

if (process.platform === "win32") {
    backend = ".\\venv\\Scripts\\python.exe"
} else {
    backend = "./venv/bin/python3"
}

try {
    python = spawn(backend, ["src-versapy/main.py"], {
        stdio: "inherit"
    })
} catch (e) {
    console.log(e)
}


function shutdown() {
    console.log("\nStopping VersaPy...");
    
    try {
        if (vite && vite.pid) process.kill(vite.pid);
    } catch {}
    try {
        if (python && python.pid) process.kill(python.pid);
    } catch {}
    
    process.exit(0);
}

vite.on("close", (code) => console.log('Frontend exited with code  ', code));
python.on("close", (code) => console.log('Backend exited with code ', code));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);