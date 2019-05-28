
module.exports = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, DiscordModules, Patcher, ColorConverter, ReactComponents, Utilities, ReactTools} = Api;

    const Flux = WebpackModules.getByProps("connectStores");
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const PopoutWrapper = WebpackModules.getByDisplayName("Popout");
    const VoiceUser = WebpackModules.find(m => typeof(m) === "function" && m.List);

    const DiscordTag = WebpackModules.getByDisplayName("NameTag");
    const ColoredDiscordTag = class ColoredDiscordTag extends DiscordTag {
        render() {
            const returnValue = super.render();
            const username = returnValue.props.children[0];
            const discriminator = returnValue.props.children[1];
            if (username) username.props.className = "username " + username.props.className;
            if (discriminator) discriminator.props.className = "discriminator " + discriminator.props.className;
            const refFunc = (colorString) => (element) => {
                if (!element) return;
                element.style.setProperty("color", colorString, "important");
            };

            const userColor = returnValue.props.colorUsername;
            const discrimColor = returnValue.props.colorDiscriminator;

            if (username && userColor !== undefined) {
                username.props.style = {color: userColor};
                if (returnValue.props.important && userColor) username.ref = refFunc(userColor);
            }
            if (discriminator && discrimColor !== undefined) {
                discriminator.props.style = {color: discrimColor};
                if (returnValue.props.important && discrimColor) username.ref = refFunc(discrimColor);
            }
            return returnValue;
        }
    };

    const FluxTag = WebpackModules.getByDisplayName("FluxContainer(DiscordTag)");
    const ColoredFluxTag = class ColoredFluxTag extends FluxTag {
        render() {
            const returnValue = super.render();
            returnValue.type = ColoredDiscordTag;
            return returnValue;
        }
    };

    return class BetterRoleColors extends Plugin {

        onStart() {
            this.patchAccountDetails();
            this.patchVoiceUsers();
            this.patchMentions();

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchAuditLog(this.promises.state);
            this.patchTypingUsers(this.promises.state);
            this.patchUserPopouts(this.promises.state);
            this.patchUserModals(this.promises.state);
            this.patchMemberList(this.promises.state);
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

        getMember(userId, guild = "") {
            const guildId = guild || SelectedGuildStore.getGuildId();
            if (!guildId) return null;
            const member = GuildMemberStore.getMember(guildId, userId);
            if (!guildId) return null;
            return member;
        }

        patchAccountDetails() {
            const AccountContainer = ReactTools.getOwnerInstance(document.querySelector(DiscordSelectors.AccountDetails.container));
            if (!AccountContainer) return;
            Patcher.after(AccountContainer.constructor.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.account.username && !this.settings.account.discriminator) return;
                const tag = returnValue.props.children[1];
                if (!tag) return;
                const fluxWrapper = Flux.connectStores([SelectedGuildStore], () => ({guildId: SelectedGuildStore.getGuildId()}));
                const wrappedTag = fluxWrapper(({guildId}) => {
                    let member = this.getMember(thisObject.props.currentUser.id, guildId);
                    if (!member || !member.colorString) member = {colorString: ""};
                    tag.props.colorUsername = this.settings.account.username ? member.colorString : "";
                    tag.props.colorDiscriminator = this.settings.account.discriminator ? member.colorString : "";
                    tag.props.usernameClass = "username";
                    tag.props.discriminatorClass = "discriminator";
                    if (this.settings.global.important) tag.props.important = true;
                    return DiscordModules.React.createElement(ColoredFluxTag, tag.props);
                });
                returnValue.props.children[1] = DiscordModules.React.createElement(wrappedTag);
            });
            ReactTools.getOwnerInstance(document.querySelector(DiscordSelectors.AccountDetails.container)).forceUpdate();
        }

        patchVoiceUsers() {
            Patcher.after(VoiceUser.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.voice) return;
                const member = this.getMember(thisObject.props.user.id);
                if (!member || !member.colorString) return;
                const username = Utilities.getNestedProp(returnValue, "props.children.props.children.2");
                if (!username || !username.props) return;
                username.props.style = {color: member.colorString};
                if (!this.settings.global.important) return;
                username.ref = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };
            });
        }

        patchMentions() {
            Patcher.after(PopoutWrapper.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.mentions) return;
                const isMention = returnValue.props.className.toLowerCase().includes("mention");
                if (!isMention) return;
                const userId = thisObject.props.render().props.userId;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), userId);
                if (!member || !member.colorString) return;
                const defaultStyle = {
                    color: member.colorString,
                    background: ColorConverter.rgbToAlpha(member.colorString, 0.1)
                };

                const hoverStyle = {
                    color: "#ffffff",
                    background: ColorConverter.rgbToAlpha(member.colorString, 0.7)
                };

                returnValue.props.onMouseEnter = () => { thisObject.setState({isHovered: true}); };
                returnValue.props.onMouseLeave = () => { thisObject.setState({isHovered: false}); };

                const currentStyle = thisObject.state.isHovered ? hoverStyle : defaultStyle;
                returnValue.props.style = currentStyle;
                if (!this.settings.global.important) return;
                const element = DiscordModules.ReactDOM.findDOMNode(thisObject);
                if (!element) return;
                element.style.setProperty("color", currentStyle.color, "important");
                element.style.setProperty("background", currentStyle.background, "important");
            });
            for (const e of document.querySelectorAll(".mention")) {
                const instance = ReactTools.getOwnerInstance(e, {include: ["Popout"]});
                if (instance) instance.forceUpdate();
            }
        }



        // Start ReactComponents using patches.

        async patchAuditLog(promiseState) {
            const UserHook = await ReactComponents.getComponentByName("UserHook", DiscordSelectors.AuditLog.userHook);
            if (promiseState.cancelled) return;
            Patcher.after(UserHook.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
                const auditLogProps = Utilities.findInTree(thisObject._reactInternalFiber, m => m && m.guildId, {walkable: ["return", "stateNode", "props"]});
                const member = this.getMember(thisObject.props.user.id, auditLogProps.guildId);
                if (!member || !member.colorString) return;
                const username = returnValue.props.children[0];
                const discriminator = returnValue.props.children[1];
                const refFunc = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };

                if (username && this.settings.auditLog.username) {
                    username.props.style = {color: member.colorString};
                    if (this.settings.global.important) username.ref = refFunc;
                }
                if (discriminator && this.settings.auditLog.discriminator) {
                    discriminator.props.style = {color: member.colorString};
                    if (this.settings.global.important) discriminator.ref = refFunc;
                }
            });
            UserHook.forceUpdateAll();
        }

        filterTypingUsers(typingUsers) {
            if (!typingUsers) return [];
            return Object.keys(typingUsers).filter((e) => {
                return e != UserStore.getCurrentUser().id;
            }).filter((e) => {
                return !RelationshipStore.isBlocked(e);
            }).map((e) => {
                return UserStore.getUser(e);
            }).filter(function(e) {
                return e != null;
            });
        }

        async patchTypingUsers(promiseState) {
            const TypingUsers = await ReactComponents.getComponentByName("TypingUsers", DiscordSelectors.Typing.typing);
            if (promiseState.cancelled) return;
            Patcher.after(TypingUsers.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.typing) return;
                const typingUsers = this.filterTypingUsers(Object.assign({}, thisObject.props.typingUsers));
                for (let m = 0; m < typingUsers.length; m++) {
                    const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[m].id);
                    if (!member) continue;
                    returnValue.props.children[1].props.children[m * 2].props.style = {color: member.colorString};
                    if (!this.settings.global.important) continue;
                    returnValue.props.children[1].props.children[m * 2].ref = (element) => {
                        if (!element) return;
                        element.style.setProperty("color", member.colorString, "important");
                    };
                }
            });
            TypingUsers.forceUpdateAll();
        }

        async patchUserPopouts(promiseState) {
            const UserPopout = await ReactComponents.getComponentByName("UserPopout", DiscordSelectors.UserPopout.userPopout);
            if (promiseState.cancelled) return;
            Patcher.after(UserPopout.component.prototype, "render", (thisObject, _, returnValue) => {
                const member = thisObject.props.guildMember;
                if (!member || !member.colorString) return;
                const nickname = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.0.props.children.0");
                const tag = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.1");
                const shouldColorUsername = this.settings.popouts.username || (!nickname && this.settings.popouts.fallback);
                const shouldColorDiscriminator = this.settings.popouts.discriminator;
                const shouldColorNickname = this.settings.popouts.nickname && nickname;
                if (shouldColorNickname) nickname.props.style = {color: member.colorString};
                if ((!shouldColorUsername && !shouldColorDiscriminator) || !tag) return;
                if (shouldColorUsername) tag.props.colorUsername = member.colorString;
                if (shouldColorDiscriminator) tag.props.colorDiscriminator = member.colorString;
                if (this.settings.global.important) tag.props.important = true;
                tag.type = ColoredFluxTag;
            });
            UserPopout.forceUpdateAll();
        }

        async patchUserModals(promiseState) {
            const UserProfileBody = await ReactComponents.getComponentByName("UserProfileBody", DiscordSelectors.UserModal.root);
            if (promiseState.cancelled) return;
            Patcher.after(UserProfileBody.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modals.username && !this.settings.modals.discriminator) return;
                const member = this.getMember(thisObject.props.user.id);
                if (!member || !member.colorString) return;
                const tag = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.0");
                if (!tag) return;
                if (this.settings.modals.username) tag.props.colorUsername = member.colorString;
                if (this.settings.modals.discriminator) tag.props.colorDiscriminator = member.colorString;
                if (this.settings.global.important) tag.props.important = true;
                tag.type = ColoredFluxTag;
            });
            UserProfileBody.forceUpdateAll();
        }

        async patchMemberList(promiseState) {
            const BRC = this;
            const MemberList = await ReactComponents.getComponentByName("ChannelMembers", DiscordSelectors.MemberList.membersWrap);
            if (promiseState.cancelled) return;
            Patcher.after(MemberList.component.prototype, "render", (memberList) => {
                if (memberList.renderSection.__patched) return;
                Patcher.after(memberList, "renderSection", (_, __, section) => {
                    if (!this.settings.modules.memberList) return;
                    const guild = DiscordModules.GuildStore.getGuild(memberList.props.channel.guild_id);
                    if (!guild) return;
                    const roleId = section.props.children ? section.props.children.props.id : section.props.id;
                    const roleColor = guild.roles[roleId] ? guild.roles[roleId].colorString : "";
                    if (!roleColor) return;
                    const originalType = section.props.children ? section.props.children.type : section.type;
                    const myRef = DiscordModules.React.createRef();
                    const ColoredRoleHeader = function() {
                        const label = originalType(...arguments);
                        label.props.style = {color: roleColor};
                        if (!BRC.settings.global.important) return label;
                        label.ref = (element) => {
                            if (!element) return;
                            element.style.setProperty("color", roleColor, "important");
                        };
                        return label;
                    };
                    if (section.props.children) section.props.children.ref = myRef, section.props.children.type = ColoredRoleHeader;
                    else section.ref = myRef, section.type = ColoredRoleHeader;
                    return section;
                });
                memberList.renderSection.__patched = true;
            });
            MemberList.forceUpdateAll();
        }

    };
};