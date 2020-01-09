module.exports = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, ReactTools, Patcher, ContextMenu, Utilities} = Api;
    return class HideMutedServers extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {hide: false};
            this.contextObserver = new MutationObserver((changes) => {
                for (const change in changes) this.observeContextMenus(changes[change]);
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
                const guilds = Utilities.findInReactTree(ret, a => a && a[0] && a[0].key && a[0].props && a[0].props.guildId);
                if (!guilds) return;
                guilds.splice(0, guilds.length, ...guilds.filter(g => !isMuted(g.key)));
            });
            this.updateGuildList();
        }

        showGuilds() {
            Patcher.unpatchAll();
            this.updateGuildList();
        }

        updateGuildList() {
            const guildList = document.querySelector(".wrapper-1Rf91z");
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
            const menuItem = new ContextMenu.ToggleItem("Hide Muted Servers", this.settings.hide, {callback: () => {
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