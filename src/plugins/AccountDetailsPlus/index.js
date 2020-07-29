
module.exports = (Plugin, Api) => {
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, Utilities, WebpackModules, Popouts, Logger} = Api;

    const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");
    const container = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
    const username = `.${rawClasses.usernameContainer.split(" ").join(".")}`;
    const nameTag = `.${rawClasses.nameTag.split(" ").join(".")}`;

    const tagSelector = `${container} ${nameTag}`;
    const usernameCSS = tagSelector + "{ cursor: pointer; }";

    return class AccountDetailsPlus extends Plugin {
        constructor() {
            super();
            this.popoutOpen = false;

            this.adjustNickname = this.adjustNickname.bind(this);
            this.showStatusPicker = this.showStatusPicker.bind(this);
            this.showUserPopout = this.showUserPopout.bind(this);
            this.updateIsPopoutOpen = this.updateIsPopoutOpen.bind(this);
        }

        async onStart() {
            // Resolve weird loading issues
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.doSetup();
        }

        onStop() {
            this.doCleanup();
        }

        doSetup() {
            this.FluxContainer = DiscordModules.UserPopout;
            if (!this.FluxContainer) return Logger.err("Could not find UserPopout component");

            this.popoutWrapper = Utilities.findInTree(ReactTools.getReactInstance(document.querySelector(container + " .avatar-SmRMf2")), n => n && n.handleClick && n.toggleShow, {walkable: ["return", "stateNode"]});
            if (!this.popoutWrapper) return Logger.err("Could not find popoutWrapper instance");

            this.currentUser = DiscordModules.UserStore.getCurrentUser();

            this.tagElement = document.querySelector(tagSelector);
            if (!this.tagElement) return Logger.err("Could not find tag element");

            this.avatarElement = document.querySelector(container + " .avatar-SmRMf2");
            if (!this.avatarElement) return Logger.err("Could not find avatar element");
            this.addAllListeners();
        }

        doCleanup() {
            PluginUtilities.removeStyle(this.getName() + "-css");
            document.querySelector(container + ` ${username}`).textContent = this.currentUser.username;
            this.clearAllListeners();
        }

        clearAllListeners() {
            document.removeEventListener("mousemove", this.adjustNickname);

            if (!this.tagElement) return Logger.err("No tag element to remove listeners");
            if (!this.avatarElement) return Logger.err("No avatar element to remove listeners");
            this.tagElement.removeEventListener("mousedown", this.updateIsPopoutOpen);
            this.tagElement.removeEventListener("click", this.showUserPopout);
            this.tagElement.removeEventListener("contextmenu", this.showStatusPicker);

            this.avatarElement.removeEventListener("mousedown", this.updateIsPopoutOpen);
            this.avatarElement.removeEventListener("click", this.showUserPopout);
            this.avatarElement.removeEventListener("contextmenu", this.showStatusPicker);
        }

        addAllListeners() {            
            if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) document.addEventListener("mousemove", this.adjustNickname);

            if (!this.tagElement) return Logger.err("Tag element not available");
            if (!this.avatarElement) return Logger.err("Avatar element not available");
            if (this.settings.popout.username) {
                PluginUtilities.addStyle(this.getName() + "-css", usernameCSS);
                this.tagElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.tagElement.addEventListener("click", this.showUserPopout);
            }
            if (this.settings.popout.avatar) {
                this.tagElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.avatarElement.addEventListener("click", this.showUserPopout);
            }
            if (this.settings.statusPicker.username) {
                this.tagElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.tagElement.addEventListener("contextmenu", this.showStatusPicker);
            }
            if (this.settings.statusPicker.avatar) {
                this.avatarElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.avatarElement.addEventListener("contextmenu", this.showStatusPicker);
            }
        }

        adjustNickname(e) {
            if (!this.settings.nickname.showNickname && !this.settings.nickname.oppositeOnHover) return;
            if (!e || !e.target || !(e.target instanceof Element)) return;
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return Logger.err("Could not find accountDetails element");

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

        updateIsPopoutOpen() {
            this.popoutOpen = this.popoutWrapper.state.shouldShowPopout;
        }

        showStatusPicker(e) {
            if (this.popoutOpen) return;
            e.preventDefault();
            e.stopPropagation();
            this.popoutWrapper.toggleShow(e);
        }

        showUserPopout(e) {
            if (this.popoutOpen) return;
            e.preventDefault();
            e.stopPropagation();
            const element = document.querySelector(container);
            Popouts.showUserPopout(element, this.currentUser, {position: "top"});
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(() => {
                this.doCleanup();
                this.doSetup();
            });
            return panel.getElement();
        }

    };
};