//META{"name":"BetterRoleColors","displayName":"BetterRoleColors","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"}*//

var BetterRoleColors = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"BetterRoleColors","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.7.4","description":"Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"},"defaultConfig":[{"type":"category","id":"modules","name":"Module Settings","collapsible":true,"shown":true,"settings":[{"type":"switch","id":"typing","name":"Typing","note":"Toggles colorizing of typing notifications.","value":true},{"type":"switch","id":"voice","name":"Voice","note":"Toggles colorizing of voice users.","value":true},{"type":"switch","id":"mentions","name":"Mentions","note":"Toggles colorizing of user mentions in chat.","value":true},{"type":"switch","id":"botTags","name":"Bot Tags","note":"Toggles coloring the background of bot tags to match role.","value":true}]},{"type":"category","id":"popouts","name":"Popout Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in popouts.","value":false},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in popouts.","value":false},{"type":"switch","id":"nickname","name":"Nickname","note":"Toggles coloring on the nickname in popouts.","value":true},{"type":"switch","id":"fallback","name":"Enable Fallback","note":"If nickname is on and username is off, enabling this will automatically color the username.","value":true}]},{"type":"category","id":"modals","name":"Modal Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in modals.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in modals.","value":false}]},{"type":"category","id":"auditLog","name":"Audit Log Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in audit log.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in audit log.","value":false}]},{"type":"category","id":"account","name":"Account Details Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in account details.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in account details.","value":false}]},{"type":"category","id":"mentions","name":"Mention Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"changeOnHover","name":"Hover Color","note":"Turning this on adjusts the color on hover to match role color, having it off defers to your theme.","value":true}]}],"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Plugin would sometimes fail to enable.","Coloring stopped working in the typing users section."]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, DiscordModules, PluginUtilities, Patcher, ColorConverter, Modals} = Api;

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
            this.showAnnouncement();
            this.patchVoiceUsers();
            this.patchMentions();
            this.patchAccountDetails();
            this.patchUserPopouts();
            this.patchUserModals();
            this.patchAuditLog();
            this.patchTypingUsers();
        }
        
        onStop() {
            Patcher.unpatchAll();
            for (let cancel of this.cancels) cancel();
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

        showAnnouncement() {
            const hasShownAnnouncement = PluginUtilities.loadData(this.getName(), "announcements", {localLibNotice: false}).localLibNotice;
            if (hasShownAnnouncement) return;
            Modals.showConfirmationModal("Local Library Notice", DiscordModules.React.createElement("span", null, `This version of ${this.getName()} is the final version that will be released using a remotely loaded library. Future versions will require my local library that gets placed in the plugins folder.`, DiscordModules.React.createElement("br"), DiscordModules.React.createElement("br"), "You can download the library now to be prepared, or wait until the next version which will prompt you to download it."), {
                confirmText: "Download Now",
                cancelText: "Wait",
                onConfirm: () => {
                    require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                }
            });
            PluginUtilities.saveData(this.getName(), "announcements", {localLibNotice: true});
        }
    
        patchAccountDetails() {
            let colorize = () => {
                if (!this.settings.account.username && !this.settings.account.discriminator) return;
                let account = document.querySelector(DiscordSelectors.AccountDetails.accountDetails);
                if (!account) return;
                let member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), UserStore.getCurrentUser().id);
                if (!member) return;
                let color = member.colorString ? member.colorString : "";
                if (this.settings.account.username) account.querySelector(".username").style.setProperty("color", color, "important");
                if (this.settings.account.discriminator) {
                    account.querySelector(".discriminator").style.setProperty("color", color, "important");
                    account.querySelector(".discriminator").style.setProperty("opacity", "1");
                }
            };
            PluginUtilities.addOnSwitchListener(colorize);
            this.cancels.push(() => {
                PluginUtilities.removeOnSwitchListener(colorize);
                let account = document.querySelector(DiscordSelectors.AccountDetails.accountDetails);
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
            let brc = this;
            Patcher.after(TypingUsers.prototype, "componentDidUpdate", (thisObject) => {
                if (!brc.settings.modules.typing) return;
                setImmediate(() => {
                    let typingUsers = Object.assign({}, thisObject.state.typingUsers);
                    typingUsers = this.filterTypingUsers(typingUsers);
                    document.querySelectorAll(DiscordSelectors.Typing.typing.descend("strong")).forEach((elem, index) => {
                        if (!typingUsers[index]) return;
                        let member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[index].id);
                        if (!member) return;
                        elem.style.setProperty("color", member.colorString ? member.colorString : "");
                    });
                });
            });
        }
    
        patchVoiceUsers() {
            let brc = this;
            let voiceUserMount = function() {
                if (!brc.settings.modules.voice) return;
                if (!this || !this.props || !this.props.user) return;
                let member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), this.props.user.id);
                if (!member || !member.colorString) return;
                let elem = ReactDOM.findDOMNode(this);
                elem.querySelector("[class*=\"name\"]").style.setProperty("color", member.colorString);
            };
    
            Patcher.after(VoiceUser.prototype, "componentDidMount", (thisObject) => {
                let bound = voiceUserMount.bind(thisObject); bound();
            });
        }
    
        patchMentions() {
            let brc = this;
            let mentionMount = function() {
                if (!brc.settings.modules.mentions) return;
                if (!this || !this.props || !this.props.children || !this.props.children.props || this.props.children.props.className != "mention") return;
                let props = this.props.render().props;
                if (!props || !props.user) return;
                let member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), props.user.id);
                if (!member || !member.colorString) return;
                let elem = ReactDOM.findDOMNode(this);
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
                let bound = mentionMount.bind(thisObject); bound();
            });
        }
    
        patchUserPopouts() {
            let brc = this;
            let popoutMount = function() {
                if (!brc.settings.popouts.username && !brc.settings.popouts.discriminator && !brc.settings.popouts.nickname) return;
                if (!this || !this.props || !this.props.user) return;
                let member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), this.props.user.id);
                if (!member || !member.colorString) return;
                let elem = ReactDOM.findDOMNode(this);
                let hasNickname = Boolean(this.state.nickname);
                if (brc.settings.popouts.username || (!hasNickname && brc.settings.popouts.fallback)) elem.querySelector(".username").style.setProperty("color", member.colorString, "important");
                if (brc.settings.popouts.discriminator) elem.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
                if (brc.settings.popouts.nickname && hasNickname) elem.querySelector(DiscordSelectors.UserPopout.headerName).style.setProperty("color", member.colorString, "important");
            };
    
            Patcher.after(UserPopout.prototype, "componentDidMount", (thisObject) => {
                let bound = popoutMount.bind(thisObject); bound();
            });
        }
    
        patchUserModals() {
            let brc = this;
            let modalMount = function() {
                if (!brc.settings.modals.username && !brc.settings.modals.discriminator) return;
                if (!this || !this.props || !this.props.user) return;
                let member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), this.props.user.id);
                if (!member || !member.colorString) return;
                let elem = ReactDOM.findDOMNode(this);
                if (brc.settings.modals.username) elem.querySelector(".username").style.setProperty("color", member.colorString, "important");
                if (brc.settings.modals.discriminator) elem.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
            };
    
            Patcher.after(UserModal.prototype, "componentDidMount", (thisObject) => {
                let bound = modalMount.bind(thisObject); bound();
            });
        }
    
        patchAuditLog() {
            let brc = this;
            let auditlogMount = function() {
                if (!brc.settings.auditLog.username && !brc.settings.auditLog.discriminator) return;
                if (!this || !this.props || !this.props.log || !this.props.log.user) return;
            
                let elem = ReactDOM.findDOMNode(this);
                let hooks = elem.querySelectorAll(DiscordSelectors.AuditLog.userHook);
                let member = GuildMemberStore.getMember(this._reactInternalFiber.return.memoizedProps.guildId, this.props.log.user.id);
                if (member && member.colorString) {
                    if (member.colorString && brc.settings.auditLog.username) hooks[0].children[0].style.color = member.colorString;
                    if (member.colorString && brc.settings.auditLog.discriminator) { hooks[0].querySelector(DiscordSelectors.AuditLog.discrim).style.color = member.colorString;hooks[0].querySelector(DiscordSelectors.AuditLog.discrim).style.opacity = 1;}
                }
            
                if (hooks.length < 2 || this.props.log.targetType != "USER") return;
                member = GuildMemberStore.getMember(this._reactInternalFiber.return.memoizedProps.guildId, this.props.log.target.id);
                if (!member || !member.colorString) return;
                if (brc.settings.auditLog.username) hooks[1].children[0].style.color = member.colorString;
                if (brc.settings.auditLog.discriminator) { hooks[1].querySelector(DiscordSelectors.AuditLog.discrim).style.color = member.colorString;hooks[1].querySelector(DiscordSelectors.AuditLog.discrim).style.opacity = 1;}
            };
    
            Patcher.after(AuditLogItem.prototype, "componentDidMount", (thisObject) => {
                let bound = auditlogMount.bind(thisObject); bound();
            });
        }

    };
};
		return plugin(Plugin, Api);
	};
	
	return !global.ZLibrary ? class {
		getName() {return config.info.name.replace(" ", "");} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;} stop() {}
		showAlert() {window.BdApi.alert("Loading Error",`Something went wrong trying to load the library for the plugin. You can try using a local copy of the library to fix this.<br /><br /><a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
		async load() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			const vm = require("vm"), plugin = compilePlugin(global.ZLibrary.buildPlugin(config));
			try {new vm.Script(plugin, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be compiled.", error: {message: err.message, stack: err.stack}});}
			global[this.getName()] = plugin;
			try {new vm.Script(`new global["${this.getName()}"]();`, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be constructed", error: {message: err.message, stack: err.stack}});}
			bdplugins[this.getName()].plugin = new global[this.getName()]();
			bdplugins[this.getName()].plugin.load();
		}
		async start() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			bdplugins[this.getName()].plugin.start();
		}
	} : compilePlugin(global.ZLibrary.buildPlugin(config));
})();