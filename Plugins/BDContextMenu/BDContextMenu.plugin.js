//META{"name":"BDContextMenu","displayName":"BDContextMenu","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"}*//

var BDContextMenu = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", (err, res, body) => { //https://zackrauen.com/BetterDiscordApp/ZLibrary.js | https://rauenzi.github.io/BetterDiscordAddons/Plugins/ZLibrary.js
			if (err || 200 !== res.statusCode) reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"BDContextMenu","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.13","description":"Adds BD shortcuts to the settings context menu. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"},"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {DiscordSelectors, ContextMenu, Toasts} = Api;
    return class BDContextMenu extends Plugin {

        constructor() {
            super();
            this.initialized = false;
            this.contextObserver = new MutationObserver((changes) => {
                for (let change in changes) this.observeContextMenus(changes[change]);
            });
        }

        onStart() {
            this.contextListener = () => { this.bindContextMenus(); };
            this.button = document.querySelector(DiscordSelectors.AccountDetails.container.child("div").child(DiscordSelectors.AccountDetails.button));
            this.button.addEventListener("contextmenu", this.contextListener);
        }
        
        onStop() {
            if (this.button) this.button.removeEventListener("contextmenu", this.contextListener);
        }

        bindContextMenus() {
            this.contextObserver.observe(document.querySelector("#app-mount"), {childList: true, subtree: true});
        }
    
        unbindContextMenus() {
            this.contextObserver.disconnect();
        }
    
        observeContextMenus(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
            let elem = e.addedNodes[0];
            let isContext = elem.matches(DiscordSelectors.ContextMenu.contextMenu);
            if (!isContext) return;
            let contextMenu = $(elem);
    
            let coreMenu = new ContextMenu.Menu(true);
            let forkMenu = new ContextMenu.Menu(true);
            let emoteMenu = new ContextMenu.Menu(true);
            let pluginMenu = new ContextMenu.Menu(true);
            let themeMenu = new ContextMenu.Menu(true);
    
            for (let setting in window.settings) {
                ((setting) => {
                    if (window.settings[setting].implemented && !window.settings[setting].hidden && window.settings[setting].cat === "core")
                        coreMenu.addItems(new ContextMenu.ToggleItem(setting, window.settingsCookie[window.settings[setting].id], {callback: () => { this.changeBDSetting(window.settings[setting].id); }}));
                })(setting);
            }
            
            if (window.bbdVersion) {
                for (let setting in window.settings) {
                    ((setting) => {
                        if (window.settings[setting].implemented && !window.settings[setting].hidden && window.settings[setting].cat === "fork")
                            forkMenu.addItems(new ContextMenu.ToggleItem(setting, window.settingsCookie[window.settings[setting].id], {callback: () => { this.changeBDSetting(window.settings[setting].id); }}));
                    })(setting);
                }
            }
    
            for (let setting in window.settings) {
                ((setting) => {
                    if (window.settings[setting].implemented && !window.settings[setting].hidden && window.settings[setting].cat === "emote")
                        emoteMenu.addItems(new ContextMenu.ToggleItem(setting, window.settingsCookie[window.settings[setting].id], {callback: () => { this.changeBDSetting(window.settings[setting].id); }}));
                })(setting);
            }
    
            for (let plugin in window.bdplugins) {
                ((plugin) => {
                    pluginMenu.addItems(new ContextMenu.ToggleItem(plugin, window.pluginCookie[plugin], {callback: () => { this.togglePlugin(plugin); }}));
                })(plugin);
            }
            
            for (let theme in window.bdthemes) {
                ((theme) => {
                    themeMenu.addItems(new ContextMenu.ToggleItem(theme, window.themeCookie[theme], {callback: () => { this.toggleTheme(theme); }}));
                })(theme);
            }
    
            
            let menu = null;
            if (window.bbdVersion) {
                menu = new ContextMenu.SubMenuItem("BetterDiscord", new ContextMenu.Menu(false).addItems(
                    new ContextMenu.SubMenuItem("Core", coreMenu, {callback: () => { contextMenu.hide(); this.openMenu(0); }}),
                    new ContextMenu.SubMenuItem("Zere's Fork", forkMenu, {callback: () => { contextMenu.hide(); this.openMenu(1); }}),
                    new ContextMenu.SubMenuItem("Emotes", emoteMenu, {callback: () => { contextMenu.hide(); this.openMenu(2); }}),
                    new ContextMenu.TextItem("Custom CSS", {callback: () => { contextMenu.hide(); this.openMenu(3); }}),
                    new ContextMenu.SubMenuItem("Plugins", pluginMenu, {callback: () => { contextMenu.hide(); this.openMenu(4); }}),
                    new ContextMenu.SubMenuItem("Themes", themeMenu, {callback: () => { contextMenu.hide(); this.openMenu(5); }})
                ));
            }
            else {
                menu = new ContextMenu.SubMenuItem("BetterDiscord", new ContextMenu.Menu(false).addItems(
                    new ContextMenu.SubMenuItem("Core", coreMenu, {callback: () => { contextMenu.hide(); this.openMenu(0); }}),
                    new ContextMenu.SubMenuItem("Emotes", emoteMenu, {callback: () => { contextMenu.hide(); this.openMenu(1); }}),
                    new ContextMenu.TextItem("Custom CSS", {callback: () => { contextMenu.hide(); this.openMenu(2); }}),
                    new ContextMenu.SubMenuItem("Plugins", pluginMenu, {callback: () => { contextMenu.hide(); this.openMenu(3); }}),
                    new ContextMenu.SubMenuItem("Themes", themeMenu, {callback: () => { contextMenu.hide(); this.openMenu(4); }})
                ));
            }
            contextMenu.append(new ContextMenu.ItemGroup().addItems(menu).getElement());
            contextMenu.css("top", "-=" + menu.getElement().outerHeight());
    
    
            this.unbindContextMenus();
    
        }
    
        changeBDSetting(setting) {
            window.settingsCookie[setting] = !window.settingsCookie[setting];
            if (window.settingsPanel.v2SettingsPanel) window.settingsPanel.v2SettingsPanel.updateSettings();
            else window.settingsPanel.updateSettings();
        }
    
        enablePlugin(plugin) {
            let enabled = window.pluginCookie[plugin];
            if (!enabled) this.togglePlugin(plugin);
        }
    
        disablePlugin(plugin) {
            let enabled = window.pluginCookie[plugin];
            if (enabled) this.togglePlugin(plugin);
        }
    
        togglePlugin(plugin) {
            let enabled = window.pluginCookie[plugin];
            if (enabled) {
                try {window.bdplugins[plugin].plugin.stop(); }
                catch (e) { Toasts.error("There was an issue stopping " + plugin); }
            }
            else {
                try { window.bdplugins[plugin].plugin.start(); }
                catch (e) { Toasts.error("There was an issue starting " + plugin); }
            }
            window.pluginCookie[plugin] = !window.pluginCookie[plugin];
            window.pluginModule.savePluginData();
        }
    
        enableTheme(theme) {
            let enabled = window.themeCookie[theme];
            if (!enabled) this.toggleTheme(theme);
        }
    
        disableTheme(theme) {
            let enabled = window.themeCookie[theme];
            if (enabled) this.toggleTheme(theme);
        }
    
        toggleTheme(theme) {
            let enabled = window.themeCookie[theme];
            if (enabled) {
                let elem = document.getElementById(theme);
                if (elem) elem.remove();
            }
            else {
                $("<style>", {id: theme, html: unescape(window.bdthemes[theme].css)}).appendTo(document.head);
                Toasts.success(theme + " was successfully applied!");
            }
            window.themeCookie[theme] = !window.themeCookie[theme];
            window.themeModule.saveThemeData();
        }
    
        openMenu(index) {
            let observer = new MutationObserver((changes) => {
                for (let change in changes) {
                    let e = changes[change];
                    if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
                    if (e.addedNodes[0].querySelector("#bd-settings-sidebar") || e.addedNodes[0].id === "bd-settings-sidebar") {
                        document.querySelectorAll("#bd-settings-sidebar .ui-tab-bar-item")[index].click();
                        document.querySelectorAll("#bd-settings-sidebar .ui-tab-bar-item")[index].classList.add("selected");
                        observer.disconnect();
                    }
                }
            });
            observer.observe(document.querySelector(".app"), {childList: true, subtree: true});
            this.button.click();
        }

    };
};
		return plugin(Plugin, Api);
	};
	
	return !global.ZLibrary ? class {
		getName() {return config.info.name.replace(" ", "");} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;} stop() {}
		showAlert() {window.mainCore.alert("Loading Error",`Something went wrong trying to load the library for the plugin. Try reloading?`);}
		async load() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			const vm = require("vm"), plugin = compilePlugin(global.ZLibrary.buildPlugin(config));
			try {new vm.Script(plugin, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be compiled.", error: {message: err.message, stack: err.stack}});}
			global[this.getName()] = plugin;
			try {new vm.Script(`new global["${this.getName()}"]();`, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be constructed", error: {message: err.message, stack: err.stack}});}
			bdplugins[this.getName()].plugin = new global[this.getName()]();
			bdplugins[this.getName()].plugin.load();
		}
		async start() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			bdplugins[this.getName()].plugin.start();
		}
	} : compilePlugin(global.ZLibrary.buildPlugin(config));
})();