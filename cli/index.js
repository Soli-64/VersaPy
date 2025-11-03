#!/usr/bin/env node

import chalk from "chalk";
import prompts from "prompts";
import { checkPython, createPythonEnv, installPythonDeps, cloneTemplate, editPackageJson, copyTemplate, isDirEmpty } from "./utils.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function manageProjectDir(argTargetDir) {
    let name;
    if (!argTargetDir) {
        const response1 = await prompts({
            type: "text",
            name: "name",
            message: "Enter your project name:",
            initial: "my-versapy-app"
        });
    
        name = response1.name;
    } else {
        name = argTargetDir
    }

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
        return process.exit(1)
    }

    return { name }
}

async function init() {

    const argv = process.argv.slice(2)

    const argTargetDir = argv[0] ? String(argv[0]) : undefined

    console.log(chalk.green(`
    ===================================
            Welcome to VersaPy
        Desktop App Python Framework
    ===================================
    `));

    let { name } = await manageProjectDir(argTargetDir)

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
    cloneTemplate(__dirname, frontend, typescript);

    console.log(
        "Vite project initialized. Installing Dependencies... "
    )

    // install vite deps if needed
    execSync(`${pkgManager} install`)

    // If you made your own local version of the module use npm link or install your local version

    // execSync(`${pkgManager} install versapy`)
    execSync(`${pkgManager} link versapy`)

    console.log(
        "Project node dependencies successfuly installed. "
    )

    // editing scripts
    editPackageJson()

    // create Pyhon Venv, Base Script and Deps
    
    console.log(
        "Creating Python Backend..."
    )

    checkPython();
    
    const venvPath = createPythonEnv();

    console.log(
        "Installing python Dependencies..."
    )

    installPythonDeps(venvPath, [
         
        // If you made your own local version of the module replace here by the absolute path to your local version.
        // "versapy",    
        "C:\\Users\\louis\\Desktop\\Dev\\projets\\versapy\\python-module"

    ]);

    // Creating versapy.config.json

    let winName = name !== "." ? name : "MyVersapyApp" // Default Name if project was created without

    const config = {
        pythonVenv: venvPath,
        frontend: {
            url: "http://localhost:5173"
        },
        backend: {
            host: "localhost",
            port: 5000
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

    console.log(
        chalk.green(
            "\n Versapy Project successfuly created."
        )
    )

    console.log(
        "Now run: \
            npm run dev \
        \
        to run your project\
        "
    )

}


init();
