
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, DCM, PluginUtilities} = Api;

    const BBDSettings = Object.entries(window.BdApi.settings).filter(s => !s[1].hidden && s[1].implemented);
    const collections = window.BdApi.settings;

    const css = require("styles.css");

    return class BDContextMenu extends Plugin {

        async onStart() {
            if (BBDSettings.length) this.patchSettingsContextMenu__Old();
            else this.patchSettingsContextMenu();
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

        async patchSettingsContextMenu__Old() {
            const SettingsContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "UserSettingsCogContextMenu");
            Patcher.after(SettingsContextMenu, "default", (component, args, retVal) => {
                const coreMenu = this.buildSubMenu__Old("Settings", "core");
                const emoteMenu = this.buildSubMenu__Old("Emotes", "emote");
                const customCSSMenu = {label: "Custom CSS", action: () => {this.openCategory__Old("custom css");}};
                const pluginMenu = this.buildContentMenu__Old(true);
                const themeMenu = this.buildContentMenu__Old(false);
                retVal.props.children.push(DCM.buildMenuItem({type: "separator"}));
                retVal.props.children.push(DCM.buildMenuItem({type: "submenu", label: "BandagedBD", items: [coreMenu, emoteMenu, pluginMenu, themeMenu, customCSSMenu]}));
            });
        }

        buildSubMenu__Old(name, id) {
            return {type: "submenu", label: name, action: () => {this.openCategory__Old(name.toLowerCase());}, items: BBDSettings.filter(s => s[1].cat == id).map(setting => {
                return {type: "toggle", label: setting[0], active: BdApi.isSettingEnabled(BdApi.settings[setting[0]].id), action: () => {BdApi.toggleSetting(BdApi.settings[setting[0]].id);}};
            })};
        }

        buildContentMenu__Old(isPlugins) {
            const names = (isPlugins ? BdApi.Plugins.getAll().map(p => p.getName()) : BdApi.Themes.getAll().map(t => t.name)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            const AddonAPI = isPlugins ? BdApi.Plugins : BdApi.Themes;

            return {type: "submenu", label: isPlugins ? "Plugins" : "Themes", action: () => {this.openCategory__Old(isPlugins ? "plugins" : "themes");}, items: names.map(content => {
                return {type: "toggle", label: content, active: AddonAPI.isEnabled(content), action: () => {AddonAPI.toggle(content);}};
            })};
        }

        async openCategory__Old(id) {
            DiscordModules.ContextMenuActions.closeContextMenu();
            DiscordModules.UserSettingsWindow.open(DiscordModules.DiscordConstants.UserSettingsSections.ACCOUNT);
            while (!document.getElementById("bd-settings-sidebar")) await new Promise(r => setTimeout(r, 100));
            const tabs = document.getElementsByClassName("ui-tab-bar-item");
            const index = Array.from(tabs).findIndex(e => e.textContent.toLowerCase() === id);
            if (tabs[index] && tabs[index].click) tabs[index].click();
        }

    };
};