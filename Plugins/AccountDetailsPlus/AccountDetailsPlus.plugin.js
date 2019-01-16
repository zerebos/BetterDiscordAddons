//META{"name":"AccountDetailsPlus","displayName":"AccountDetailsPlus","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"}*//

var AccountDetailsPlus = (() => {
    const config = {"info":{"name":"AccountDetailsPlus","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.2","description":"Lets you view popout, nickname and more from your account panel at the bottom. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"},"defaultConfig":[{"type":"category","id":"popout","name":"User Popout","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"avatar","name":"Avatar","note":"Opens your popout when clicking your avatar.","value":true},{"type":"switch","id":"username","name":"Username","note":"Opens your popout when clicking your username.","value":true}]},{"type":"category","id":"statusPicker","name":"Status Picker","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"avatar","name":"Avatar","note":"Opens your popout when right clicking your avatar.","value":true},{"type":"switch","id":"username","name":"Username","note":"Opens your popout when right clicking your username.","value":true}]},{"type":"category","id":"nickname","name":"Nickname","collapsible":true,"shown":false,"settings":[{"type":"dropdown","id":"showNickname","name":"Name Shown","value":true,"options":[{"label":"Username","value":false},{"label":"Nickname","value":true}]},{"type":"switch","id":"oppositeOnHover","name":"Opposite On Hover","note":"Shows the opposite on hover. e.g. if you are showing nickname, hovering will show your username.","value":true}]}],"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Fixed that one issue where it didn't work."]}],"main":"index.js"};

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
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, DOMTools} = Api;
    return class AccountDetailsPlus extends Plugin {
        constructor() {
            super();
            this.usernameCSS = `.container-iksrDt .nameTag-26T3kW { cursor: pointer; }`;
            this.popoutOpen = false;
        }

        async onStart() {
            await new Promise(resolve => setTimeout(resolve, 1000));      
            this.FluxContainer = DiscordModules.UserPopout;
            this.currentUser = DiscordModules.UserStore.getCurrentUser();
            this.popoutWrapper = ReactTools.getReactProperty(document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn"), "return.return.return.return.return.return.return.stateNode");
            this.originalRender = this.popoutWrapper.props.render;
         
            this.activateShit();
        }
        
        onStop() {
            this.popoutWrapper.props.render = this.originalRender;
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(".AccountDetailsPlus");
            this.saveSettings();
        }

        activateShit() {
            document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).off("." + this.getName());
            document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").off("." + this.getName());
            this.usernameCSS = DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag + "{ cursor: pointer; }";
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(document, "mousemove." + this.getName());
            document.querySelector(DiscordSelectors.AccountDetails.container.descend(".username")).textContent = this.currentUser.username;
            
            if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) {
                DOMTools.on(document, "mousemove." + this.getName(), (e) => { this.adjustNickname(e); });
            }
            if (this.settings.popout.username) {
                PluginUtilities.addStyle(this.getName() + "-css", this.usernameCSS);
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.popout.avatar) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.statusPicker.username) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
            if (this.settings.statusPicker.avatar) {
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
        }
    
        adjustNickname(e) {
            if (!e || !e.target || !(e.target instanceof Element)) return;
            let accountDetails = document.querySelector(DiscordSelectors.AccountDetails.container);
            if (!accountDetails) return;
    
            let isHovering = accountDetails.contains(e.target);
            let nameElement = accountDetails.querySelector(".username");
    
            let nick = DiscordModules.GuildMemberStore.getNick(DiscordModules.SelectedGuildStore.getGuildId(), this.currentUser.id);
            nick = nick ? nick : this.currentUser.username;
    
            if (isHovering && this.settings.nickname.oppositeOnHover) {
                if (this.settings.nickname.showNickname) nameElement.textContent = this.currentUser.username;
                else if (!this.settings.nickname.showNickname) nameElement.textContent = nick;
            }
            else {
                if (this.settings.nickname.showNickname) nameElement.textContent = nick;
                else nameElement.textContent = this.currentUser.username;
            }
        }
    
        setRender(renderer, options = {}) {
            this.popoutWrapper.props.render = renderer;
            Object.assign(this.popoutWrapper.props, options);
        }
    
        showStatusPicker(e) {
            e.preventDefault();
            e.stopPropagation();
            this.setRender(this.originalRender, {position: "top-left", animationType: "spring"});
            this.popoutWrapper.toggle(e);
        }
    
        showUserPopout(e) {
            e.preventDefault();
            e.stopPropagation();
            var element = document.querySelector(DiscordSelectors.AccountDetails.container);
            // e.target = e.currentTarget = e.toElement = e.delegateTarget = document.querySelector(DiscordSelectors.AccountDetails.container);
            this.setRender((props) => {
                let guild = DiscordModules.SelectedGuildStore.getGuildId();
                let channel = DiscordModules.SelectedChannelStore.getChannelId();
                return DiscordModules.React.createElement(this.FluxContainer, Object.assign({}, props, {
                    user: this.currentUser,
                    guildId: guild,
                    channelId: channel
                }));
            }, {position: "top-left", animationType: "default"});
    
            this.popoutWrapper.toggle(Object.assign({}, e, {
                target: element,
                toElement: element,
                currentTarget: element,
                delegateTarget: element
            })); 
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();