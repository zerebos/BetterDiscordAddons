//META{"name":"BetterRoleColors","displayName":"BetterRoleColors","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"}*//

var BetterRoleColors = (() => {
    const config = {"info":{"name":"BetterRoleColors","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.7.6","description":"Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"},"defaultConfig":[{"type":"category","id":"modules","name":"Module Settings","collapsible":true,"shown":true,"settings":[{"type":"switch","id":"typing","name":"Typing","note":"Toggles colorizing of typing notifications.","value":true},{"type":"switch","id":"voice","name":"Voice","note":"Toggles colorizing of voice users.","value":true},{"type":"switch","id":"mentions","name":"Mentions","note":"Toggles colorizing of user mentions in chat.","value":true},{"type":"switch","id":"botTags","name":"Bot Tags","note":"Toggles coloring the background of bot tags to match role.","value":true},{"type":"switch","id":"memberList","name":"Memberlist Headers","note":"Toggles coloring role names in the member list.","value":true}]},{"type":"category","id":"popouts","name":"Popout Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in popouts.","value":false},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in popouts.","value":false},{"type":"switch","id":"nickname","name":"Nickname","note":"Toggles coloring on the nickname in popouts.","value":true},{"type":"switch","id":"fallback","name":"Enable Fallback","note":"If nickname is on and username is off, enabling this will automatically color the username.","value":true}]},{"type":"category","id":"modals","name":"Modal Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in modals.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in modals.","value":false}]},{"type":"category","id":"auditLog","name":"Audit Log Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in audit log.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in audit log.","value":false}]},{"type":"category","id":"account","name":"Account Details Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in account details.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in account details.","value":false}]},{"type":"category","id":"mentions","name":"Mention Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"changeOnHover","name":"Hover Color","note":"Turning this on adjusts the color on hover to match role color, having it off defers to your theme.","value":true}]}],"changelog":[{"title":"What's New?","items":["Role headers in the memberlist now match the role color! (You can turn this off in settings)"]}],"main":"index.js"};

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
    const {DiscordSelectors, WebpackModules, DiscordModules, PluginUtilities, Patcher, ColorConverter, ReactTools} = Api;

    const ReactDOM = DiscordModules.ReactDOM;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const PopoutWrapper = WebpackModules.getByProps("Positions", "Animations");
    const VoiceUser = WebpackModules.find(m => typeof(m) === "function" && m.List);
    const UserPopout = DiscordModules.UserPopout;
    const UserModal = DiscordModules.UserProfileModal;
    const AuditLogItem = WebpackModules.getByPrototypes("renderPermissionUpdate");
    const TypingUsers = WebpackModules.findByDisplayName("FluxContainer(TypingUsers)");

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
    
        patchTypingUsers() {
            const brc = this;
            Patcher.after(TypingUsers.prototype, "componentDidUpdate", (thisObject) => {
                if (!brc.settings.modules.typing) return;
                setImmediate(() => {
                    const typingUsers = this.filterTypingUsers(Object.assign({}, thisObject.state.typingUsers));
                    document.querySelectorAll(DiscordSelectors.Typing.typing.descend("strong")).forEach((elem, index) => {
                        if (!typingUsers[index]) return;
                        const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[index].id);
                        if (!member) return;
                        elem.style.setProperty("color", member.colorString ? member.colorString : "");
                    });
                });
            });
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
    
        patchUserPopouts() {
            const brc = this;
            const popoutMount = function() {
                if (!brc.settings.popouts.username && !brc.settings.popouts.discriminator && !brc.settings.popouts.nickname) return;
                if (!this || !this.props || !this.props.user) return;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), this.props.user.id);
                if (!member || !member.colorString) return;
                const elem = ReactDOM.findDOMNode(this);
                const hasNickname = Boolean(this.state.nickname);
                if (brc.settings.popouts.username || (!hasNickname && brc.settings.popouts.fallback)) elem.querySelector(".username").style.setProperty("color", member.colorString, "important");
                if (brc.settings.popouts.discriminator) elem.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
                if (brc.settings.popouts.nickname && hasNickname) elem.querySelector(DiscordSelectors.UserPopout.headerName).style.setProperty("color", member.colorString, "important");
            };
    
            Patcher.after(UserPopout.prototype, "componentDidMount", (thisObject) => {
                const bound = popoutMount.bind(thisObject); bound();
            });
        }
    
        patchUserModals() {
            const brc = this;
            const modalMount = function() {
                if (!brc.settings.modals.username && !brc.settings.modals.discriminator) return;
                if (!this || !this.props || !this.props.user) return;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), this.props.user.id);
                if (!member || !member.colorString) return;
                const elem = ReactDOM.findDOMNode(this);
                if (brc.settings.modals.username) elem.querySelector(".username").style.setProperty("color", member.colorString, "important");
                if (brc.settings.modals.discriminator) elem.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
            };
    
            Patcher.after(UserModal.prototype, "componentDidMount", (thisObject) => {
                const bound = modalMount.bind(thisObject); bound();
            });
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

        getMemberGroup() {
            return new Promise(resolve => {
                const memberList = document.querySelector(DiscordSelectors.MemberList.membersWrap);
                if (memberList) {resolve(ReactTools.getOwnerInstance(memberList, {include: ["ChannelMembers"]}).constructor);}
                else {
                    const channel = WebpackModules.find(m => m.prototype && m.prototype.renderEmptyChannel);
                    const unpatch = Patcher.before(channel.prototype, "componentDidUpdate", (t) => {
                        const elem = DiscordModules.ReactDOM.findDOMNode(t);
                        if (!elem) return;
                        const memberList = elem.querySelector(DiscordSelectors.MemberList.membersWrap);
                        if (!memberList) return;
                        unpatch();
                        resolve(ReactTools.getOwnerInstance(memberList, {include: ["ChannelMembers"]}).constructor);
                    });
                }
            });
        }

        forceUpdateMemberList() {
            const memberList = document.querySelector(DiscordSelectors.MemberList.membersWrap);
            if (memberList) ReactTools.getOwnerInstance(memberList, {include: ["ChannelMembers"]}).forceUpdate();
        }

        async patchMemberList() {
            const MemberList = await this.getMemberGroup();
            Patcher.after(MemberList.prototype, "render", (memberList) => {
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
            this.forceUpdateMemberList();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();