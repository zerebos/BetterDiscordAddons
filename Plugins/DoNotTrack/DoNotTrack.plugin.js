/**
 * @name DoNotTrack
 * @description Stops Discord from tracking everything you do like Sentry and Analytics.
 * @version 0.0.8
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/DoNotTrack
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/DoNotTrack/DoNotTrack.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    info: {
        name: "DoNotTrack",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "0.0.8",
        description: "Stops Discord from tracking everything you do like Sentry and Analytics.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/DoNotTrack",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/DoNotTrack/DoNotTrack.plugin.js"
    },
    changelog: [
        {
            title: "Fixes",
            type: "fixed",
            items: [
                "Fixed for Discord changes"
            ]
        }
    ],
    main: "index.js",
    defaultConfig: [
        {
            type: "switch",
            id: "stopProcessMonitor",
            name: "Stop Process Monitor",
            note: "This setting stops Discord from monitoring the processes on your PC and prevents your currently played game from showing.",
            value: true
        }
    ]
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {Patcher, WebpackModules, Modals} = Api;

    const SettingsManager = WebpackModules.getByProps("ShowCurrentGame");
    const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");

    return class DoNotTrack extends Plugin {
        onStart() {
            
            Patcher.instead(Analytics.default, "track", () => {});

            const Logger = window.__SENTRY__.logger;
            Logger.disable(); // Kill sentry logs

            const SentryHub = window.DiscordSentry.getCurrentHub();
            SentryHub.getClient().close(0); // Kill reporting
            SentryHub.getStackTop().scope.clear(); // Delete PII

            /* eslint-disable no-console */
            for (const method in console) {
                if (!console[method].__sentry_original__) continue;
                console[method] = console[method].__sentry_original__;
            }            

            if (this.settings.stopProcessMonitor) this.disableProcessMonitor();
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

        disableProcessMonitor() {
            SettingsManager?.ShowCurrentGame?.updateSetting(false);
            const NativeModule = WebpackModules.getByProps("getDiscordUtils");
            const DiscordUtils = NativeModule.getDiscordUtils();
            DiscordUtils.setObservedGamesCallback([], () => {});
        }

        enableProcessMonitor() {
            SettingsManager?.ShowCurrentGame?.updateSetting(true);
            Modals.showConfirmationModal("Reload Discord?", "To reenable the process monitor Discord needs to be reloaded.", {
                confirmText: "Reload",
                cancelText: "Later",
                onConfirm: () => {
                    window.location.reload();
                }
            });
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

        updateSettings(id, value) {
            if (id !== "stopProcessMonitor") return;
            if (value) return this.disableProcessMonitor();
            return this.enableProcessMonitor();
        }

    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/