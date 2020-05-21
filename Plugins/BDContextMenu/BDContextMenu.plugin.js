/**
 * @name BDContextMenu
 * @invite TyFxKer
 * @authorLink https://twitter.com/ZackRauen
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
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
    const config = {info:{name:"BDContextMenu",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.7",description:"Adds BD shortcuts to the settings context menu.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"},changelog:[{title:"Fixed",type:"fixed",items:["Menu shows up again."]}],main:"index.js"};

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

    const BBDSettings = Object.entries(BdApi.settings).filter(s => !s[1].hidden && s[1].implemented);

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
                const coreMenu = this.buildSubMenu("Settings", "core");
                const emoteMenu = this.buildSubMenu("Emotes", "emote");
                const customCSSMenu = {label: "Custom CSS", action: () => {this.openCategory("custom css");}};
                const pluginMenu = this.buildContentMenu(true);
                const themeMenu = this.buildContentMenu(false);
                retVal.props.children.push(DCM.buildMenuItem({type: "separator"}));
                retVal.props.children.push(DCM.buildMenuItem({type: "submenu", label: "BandagedBD", items: [coreMenu, emoteMenu, pluginMenu, themeMenu, customCSSMenu]}));
            });
        }

        buildSubMenu(name, id) {
            return {type: "submenu", label: name, action: () => {this.openCategory(name.toLowerCase());}, items: BBDSettings.filter(s => s[1].cat == id).map(setting => {
                return {type: "toggle", label: setting[0], active: BdApi.isSettingEnabled(BdApi.settings[setting[0]].id), action: () => {BdApi.toggleSetting(BdApi.settings[setting[0]].id);}};
            })};
        }

        buildContentMenu(isPlugins) {
            const names = (isPlugins ? BdApi.Plugins.getAll().map(p => p.getName()) : BdApi.Themes.getAll().map(t => t.name)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            const AddonAPI = isPlugins ? BdApi.Plugins : BdApi.Themes;

            return {type: "submenu", label: isPlugins ? "Plugins" : "Themes", action: () => {this.openCategory(isPlugins ? "plugins" : "themes");}, items: names.map(content => {
                return {type: "toggle", label: content, active: AddonAPI.isEnabled(content), action: () => {AddonAPI.toggle(content);}};
            })};
        }

        async openCategory(id) {
            DiscordModules.ContextMenuActions.closeContextMenu();
            DiscordModules.UserSettingsWindow.open(DiscordModules.DiscordConstants.UserSettingsSections.ACCOUNT);
            while (!document.getElementById("bd-settings-sidebar")) await new Promise(r => setTimeout(r, 100));
            const tabs = document.getElementsByClassName("ui-tab-bar-item");
            const index = Array.from(tabs).findIndex(e => e.textContent.toLowerCase() === id);
            if (tabs[index] && tabs[index].click) tabs[index].click();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/