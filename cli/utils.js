
import { execSync } from "child_process";
import path from "path";
import fs, { cpSync } from "fs";

const pythonExe = process.platform === "win32" ? "python" : "python3"


function checkPython() {
  try {
    execSync(`${pythonExe} --version`)
      .toString()
      .trim();
    console.log(`Python successfuly detected`);
  } catch {
    console.error("Python not detected. Please install Python >=3.9");
    process.exit(1);
  }
}

function createPythonEnv() {
    const venvPath = path.join(process.cwd(), "venv");
    console.log("Creating python virtual env.");
    try {
        execSync(`${pythonExe} -m venv venv`, { stdio: "inherit" });
    } catch (error) {
        console.error("Error while creating the .", error);
        process.exit(1);
    }
    console.log(" Python venv successfuly created.");
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

function copyTemplate(__dirname, templateName, destDir) {
  const src = path.join(__dirname, "templates", templateName);
  fs.copyFileSync(src, destDir);
}

function cloneTemplate(__dirname, framework, ts) {

    try {
        const src = path.join(__dirname, "templates");
        cpSync(`${src}/frontend/vite-${framework}${ts && "-ts"}`, ".", { recursive: true })

        fs.mkdirSync("public")
        copyTemplate(__dirname, `frontend/vite-public/vite.svg`, "./public/vite.svg")

        copyTemplate(__dirname, `frontend/README.md`, "./README.md")
        copyTemplate(__dirname, `frontend/vite-gitignore`, "./.gitignore")

      } catch (error) {
        console.error("Error while cloning the template: ", error);
        process.exit(1);
    }

}

function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) return true;
  const files = fs.readdirSync(dir).filter(f => !f.startsWith("."));
  return files.length === 0;
}

function editPackageJson() {
  const pkgPath = `./package.json`;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  pkg.scripts.dev = "vpy-dev";
  pkg.scripts.build = "vpy-build"
  pkg.scripts.vite = "vite"
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

export { checkPython, createPythonEnv, installPythonDeps, cloneTemplate, editPackageJson, copyTemplate, isDirEmpty};