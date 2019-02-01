//META{"name":"RevealSpoilers","displayName":"RevealSpoilers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RevealSpoilers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RevealSpoilers/RevealSpoilers.plugin.js"}*//

var RevealSpoilers = (() => {
    const config = {"info":{"name":"RevealSpoilers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"1.0.1","description":"Makes all spoilers revealed by default and optionally removes the revealed background color. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RevealSpoilers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RevealSpoilers/RevealSpoilers.plugin.js"},"defaultConfig":[{"type":"switch","id":"hidebg","name":"Hide Background","note":"Toggles hiding the 'revealed' background color.","value":true}],"changelog":[{"title":"What's New?","items":["Made hiding the revealed background color optional."]}],"main":"index.js"};

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
            const Spoiler = WebpackModules.getByDisplayName("Spoiler");
            Patcher.before(Spoiler.prototype, "render", (t) => t.state.visible = true);
            if (this.settings.hidebg) this.hideBackground();
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

        hideBackground() {
            const SpoilerClasses = WebpackModules.getByProps("spoilerText");
            const spoilerText = SpoilerClasses.spoilerText.split(" ")[0];
            PluginUtilities.addStyle(this.getName(), `
                .theme-dark .${spoilerText}, .theme-light ${spoilerText} {
                    background: none;
                }
            `);
        }

        showBackground() {
            PluginUtilities.removeStyle(this.getName());
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, checked) => {
                if (checked) this.hideBackground();
                else this.showBackground();
            });
            return panel.getElement();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();