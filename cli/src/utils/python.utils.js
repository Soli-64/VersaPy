import path from "path";
import { execSync } from "child_process";

const PYTHON_EXE = process.platform === "win32" ? "python" : "python3"
const PIP_EXE = (venvPath) => path.join(venvPath, process.platform === "win32" ? "Scripts/pip.exe" : "bin/pip");

const checkPython = () => {
  try {
    execSync(`${PYTHON_EXE} --version`)
      .toString()
      .trim();
    console.log(`Python successfuly detected`);
  } catch {
    console.error("Python not detected. Please install Python >=3.9");
    process.exit(1);
  }
}

const createPythonEnv = () => {
    const venvPath = path.join(process.cwd(), "venv");
    console.log("Creating python virtual env.");
    try {
        execSync(`${PYTHON_EXE} -m venv venv`, { stdio: "inherit" });
    } catch (error) {
        console.error("Error while creating the .", error);
        process.exit(1);
    }
    console.log(" Python venv successfuly created.");
    return venvPath;
}

const installPythonDeps = (venvPath, libs) => {

  execSync(`${PYTHON_EXE} -m pip install --upgrade pip setuptools wheel`)

  if (libs.length > 0) {
    execSync(`${PIP_EXE(venvPath)} install ${libs.join(" ")}`, { stdio: "inherit" });
  }
}

export {
    checkPython,
    createPythonEnv,
    installPythonDeps
};