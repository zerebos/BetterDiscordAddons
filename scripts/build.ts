/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import {sveltePreprocess} from "svelte-preprocess";

import install from "./install";
import buildMeta from "./meta";
import {$} from "bun";


const pluginName = process.argv.slice(2)[0];

// Initialize bdFolder
const windows = process.env.APPDATA;
const mac = process.env.HOME + "/Library/Application Support";
const linux = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : process.env.HOME + "/.config";
let bdFolder = (process.platform == "win32" ? windows : process.platform == "darwin" ? mac : linux) + "/BetterDiscord/";

if (process.env.WSL_DISTRO_NAME) {
    // WSL detected, generate proper windows path for wsl
    const appdata = (await $`wslpath "$(cmd.exe /c "echo %APPDATA%" 2>/dev/null | tr -d '\r')"`.text()).trim();
    bdFolder = path.join(appdata, "BetterDiscord") + "/";
}

// Setup input and output bases
const projectRoot = path.dirname(process.env.npm_package_json ?? "..");
const pluginsPath = path.join(projectRoot, "src", "plugins");
const releasePath = path.join(projectRoot, "Plugins", pluginName);
const releaseFile = path.join(releasePath, `${pluginName}.plugin.js`);
if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, {recursive: true});
if (!fs.existsSync(releasePath)) fs.mkdirSync(releasePath, {recursive: true});

// Setup plugin specific paths
const pluginFolder = path.join(pluginsPath, pluginName);
const configPath = path.join(pluginsPath, pluginName, "config.ts");
const pluginFolderExists = fs.existsSync(pluginFolder);
const configExists = fs.existsSync(configPath);


// Copies to BD folder after every build and updates the meta
const copyToBDPlugin: esbuild.Plugin = {
    name: "CopyToBD",
    async setup(build: esbuild.PluginBuild) {
        build.onEnd(async result => {
            if (result.errors.length || !result.metafile) return;

            // Add the banner and install script
            const config = await buildConfig();
            const banner = buildMeta(config) + "\n" + install + "\n";
            const output = fs.readFileSync(releaseFile).toString();
            const newFileContent = banner + output + "\n/*@end@*/";
            fs.writeFileSync(releaseFile, newFileContent);

            fs.writeFileSync(path.join(bdFolder, "plugins", `${pluginName}.plugin.js`), fs.readFileSync(releaseFile));
        });


    }
};

async function buildConfig() {
    // Forcibly use UUID to make sure there's no import caching issues
    const configTempFile = path.join(releasePath, `${crypto.randomUUID()}.config.js`);

    // Temporarily build the config
    await esbuild.build({
        entryPoints: [configPath],
        outfile: configTempFile,
    });

    // Import in the result and remove the temp file
    const config = (await import("file://" + configTempFile)).default;
    fs.rmSync(configTempFile);
    return config;
}

async function buildPlugin() {
    console.log("");
    console.time("Build took");
    console.log(`Building ${pluginName} from ${configPath}`);

    if (!pluginFolderExists || !configExists) {
        console.error(`Could not build plugin ${pluginName}. Config not found.`);
        process.exit(1);
    }

    // TODO: maybe just remove `main` and have all of them use index.ts
    const config = await buildConfig();
    const mainFilePath = path.join(pluginFolder, config.main);

    if (!fs.existsSync(mainFilePath)) {
        console.error(`Could not build plugin ${pluginName}. Main file (${config.main}) not found.`);
        process.exit(2);
    }

    const ctx = await esbuild.context({
        entryPoints: [mainFilePath],
        outfile: releaseFile,
        bundle: true,
        format: "cjs",
        target: ["chrome128"],
        external: ["events"],
        loader: {".css": "text", ".html": "text", ".svg": "text"},
        logLevel: "info",
        metafile: true,
        minify: false,
        plugins: [
            copyToBDPlugin,
            esbuildSvelte({
                preprocess: sveltePreprocess(),
                compilerOptions: {
                    css: "injected",
                    cssHash: ({hash, css}) => `${pluginName}-${hash(css)}`
                }
            })
        ],
        treeShaking: true,
    });

    await ctx.rebuild();

    console.log(`${pluginName} built successfully`);
    console.log(`${pluginName} saved as ${releaseFile}`);
    console.timeEnd("Build took");

    if (process.argv.includes("--watch")) await ctx.watch();
    else await ctx.dispose();
}

buildPlugin().catch(console.error);