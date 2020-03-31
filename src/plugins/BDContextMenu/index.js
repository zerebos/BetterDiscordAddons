
module.exports = (Plugin, Api) => {
    const {DiscordSelectors, Patcher, ReactComponents, DiscordModules, WebpackModules, ReactTools} = Api;

    const React = DiscordModules.React;
    const MenuItem = DiscordModules.ContextMenuItem;
    const DiscordToggleMenuItem = WebpackModules.getByString("itemToggle", "checkbox");
    const BBDSettings = Object.entries(BdApi.settings).filter(s => !s[1].hidden && s[1].implemented);
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

                const coreMenu = this.buildSubMenu("Settings", "core");
                const emoteMenu = this.buildSubMenu("Emotes", "emote");
                const customCSSMenu = DiscordModules.React.createElement(MenuItem, {label: "Custom CSS", action: () => {this.openCategory("custom css");}});
                const pluginMenu = this.buildContentMenu(true);
                const themeMenu = this.buildContentMenu(false);

                const mainMenu = React.createElement(SubMenuItem.default, {
                    label: "BandagedBD",
                    invertChildY: true,
                    render: [coreMenu, emoteMenu, pluginMenu, themeMenu, customCSSMenu]
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
                action: () => {this.openCategory(name.toLowerCase());}
            });
            const categorySettings = BBDSettings.filter(s => s[1].cat == id);
            if (!categorySettings.length) return null;
            for (const setting of categorySettings) {
                const item = React.createElement(ToggleMenuItem, {
                    label: setting[0],
                    active: BdApi.isSettingEnabled(BdApi.settings[setting[0]].id),
                    action: () => {
                        BdApi.toggleSetting(BdApi.settings[setting[0]].id);
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
            const pluginNames = BdApi.Plugins.getAll().map(p => p.getName());
            const themeNames = BdApi.Themes.getAll().map(t => t.name);
            for (const content of (isPlugins ? pluginNames : themeNames).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))) {
                const item = React.createElement(ToggleMenuItem, {
                    label: content,
                    active: isPlugins ? BdApi.Plugins.isEnabled(content) : BdApi.Themes.isEnabled(content),
                    action: () => {
                        if (isPlugins) BdApi.Plugins.toggle(content);
                        else BdApi.Themes.toggle(content);
                    }
                });
                menuItems.push(item);
            }
            return subMenu;
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