/**
 * @name BDContextMenu
 * @description Adds BD shortcuts to the settings context menu.
 * @version 0.1.13
 * @author Zerebos
 * @authorId 249746236008169473
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
        version: "0.1.13",
        description: "Adds BD shortcuts to the settings context menu.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"
    },
    changelog: [
        {
            title: "Bugfixes",
            type: "fixed",
            items: [
                "Context menu should show up again."
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
    const {ContextMenu, DOM, Webpack} = window.BdApi;
    const UserSettingsWindow = Webpack.getModule(Webpack.Filters.byProps("open", "updateAccount"));

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
            this.patchSettingsContextMenu();
            DOM.addStyle("BDCM", css);
        }

        onStop() {
            DOM.removeStyle("BDCM");
            this.contextMenuPatch?.();
        }

        patchSettingsContextMenu() {
            // console.log("GOING TO PATCH")
            this.contextMenuPatch = ContextMenu.patch("user-settings-cog", (retVal) => {
                // console.log("bdcm", retVal); // props.children.props.children[0]
                const items = collections.map(c => this.buildCollectionMenu(c));
                items.push({label: "Updates", action: () => {this.openCategory("updates");}});
                if (window.BdApi.isSettingEnabled("settings", "customcss", "customcss")) items.push({label: "Custom CSS", action: () => {this.openCategory("customcss");}});
                items.push(this.buildAddonMenu("Plugins", window.BdApi.Plugins));
                items.push(this.buildAddonMenu("Themes", window.BdApi.Themes));
                retVal.props.children.props.children[0].push(ContextMenu.buildItem({type: "separator"}));
                retVal.props.children.props.children[0].push(ContextMenu.buildItem({type: "submenu", label: "BetterDiscord", items: items}));
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
                                disabled: setting.disabled,
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
                        disabled: manager.get(addon)?.partial ?? false,
                        active: manager.isEnabled(addon),
                        action: () => {manager.toggle(addon);}
                    };
                })
            };
        }

        async openCategory(id) {
            ContextMenu.close();
            UserSettingsWindow?.open?.(id);
        }
    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/