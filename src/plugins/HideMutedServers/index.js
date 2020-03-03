module.exports = (Plugin, Api) => {
    const {WebpackModules, ReactTools, Patcher, DiscordModules, Utilities, PluginUtilities} = Api;

    const Guilds = WebpackModules.getByDisplayName("Guilds");
    const GuildFolder = WebpackModules.getByPrototypes("renderExpandedGuilds");

    const MenuItem = WebpackModules.getByDisplayName("ToggleMenuItem");
    const isGuildMuted = WebpackModules.getByProps("isMuted").isMuted;

    const isMuted = (guild) => {
        if (guild.props.guildId) return isGuildMuted(guild.props.guildId);
        const unmuted = guild.props.guildIds.filter(g => !isGuildMuted(g));
        return !unmuted.length;
    };

    const replaceGuilds = function(component, args, originalFunction) {
        const originalGuilds = component.props.guildIds;
        const unmuted = component.props.guildIds.filter(g => !isGuildMuted(g));
        component.props.guildIds = unmuted;
        const returnValue = originalFunction(...args);
        component.props.guildIds = originalGuilds;
        return returnValue;
    };

    return class HideMutedServers extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {hide: false};
            this.guildListPatch = () => {};
            this.guildFolderExpandedPatch = () => {};
            this.guildFolderIconPatch = () => {};
        }

        onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};

            this.patchGuildContextMenu(this.promises.state);
            if (this.settings.hide) this.hideGuilds();
            Patcher.after(DiscordModules.NotificationSettingsModal, "updateNotificationSettings", this.updateGuildList);
        }

        onStop() {
            this.promises.cancel();
            Patcher.unpatchAll();
            this.showGuilds();
        }

        hideGuilds() {
            this.guildListPatch = Patcher.after(Guilds.prototype, "render", (thisObject, args, ret) => {
                const guilds = Utilities.findInReactTree(ret, a => a && a[0] && a[0].key && a[0].props && a[0].props.guildId);
                if (!guilds) return;
                guilds.splice(0, guilds.length, ...guilds.filter(g => !isMuted(g)));
            });

            this.guildFolderExpandedPatch = Patcher.instead(GuildFolder.prototype, "renderExpandedGuilds", replaceGuilds);
            this.guildFolderIconPatch = Patcher.instead(GuildFolder.prototype, "renderFolderIcon", replaceGuilds);
            this.updateGuildList();
        }

        showGuilds() {
            this.guildListPatch();
            this.guildFolderExpandedPatch();
            this.guildFolderIconPatch();
            this.updateGuildList();
        }

        updateGuildList() {
            const folderList = document.querySelectorAll(".wrapper-21YSNc");
            for (const folder of folderList) {
                const folderInstance = ReactTools.getOwnerInstance(folder);
                if (!folderInstance || !folderInstance.forceUpdate) continue;
                folderInstance.forceUpdate();
            }
            const guildList = document.querySelector(".wrapper-1Rf91z");
            if (!guildList) return;
            const guildListInstance = ReactTools.getOwnerInstance(guildList);
            if (!guildListInstance) return;
            guildListInstance.forceUpdate();
        }

        async patchGuildContextMenu(promiseState) {
            const GuildContextMenu = await PluginUtilities.getContextMenu("GUILD_ICON_");
            if (promiseState.cancelled) return;

            Patcher.after(GuildContextMenu, "default", (_, __, retVal) => {
                if (!retVal || !retVal.props || !retVal.props.children || !retVal.props.children[3]) return;
                const original = retVal.props.children[3].props.children;
                const newOne = DiscordModules.React.createElement(MenuItem, {
                    label: "Hide Muted Servers",
                    active: this.settings.hide,
                    action: () => {
                        this.settings.hide = !this.settings.hide;
                        if (this.settings.hide) this.hideGuilds();
                        else this.showGuilds();
                        this.saveSettings();
                        PluginUtilities.forceUpdateContextMenus();
                    }
                });
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
            PluginUtilities.forceUpdateContextMenus();
        }

    };
};