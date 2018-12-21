//META{"name":"StatusEverywhere","displayName":"StatusEverywhere","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js"}*//

var StatusEverywhere = (() => {
    const config = {"info":{"name":"StatusEverywhere","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.4.2","description":"Adds user status everywhere Discord doesn't. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js"},"changelog":[{"title":"Internal Changes","type":"improved","items":["Move to the more stable local library."]}],"main":"index.js"};

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
    const {Patcher, WebpackModules, DiscordModules, Modals, PluginUtilities} = Api;
    return class StatusEverywhere extends Plugin {
        onStart() {
			this.showAnnouncement();
            const Avatar = WebpackModules.getByProps("AvatarWrapper");
            const original = Avatar.default;
            Patcher.before(Avatar, "default", (_, args) => {
                if (args[0].status) return;
                const id = args[0].src.split("/")[4];
                const cached = DiscordModules.UserStatusStore.getStatus(id);
				args[0].status = cached == "offline" ? DiscordModules.UserStatusStore.getStatus(id, DiscordModules.SelectedGuildStore.getGuildId()) : cached;
            });
            Object.assign(Avatar.default, original);
        }
        
        onStop() {
            Patcher.unpatchAll();
        }
		
		showAnnouncement() {
            if (window.ZeresPluginLibrary) return; // they already have it
            const hasShownAnnouncement = PluginUtilities.loadData(this.getName(), "announcements", {localLibNotice: false}).localLibNotice;
            if (hasShownAnnouncement) return;
            Modals.showConfirmationModal("Local Library Notice", DiscordModules.React.createElement("span", null, `This version of ${this.getName()} is the final version that will be released using a remotely loaded library. Future versions will require my local library that gets placed in the plugins folder.`, DiscordModules.React.createElement("br"), DiscordModules.React.createElement("br"), "You can download the library now to be prepared, or wait until the next version which will prompt you to download it."), {
                confirmText: "Download Now",
                cancelText: "Wait",
                onConfirm: () => {
                    require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                }
            });
            PluginUtilities.saveData(this.getName(), "announcements", {localLibNotice: true});
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();