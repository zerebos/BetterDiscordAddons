//META{"name":"HideIconBadge","displayName":"HideIconBadge","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideIconBadge","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideIconBadge/HideIconBadge.plugin.js"}*//

var HideIconBadge = (() => {
    const config = {"info":{"name":"HideIconBadge","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.5","description":"Hides the badge on the app icon and tray icon. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideIconBadge","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideIconBadge/HideIconBadge.plugin.js"},"changelog":[{"title":"What's New?","items":["Use only local lib loading."]}],"main":"index.js"};

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
    const {Patcher, WebpackModules} = Api;
    const ElectronModule = WebpackModules.getByProps(["setBadge"]);
    return class HideIconBadge extends Plugin {
        onStart() {
            ElectronModule.setBadge(0);
            Patcher.before(ElectronModule, "setBadge", (thisObject, methodArguments) => {
                methodArguments[0] = 0;
            });
    
            ElectronModule.setSystemTrayIcon("DEFAULT");
            Patcher.before(ElectronModule, "setSystemTrayIcon", (thisObject, methodArguments) => {
                methodArguments[0] === "UNREAD" ? methodArguments[0] = "DEFAULT" : void 0;
            });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();