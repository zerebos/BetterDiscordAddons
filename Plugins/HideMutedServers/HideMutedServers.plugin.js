/**
 * @name HideMutedServers
 * @invite TyFxKer
 * @authorLink https://twitter.com/ZackRauen
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideMutedServers
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideMutedServers/HideMutedServers.plugin.js
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

var HideMutedServers = (() => {
    const config = {info:{name:"HideMutedServers",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"1.1.0",description:"Hides muted servers with a context menu option to show/hide. Acts similar to Discord's Hide Muted Channels option.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideMutedServers",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideMutedServers/HideMutedServers.plugin.js"},changelog:[{title:"What's New?",items:["Full server folder (native not the plugin) compatibility.","Muted servers inside folders will be hidden.","Folders that had all servers muted will be completely hidden."]},{title:"Bugs Squashed",type:"fixed",items:["Context menu shows again.","Muting a new server will hide instantly."]}],main:"index.js"};

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
    const {WebpackModules, ReactTools, Patcher, DiscordModules, Utilities, PluginUtilities} = Api;

    const Guilds = WebpackModules.getByDisplayName("Guilds");
    const GuildFolder = WebpackModules.getByPrototypes("renderExpandedGuilds");

    const MenuItem = WebpackModules.getByDisplayName("ToggleMenuItem");
    const isGuildMuted = WebpackModules.getByProps("isMuted").isMuted;

    const isMuted = (guild) => {
        if (guild.props.guildId) return isGuildMuted(guild.props.guildId);
        const unmuted = guild.props.guildIds.filter(g => !isGuildMuted(g));
        return !unmuted.length;
    };

    const replaceGuilds = function(component, args, originalFunction) {
        const originalGuilds = component.props.guildIds;
        const unmuted = component.props.guildIds.filter(g => !isGuildMuted(g));
        component.props.guildIds = unmuted;
        const returnValue = originalFunction(...args);
        component.props.guildIds = originalGuilds;
        return returnValue;
    };

    return class HideMutedServers extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {hide: false};
            this.guildListPatch = () => {};
            this.guildFolderExpandedPatch = () => {};
            this.guildFolderIconPatch = () => {};
        }

        onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};

            this.patchGuildContextMenu(this.promises.state);
            if (this.settings.hide) this.hideGuilds();
            Patcher.after(DiscordModules.NotificationSettingsModal, "updateNotificationSettings", this.updateGuildList);
        }

        onStop() {
            this.promises.cancel();
            Patcher.unpatchAll();
            this.showGuilds();
        }

        hideGuilds() {
            this.guildListPatch = Patcher.after(Guilds.prototype, "render", (thisObject, args, ret) => {
                const guilds = Utilities.findInReactTree(ret, a => a && a[0] && a[0].key && a[0].props && a[0].props.guildId);
                if (!guilds) return;
                guilds.splice(0, guilds.length, ...guilds.filter(g => !isMuted(g)));
            });

            this.guildFolderExpandedPatch = Patcher.instead(GuildFolder.prototype, "renderExpandedGuilds", replaceGuilds);
            this.guildFolderIconPatch = Patcher.instead(GuildFolder.prototype, "renderFolderIcon", replaceGuilds);
            this.updateGuildList();
        }

        showGuilds() {
            this.guildListPatch();
            this.guildFolderExpandedPatch();
            this.guildFolderIconPatch();
            this.updateGuildList();
        }

        updateGuildList() {
            const folderList = document.querySelectorAll(".wrapper-21YSNc");
            for (const folder of folderList) {
                const folderInstance = ReactTools.getOwnerInstance(folder);
                if (!folderInstance || !folderInstance.forceUpdate) continue;
                folderInstance.forceUpdate();
            }
            const guildList = document.querySelector(".wrapper-1Rf91z");
            if (!guildList) return;
            const guildListInstance = ReactTools.getOwnerInstance(guildList);
            if (!guildListInstance) return;
            guildListInstance.forceUpdate();
        }

        async patchGuildContextMenu(promiseState) {
            const GuildContextMenu = await PluginUtilities.getContextMenu("GUILD_ICON_");
            if (promiseState.cancelled) return;

            Patcher.after(GuildContextMenu, "default", (_, __, retVal) => {
                if (!retVal || !retVal.props || !retVal.props.children || !retVal.props.children[3]) return;
                const original = retVal.props.children[3].props.children;
                const newOne = DiscordModules.React.createElement(MenuItem, {
                    label: "Hide Muted Servers",
                    active: this.settings.hide,
                    action: () => {
                        this.settings.hide = !this.settings.hide;
                        if (this.settings.hide) this.hideGuilds();
                        else this.showGuilds();
                        this.saveSettings();
                        PluginUtilities.forceUpdateContextMenus();
                    }
                });
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
            PluginUtilities.forceUpdateContextMenus();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/