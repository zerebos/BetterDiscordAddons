
module.exports = (Plugin, Api) => {
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, DOMTools, Utilities} = Api;
    return class AccountDetailsPlus extends Plugin {
        constructor() {
            super();
            // this.usernameCSS = `.container-iksrDt .accountDetails-26T3kW { cursor: pointer; }`;
            this.popoutOpen = false;
        }

        async onStart() {
            await new Promise(resolve => setTimeout(resolve, 1000));      
            this.FluxContainer = DiscordModules.UserPopout;
            this.currentUser = DiscordModules.UserStore.getCurrentUser();
            this.popoutWrapper = Utilities.findInTree(ReactTools.getReactInstance(document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn")), n => n && n.handleClick && n.toggle, {walkable: ["return", "stateNode"]});
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
            document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails).off("." + this.getName());
            document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").off("." + this.getName());
            this.usernameCSS = DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails + "{ cursor: pointer; }";
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(document, "mousemove." + this.getName());
            document.querySelector(DiscordSelectors.AccountDetails.container.descend(".username")).textContent = this.currentUser.username;
            
            if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) {
                DOMTools.on(document, "mousemove." + this.getName(), (e) => { this.adjustNickname(e); });
            }
            if (this.settings.popout.username) {
                PluginUtilities.addStyle(this.getName() + "-css", this.usernameCSS);
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails).on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.popout.avatar) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.statusPicker.username) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.accountDetails).on("contextmenu." + this.getName(), (e) => {
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
            const accountDetails = document.querySelector(DiscordSelectors.AccountDetails.container);
            if (!accountDetails) return;
    
            const isHovering = accountDetails.contains(e.target);
            const nameElement = accountDetails.querySelector(".username");
    
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
            const element = document.querySelector(DiscordSelectors.AccountDetails.container);
            // e.target = e.currentTarget = e.toElement = e.delegateTarget = document.querySelector(DiscordSelectors.AccountDetails.container);
            this.setRender((props) => {
                const guild = DiscordModules.SelectedGuildStore.getGuildId();
                const channel = DiscordModules.SelectedChannelStore.getChannelId();
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
            this.setRender(this.originalRender, {position: "top-left", animationType: "spring"});
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.activateShit.bind(this));
            return panel.getElement();
        }

    };
};