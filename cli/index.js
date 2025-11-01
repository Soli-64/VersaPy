#!/usr/bin/env node

import chalk from "chalk";
import prompts from "prompts";
import { checkPython, createPythonEnv, installPythonDeps, cloneTemplate, editPackageJson, copyTemplate, isDirEmpty } from "./utils.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {

    console.log(chalk.green(`
    ===================================
            Welcome to VersaPy
        Desktop App Python Framework
    ===================================
    `));

    const response1 = await prompts({
        type: "text",
        name: "name",
        message: "Enter your project name:",
        initial: "my-versapy-app"
    });

    const { name } = response1;

    // Changing process path if a new dir has been created
    if (name.trim() !== ".") {
        fs.mkdirSync(name);
        process.chdir(name);
    }

    // Vite can't create properly without interaction if the dir isn't empty 
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

    // inializing vite
    cloneTemplate(pkgManager, frontend, typescript);

    // install vite deps if needed
    execSync(`${pkgManager} install`)

    // installing

    // If the package isn't released or if you made your own version,
    // use npm link or install your local version

    execSync(`${pkgManager} install versapy`)
    // execSync(`${pkgManager} link versapy`)

    // editing scripts and deps
    editPackageJson()

    // create Pyhon Venv, Base Script and Deps
    
    checkPython();
    const venvPath = createPythonEnv();
    installPythonDeps(venvPath, [
        
        /** 
         * If the module isn't released or you modified it replace here the absolute path
         * to your local version.
        */ 
        "versapy",    

    ]);

    // Creating .env file

    // Env file is a temp solution, i'm searching for another 
    // solution to share the url where the back will from front to back

    copyTemplate(__dirname, ".env", "./.env")

    // Creating versapy.config.json

    let winName = name !== "." ? name : "MyVersapyApp" // Default Name if project was created without

    const config = {
        pythonVenv: venvPath,
        frontend: {
            url: "http://localhost:5173"
        },
        window: {
            title: winName,
            width: 1024,
            height: 768,
            resizable: true,
            fullscreen: false
        },
    };

    fs.writeFileSync("versapy.config.json", JSON.stringify(config, null, 2))

    // Creating src-versapy folder

    fs.mkdirSync("src-versapy");

    // Creating sample backend exemple file

    copyTemplate(__dirname, 'main.py', './src-versapy/main.py')

}


main();
