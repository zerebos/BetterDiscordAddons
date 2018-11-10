//META{"name":"BDContextMenu","displayName":"BDContextMenu","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"}*//

var BDContextMenu = (() => {
    const config = {"info":{"name":"BDContextMenu","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.15","description":"Adds BD shortcuts to the settings context menu. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BDContextMenu","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BDContextMenu/BDContextMenu.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Fixed not updating BD settings."]}],"main":"index.js"};

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
    const {DiscordSelectors, ContextMenu} = Api;
    return class BDContextMenu extends Plugin {

        constructor() {
            super();
            this.initialized = false;
            this.contextObserver = new MutationObserver((changes) => {
                for (let change in changes) this.observeContextMenus(changes[change]);
            });
        }

        async onStart() {
            if (!document.querySelector(DiscordSelectors.AccountDetails.container.child("div").child(DiscordSelectors.AccountDetails.button))) await new Promise(resolve => setTimeout(resolve, 1000));
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
            const elem = e.addedNodes[0];
            const isContext = elem.matches(DiscordSelectors.ContextMenu.contextMenu);
            if (!isContext) return;
            this.unbindContextMenus();

            const coreMenu = new ContextMenu.Menu(true);
            const forkMenu = new ContextMenu.Menu(true);
            const emoteMenu = new ContextMenu.Menu(true);
            const pluginMenu = new ContextMenu.Menu(true);
            const themeMenu = new ContextMenu.Menu(true);
    
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
    
            const pluginList = Object.keys(window.bdplugins).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            for (let plugin of pluginList) {
                ((plugin) => {
                    pluginMenu.addItems(new ContextMenu.ToggleItem(plugin, window.pluginCookie[plugin], {callback: () => { this.togglePlugin(plugin); }}));
                })(plugin);
            }
            
            const themeList = Object.keys(window.bdthemes).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
            for (let theme of themeList) {
                ((theme) => {
                    themeMenu.addItems(new ContextMenu.ToggleItem(theme, window.themeCookie[theme], {callback: () => { this.toggleTheme(theme); }}));
                })(theme);
            }
            
            const menu = new ContextMenu.SubMenuItem("BetterDiscord", new ContextMenu.Menu(false).addItems(
                new ContextMenu.SubMenuItem("Core", coreMenu, {callback: () => { elem.style.display = "none"; this.openMenu(0); }}),
                new ContextMenu.SubMenuItem("Zere's Fork", forkMenu, {callback: () => { elem.style.display = "none"; this.openMenu(1); }}),
                new ContextMenu.SubMenuItem("Emotes", emoteMenu, {callback: () => { elem.style.display = "none"; this.openMenu(2); }}),
                new ContextMenu.TextItem("Custom CSS", {callback: () => { elem.style.display = "none"; this.openMenu(3); }}),
                new ContextMenu.SubMenuItem("Plugins", pluginMenu, {callback: () => { elem.style.display = "none"; this.openMenu(4); }}),
                new ContextMenu.SubMenuItem("Themes", themeMenu, {callback: () => { elem.style.display = "none"; this.openMenu(5); }})
            ));
            elem.append(new ContextMenu.ItemGroup().addItems(menu).getElement());
            ContextMenu.updateDiscordMenu(elem);
        }
    
        changeBDSetting(setting) {
            window.settingsPanel.updateSettings(setting, !window.settingsCookie[setting]);
        }
    
        togglePlugin(plugin) {
            window.pluginModule.togglePlugin(plugin);
        }
    
        toggleTheme(theme) {
            window.themeModule.toggleTheme(theme);
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
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();