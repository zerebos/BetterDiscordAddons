//META{"name":"HideMutedServers","displayName":"HideMutedServers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideMutedServers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideMutedServers/HideMutedServers.plugin.js"}*//
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
    const config = {"info":{"name":"HideMutedServers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"1.0.3","description":"Hides muted servers with a context menu option to show/hide. Acts similar to Discord's Hide Muted Channels option. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideMutedServers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideMutedServers/HideMutedServers.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Changed a thing.","Changed guild to server in UI."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, ReactTools, Patcher, ContextMenu, Utilities} = Api;
    return class HideMutedServers extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {hide: false};
            this.contextObserver = new MutationObserver((changes) => {
                for (const change in changes) this.observeContextMenus(changes[change]);
            });
        }

        onStart() {
            this.bindContextMenus();
            if (this.settings.hide) this.hideGuilds();
        }

        onStop() {
            this.unbindContextMenus();
            this.showGuilds();
        }

        hideGuilds() {
            const isMuted = WebpackModules.getByProps("isMuted").isMuted;
            const Guilds = WebpackModules.getByDisplayName("Guilds");
            Patcher.after(Guilds.prototype, "render", (thisObject, args, ret) => {
                const guilds = Utilities.findInReactTree(ret, a => a && a[0] && a[0].key && a[0].props && a[0].props.guildId);
                if (!guilds) return;
                guilds.splice(0, guilds.length, ...guilds.filter(g => !isMuted(g.key)));
            });
            this.updateGuildList();
        }

        showGuilds() {
            Patcher.unpatchAll();
            this.updateGuildList();
        }

        updateGuildList() {
            const guildList = document.querySelector(".wrapper-1Rf91z");
            if (!guildList) return;
            const guildListInstance = ReactTools.getOwnerInstance(guildList);
            if (!guildListInstance) return;
            guildListInstance.forceUpdate();
        }

        bindContextMenus() {
            this.contextObserver.observe(document.querySelector("#app-mount"), {childList: true, subtree: true});
        }

        unbindContextMenus() {
            this.contextObserver.disconnect();
        }

        observeContextMenus(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
            const elem = e.addedNodes[0];
            const isContextMenu = elem.matches(DiscordSelectors.ContextMenu.contextMenu);
            if (!isContextMenu) return;
            const contextMenu = elem;
            const isGuildContext = ReactTools.getReactProperty(contextMenu, "return.memoizedProps.type") == "GUILD_ICON_BAR";
            if (!isGuildContext) return;
            const menuItem = new ContextMenu.ToggleItem("Hide Muted Servers", this.settings.hide, {callback: () => {
                this.settings.hide = !this.settings.hide;
                if (this.settings.hide) this.hideGuilds();
                else this.showGuilds();
                this.saveSettings();
            }});
            const menuGroup = new ContextMenu.ItemGroup();
            menuGroup.addItems(menuItem);
            contextMenu.find(DiscordSelectors.ContextMenu.itemGroup).after(menuGroup.getElement());
            ContextMenu.updateDiscordMenu(contextMenu);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/