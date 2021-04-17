/**
 * @name BDContextMenu
 * @version 0.1.9
 * @authorLink https://twitter.com/IAmZerebos
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js
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

module.exports = (() => {
    const config = {info:{name:"BDContextMenu",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.9",description:"Adds BD shortcuts to the settings context menu.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"},changelog:[{title:"Bugfixes",type:"fixed",items:["Fixes for update META structures."]}],main:"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, DCM, PluginUtilities} = Api;

    const collections = window.BdApi.settings;
    const css = `#user-settings-cog-BandagedBD--Settings + .layer-v9HyYc .submenu-2-ysNh .scroller-2FKFPG {
    max-height: 320px;
}

#user-settings-cog-BandagedBD--Emotes + .layer-v9HyYc .submenu-2-ysNh .scroller-2FKFPG {
    max-height: 320px;
}

#user-settings-cog-BandagedBD--Plugins + .layer-v9HyYc .submenu-2-ysNh .scroller-2FKFPG {
    max-height: 320px;
}

#user-settings-cog-BandagedBD--Themes + .layer-v9HyYc .submenu-2-ysNh .scroller-2FKFPG {
    max-height: 320px;
}`;

    return class BDContextMenu extends Plugin {

        async onStart() {
            this.patchSettingsContextMenu();
            PluginUtilities.addStyle("BDCM", css);
        }

        onStop() {
            PluginUtilities.removeStyle("BDCM");
            Patcher.unpatchAll();
        }

        async patchSettingsContextMenu() {
            const SettingsContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "UserSettingsCogContextMenu");
            Patcher.after(SettingsContextMenu, "default", (component, args, retVal) => {
                const items = collections.map(c => this.buildCollectionMenu(c));
                items.push({label: "Custom CSS", action: () => {this.openCategory("custom css");}});
                items.push(this.buildAddonMenu("Plugins", window.BdApi.Plugins));
                items.push(this.buildAddonMenu("Themes", window.BdApi.Themes));
                retVal.props.children.push(DCM.buildMenuItem({type: "separator"}));
                retVal.props.children.push(DCM.buildMenuItem({type: "submenu", label: "BetterDiscord", items: items}));
            });
        }

        buildCollectionMenu(collection) {
            return {
                type: "submenu",
                label: collection.name,
                action: () => {this.openCategory(collection.name.toLowerCase());},
                items: collection.settings.map(category => {
                    return {
                        type: "submenu",
                        label: category.name,
                        action: () => () => {this.openCategory(collection.name.toLowerCase());},
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
            DiscordModules.UserSettingsWindow.open(DiscordModules.DiscordConstants.UserSettingsSections.ACCOUNT);
            while (!document.getElementsByClassName("bd-sidebar-header").length) await new Promise(r => setTimeout(r, 100));
            const tabs = document.querySelectorAll(".bd-sidebar-header ~ .item-PXvHYJ");
            const index = Array.from(tabs).findIndex(e => e.textContent.toLowerCase() === id);
            if (tabs[index] && tabs[index].click) tabs[index].click();
        }
    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/