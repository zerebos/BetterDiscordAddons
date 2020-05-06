
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, DCM} = Api;

    const BBDSettings = Object.entries(BdApi.settings).filter(s => !s[1].hidden && s[1].implemented);

    return class BDContextMenu extends Plugin {

        async onStart() {
            this.patchSettingsContextMenu();
        }

        onStop() {
            Patcher.unpatchAll();
        }

        async patchSettingsContextMenu() {
            const SettingsContextMenu = WebpackModules.getByDisplayName("UserSettingsCogContextMenu");
            Patcher.after(SettingsContextMenu.prototype, "render", (component, args, retVal) => {
                const coreMenu = this.buildSubMenu("Settings", "core");
                const emoteMenu = this.buildSubMenu("Emotes", "emote");
                const customCSSMenu = {label: "Custom CSS", action: () => {this.openCategory("custom css");}};
                const pluginMenu = this.buildContentMenu(true);
                const themeMenu = this.buildContentMenu(false);
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