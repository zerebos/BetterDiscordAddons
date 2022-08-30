/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");
const args = process.argv.slice(2);
const defaultConfig = require(path.join(__dirname, "../package.json")).buildConfig;
const configFilePath = path.join(__dirname, "../config.json");
const buildConfig = Object.assign(defaultConfig, fs.existsSync(configFilePath) ? require(configFilePath) : {});
const pluginsPath = path.isAbsolute(buildConfig.pluginsFolder) ? buildConfig.pluginsFolder : path.join(__dirname, "..", buildConfig.pluginsFolder);
const releasePath = path.isAbsolute(buildConfig.releaseFolder) ? buildConfig.releaseFolder : path.join(__dirname, "..", buildConfig.releaseFolder);
const windows = process.env.APPDATA;
const mac = process.env.HOME + "/Library/Application Support";
const linux = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : process.env.HOME + "/.config";
let bdFolder = (process.platform == "win32" ? windows : process.platform == "darwin" ? mac : linux) + "/BetterDiscord/";
if (buildConfig.bdFolder) bdFolder = buildConfig.bdFolder;

const embedFiles = function(content, pluginName, files) {
    for (const fileName of files) {
        content = content.replace(new RegExp(`require\\(('|"|\`)${fileName}('|"|\`)\\)`, "g"), () => {
            const filePath = path.join(pluginsPath, pluginName, fileName);
            if (!fileName.endsWith(".js")) return `\`${fs.readFileSync(filePath).toString().replace(/\\/g, `\\\\`).replace(/\\\\\$\{/g, "\\${").replace(/`/g, "\\`")}\``;
            const exported = require(filePath);
            if (typeof(exported) !== "object" && !Array.isArray(exported)) return `(${require(filePath).toString()})`;
            if (Array.isArray(exported)) return `(${JSON.stringify(exported)})`;
            const raw = fs.readFileSync(filePath).toString().replace(/module\.exports\s*=\s*/, "");
            return `(() => {return ${raw}})()`;
        });
    }
    return content;
};

const template = fs.readFileSync(path.join(__dirname, "template.js")).toString();
const list = args.slice(1).length ? args.slice(1) : fs.readdirSync(pluginsPath).filter(f => fs.lstatSync(path.join(pluginsPath, f)).isDirectory());
console.log("");
console.log(`Building ${list.length} plugin${list.length > 1 ? "s" : ""}`);
console.time("Build took");
for (let f = 0; f < list.length; f++) {
    const pluginName = list[f];
    const configPath = path.join(pluginsPath, pluginName, "config.json");
    console.log(`Building ${pluginName} from ${configPath}`);
    
    if (!fs.existsSync(configPath)) {
        console.error(`Could not find "${configPath}". Skipping...`);
        continue;
    }
    const config = require(configPath);
    const files = fs.readdirSync(path.join(pluginsPath, pluginName)).filter(f => f != "config.json" && f != config.main);
    const content = embedFiles(require(path.join(pluginsPath, pluginName, config.main)).toString(), pluginName, files);
    let result = buildMeta(config);
    if (buildConfig.addInstallScript) result += require(path.join(__dirname, "installscript.js"));
    result += template.replace(`const config = "";`, `const config = ${JSON.stringify(config, null, 4).replace(/"((?:[A-Za-z]|[0-9]|_)+)"\s?:/g, "$1:")};`)
                      .replace(`const plugin = "";`, `const plugin = ${content};`);
    if (buildConfig.addInstallScript) result += "\n/*@end@*/";
    const buildFile = path.join(releasePath, pluginName, pluginName + ".plugin.js");
    fs.writeFileSync(buildFile, result);
    if (buildConfig.copyToBD) {
        console.log(`Copying ${pluginName} to BD folder`);
        fs.writeFileSync(path.join(bdFolder, "plugins", pluginName + ".plugin.js"), result);
    }
    console.log(`${pluginName} built successfully`);
    console.log(`${pluginName} saved as ${buildFile}`);
}
console.timeEnd("Build took");

function buildMeta(config) {
    const metaString = ["/**"];
    const line = (label, val) => val && metaString.push(` * @${label} ${val}`);
    line("name", config.info.name);
    line("description", config.info.description);
    line("version", config.info.version);
    line("author", config.info.authors.map(a => a.name).join(", "));
    line("authorId", config.info.authors[0].id ?? config.info.authors[0].discord_id);
    line("authorLink", config.info.authors[0].link ?? buildConfig.authorLink);
    line("invite", config.info.invite ?? buildConfig.invite);
    line("website", config.info.website ?? config.info.github);
    line("source", config.info.source ?? config.info.github_raw);
    line("donate", config.info.donate);
    line("patreon", config.info.patreon);
    metaString.push(" */");
    metaString.push("");
    return metaString.join("\n");
}

