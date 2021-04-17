
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, DCM, PluginUtilities} = Api;

    const collections = window.BdApi.settings;
    const css = require("styles.css");

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