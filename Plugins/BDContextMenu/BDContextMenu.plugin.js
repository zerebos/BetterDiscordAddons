//META{"name":"BDContextMenu"}*//

/* global PluginUtilities:false, PluginContextMenu:false, DiscordModules:false */

class BDContextMenu {
	getName() { return "BDContextMenu"; }
	getShortName() { return "BDContextMenu"; }
	getDescription() { return "Adds BD shortcuts to the settings context menu. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.7"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
        this.initialized = false;
        this.contextObserver = new MutationObserver((changes) => {
			for (let change in changes) this.observeContextMenus(changes[change]);
		});
    }
	
	load() {}
	unload() {}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
        else libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	
	initialize() {
		this.initialized = true;
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
        $(`.${DiscordModules.AccountDetailsClasses.container} > div > .${DiscordModules.AccountDetailsClasses.button}`).on('contextmenu.bdcs', () => { this.bindContextMenus(); });
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}
	
    stop() {
        $('*').off('.bdcs');
    }

    observer(e) {
        if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
        if (!e.addedNodes[0].querySelector(`.${DiscordModules.AccountDetailsClasses.container} > div > .${DiscordModules.AccountDetailsClasses.button}`)) return;
        $(`.${DiscordModules.AccountDetailsClasses.container} > div > .${DiscordModules.AccountDetailsClasses.button}`).on('contextmenu.bdcs', () => { this.bindContextMenus(); });
    }
    
    bindContextMenus() {
		this.contextObserver.observe(document.querySelector('#app-mount'), {childList: true, subtree: true});
	}

	unbindContextMenus() {
		this.contextObserver.disconnect();
	}

	observeContextMenus(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
		let elem = e.addedNodes[0];
		let isContext = elem.classList.contains(DiscordModules.ContextMenuClasses.contextMenu);
        if (!isContext) return;
        let contextMenu = $(elem);

        let coreMenu = new PluginContextMenu.Menu(true);
		let forkMenu = new PluginContextMenu.Menu(true);
        let emoteMenu = new PluginContextMenu.Menu(true);
        let pluginMenu = new PluginContextMenu.Menu(true);
        let themeMenu = new PluginContextMenu.Menu(true);

        for (let setting in window.settings) {
            ((setting) => {
                if (window.settings[setting].implemented && !window.settings[setting].hidden && window.settings[setting].cat === "core")
                    coreMenu.addItems(new PluginContextMenu.ToggleItem(setting, window.settingsCookie[window.settings[setting].id], {callback: () => { this.changeBDSetting(window.settings[setting].id); }}));
            })(setting);
        }
		
		if (window.bbdVersion) {
			for (let setting in window.settings) {
				((setting) => {
					if (window.settings[setting].implemented && !window.settings[setting].hidden && window.settings[setting].cat === "fork")
						forkMenu.addItems(new PluginContextMenu.ToggleItem(setting, window.settingsCookie[window.settings[setting].id], {callback: () => { this.changeBDSetting(window.settings[setting].id); }}));
				})(setting);
			}
		}

        for (let setting in window.settings) {
            ((setting) => {
                if (window.settings[setting].implemented && !window.settings[setting].hidden && window.settings[setting].cat === "emote")
                    emoteMenu.addItems(new PluginContextMenu.ToggleItem(setting, window.settingsCookie[window.settings[setting].id], {callback: () => { this.changeBDSetting(window.settings[setting].id); }}));
            })(setting);
        }

        for (let plugin in window.bdplugins) {
            ((plugin) => {
                pluginMenu.addItems(new PluginContextMenu.ToggleItem(plugin, window.pluginCookie[plugin], {callback: () => { this.togglePlugin(plugin); }}));
            })(plugin);
        }
        
        for (let theme in window.bdthemes) {
            ((theme) => {
                themeMenu.addItems(new PluginContextMenu.ToggleItem(theme, window.themeCookie[theme], {callback: () => { this.toggleTheme(theme); }}));
            })(theme);
        }

		
		let menu = null;
		if (window.bbdVersion) {
			menu = new PluginContextMenu.SubMenuItem("BetterDiscord", new PluginContextMenu.Menu(false).addItems(
				new PluginContextMenu.SubMenuItem("Core", coreMenu, {callback: () => { contextMenu.hide(); this.openMenu(0); }}),
				new PluginContextMenu.SubMenuItem("Zere's Fork", forkMenu, {callback: () => { contextMenu.hide(); this.openMenu(1); }}),
				new PluginContextMenu.SubMenuItem("Emotes", emoteMenu, {callback: () => { contextMenu.hide(); this.openMenu(2); }}),
				new PluginContextMenu.TextItem("Custom CSS", {callback: () => { contextMenu.hide(); this.openMenu(3); }}),
				new PluginContextMenu.SubMenuItem("Plugins", pluginMenu, {callback: () => { contextMenu.hide(); this.openMenu(4); }}),
				new PluginContextMenu.SubMenuItem("Themes", themeMenu, {callback: () => { contextMenu.hide(); this.openMenu(5); }})
			));
		}
		else {
			menu = new PluginContextMenu.SubMenuItem("BetterDiscord", new PluginContextMenu.Menu(false).addItems(
				new PluginContextMenu.SubMenuItem("Core", coreMenu, {callback: () => { contextMenu.hide(); this.openMenu(0); }}),
				new PluginContextMenu.SubMenuItem("Emotes", emoteMenu, {callback: () => { contextMenu.hide(); this.openMenu(1); }}),
				new PluginContextMenu.TextItem("Custom CSS", {callback: () => { contextMenu.hide(); this.openMenu(2); }}),
				new PluginContextMenu.SubMenuItem("Plugins", pluginMenu, {callback: () => { contextMenu.hide(); this.openMenu(3); }}),
				new PluginContextMenu.SubMenuItem("Themes", themeMenu, {callback: () => { contextMenu.hide(); this.openMenu(4); }})
			));
		}
        contextMenu.append(new PluginContextMenu.ItemGroup().addItems(menu).getElement());
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
            catch (e) { PluginUtilities.showToast("There was an issue stopping " + plugin, {type: "error"}); }
        }
        else {
            try { window.bdplugins[plugin].plugin.start(); }
            catch (e) { PluginUtilities.showToast("There was an issue starting " + plugin, {type: "error"}); }
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
            PluginUtilities.showToast(theme + " was successfully applied!", {type: "success"});
        }
        window.themeCookie[theme] = !window.themeCookie[theme];
        window.themeModule.saveThemeData();
    }

    openMenu(index) {
        let observer = new MutationObserver((changes) => {
            for (let change in changes) {
                let e = changes[change];
                if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
                if (e.addedNodes[0].querySelector('#bd-settings-sidebar') || e.addedNodes[0].id === "bd-settings-sidebar") {
                    document.querySelectorAll('#bd-settings-sidebar .ui-tab-bar-item')[index].click();
                    document.querySelectorAll('#bd-settings-sidebar .ui-tab-bar-item')[index].classList.add('selected');
                    observer.disconnect();
                }
            }
        });
        observer.observe(document.querySelector('.app'), {childList: true, subtree: true});
        $(`.${DiscordModules.AccountDetailsClasses.container} > div > .${DiscordModules.AccountDetailsClasses.button}`).click();
    }
    
}