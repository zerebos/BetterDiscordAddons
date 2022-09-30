/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, DCM, PluginUtilities, WebpackModules} = Api;

    const collections = window.BdApi.settings;
    const css = require("styles.css");

    return class BDContextMenu extends Plugin {

        async onStart() {
            this.contextMenuPatches = [];
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchSettingsContextMenu(this.promises.state);
            PluginUtilities.addStyle("BDCM", css);
        }

        onStop() {
            this.promises.cancel();
            PluginUtilities.removeStyle("BDCM");
            Patcher.unpatchAll();
            for (const cancel of this.contextMenuPatches) cancel();
        }

        async findContextMenu(displayName) {
            const normalFilter = (exports) => exports && exports.default && exports.default.displayName === displayName;
            const nestedFilter = (module) => module.toString().includes(displayName);
            {
                const normalCache = WebpackModules.getModule(normalFilter);
                if (normalCache) return {type: "normal", module: normalCache};
            }
            {
                const webpackId = Object.keys(WebpackModules.require.m).find(id => nestedFilter(WebpackModules.require.m[id]));
                const nestedCache = webpackId !== undefined && WebpackModules.getByIndex(webpackId);
                if (nestedCache) return {type: "nested", module: nestedCache};
            }
            return new Promise((resolve) => {
                const listener = (exports, module) => {
                    const normal = normalFilter(exports);
                    const nested = nestedFilter(module);
                    if (!nested && !normal) return;
                    resolve({type: normal ? "normal" : "nested", module: exports});
                    WebpackModules.removeListener(listener);
                };
                WebpackModules.addListener(listener);
                this.contextMenuPatches.push(() => {
                    WebpackModules.removeListener(listener);
                });
            });
        }

        async patchSettingsContextMenu(promiseState) {
            const self = this;
            const SettingsContextMenu = await this.findContextMenu("UserSettingsCogContextMenu");
            if (promiseState.cancelled) return;
            Patcher.after(SettingsContextMenu.module, "default", (component, args, retVal) => {
                const orig = retVal.props.children.type;
                retVal.props.children.type = function() {
                    const returnValue = Reflect.apply(orig, this, arguments);
                    const items = collections.map(c => self.buildCollectionMenu(c));
                    if (window.BdApi.isSettingEnabled("settings", "customcss", "customcss")) items.push({label: "Custom CSS", action: () => {self.openCategory("customcss");}});
                    items.push(self.buildAddonMenu("Plugins", window.BdApi.Plugins));
                    items.push(self.buildAddonMenu("Themes", window.BdApi.Themes));
                    returnValue.props.children.props.children[0].push(DCM.buildMenuItem({type: "separator"}));
                    returnValue.props.children.props.children[0].push(DCM.buildMenuItem({type: "submenu", label: "BetterDiscord", items: items}));
                    return returnValue;
                };
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
            DiscordModules.UserSettingsWindow.open(id);
        }
    };
};