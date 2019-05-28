
module.exports = (Plugin, Api) => {
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

// WebpackModules.find(m => {
//     if (typeof m.render != "function") return false;
//     try {
//         const originalRender = m.render();
//         const container = originalRender.type;
//         if (!container.displayName || container.displayName != "FluxContainer") return false;
//         new container();
//         return false;
//     }
//     catch (e) {return e.toString().includes("user");}
// });


// PromiseExtended = class PromiseExtended extends Promise {
// 	constructor(callback) {
//         const promiseFunctions = {cancelCallbacks: []};
//         const state = {};
// 		super((resolve, reject) => {
//             const newReject = (value, cancelValue) => {
//                 console.log("newReject", value, cancelValue);
//                 if (value == "cancelled") state.hasCancelled = true;
//                 console.log(state.hasCancelled);
//                 reject();
//                 console.log(state.hasCancelled);
//                 if (!state.hasCancelled) return;
//                 console.log("Running cancels");
//                 for (const cancel of promiseFunctions.cancelCallbacks) {
//                     console.log(cancel);
//                     cancel(cancelValue);
//                 }
//             };
// 			promiseFunctions.reject = newReject;
//             promiseFunctions.resolve = resolve;
// 			callback(resolve, newReject);
//         });
//         this.state = state;
//         this.promiseFunctions = promiseFunctions;
//     }

//     cancel(cancelValue) {
//         this.promiseFunctions.reject("cancelled", cancelValue);
//     }

//     resolve() {
//         this.promiseFunctions.resolve(...arguments);
//     }

//     reject() {
//         this.promiseFunctions.reject(...arguments);
//     }

//     catch(callback) {
//         const newCallback = () => {
//             if (!this.state.hasCancelled) callback();
//         };
//         super.catch(newCallback);
//         return this;
//     }

//     then(resolved, rejected) {
//         const newReject = () => {
//             if (!this.state.hasCancelled) rejected();
//         };
//         if (rejected) super.then(resolved, newReject);
//         else super.then(resolved);
//         return this;
//     }

//     cancelled(callback) {
//         this.promiseFunctions.cancelCallbacks.push(callback);
//         return this;
//     }
// };


// const test = async function() {
//     const blah = [];
//     for (var i = 0; i < 100000; i++) {
//         blah.push(i*2);
//     }
//     await new Promise(r=>{setTimeout(r,5000);});
//     console.log("finished")
// };

// const makeCancellable = function(asyncFunction) {
//     const funcs = {};
//     const pp = new Promise(async (resolve, reject) => {
//         funcs.cancel = reject;
//         funcs.finish = resolve;
//         await asyncFunction();
//         resolve();
//     });
//     // const cp = new Promise();

//     pp.then(() => {console.log("resolved");}).catch(() => {});
//     return funcs;
// };

// makeCancellable = function(asyncFunction) {
//     const pp = new PromiseExtended((resolve, reject) => {
//         asyncFunction().then(resolve);
//     });
//     // const cp = new Promise();
//     pp.cancelled(() => {console.log("cancelled");}).then(() => {console.log("resolved");}).catch(() => {console.log("rejected");});
//     // pp.then(() => {console.log("resolved");}).catch(() => {console.log("rejected");});
//     return pp;
// };