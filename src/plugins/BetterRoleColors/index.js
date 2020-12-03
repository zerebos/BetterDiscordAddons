
module.exports = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, DiscordModules, Patcher, ColorConverter, ReactComponents, Utilities, ReactTools, PluginUtilities, Logger} = Api;

    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const PopoutWrapper = WebpackModules.getByDisplayName("DeprecatedPopout");
    const VoiceUser = WebpackModules.getByDisplayName("VoiceUser");
    const RichTextareaComponents = WebpackModules.getByProps("UserMention");

    const ColoredDiscordTag = (DiscordTag) => function(props) {
        const returnValue = DiscordTag(props);
        const username = returnValue.props.children[0];
        const discriminator = returnValue.props.children[1];
        if (username) username.props.className = "username " + username.props.className;
        if (discriminator) discriminator.props.className = "discriminator " + (discriminator.props.className || "");
        const refFunc = (colorString) => (element) => {
            if (!element) return;
            element.style.setProperty("color", colorString, "important");
        };

        const userColor = props.colorUsername;
        const discrimColor = props.colorDiscriminator;

        if (username && userColor !== undefined) {
            username.props.style = {color: userColor};
            if (props.important && userColor) username.ref = refFunc(userColor);
        }
        if (discriminator && discrimColor !== undefined) {
            discriminator.props.style = {color: discrimColor};
            if (props.important && discrimColor) username.ref = refFunc(discrimColor);
        }
        return returnValue;
    };

    const FluxTag = WebpackModules.getByDisplayName("DiscordTag");
    const ColoredFluxTag = function(props) {
        const returnValue = FluxTag(props);
        returnValue.type = ColoredDiscordTag(returnValue.type);
        return returnValue;
    };

    return class BetterRoleColors extends Plugin {

        onStart() {
            Utilities.suppressErrors(this.patchAccountDetails.bind(this), "account details patch")();
            Utilities.suppressErrors(this.patchVoiceUsers.bind(this), "voice users patch")();
            Utilities.suppressErrors(this.patchMentions.bind(this), "mentions patch")();

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            Utilities.suppressErrors(this.patchAuditLog.bind(this), "audit log patch")(this.promises.state);
            Utilities.suppressErrors(this.patchTypingUsers.bind(this), "typing users patch")(this.promises.state);
            Utilities.suppressErrors(this.patchUserPopouts.bind(this), "user popout patch")(this.promises.state);
            Utilities.suppressErrors(this.patchUserModals.bind(this), "user modal patch")(this.promises.state);
            Utilities.suppressErrors(this.patchMemberList.bind(this), "member list patch")(this.promises.state);
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
            const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");

            const containerSelector = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
            const usernameSelector = `${containerSelector} .${rawClasses.usernameContainer.split(" ").join(".")} > div`;
            const discrimSelector = `${containerSelector} .${rawClasses.usernameContainer.split(" ").join(".")} + div`;

            const colorizeAccountDetails = () => {
                let username = document.querySelector(usernameSelector);
                if (!username) username = document.querySelector(usernameSelector.replace(" > div", ""));
                const discrim = document.querySelector(discrimSelector);
                if (!username || !discrim) return Logger.info("Could not get account details username and discrim elements");
                let member = this.getMember(UserStore.getCurrentUser().id, SelectedGuildStore.getGuildId());
                if (!member || !member.colorString) member = {colorString: ""};
                const doImportant = this.settings.global.important ? "important" : undefined;
                username.style.setProperty("color", this.settings.account.username ? member.colorString : "", doImportant);
                discrim.style.setProperty("color", this.settings.account.discriminator ? member.colorString : "", doImportant);
            };
            PluginUtilities.addOnSwitchListener(colorizeAccountDetails);
            colorizeAccountDetails();
            return () => {PluginUtilities.removeOnSwitchListener(colorizeAccountDetails);};
        }

        patchVoiceUsers() {
            Patcher.after(VoiceUser.prototype, "renderName", (thisObject, _, returnValue) => {
                if (!this.settings.modules.voice) return;
                if (!returnValue || !returnValue.props) return;
                const member = this.getMember(thisObject.props.user.id);
                if (!member || !member.colorString) return;
                returnValue.props.style = {color: member.colorString};
                if (!this.settings.global.important) return;
                returnValue.ref = (element) => {
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

                if (!this.settings.mentions.changeOnHover) return;
                returnValue.props.onMouseEnter = () => {thisObject.setState({isHovered: true});};
                returnValue.props.onMouseLeave = () => {thisObject.setState({isHovered: false});};

                if (!thisObject.state.hasOwnProperty("isHovered")) thisObject.setState({isHovered: false});
                const currentStyle = thisObject.state.isHovered ? hoverStyle : defaultStyle;
                returnValue.props.style = currentStyle;
                if (!this.settings.global.important) return;
                const element = DiscordModules.ReactDOM.findDOMNode(thisObject);
                if (!element) return;
                setImmediate(() => element.style.setProperty("color", currentStyle.color, "important"));
                setImmediate(() => element.style.setProperty("background", currentStyle.background, "important"));
            });
            for (const e of document.querySelectorAll(".mention")) {
                const instance = ReactTools.getOwnerInstance(e, {include: ["Popout"]});
                if (instance) instance.forceUpdate();
            }
            Patcher.after(RichTextareaComponents, "UserMention", (_, [props], ret) => {
                const old = Utilities.getNestedProp(ret, "props.children");
                if (typeof old !== "function" || !this.settings.modules.mentions) return;
                let tooltipRef;
                ret.ref = e => tooltipRef = e;
                ret.props.children = childProps => {
                    try {
                        const ret2 = old(childProps);
                        const userId = props.id;
                        const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), userId);
                        if (!member || !member.colorString) return ret2;
                        const defaultStyle = {
                            color: member.colorString,
                            background: ColorConverter.rgbToAlpha(member.colorString, 0.1)
                        };
                        const hoverStyle = {
                            color: "#ffffff",
                            background: ColorConverter.rgbToAlpha(member.colorString, 0.7)
                        };
                        const currentStyle = this.settings.mentions.changeOnHover && tooltipRef && tooltipRef.state.shouldShowTooltip ? hoverStyle : defaultStyle;
                        ret2.props.style = currentStyle;
                        if (this.settings.global.important) {
                            ret2.props.ref = e => {
                                if (!e || !e.ref) return;
                                e.ref.style.setProperty("color", currentStyle.color, "important");
                                e.ref.style.setProperty("background", currentStyle.background, "important");
                            };
                        }
                        return ret2;
                    }
                    catch (err) {
                        try {
                            return old(childProps);
                        }
                        catch (error) {
                            Logger.stacktrace("Error in UserMention patch", error);
                            return null;
                            /*  null will make it simply draw nothing, at that point it's obvious
                                that something went horribly wrong somewhere deeper
                            */
                        }
                    }
                };
            });
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
                const nickname = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.0.props.children");
                const tag = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.1.props.children");
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
                if (!this.settings.modules.memberList) return;
                if (memberList.renderSection.__patched) return;
                const original = memberList.renderSection;
                memberList.renderSection = function() {
                    const section = Reflect.apply(original, this, arguments);
                    const guild = DiscordModules.GuildStore.getGuild(memberList.props.channel.guild_id);
                    if (!guild) return section;
                    const children = section.props.children ? section.props.children : section;
                    const roleId = children.props.id;
                    const roleColor = guild.roles[roleId] ? guild.roles[roleId].colorString : "";
                    if (!roleColor) return section;
                    const originalType = children.type.type;
                    const myRef = DiscordModules.React.createRef();
                    const ColoredRoleHeader = function() {
                        const label = originalType(...arguments);
                        const originalLabel = label.type;
                        const ColoredHeader = function() {
                            const final = originalLabel(...arguments);
                            final.props.style = {color: roleColor};
                            if (!BRC.settings.global.important) return final;
                            final.ref = (element) => {
                                if (!element) return;
                                element.style.setProperty("color", roleColor, "important");
                            };
                            return final;
                        };
                        label.type = ColoredHeader;
                        return label;
                    };
                    children.ref = myRef;
                    children.type = ColoredRoleHeader;
                    return section;
                };
                memberList.renderSection.__patched = true;
                memberList.forceUpdate();
            });
        }

    };
};