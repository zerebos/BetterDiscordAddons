
module.exports = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, DiscordModules, PluginUtilities, Patcher, ColorConverter, ReactComponents} = Api;

    const ReactDOM = DiscordModules.ReactDOM;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const PopoutWrapper = WebpackModules.getByProps("Positions", "Animations");
    const VoiceUser = WebpackModules.find(m => typeof(m) === "function" && m.List);
    const AuditLogItem = WebpackModules.getByPrototypes("renderPermissionUpdate");

    return class BetterRoleColors extends Plugin {

        constructor() {
            super();
            this.cancels = [];
        }

        onStart() {
            this.patchVoiceUsers();
            this.patchMentions();
            this.patchAccountDetails();
            this.patchUserPopouts();
            this.patchUserModals();
            this.patchAuditLog();
            this.patchTypingUsers();
            this.patchMemberList();
        }
        
        onStop() {
            Patcher.unpatchAll();
            for (const cancel of this.cancels) cancel();
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }
    
        patchAccountDetails() {
            const colorize = () => {
                if (!this.settings.account.username && !this.settings.account.discriminator) return;
                const account = document.querySelector(DiscordSelectors.AccountDetails.accountDetails);
                if (!account) return;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), UserStore.getCurrentUser().id);
                const color = member && member.colorString ? member.colorString : "";
                if (this.settings.account.username) account.querySelector(".username").style.setProperty("color", color, "important");
                if (this.settings.account.discriminator) {
                    account.querySelector(".discriminator").style.setProperty("color", color, "important");
                    account.querySelector(".discriminator").style.setProperty("opacity", "1");
                }
            };
            PluginUtilities.addOnSwitchListener(colorize);
            this.cancels.push(() => {
                PluginUtilities.removeOnSwitchListener(colorize);
                const account = document.querySelector(DiscordSelectors.AccountDetails.accountDetails);
                account.querySelector(".username").style.setProperty("color", "");
                account.querySelector(".discriminator").style.setProperty("color", "");
                account.querySelector(".discriminator").style.setProperty("opacity", "");
            });
            colorize();
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
    
        async patchTypingUsers() {
            const TypingUsers = await ReactComponents.getComponentByName("TypingUsers", DiscordSelectors.Typing.typing);
            const brc = this;
            Patcher.after(TypingUsers.component.prototype, "componentDidUpdate", (thisObject) => {
                if (!brc.settings.modules.typing) return;
                setImmediate(() => {
                    const typingUsers = this.filterTypingUsers(Object.assign({}, thisObject.props.typingUsers));
                    document.querySelectorAll(DiscordSelectors.Typing.typing.descend("strong")).forEach((elem, index) => {
                        if (!typingUsers[index]) return;
                        const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[index].id);
                        if (!member) return;
                        elem.style.setProperty("color", member.colorString ? member.colorString : "");
                    });
                });
            });
            TypingUsers.forceUpdateAll();
        }
    
        patchVoiceUsers() {
            const brc = this;
            const voiceUserMount = function() {
                if (!brc.settings.modules.voice) return;
                if (!this || !this.props || !this.props.user) return;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), this.props.user.id);
                if (!member || !member.colorString) return;
                const elem = ReactDOM.findDOMNode(this);
                elem.querySelector("[class*=\"name\"]").style.setProperty("color", member.colorString);
            };
    
            Patcher.after(VoiceUser.prototype, "componentDidMount", (thisObject) => {
                const bound = voiceUserMount.bind(thisObject); bound();
            });
        }
    
        patchMentions() {
            const brc = this;
            const mentionMount = function() {
                if (!brc.settings.modules.mentions) return;
                if (!this || !this.props || !this.props.children || !this.props.children.props || this.props.children.props.className != "mention") return;
                const props = this.props.render().props;
                if (!props || !props.user) return;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), props.user.id);
                if (!member || !member.colorString) return;
                const elem = ReactDOM.findDOMNode(this);
                elem.style.setProperty("color", member.colorString, "important");
                elem.style.setProperty("background", ColorConverter.rgbToAlpha(member.colorString,0.1), "important");
    
                if (!brc.settings.mentions.changeOnHover) return;
                elem.addEventListener("mouseenter", (e) =>{
                    e.target.style.setProperty("color", "#FFFFFF", "important");
                    e.target.style.setProperty("background", ColorConverter.rgbToAlpha(member.colorString,0.7), "important");
                });
                elem.addEventListener("mouseleave", (e) => {
                    e.target.style.setProperty("color", member.colorString, "important");
                    e.target.style.setProperty("background", ColorConverter.rgbToAlpha(member.colorString,0.1), "important");
                });
            };
    
            Patcher.after(PopoutWrapper.prototype, "componentDidMount", (thisObject) => {
                const bound = mentionMount.bind(thisObject); bound();
            });
        }
    
        async patchUserPopouts() {
            const UserPopout = await ReactComponents.getComponentByName("UserPopout", DiscordSelectors.UserPopout.userPopout);
            const brc = this;
            const popoutMount = function() {
                if (!brc.settings.popouts.username && !brc.settings.popouts.discriminator && !brc.settings.popouts.nickname) return;
                if (!this || !this.props || !this.props.user) return;
                const member = GuildMemberStore.getMember(this.props.guildId, this.props.user.id);
                if (!member || !member.colorString) return;
                const elem = ReactDOM.findDOMNode(this);
                const hasNickname = Boolean(this.props.guildMember.nick);
                if (brc.settings.popouts.username || (!hasNickname && brc.settings.popouts.fallback)) elem.querySelector(".username").style.setProperty("color", member.colorString, "important");
                if (brc.settings.popouts.discriminator) elem.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
                if (brc.settings.popouts.nickname && hasNickname) elem.querySelector(DiscordSelectors.UserPopout.headerName).style.setProperty("color", member.colorString, "important");
            };
    
            Patcher.after(UserPopout.component.prototype, "componentDidMount", (thisObject) => {
                const bound = popoutMount.bind(thisObject); bound();
            });
            UserPopout.forceUpdateAll();
        }
    
        async patchUserModals() {
            const UserProfile = await ReactComponents.getComponentByName("UserProfile", DiscordSelectors.UserModal.root);
            const brc = this;
            const modalMount = function() {
                if (!brc.settings.modals.username && !brc.settings.modals.discriminator) return;
                if (!this || !this.props || !this.props.user) return;
                const member = GuildMemberStore.getMember(this.props.guildId, this.props.user.id);
                if (!member || !member.colorString) return;
                const elem = ReactDOM.findDOMNode(this);
                if (brc.settings.modals.username) elem.querySelector(".username").style.setProperty("color", member.colorString, "important");
                if (brc.settings.modals.discriminator) elem.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
            };
    
            Patcher.after(UserProfile.component.prototype, "componentDidMount", (thisObject) => {
                const bound = modalMount.bind(thisObject); bound();
            });
            UserProfile.forceUpdateAll();
        }
    
        patchAuditLog() {
            const brc = this;
            const auditlogMount = function() {
                if (!brc.settings.auditLog.username && !brc.settings.auditLog.discriminator) return;
                if (!this || !this.props || !this.props.log || !this.props.log.user) return;
            
                const elem = ReactDOM.findDOMNode(this);
                const hooks = elem.querySelectorAll(DiscordSelectors.AuditLog.userHook);
                const member = GuildMemberStore.getMember(this._reactInternalFiber.return.memoizedProps.guildId, this.props.log.user.id);
                if (member && member.colorString) {
                    if (member.colorString && brc.settings.auditLog.username) hooks[0].children[0].style.color = member.colorString;
                    if (member.colorString && brc.settings.auditLog.discriminator) { hooks[0].querySelector(DiscordSelectors.AuditLog.discrim).style.color = member.colorString;hooks[0].querySelector(DiscordSelectors.AuditLog.discrim).style.opacity = 1;}
                }
            
                if (hooks.length < 2 || this.props.log.targetType != "USER") return;
                const member2 = GuildMemberStore.getMember(this._reactInternalFiber.return.memoizedProps.guildId, this.props.log.target.id);
                if (!member2 || !member2.colorString) return;
                if (brc.settings.auditLog.username) hooks[1].children[0].style.color = member2.colorString;
                if (brc.settings.auditLog.discriminator) { hooks[1].querySelector(DiscordSelectors.AuditLog.discrim).style.color = member2.colorString;hooks[1].querySelector(DiscordSelectors.AuditLog.discrim).style.opacity = 1;}
            };
    
            Patcher.after(AuditLogItem.prototype, "componentDidMount", (thisObject) => {
                const bound = auditlogMount.bind(thisObject); bound();
            });
        }

        async patchMemberList() {
            const MemberList = await ReactComponents.getComponentByName("ChannelMembers", DiscordSelectors.MemberList.membersWrap);
            Patcher.after(MemberList.component.prototype, "render", (memberList) => {
                if (memberList.renderSection.__patched) return;
                Patcher.after(memberList, "renderSection", (_, __, section) => {
                    if (!this.settings.modules.memberList) return;
                    const guild = DiscordModules.GuildStore.getGuild(memberList.props.channel.guild_id);
                    if (!guild) return;
                    const roleColor = guild.roles[section.props.id] ? guild.roles[section.props.id].colorString : "";
                    if (!roleColor) return;
                    const originalType = section.type;
                    section.type = function() {
                        const label = originalType(...arguments);
                        label.props.style = {color: roleColor};
                        return label;
                    };
                    return section;
                });
                memberList.renderSection.__patched = true;
            });
            MemberList.forceUpdateAll();
        }

    };
};