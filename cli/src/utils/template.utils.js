import fs from "fs";
import path from "path";

const copyTemplate = (__dirname, templateName, destDir) => {
  const src = path.join(__dirname, "templates", templateName);
  fs.copyFileSync(src, destDir);
}

const cloneTemplate = (__dirname, framework) => {

    try {
        const src = path.join(__dirname, "templates");
        fs.cpSync(`${src}/frontend/vite-${framework}`, ".", { recursive: true })

        fs.mkdirSync("public")
        copyTemplate(__dirname, `frontend/vite-public/vite.svg`, "./public/vite.svg")

        copyTemplate(__dirname, `frontend/README.md`, "./README.md")
        copyTemplate(__dirname, `frontend/vite-gitignore`, "./.gitignore")

      } catch (error) {
        console.error("Error while cloning the template: ", error);
        process.exit(1);
    }

}

const editPackageJson = () => {
  const pkgPath = `./package.json`;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  pkg.scripts.dev = "vpy-dev";
  pkg.scripts.build = "vpy-build"
  pkg.scripts.vite = "vite"
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

export { copyTemplate, cloneTemplate, editPackageJson }