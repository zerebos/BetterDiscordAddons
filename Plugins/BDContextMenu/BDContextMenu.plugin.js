//META{"name":"BDContextMenu","displayName":"BDContextMenu","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"}*//
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

var BDContextMenu = (() => {
    const config = {"info":{"name":"BDContextMenu","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.3","description":"Adds BD shortcuts to the settings context menu. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"},"changelog":[{"title":"Improved","type":"improved","items":["Promise state is tracked so you won't see any double menus.","Made it compatible with coming BBD changes..."]},{"title":"Bugs Squashed","type":"fixed","items":["Fixed that thing where it didn't work."]}],"main":"index.js"};

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
    const {DiscordSelectors, Patcher, ReactComponents, DiscordModules, WebpackModules, ReactTools} = Api;

    const React = DiscordModules.React;
    const MenuItem = WebpackModules.getByString("disabled", "brand");
    const DiscordToggleMenuItem = WebpackModules.getByString("itemToggle", "checkbox");
    const BBDSettings = Object.entries(window.settings).filter(s => !s[1].hidden && s[1].implemented);
    const SubMenuItem = WebpackModules.find(m => m.default && m.default.displayName && m.default.displayName.includes("SubMenuItem"));

    const ToggleMenuItem = class OtherItem extends React.Component {
        handleToggle() {
            this.props.active = !this.props.active;
            if (this.props.action) this.props.action(this.props.active);
            this.forceUpdate();
        }
        render() {
            return React.createElement(DiscordToggleMenuItem, Object.assign({}, this.props, {action: this.handleToggle.bind(this)}));
        }
    };

    return class BDContextMenu extends Plugin {

        async onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchSettingsContextMenu(this.promises.state);
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
        }

        async patchSettingsContextMenu(promiseState) {
            const SettingsContextMenu = await ReactComponents.getComponentByName("UserSettingsCogContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            if (promiseState.cancelled) return;
            Patcher.after(SettingsContextMenu.component.prototype, "render", (component, args, retVal) => {

                const coreMenu = this.buildSubMenu("Core", "core");
                const bandageMenu = this.buildSubMenu("Bandages", "fork");
                const emoteMenu = this.buildSubMenu("Emotes", "emote");
                const customCSSMenu = DiscordModules.React.createElement(MenuItem, {label: "Custom CSS", action: () => {this.openCategory("customcss");}});
                const pluginMenu = this.buildContentMenu(true);
                const themeMenu = this.buildContentMenu(false);

                const mainMenu = React.createElement(SubMenuItem.default, {
                    label: "BandagedBD",
                    invertChildY: true,
                    render: [coreMenu, bandageMenu, emoteMenu, customCSSMenu, pluginMenu, themeMenu]
                });
                retVal.props.children.push(mainMenu);
            });
            SettingsContextMenu.forceUpdateAll();
            for (const element of document.querySelectorAll(DiscordSelectors.ContextMenu.contextMenu)) {
				const updater = ReactTools.getReactProperty(element, "return.stateNode.props.onHeightUpdate");
				if (typeof(updater) == "function") updater();
			}
        }

        buildSubMenu(name, id) {
            const menuItems = [];
            const subMenu = React.createElement(SubMenuItem.default, {
                label: name,
                invertChildY: true,
                render: menuItems,
                action: () => {this.openCategory(id);}
            });
            const categorySettings = BBDSettings.filter(s => s[1].cat == id);
            if (!categorySettings.length) return null;
            for (const setting of categorySettings) {
                const item = React.createElement(ToggleMenuItem, {
                    label: setting[0],
                    active: window.settingsCookie[window.settings[setting[0]].id],
                    action: () => {
                        const id = window.settings[setting[0]].id;
                        window.settingsPanel.updateSettings(id, !window.settingsCookie[id]);
                    }
                });
                menuItems.push(item);
            }
            return subMenu;
        }

        buildContentMenu(isPlugins) {
            const menuItems = [];
            const subMenu = React.createElement(SubMenuItem.default, {
                label: isPlugins ? "Plugins" : "Themes",
                invertChildY: true,
                render: menuItems,
                action: () => {this.openCategory(isPlugins ? "plugins" : "themes");}
            });
            for (const content of Object.keys(isPlugins ? window.bdplugins : window.bdthemes).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))) {
                const item = React.createElement(ToggleMenuItem, {
                    label: content,
                    active: isPlugins ? window.pluginCookie[content] : window.themeCookie[content],
                    action: () => {
                        if (isPlugins) window.pluginModule.togglePlugin(content);
                        else window.themeModule.toggleTheme(content);
                    }
                });
                menuItems.push(item);
            }
            return subMenu;
        }

        async openCategory(id) {
            DiscordModules.ContextMenuActions.closeContextMenu();
            DiscordModules.UserSettingsWindow.open(DiscordModules.DiscordConstants.UserSettingsSections.ACCOUNT);
            while (!window.settingsPanel.sidebar.root) await new Promise(r => setTimeout(r, 100));
            window.settingsPanel.sideBarOnClick(id);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/