//META{"name":"RevealSpoilers","displayName":"RevealSpoilers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RevealSpoilers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RevealSpoilers/RevealSpoilers.plugin.js"}*//

var RevealSpoilers = (() => {
    const config = {"info":{"name":"RevealSpoilers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"1.0.0","description":"Makes all spoilers revealed by default and removes the revealed background color. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RevealSpoilers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RevealSpoilers/RevealSpoilers.plugin.js"},"main":"index.js"};

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
    const {Patcher, WebpackModules, PluginUtilities} = Api;
    return class RevealSpoilers extends Plugin {
        onStart() {
            const SpoilerClasses = WebpackModules.getByProps("spoilerText");
            const spoilerText = SpoilerClasses.spoilerText.split(" ")[0];
            const Spoiler = WebpackModules.getByDisplayName("Spoiler");
            Patcher.before(Spoiler.prototype, "render", (t) => t.state.visible = true);
            PluginUtilities.addStyle(this.getName(), `
            .theme-dark .${spoilerText}, .theme-light ${spoilerText} {
                background: none;
            }
            `);
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();