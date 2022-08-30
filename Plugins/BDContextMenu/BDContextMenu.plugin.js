/**
 * @name BDContextMenu
 * @description Adds BD shortcuts to the settings context menu.
 * @version 0.1.12
 * @author Zerebos
 * @authorId 249746236008169473
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js
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
        name: "BDContextMenu",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "0.1.12",
        description: "Adds BD shortcuts to the settings context menu.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"
    },
    changelog: [
        {
            title: "Bugfixes",
            type: "fixed",
            items: [
                "Context menu should show up again.",
                "Clicking to go to each section works again!"
            ]
        }
    ],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {Patcher, DiscordModules, DCM, PluginUtilities, WebpackModules} = Api;

    const collections = window.BdApi.settings;
    const css = `#user-settings-cog-BetterDiscord--Settings + .layer-2aCOJ3 .submenu-1apzyU .scroller-1bVxF5 {
    max-height: 320px;
}

#user-settings-cog-BetterDiscord--Emotes + .layer-2aCOJ3 .submenu-1apzyU .scroller-1bVxF5 {
    max-height: 320px;
}

#user-settings-cog-BetterDiscord--Plugins + .layer-2aCOJ3 .submenu-1apzyU .scroller-1bVxF5 {
    max-height: 320px;
}

#user-settings-cog-BetterDiscord--Themes + .layer-2aCOJ3 .submenu-1apzyU .scroller-1bVxF5 {
    max-height: 320px;
}`;

    return class BDContextMenu extends Plugin {

        async onStart() {
            this.contextMenuPatches = [];
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchSettingsContextMenu(this.promises.state);
            PluginUtilities.addStyle("BDCM", css);
        }

        onStop() {
            this.promises.cancel();
            PluginUtilities.removeStyle("BDCM");
            Patcher.unpatchAll();
            for (const cancel of this.contextMenuPatches) cancel();
        }

        async findContextMenu(displayName) {
            const normalFilter = (exports) => exports && exports.default && exports.default.displayName === displayName;
            const nestedFilter = (module) => module.toString().includes(displayName);
            {
                const normalCache = WebpackModules.getModule(normalFilter);
                if (normalCache) return {type: "normal", module: normalCache};
            }
            {
                const webpackId = Object.keys(WebpackModules.require.m).find(id => nestedFilter(WebpackModules.require.m[id]));
                const nestedCache = webpackId !== undefined && WebpackModules.getByIndex(webpackId);
                if (nestedCache) return {type: "nested", module: nestedCache};
            }
            return new Promise((resolve) => {
                const listener = (exports, module) => {
                    const normal = normalFilter(exports);
                    const nested = nestedFilter(module);
                    if (!nested && !normal) return;
                    resolve({type: normal ? "normal" : "nested", module: exports});
                    WebpackModules.removeListener(listener);
                };
                WebpackModules.addListener(listener);
                this.contextMenuPatches.push(() => {
                    WebpackModules.removeListener(listener);
                });
            });
        }

        async patchSettingsContextMenu(promiseState) {
            const self = this;
            const SettingsContextMenu = await this.findContextMenu("UserSettingsCogContextMenu");
            if (promiseState.cancelled) return;
            Patcher.after(SettingsContextMenu.module, "default", (component, args, retVal) => {
                const orig = retVal.props.children.type;
                retVal.props.children.type = function() {
                    const returnValue = Reflect.apply(orig, this, arguments);
                    const items = collections.map(c => self.buildCollectionMenu(c));
                    if (window.BdApi.isSettingEnabled("settings", "customcss", "customcss")) items.push({label: "Custom CSS", action: () => {self.openCategory("customcss");}});
                    items.push(self.buildAddonMenu("Plugins", window.BdApi.Plugins));
                    items.push(self.buildAddonMenu("Themes", window.BdApi.Themes));
                    returnValue.props.children.props.children[0].push(DCM.buildMenuItem({type: "separator"}));
                    returnValue.props.children.props.children[0].push(DCM.buildMenuItem({type: "submenu", label: "BetterDiscord", items: items}));
                    return returnValue;
                };
            });
        }

        buildCollectionMenu(collection) {
            return {
                type: "submenu",
                label: collection.name,
                action: () => {this.openCategory(collection.name);},
                items: collection.settings.map(category => {
                    return {
                        type: "submenu",
                        label: category.name,
                        action: () => {this.openCategory(collection.name);},
                        items: category.settings.filter(s => s.type === "switch" && !s.hidden).map(setting => {
                            return {
                                type: "toggle",
                                label: setting.name,
                                active: window.BdApi.isSettingEnabled(collection.id, category.id, setting.id),
                                action: () => window.BdApi.toggleSetting(collection.id, category.id, setting.id)
                            };
                        })
                    };
                })
            };
        }

        buildAddonMenu(label, manager) {
            const ids = manager.getAll().map(a => a.name || a.getName()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            return {
                type: "submenu",
                label: label,
                action: () => {this.openCategory(label.toLowerCase());},
                items: ids.map(addon => {
                    return {
                        type: "toggle",
                        label: addon,
                        active: manager.isEnabled(addon),
                        action: () => {manager.toggle(addon);}
                    };
                })
            };
        }

        async openCategory(id) {
            DiscordModules.ContextMenuActions.closeContextMenu();
            DiscordModules.UserSettingsWindow.open(id);
        }
    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/