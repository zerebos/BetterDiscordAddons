//META{"name":"BDContextMenu","displayName":"BDContextMenu","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"}*//

var BDContextMenu = (() => {
    const config = {"info":{"name":"BDContextMenu","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.1","description":"Adds BD shortcuts to the settings context menu. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Fixed issues with Discord's internal changes."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {DiscordSelectors, Patcher, ReactComponents, DiscordModules, WebpackModules, ReactTools} = Api;

    const React = DiscordModules.React;
    const MenuItem = WebpackModules.getByRegex(/(?=.*disabled)(?=.*brand)/);
    const DiscordToggleMenuItem = WebpackModules.getByRegex(/(?=.*itemToggle)(?=.*checkbox)/);
    const BBDSettings = Object.entries(window.settings).filter(s => !s[1].hidden && s[1].implemented);

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
            this.SubMenuItem = await ReactComponents.getComponent("FluxContainer", DiscordSelectors.ContextMenu.itemSubMenu, m => {
				try {
					const instance = new m({});
					const rendered = instance.render();
					return rendered.type.displayName == "SubMenuItem";
                } 
                catch (e) {return false;}
			});
            this.patchSettingsContextMenu();
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

        async patchSettingsContextMenu() {
            const SettingsContextMenu = await ReactComponents.getComponentByName("UserSettingsCogContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            Patcher.after(SettingsContextMenu.component.prototype, "render", (component, args, retVal) => {

                const coreMenu = this.buildSubMenu("Core", "core");
                const bandageMenu = this.buildSubMenu("Bandages", "fork");
                const emoteMenu = this.buildSubMenu("Emotes", "emote");
                const customCSSMenu = new MenuItem({label: "Custom CSS", action: () => {this.openCategory("customcss");}});
                const pluginMenu = this.buildContentMenu(true);
                const themeMenu = this.buildContentMenu(false);
                
                const mainMenu = React.createElement(this.SubMenuItem.component, {
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
            const subMenu = React.createElement(this.SubMenuItem.component, {
                label: name,
                invertChildY: true,
                render: menuItems,
                action: () => {this.openCategory(id);}
            });
            for (const setting of BBDSettings.filter(s => s[1].cat == id)) {
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
            const subMenu = React.createElement(this.SubMenuItem.component, {
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