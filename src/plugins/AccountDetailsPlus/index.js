
module.exports = (Plugin, Api) => {
    const {DiscordModules, DiscordSelectors, WebpackModules, Logger, ReactComponents, Patcher, Utilities} = Api;

    const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");
    const container = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
    const username = `.${rawClasses.usernameContainer.split(" ").join(".")}`;

    const renderUserPopout = (props) => {
        const guild = DiscordModules.SelectedGuildStore.getGuildId();
        const channel = DiscordModules.SelectedChannelStore.getChannelId();
        return DiscordModules.React.createElement(DiscordModules.UserPopout, Object.assign({}, props, {
            userId: DiscordModules.UserStore.getCurrentUser().id,
            guildId: guild,
            channelId: channel
        }));
    };

    return class AccountDetailsPlus extends Plugin {

        async onStart() {
            this.currentUser = DiscordModules.UserStore.getCurrentUser();
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchAccountAvatar(this.promises.state);
            this.patchUsername();
        }

        onStop() {
            Patcher.unpatchAll();
            if (this.unpatchUsername) this.unpatchUsername();
        }

        async patchAccountAvatar(promiseState) {
            const Account = await ReactComponents.getComponentByName("Account", ".container-YkUktl");
            if (promiseState.cancelled) return;
            Patcher.after(Account.component.prototype, "render", (thisObject, _, retAccount) => {
                if (!thisObject._renderStatusPickerPopout) thisObject._renderStatusPickerPopout = thisObject.renderStatusPickerPopout;
                const popoutWrap = Utilities.findInReactTree(retAccount, (n) => n && typeof(n.children) === "function");
                const popoutWrapRender = popoutWrap.children;
                if (!popoutWrap || typeof(popoutWrapRender) !== "function") return retAccount;
                popoutWrap.children = (popoutProps) => {
                    const retPopout = Reflect.apply(popoutWrapRender, thisObject, [popoutProps]);
                    const avatarWrap = Utilities.getNestedProp(retPopout, "props.children.props");
                    const avatarRender = avatarWrap.children;
                    if (!avatarWrap || !avatarRender) return retPopout;

                    avatarWrap.children = avatarProps => {
                        const originalClick = avatarProps.onClick;
                        avatarProps.onContextMenu = (e) => {
                            thisObject.renderStatusPickerPopout = this.settings.popoutOnClick ? thisObject._renderStatusPickerPopout : renderUserPopout;
                            originalClick(e);
                            thisObject.forceUpdate();
                        };
                        avatarProps.onClick = (e) => {
                            thisObject.renderStatusPickerPopout = this.settings.popoutOnClick ? renderUserPopout : thisObject._renderStatusPickerPopout;
                            originalClick(e);
                            thisObject.forceUpdate();
                        };

                        return Reflect.apply(avatarRender, thisObject, [avatarProps]);
                    };
                    return retPopout;
                };
            });
        }

        getNickname(guildId = DiscordModules.SelectedGuildStore.getGuildId()) {
            const nick = DiscordModules.GuildMemberStore.getNick(guildId, this.currentUser.id);
            return nick ? nick : this.currentUser.username;
        }

        patchUsername() {
            this.onSwitch = this.adjustNickname;
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return Logger.err("Could not find accountDetails element");
            const nameElement = accountDetails.querySelector(username);

            const hoverChange = event => {
                const nick = this.getNickname();
                if (this.settings.nicknameByDefault) nameElement.textContent = event.type === "mouseenter" ? this.currentUser.username : nick;
                else nameElement.textContent = event.type === "mouseenter" ? nick : this.currentUser.username;
            };

            accountDetails.addEventListener("mouseenter", hoverChange);
            accountDetails.addEventListener("mouseleave", hoverChange);

            this.unpatchUsername = () => {
                delete this.onSwitch;
                accountDetails.removeEventListener("mouseenter", hoverChange);
                accountDetails.removeEventListener("mouseleave", hoverChange);
                nameElement.textContent = this.currentUser.username;
            };

            this.adjustNickname();
        }

        adjustNickname() {
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return Logger.err("Could not find accountDetails element");
            const nameElement = accountDetails.querySelector(username);
            const nick = this.getNickname();
            if (this.settings.nicknameByDefault) nameElement.textContent = nick;
            else nameElement.textContent = this.currentUser.username;
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

    };
};