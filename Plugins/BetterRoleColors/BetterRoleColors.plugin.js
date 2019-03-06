//META{"name":"BetterRoleColors","displayName":"BetterRoleColors","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject('WScript.Shell');
	var fs = new ActiveXObject('Scripting.FileSystemObject');
	var pathPlugins = shell.ExpandEnvironmentStrings('%APPDATA%\\BetterDiscord\\plugins');
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup('It looks like you\'ve mistakenly tried to run me directly. \n(Don\'t do that!)', 0, 'I\'m a plugin for BetterDiscord', 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup('I\'m in the correct folder already.\nJust reload Discord with Ctrl+R.', 0, 'I\'m already installed', 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup('I can\'t find the BetterDiscord plugins folder.\nAre you sure it\'s even installed?', 0, 'Can\'t install myself', 0x10);
	} else if (shell.Popup('Should I copy myself to BetterDiscord\'s plugins folder for you?', 0, 'Do you need some help?', 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec('explorer ' + pathPlugins);
		shell.Popup('I\'m installed!\nJust reload Discord with Ctrl+R.', 0, 'Successfully installed', 0x40);
	}
	WScript.Quit();

@else@*/

var BetterRoleColors = (() => {
    const config = {"info":{"name":"BetterRoleColors","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.7.8","description":"Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"},"changelog":[{"title":"Small Fix","type":"fixed","items":["Fixed role headers not being colored."]}],"defaultConfig":[{"type":"category","id":"modules","name":"Module Settings","collapsible":true,"shown":true,"settings":[{"type":"switch","id":"typing","name":"Typing","note":"Toggles colorizing of typing notifications.","value":true},{"type":"switch","id":"voice","name":"Voice","note":"Toggles colorizing of voice users.","value":true},{"type":"switch","id":"mentions","name":"Mentions","note":"Toggles colorizing of user mentions in chat.","value":true},{"type":"switch","id":"botTags","name":"Bot Tags","note":"Toggles coloring the background of bot tags to match role.","value":true},{"type":"switch","id":"memberList","name":"Memberlist Headers","note":"Toggles coloring role names in the member list.","value":true}]},{"type":"category","id":"popouts","name":"Popout Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in popouts.","value":false},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in popouts.","value":false},{"type":"switch","id":"nickname","name":"Nickname","note":"Toggles coloring on the nickname in popouts.","value":true},{"type":"switch","id":"fallback","name":"Enable Fallback","note":"If nickname is on and username is off, enabling this will automatically color the username.","value":true}]},{"type":"category","id":"modals","name":"Modal Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in modals.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in modals.","value":false}]},{"type":"category","id":"auditLog","name":"Audit Log Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in audit log.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in audit log.","value":false}]},{"type":"category","id":"account","name":"Account Details Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in account details.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in account details.","value":false}]},{"type":"category","id":"mentions","name":"Mention Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"changeOnHover","name":"Hover Color","note":"Turning this on adjusts the color on hover to match role color, having it off defers to your theme.","value":true}]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
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
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/