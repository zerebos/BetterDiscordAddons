//META{"name":"HideDisabledEmojis","displayName":"HideDisabledEmojis","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js"}*//

var HideDisabledEmojis = (() => {
    const config = {"info":{"name":"HideDisabledEmojis","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.4","description":"Hides disabled emojis from the emoji picker. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis","github_raw":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js"},"changelog":[{"title":"What's New?","items":["Use only local lib loading."]}],"main":"index.js"};

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
    const {Patcher, Toasts, WebpackModules} = Api;
    return class HideDisabledEmojis extends Plugin {
        onStart() {
            let EmojiInfo = WebpackModules.findByUniqueProperties(["isEmojiDisabled"]);
            let EmojiPicker = WebpackModules.findByDisplayName("EmojiPicker");
            Patcher.after(EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
                return returnValue || EmojiInfo.isEmojiDisabled(methodArguments[0], methodArguments[1]);
            });

            Patcher.before(EmojiPicker.prototype, "render", (thisObject) => {
                let cats = thisObject.categories;
                let filtered = thisObject.computeMetaData();
                let newcats = {};

                for (let c of filtered) newcats[c.category] ? newcats[c.category] += 1 : newcats[c.category] = 1;

                let i = 0;
                for (let cat of cats) {
                    if (!newcats[cat.category]) {
                        cat.offsetTop = 999999;
                    }
                    else {
                        cat.offsetTop = i * 32;
                        i += newcats[cat.category] + 1;
                    }
                    thisObject.categoryOffsets[cat.category] = cat.offsetTop;
                }

                cats.sort((a,b) => a.offsetTop - b.offsetTop);
            });

            Toasts.default(this.getName() + " " + this.getVersion() + " has started.");
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();