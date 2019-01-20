//META{"name":"HideMutedServers","displayName":"HideMutedServers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideMutedServers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideMutedServers/HideMutedServers.plugin.js"}*//

var HideMutedServers = (() => {
    const config = {"info":{"name":"HideMutedServers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"1.0.0","description":"Hides muted servers with a context menu option to show/hide. Acts similar to Discord's Hide Muted Channels option. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideMutedServers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideMutedServers/HideMutedServers.plugin.js"},"main":"index.js"};

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
    const {DiscordSelectors, WebpackModules, ReactTools, Patcher, ContextMenu} = Api;
    return class HideMutedServers extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {hide: false};
            this.contextObserver = new MutationObserver((changes) => {
                for (let change in changes) this.observeContextMenus(changes[change]);
            });
        }

        onStart() {
            this.bindContextMenus();
            if (this.settings.hide) this.hideGuilds();
        }
        
        onStop() {
            this.unbindContextMenus();
            this.showGuilds();
        }

        hideGuilds() {
            const isMuted = WebpackModules.getByProps("isMuted").isMuted;
            const Guilds = WebpackModules.getByDisplayName("Guilds");
            Patcher.after(Guilds.prototype, "render", (thisObject, args, ret) => {
                var guilds = ret.props.children[1].props.children[4];
                var newGuilds = guilds.filter(g => !isMuted(g.key));
                ret.props.children[1].props.children[4] = newGuilds;
            });
            this.updateGuildList();
        }
        
        showGuilds() {
            Patcher.unpatchAll();
            this.updateGuildList();
        }
        
        updateGuildList() {
            const guildList = document.querySelector(DiscordSelectors.Guilds.guildsWrapper);
            if (!guildList) return;
            const guildListInstance = ReactTools.getOwnerInstance(guildList);
            if (!guildListInstance) return;
            guildListInstance.forceUpdate();
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
            const isContextMenu = elem.matches(DiscordSelectors.ContextMenu.contextMenu);
            if (!isContextMenu) return;
            const contextMenu = elem;
            const isGuildContext = ReactTools.getReactProperty(contextMenu, "return.memoizedProps.type") == "GUILD_ICON_BAR";
            if (!isGuildContext) return;
            const menuItem = new ContextMenu.ToggleItem("Hide Muted Guilds", this.settings.hide, {callback: () => {
                this.settings.hide = !this.settings.hide;
                if (this.settings.hide) this.hideGuilds();
                else this.showGuilds();
                this.saveSettings();
            }});
            const menuGroup = new ContextMenu.ItemGroup();
            menuGroup.addItems(menuItem);
            contextMenu.find(DiscordSelectors.ContextMenu.itemGroup).after(menuGroup.getElement());
            ContextMenu.updateDiscordMenu(contextMenu);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();