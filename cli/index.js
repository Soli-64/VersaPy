#!/usr/bin/env node

import chalk from "chalk";
import prompts from "prompts";
import mri from "mri";
import { checkPython, createPythonEnv, installPythonDeps, cloneTemplate, editPackageJson, copyTemplate, isDirEmpty } from "./utils.js";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PKGMAN_COMMANDS = {
        npm: {
            install: 'npm install',
            add: 'npm install',
            link: 'npm link'
        },
        yarn: {
            install: 'yarn',
            add: 'yarn add',
            link: 'yarn link'
        },
        pnpm: {
            install: 'pnpm install',
            add: 'pnpm add',
            link: 'pnpm link'
        }
    };

// Parse command line arguments
const argv = process.argv.slice(2);
const args = mri(argv, {
    boolean: ['help', 'version'],  
    string: ['template'],                        
    alias: {
        h: 'help',
        v: 'version',
        t: 'template'
    },
    default: {
        template: 'default'
    }
});

// Show help if requested
if (args.help) {
    console.log(`
    Usage: create-versapy [project-name] [options]

    Options:
        -h, --help          Show this help message
        -v, --version       Show version number
        -t, --template      Template to use (vite models templates, see doc)
    `);
    process.exit(0);
}

// Show version if requested
if (args.version) {
    console.log('VersaPy CLI v0.1.3');
    process.exit(0);
}

const manageProjectDir = async (argTargetDir) => {
    let name;
     
    if (args._.length > 0) {
        name = args._[0];
    } else if (!argTargetDir) {
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

    if (name.trim() !== ".") {
        fs.mkdirSync(name);
        process.chdir(name);
    }

    // Vite can't create properly if the current dir isn't empty 
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

const manageFrontTemplate = async () => {
    
    let framework = args.template;
    
    const baseFrameworks = [
        "vanilla", "vue", "react", "preact", "lit", 
        "svelte", "solid", "qwik", "angular"
    ];
    const validFrameworks = [...baseFrameworks, ...(baseFrameworks.map(i => i = `${i}-ts`))]

    // Check cli provided framework validity
    if (framework !== "default" && !validFrameworks.includes(framework)) {
        console.log(chalk.red(`Invalid framework: ${framework}`));
        console.log(chalk.yellow(`Valid frameworks are: ${validFrameworks.join(", ")}`));
        process.exit(1);
    }

    const _prompts = [
        { 
            type: "select", 
            name: "pkgManager", 
            message: "Select a Package Manager:", 
            choices: [ 
                { title: "npm", value: "npm" }, 
                { title: "yarn", value: "yarn" },
                { title: "pnpm", value: "pnpm" } 
            ], 
            initial: 0 
        }
    ]

    // Prompt if arguments aren't provided via cli
    if (!framework || framework === 'default') {
        _prompts.push(
            {
                type: "select",
                name: "_framework",
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
                name: "_typescript",
                message: "Use TypeScript?",
                choices: [
                    { title: "Yes", value: true },
                    { title: "No", value: false }
                ],
                initial: 0
            }
        )
    }

    const response2 = await prompts(_prompts)

    const { pkgManager } = response2;

    if (!framework || framework === 'default') {
        cloneTemplate(__dirname, `${response2._framework}${response2._typescript && "-ts"}`);
    } else {
        cloneTemplate(__dirname, framework)
    }

    console.log(
        chalk.blue("Vite project initialized. Installing Dependencies... ")
    )

    try {
        
        // install vite deps
        execSync(PKGMAN_COMMANDS[pkgManager].install, { stdio: "inherit" });
        
        // If you want to use a local version use link command otherwise install from registry
        execSync(PKGMAN_COMMANDS[pkgManager].add + " versapy", { stdio: "inherit" });
        // execSync(PKGMAN_COMMANDS[pkgManager].link + " versapy", { stdio: "inherit" });
    
    } catch (error) {
        console.error(chalk.red("Failed to install dependencies:"), error);
        process.exit(1);
    
    }

    console.log(
        "Project front dependencies successfuly installed. "
    )

    // Add and modify scripts
    editPackageJson()
}

const managePythonEnv = () => {

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
        "versapy",    

    ]);

    return { venvPath }

}

const manageTemplatesCopy = async (name) => {
    
    const folderName = path.basename(process.cwd())

    let winName = name !== "." ? name : folderName // Using default name if project was created in current dir
    
    // Creating versapy.config.json
    const config = {
        frontend: {
            host: "localhost",
            port: 5200
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

    // Adding sample backend exemple file
    copyTemplate(__dirname, 'main.py', './src-versapy/main.py')

    console.log(
        chalk.green(
            "\n Versapy Project successfuly created."
        )
    )

    console.log(
        "Now run: \n \
        \n \
            npm run dev \n \
        \n \
        "
    )
}

const argTargetDir = () => {
    const argv = process.argv.slice(2)
    const argTargetDir = argv[0] ? String(argv[0]) : undefined
    return argTargetDir
}

async function init() {

    console.log(chalk.green(`
    ===================================
            Welcome to VersaPy
        Desktop App Python Framework
    ===================================
    `));

    let { name } = await manageProjectDir(argTargetDir())

    // Copy template, install front deps and edit files
    await manageFrontTemplate()

    // Check version, create venv and install deps
    const { venvPath } = managePythonEnv()

    // Copy templates, create and edit files
    await manageTemplatesCopy(name, venvPath)

}

init();
