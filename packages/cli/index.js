#!/usr/bin/env node

import chalk from "chalk";
import prompts from "prompts";
import { checkPython, createPythonEnv, installPythonDeps, cloneTemplate, editPackageJson } from "./utils.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyTemplate(templateName, destDir) {
  const src = path.join(__dirname, "templates", templateName);
  fs.copyFileSync(src, destDir);
//   console.log(` Copied ${templateName} template to ${destDir}`);
}

function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) return true; // le dossier n’existe pas encore
  const files = fs.readdirSync(dir).filter(f => !f.startsWith("."));
  return files.length === 0;
}

async function main() {

    console.log(chalk.green(`
    ===================================
            Welcome to VersaPy
        Tauri-like Python Framework
    ===================================
    `));

    const response1 = await prompts({
        type: "text",
        name: "name",
        message: "Enter your project name:",
        initial: "my-versapy-app"
    });

    const { name } = response1;

    if (name.trim() !== ".") {
        fs.mkdirSync(name);
        process.chdir(name);
    }

    const verif = isDirEmpty(".")
    if (!verif) {
        console.log(
            chalk.red(
                `Please initialize your versapy project in an empty directory, \n or enter a project name, which will create a new one.   
                `
            )
        )
        return
    }

    // Creating Frontend: Vite + Framework ( + Ts )

    const response2 = await prompts([
        { 
            type: "select", 
            name: "pkgManager", 
            message: "Select a Package Manager:", 
            choices: [ 
                { title: "npm", value: "npm" }, 
                { title: "yarn", value: "yarn" },
                { title: "pnpm", value: "pnpm" } 
            ], initial: 0 },
        {
            type: "select",
            name: "frontend",
            message: "Select a Framework:",
            choices: [
                { title: "Vanilla", value: "vanilla" },
                { title: "Vue", value: "vue" },
                { title: "React", value: "react" },
                { title: "Preact", value: "preact" },
                { title: "Lit", value: "lit" },
                { title: "Svelte", value: "svelte" },
                { title: "Solid", value: "solid" },
                { title: "Qwik", value: "qwik" },
                { title: "Angular", value: "angular" },
                { title: "Marko", value: "marko" },
            ],
            initial: 0
        },
        {
            type: "select",
            name: "typescript",
            message: "Use TypeScript?",
            choices: [
                { title: "Yes", value: true },
                { title: "No", value: false }
            ],
            initial: 0
        }
    ]);

    const { pkgManager, frontend, typescript } = response2;

    cloneTemplate(pkgManager, frontend, typescript);

    execSync(`${pkgManager} install`)

    editPackageJson()

    // create Pyhon Venv, Base Script and Deps
    
    checkPython();
    const venvPath = createPythonEnv();
    installPythonDeps(venvPath, [
        // "versapy" 
    ]);


    // Creating versapy.dev.js file

    // fs.writeFileSync("versapy.dev.js", versapyDevJSContent)
    copyTemplate("versapy.dev.js", "./versapy.dev.js")

    // Creating .env file

    copyTemplate(".env", "./.env")

    // Creating versapy.config.json

    let tempName = name !== "." ? name : "MyVersapyApp"

    const config = {
        pythonVenv: venvPath,
        frontend: {
            url: "http://localhost:5173"
        },
        window: {
            title: tempName,
            width: 1024,
            height: 768,
            resizable: true,
            fullscreen: false
        },
    };

    fs.writeFileSync("versapy.config.json", JSON.stringify(config, null, 2))

    // Creating src-versapy folder

    fs.mkdirSync("src-versapy");

    // Creating sample backend file

    copyTemplate('main.py', './src-versapy/main.py')

}


main();
