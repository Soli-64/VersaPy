
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const pythonExe = process.platform === "win32" ? "python" : "python3"

function checkPython() {
  try {
    const version = execSync(`${pythonExe} --version`)
      .toString()
      .trim();
    console.log(`✅ Python détecté`);
  } catch {
    console.error("❌ Python non détecté. Installez Python 3.9+");
    process.exit(1);
  }
}

function createPythonEnv() {
    const venvPath = path.join(process.cwd(), "venv");
    console.log("🐍 Création de l'environnement virtuel Python...");
    try {
        execSync(`${pythonExe} -m venv venv`, { stdio: "inherit" });
    } catch (error) {
        console.error("❌ Échec de la création de l'environnement virtuel.", error);
        process.exit(1);
    }
    console.log("✅ Environnement virtuel créé.");
    return venvPath;
}

function installPythonDeps(venvPath, libs) {
  const pipExec = path.join(venvPath, process.platform === "win32" ? "Scripts/pip.exe" : "bin/pip");
  const pythonExe = process.platform === "win32" ? ".\\venv\\Scripts\\python.exe" : "./venv/bin/python3"

  execSync(`${pythonExe} -m pip install --upgrade pip setuptools wheel`)

  if (libs.length > 0) {
    execSync(`${pipExec} install ${libs.join(" ")}`, { stdio: "inherit" });
  }
}

function cloneTemplate(pkgMan, framework, ts) {

    try {
        execSync(`${pkgMan} create vite@latest . ${pkgMan === "npm" && "--"} --template ${framework}${ts ? "-ts" : ""} --no-interactive --no-rolldown `, { stdio: "inherit" });
    } catch (error) {
        console.error("❌ Échec de la création du projet.", error);
        process.exit(1);
    }

}

function editPackageJson() {
  const pkgPath = `./package.json`;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  pkg.scripts.dev = "node ./versapy.dev.js";
  pkg.scripts.vite = "vite"
  pkg.dependencies.versapy = "0.0.0"
  // pkg.scripts["versapy:dev"] = "node ./versapy/cli/versapy-dev.js";

  // pkg.scripts.build = "vite build";

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(" package.json succesfuly updated!");
}

export { checkPython, createPythonEnv, installPythonDeps, cloneTemplate, editPackageJson };