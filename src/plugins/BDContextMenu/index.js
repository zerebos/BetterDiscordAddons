/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {ContextMenu, DOM, Webpack} = window.BdApi;
    const UserSettingsWindow = Webpack.getModule(Webpack.Filters.byProps("open", "updateAccount"));

    const collections = window.BdApi.settings;
    const css = require("styles.css");

    return class BDContextMenu extends Plugin {

        async onStart() {
            this.patchSettingsContextMenu();
            DOM.addStyle("BDCM", css);
        }

        onStop() {
            DOM.removeStyle("BDCM");
            this.contextMenuPatch?.();
        }

        patchSettingsContextMenu() {
            this.contextMenuPatch = ContextMenu.patch("user-settings-cog", (retVal) => {
                const items = collections.map(c => this.buildCollectionMenu(c));
                items.push({label: "Updates", action: () => {this.openCategory("updates");}});
                if (window.BdApi.isSettingEnabled("settings", "customcss", "customcss")) items.push({label: "Custom CSS", action: () => {this.openCategory("customcss");}});
                items.push(this.buildAddonMenu("Plugins", window.BdApi.Plugins));
                items.push(this.buildAddonMenu("Themes", window.BdApi.Themes));
                retVal?.props?.children?.props?.children?.[0].push(ContextMenu.buildItem({type: "separator"}));
                retVal?.props?.children?.props?.children?.[0].push(ContextMenu.buildItem({type: "submenu", label: "BetterDiscord", items: items}));
            });
        }

        buildCollectionMenu(collection) {
            return {
                type: "submenu",
                label: collection.name,
                action: () => {this.openCategory(collection.name);},
                items: collection.settings.map(category => {
                    return {
                        type: "submenu",
                        label: category.name,
                        action: () => {this.openCategory(collection.name);},
                        items: category.settings.filter(s => s.type === "switch" && !s.hidden).map(setting => {
                            return {
                                type: "toggle",
                                label: setting.name,
                                disabled: setting.disabled,
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
                        disabled: manager.get(addon)?.partial ?? false,
                        active: manager.isEnabled(addon),
                        action: () => {manager.toggle(addon);}
                    };
                })
            };
        }

        async openCategory(id) {
            ContextMenu.close();
            UserSettingsWindow?.open?.(id);
        }
    };
};