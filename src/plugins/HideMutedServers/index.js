module.exports = (Plugin, Api) => {
    const {WebpackModules, ReactTools, Patcher, DiscordModules, Utilities, DCM} = Api;

    const isGuildMuted = WebpackModules.getByProps("isMuted").isMuted;

    const isMuted = (guild) => {
        if (guild.props.guildId) return isGuildMuted(guild.props.guildId);
        const unmuted = guild.props.guildIds.filter(g => !isGuildMuted(g));
        return !unmuted.length;
    };

    return class HideMutedServers extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {hide: false};
            this.guildListPatch = () => {};
            this.guildFolderExpandedPatch = () => {};
            this.guildFolderIconPatch = () => {};
            this.folderPatches = {};
        }

        onStart() {
            this.patchGuildContextMenu();
            if (this.settings.hide) this.hideGuilds();
            Patcher.after(DiscordModules.NotificationSettingsModal, "updateNotificationSettings", this.updateGuildList);
        }

        onStop() {
            this.showGuilds();
        }

        hideGuilds() {

            const guildList = document.querySelector(".guilds-1SWlCJ");
            if (!guildList) return;
            
            const guildListInstance = Utilities.findInTree(ReactTools.getReactInstance(guildList), n => n && n.type && n.type.displayName && n.type.displayName === "Guilds", {walkable: ["return", "stateNode"]});
            if (!guildListInstance) return;

            const Guilds = guildListInstance.type;
            this.guildListPatch = Patcher.after(Guilds.prototype, "render", (thisObject, args, ret) => {
                const guildContainer = Utilities.findInReactTree(ret, a => a && a["data-ref-id"] && a["data-ref-id"] === "guildsnav");
                if (!guildContainer || !guildContainer.children) return;
                const guilds = guildContainer.children;
                guilds.splice(0, guilds.length, ...guilds.filter(g => !isMuted(g)));
                for (const guild of guilds) {
                    if (!guild.props.guildIds || this.folderPatches[guild.props.folderId]) continue; // not a folder or already patched
                    const originalGuilds = guild.props.guildIds.slice(0);
                    guild.props.guildIds.splice(0, guild.props.guildIds.length, ...guild.props.guildIds.filter(g => !isGuildMuted(g)));
                    const unpatchFolder = () => {
                        if (!guild.props.guildIds) guild.props.guildIds = [];
                        guild.props.guildIds.splice(0, guild.props.guildIds.length, ...originalGuilds);
                        delete this.folderPatches[guild.props.folderId];
                    };
                    this.folderPatches[guild.props.folderId] = unpatchFolder;
                }
            });

            this.updateGuildList();
        }

        showGuilds() {           
            this.guildListPatch();
            for (const patch in this.folderPatches) this.folderPatches[patch]();
            this.updateGuildList();
        }

        updateGuildList() {
            const folderList = document.querySelectorAll(".wrapper-21YSNc"); // wrapper-21YSNc da-wrapper
            for (const folder of folderList) {
                const folderInstance = ReactTools.getOwnerInstance(folder);
                if (!folderInstance || !folderInstance.forceUpdate) continue;
                folderInstance.forceUpdate();
            }
            const guildList = document.querySelector(".guilds-1SWlCJ");
            if (!guildList) return;
            const guildListInstance = ReactTools.getOwnerInstance(guildList);
            if (!guildListInstance) return;
            guildListInstance.forceUpdate();
        }

        patchGuildContextMenu() {
            const GuildContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "GuildContextMenu");
            Patcher.after(GuildContextMenu, "default", (_, args, retVal) => {
                if (!retVal || !retVal.props || !retVal.props.children || !retVal.props.children[3]) return;
                const original = retVal.props.children[3].props.children;
                const newOne = DCM.buildMenuItem({
                    type: "toggle",
                    label: "Hide Muted Servers",
                    active: this.settings.hide,
                    action: () => {
                        this.settings.hide = !this.settings.hide;
                        if (this.settings.hide) this.hideGuilds();
                        else this.showGuilds();
                        this.saveSettings();
                    }
                });
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[3].props.children = [original, newOne];
            });
        }

    };
};