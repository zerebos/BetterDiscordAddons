//META{"name":"DoNotTrack","displayName":"DoNotTrack","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/DoNotTrack","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/DoNotTrack/DoNotTrack.plugin.js"}*//

var DoNotTrack = (() => {
    const config = {"info":{"name":"DoNotTrack","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.3","description":"Stops Discord from tracking everything you do like Sentry and Analytics. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/DoNotTrack","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/DoNotTrack/DoNotTrack.plugin.js"},"changelog":[{"title":"What's New?","items":["Use only local lib loading."]}],"main":"index.js"};

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

    return class DoNotTrack extends Plugin {
        onStart() {
            const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");
            Patcher.instead(Analytics.default, "track", () => {});
    
            const Warning = WebpackModules.getByProps("consoleWarning");
            Patcher.instead(Warning, "consoleWarning", () => {});
    
            const MethodWrapper = WebpackModules.getByProps("wrapMethod");
            Patcher.instead(MethodWrapper, "wrapMethod", () => {});
    
            const Sentry = WebpackModules.getByProps("_originalConsoleMethods", "_wrappedBuiltIns");
            Sentry.uninstall();
            Patcher.instead(Sentry, "_breadcrumbEventHandler", () => () => {});
            Patcher.instead(Sentry, "captureBreadcrumb", () => {});
            Patcher.instead(Sentry, "_makeRequest", () => {});
            Patcher.instead(Sentry, "_sendProcessedPayload", () => {});
            Patcher.instead(Sentry, "_send", () => {});
            Object.assign(window.console, Sentry._originalConsoleMethods);
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();