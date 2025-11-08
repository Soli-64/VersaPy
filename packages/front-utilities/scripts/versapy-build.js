#!/usr/bin/env node

import { execSync, spawn } from "child_process";

execSync("vite build", { stdio: "inherit" });

const pythonExe = process.platform === "win32" ? ".\\venv\\Scripts\\python.exe" : "./venv/bin/python3"

spawn(
    pythonExe,
    [
    "-m", 
    "PyInstaller", 
    "--noconfirm",
    "--distpath", "./versapy-dist",
    "--add-data", "./dist:./dist",
    "--add-data", "./versapy.config.json:.",
    "src-versapy/main.py"],
  {
    shell: true,
    stdio: "inherit",
    env: { ...process.env, VERSAPY_MODE: "prod" }
  }
);
