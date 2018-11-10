//META{"name":"AutoPlayGifs","displayName":"AutoPlayGifs","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js"}*//

var AutoPlayGifs = (() => {
    const config = {"info":{"name":"AutoPlayGifs","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.1","description":"Automatically plays avatars. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js"},"defaultConfig":[{"type":"switch","id":"chat","name":"Autoplay Chat","note":"Autoplays avatars in the chat area for Nitro users.","value":true},{"type":"switch","id":"memberList","name":"Autoplay Memberlist","note":"Autoplays avatars in the member list for Nitro users.","value":true}],"changelog":[{"title":"What's New?","items":["Move to local lib only."]}],"main":"index.js"};

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
    const {WebpackModules, DiscordModules, Patcher} = Api;

    return class AutoPlayGifs extends Plugin {
        constructor() {
            super();
            this.cancelChatAvatars = () => {};
            this.cancelMemberListAvatars = () => {};
        }

        onStart() {
            if (this.settings.chat) this.patchChatAvatars();
            if (this.settings.memberList) this.patchMemberListAvatars();
        }
        
        onStop() {
            this.cancelChatAvatars();
            this.cancelMemberListAvatars();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, value) => {
                if (id == "chat") {
                    if (value) this.patchChatAvatars();
                    else this.cancelChatAvatars();
                }
                if (id == "memberList") {
                    if (value) this.patchMemberListAvatars();
                    else this.cancelMemberListAvatars();
                }
            });
            return panel.getElement();
        }

        patchChatAvatars() {
            let MessageGroup = WebpackModules.find(m => m.defaultProps && m.defaultProps.disableManageMessages);
            this.cancelChatAvatars = Patcher.before(MessageGroup.prototype, "render", (thisObject) => {
                thisObject.state.disableAvatarAnimation = false;
            });
        }
    
        patchMemberListAvatars() {
            let MemberList = WebpackModules.findByDisplayName("MemberListItem");
            this.cancelMemberListAvatars = Patcher.before(MemberList.prototype, "render", (thisObject) => {
                if (!thisObject.props.user) return;
                let id = thisObject.props.user.id;
                let hasAnimatedAvatar = DiscordModules.ImageResolver.hasAnimatedAvatar(DiscordModules.UserStore.getUser(id));
                if (!hasAnimatedAvatar) return;
                thisObject.props.user.getAvatarURL = () => {return DiscordModules.ImageResolver.getUserAvatarURL(DiscordModules.UserStore.getUser(id)).replace("webp", "gif");};
            });
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();