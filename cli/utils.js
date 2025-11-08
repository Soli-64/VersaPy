import fs from "fs";

function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) return true;
  const files = fs.readdirSync(dir).filter(f => !f.startsWith("."));
  return files.length === 0;
}

export { checkPython, createPythonEnv, installPythonDeps } from "./src/utils/python.utils.js"
export { cloneTemplate, editPackageJson, copyTemplate } from "./src/utils/template.utils.js"
export { isDirEmpty };