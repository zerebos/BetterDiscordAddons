
module.exports = (Plugin, Api) => {
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, DOMTools, Utilities, WebpackModules} = Api;

    const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");
    const container = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
    const username = `.${rawClasses.username.split(" ").join(".")}`;
    const nameTag = `.${rawClasses.nameTag.split(" ").join(".")}`;

    const tagSelector = `${container} ${nameTag}`;

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
            this.popoutWrapper = Utilities.findInTree(ReactTools.getReactInstance(document.querySelector(container + " .avatar-SmRMf2")), n => n && n.handleClick && n.toggleShow, {walkable: ["return", "stateNode"]});
            this.originalRender = this.popoutWrapper.props.renderPopout;

            this.activateShit();
        }

        onStop() {
            this.popoutWrapper.props.renderPopout = this.originalRender;
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(".AccountDetailsPlus");
            this.saveSettings();
        }

        activateShit() {
            document.querySelector(tagSelector).off("." + this.getName());
            document.querySelector(container + " .avatar-SmRMf2").off("." + this.getName());
            this.usernameCSS = tagSelector + "{ cursor: pointer; }";
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(document, "mousemove." + this.getName());
            document.querySelector(container + ` ${username}`).textContent = this.currentUser.username;

            if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) {
                DOMTools.on(document, "mousemove." + this.getName(), (e) => { this.adjustNickname(e); });
            }
            if (this.settings.popout.username) {
                PluginUtilities.addStyle(this.getName() + "-css", this.usernameCSS);
                document.querySelector(tagSelector).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.shouldShowPopout; });
                document.querySelector(tagSelector).on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.popout.avatar) {
                document.querySelector(tagSelector).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.shouldShowPopout; });
                document.querySelector(container + " .avatar-SmRMf2").on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.statusPicker.username) {
                document.querySelector(tagSelector).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.shouldShowPopout; });
                document.querySelector(tagSelector).on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
            if (this.settings.statusPicker.avatar) {
                document.querySelector(container + " .avatar-SmRMf2").on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.shouldShowPopout; });
                document.querySelector(container + " .avatar-SmRMf2").on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
        }

        adjustNickname(e) {
            if (!e || !e.target || !(e.target instanceof Element)) return;
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return;

            const isHovering = accountDetails.contains(e.target);
            const nameElement = accountDetails.querySelector(username);

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
            this.popoutWrapper.props.renderPopout = renderer;
            Object.assign(this.popoutWrapper.props, options);
        }

        showStatusPicker(e) {
            e.preventDefault();
            e.stopPropagation();
            this.setRender(this.originalRender, {position: "top"});
            this.popoutWrapper.toggleShow(e);
        }

        showUserPopout(e) {
            e.preventDefault();
            e.stopPropagation();
            const element = document.querySelector(container);
            // e.target = e.currentTarget = e.toElement = e.delegateTarget = document.querySelector(container);
            this.setRender((props) => {
                const guild = DiscordModules.SelectedGuildStore.getGuildId();
                const channel = DiscordModules.SelectedChannelStore.getChannelId();
                return DiscordModules.React.createElement(this.FluxContainer, Object.assign({}, props, {
                    userId: this.currentUser.id,
                    guildId: guild,
                    channelId: channel
                }));
            }, {position: "top"});

            this.popoutWrapper.toggleShow(Object.assign({}, e, {
                target: element,
                toElement: element,
                currentTarget: element,
                delegateTarget: element
            }));
            this.setRender(this.originalRender, {position: "top"});
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.activateShit.bind(this));
            return panel.getElement();
        }

    };
};