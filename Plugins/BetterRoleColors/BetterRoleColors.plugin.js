//META{"name":"BetterRoleColors","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"}*//

class BetterRoleColors {
	getName() { return "BetterRoleColors"; }
	getShortName() { return "BRC"; }
	getDescription() { return "Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.7.0"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.defaultSettings = {modules: {typing: true, voice: true, mentions: true, botTags: true},
								popouts: {username: false, discriminator: false, nickname: true, fallback: true},
								modals: {username: true, discriminator: false},
								auditLog: {username: true, discriminator: false},
								account: {username: true, discriminator: false},
								mentions: {changeOnHover: true}};
		this.settings = this.defaultSettings;

		this.cancels = [];
	}
	
	loadSettings() {
		this.settings = PluginUtilities.loadSettings(this.getShortName(), this.defaultSettings);
	}

	saveSettings() {
		PluginUtilities.saveSettings(this.getShortName(), this.settings);
	}
	
	load() {}
	unload() {}
	
	start() {	
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (!window.ZeresLibrary || window.ZeresLibrary.isOutdated) {
			if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
			document.head.appendChild(libraryScript);
		}

		if (window.ZeresLibrary) this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.loadSettings();

		this.GuildStore = DiscordModules.GuildMemberStore;
		this.SelectedGuildStore = DiscordModules.SelectedGuildStore;
		this.UserTypingStore = DiscordModules.UserTypingStore;
		this.SelectedChannelStore = DiscordModules.SelectedChannelStore;
		this.UserStore = DiscordModules.UserStore;
		this.RelationshipStore = DiscordModules.RelationshipStore;
		this.PopoutWrapper = InternalUtilities.WebpackModules.findByUniqueProperties(['Positions', 'Animations']);
		this.VoiceUser = InternalUtilities.WebpackModules.find(m => typeof(m) === "function" && m.List);
		this.UserPopout = InternalUtilities.WebpackModules.find(m => m.displayName == "FluxContainer(SubscribeGuildMembersContainer(t))");
		this.UserModal = InternalUtilities.WebpackModules.find(m => {
			try {
				return m.modalConfig && m.prototype.render().type.displayName == "FluxContainer(SubscribeGuildMembersContainer(t))";
			}
			catch (err) {return false;}
		});
		this.AuditLogItem = InternalUtilities.WebpackModules.find(m => m.prototype && m.prototype.renderPermissionUpdate);
		this.TypingUsers = InternalUtilities.WebpackModules.find(m => {
			try { return m.displayName == "FluxContainer(t)" && !(new m({channel: 0})); }
			catch (e) { return e.toString().includes("isPrivate"); }
		});		

		this.colorize();
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}
	
	stop() {
		this.decolorize();
		$("*").off("." + this.getShortName());
	}

	colorize() {
		this.patchVoiceUsers();
		this.patchMentions();
		this.patchAccountDetails();
		this.patchUserPopouts();
		this.patchUserModals();
		this.patchAuditLog();
		this.patchTypingUsers();
	}

	decolorize() {
		for (let cancel of this.cancels) cancel();
	}

	patchAccountDetails() {
		let colorize = () => {
			if (!this.settings.account.username && !this.settings.account.discriminator) return;
			let account = document.querySelector(DiscordSelectors.AccountDetails.accountDetails);
			if (!account) return;
			let member = DiscordModules.GuildMemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), DiscordModules.UserStore.getCurrentUser().id);
			if (!member || !member.colorString) return;
			if (this.settings.account.username) account.querySelector(".username").style.setProperty("color", member.colorString, "important");
			if (this.settings.account.discriminator) {
				account.querySelector(".discriminator").style.setProperty("color", member.colorString, "important");
				account.querySelector(".discriminator").style.setProperty("opacity", "1");
			}
		};
		InternalUtilities.addOnSwitchListener(colorize);
		this.cancels.push(() => {InternalUtilities.removeOnSwitchListener(colorize);});
	}

	filterTypingUsers(typingUsers) {
		if (!typingUsers) return [];
		return Object.keys(typingUsers).filter((e) => {
				return e != this.UserStore.getCurrentUser().id;
			}).filter((e) => {
				return !this.RelationshipStore.isBlocked(e);
			}).map((e) => {
				return this.UserStore.getUser(e);
			}).filter(function(e) {
				return null != e;
			});
	}

	patchTypingUsers() {
		let brc = this;
		this.cancels.push(InternalUtilities.monkeyPatch(this.TypingUsers.prototype, "componentDidUpdate", {after: (data) => {
			if (!brc.settings.modules.typing) return;
			setImmediate(() => {
				let typingUsers = data.thisObject.state.typingUsers;
				typingUsers = this.filterTypingUsers(typingUsers);
				document.querySelectorAll(DiscordSelectors.Typing.typing.descend("strong")).forEach((elem, index) => {
					if (!typingUsers[index]) return;
					let member = DiscordModules.GuildMemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), typingUsers[index].id);
					if (!member) return;
					elem.style.setProperty("color", member.colorString ? member.colorString : "");
				});
			});
		}}));
	}

	patchVoiceUsers() {
		let brc = this;
		let voiceUserMount = function() {
			if (!brc.settings.modules.voice) return;
			if (!this || !this.props || !this.props.user) return;
			let member = DiscordModules.GuildMemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), this.props.user.id);
			if (!member || !member.colorString) return;
			let elem = DiscordModules.ReactDOM.findDOMNode(this);
			elem.querySelector('[class*="name"]').style.setProperty("color", member.colorString);
		};
		this.cancels.push(InternalUtilities.monkeyPatch(this.VoiceUser.prototype, "componentDidMount", {after: ({thisObject}) => {
			let bound = voiceUserMount.bind(thisObject); bound();
		}}));
	}

	patchMentions() {
		let brc = this;
		let mentionMount = function() {
			if (!brc.settings.modules.mentions) return;
			if (!this || !this.props || !this.props.children || !this.props.children.props || this.props.children.props.className != "mention") return;
			let props = this.props.render().props;
			if (!props || !props.user) return;
			let member = DiscordModules.GuildMemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), props.user.id);
			if (!member || !member.colorString) return;
			let elem = DiscordModules.ReactDOM.findDOMNode(this);
			elem.style.setProperty("color", member.colorString);
			elem.style.setProperty("background", ColorUtilities.rgbToAlpha(member.colorString,0.1));

			if (!brc.settings.mentions.changeOnHover) return;
			$(elem).on("mouseenter." + brc.getShortName(), (e)=>{
				e.target.style.setProperty("color", "#FFFFFF");
				e.target.style.setProperty("background", ColorUtilities.rgbToAlpha(member.colorString,0.7));
			});
			$(elem).on("mouseleave." + brc.getShortName(), (e)=> {
				e.target.style.setProperty("color", member.colorString);
				e.target.style.setProperty("background", ColorUtilities.rgbToAlpha(member.colorString,0.1));
			});
		};
		this.cancels.push(InternalUtilities.monkeyPatch(this.PopoutWrapper.prototype, "componentDidMount", {after: ({thisObject}) => {
			let bound = mentionMount.bind(thisObject); bound();
		}}));
	}

	patchUserPopouts() {
		let brc = this;
		let popoutMount = function() {
			if (!brc.settings.popouts.username && !brc.settings.popouts.discriminator && !brc.settings.popouts.nickname) return;
			if (!this || !this.props || !this.props.user) return;
			let member = DiscordModules.GuildMemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), this.props.user.id);
			if (!member || !member.colorString) return;
			let elem = DiscordModules.ReactDOM.findDOMNode(this);
			let hasNickname = Boolean(this.state.nickname);
			if (brc.settings.popouts.username || (!hasNickname && brc.settings.popouts.fallback)) elem.querySelector('.username').style.setProperty("color", member.colorString, "important");
			if (brc.settings.popouts.discriminator) elem.querySelector('.discriminator').style.setProperty("color", member.colorString, "important");
			if (brc.settings.popouts.nickname && hasNickname) elem.querySelector(DiscordSelectors.UserPopout.headerName).style.setProperty("color", member.colorString, "important");
		};
		this.cancels.push(InternalUtilities.monkeyPatch(this.UserPopout.prototype, "componentDidMount", {after: ({thisObject}) => {
			let bound = popoutMount.bind(thisObject); bound();
		}}));
	}

	patchUserModals() {
		let brc = this;
		let modalMount = function() {
			if (!brc.settings.modals.username && !brc.settings.modals.discriminator) return;
			if (!this || !this.props || !this.props.user) return;
			let member = DiscordModules.GuildMemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), this.props.user.id);
			if (!member || !member.colorString) return;
			let elem = DiscordModules.ReactDOM.findDOMNode(this);
			if (brc.settings.modals.username) elem.querySelector('.username').style.setProperty("color", member.colorString, "important");
			if (brc.settings.modals.discriminator) elem.querySelector('.discriminator').style.setProperty("color", member.colorString, "important");
		};

		this.cancels.push(InternalUtilities.monkeyPatch(this.UserModal.prototype, "componentDidMount", {after: ({thisObject}) => {
			let bound = modalMount.bind(thisObject); bound();
		}}));
	}

	patchAuditLog() {
		let brc = this;
		let auditlogMount = function() {
			if (!brc.settings.auditLog.username && !brc.settings.auditLog.discriminator) return;
			if (!this || !this.props || !this.props.log || !this.props.log.user) return;
		
			let elem = DiscordModules.ReactDOM.findDOMNode(this);
			let hooks = elem.querySelectorAll(DiscordSelectors.AuditLog.userHook);
			let member = DiscordModules.GuildMemberStore.getMember(this._reactInternalFiber.return.memoizedProps.guildId, this.props.log.user.id);
			if (member && member.colorString) {
				if (member.colorString && brc.settings.auditLog.username) hooks[0].children[0].style.color = member.colorString;
				if (member.colorString && brc.settings.auditLog.discriminator) { hooks[0].querySelector(DiscordSelectors.AuditLog.discrim).style.color = member.colorString;hooks[0].querySelector(DiscordSelectors.AuditLog.discrim).style.opacity = 1;}
			}
		
			if (hooks.length < 2 || this.props.log.targetType != "USER") return;
			member = DiscordModules.GuildMemberStore.getMember(this._reactInternalFiber.return.memoizedProps.guildId, this.props.log.target.id);
			if (!member || !member.colorString) return;
			if (brc.settings.auditLog.username) hooks[1].children[0].style.color = member.colorString;
			if (brc.settings.auditLog.discriminator) { hooks[1].querySelector(DiscordSelectors.AuditLog.discrim).style.color = member.colorString;hooks[1].querySelector(DiscordSelectors.AuditLog.discrim).style.opacity = 1;}
		};

		this.cancels.push(InternalUtilities.monkeyPatch(this.AuditLogItem.prototype, "componentDidMount", {after: ({thisObject}) => {
			let bound = auditlogMount.bind(thisObject); bound();
		}}));
	}
	
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}
	
	generateSettings(panel) {

		new PluginSettings.ControlGroup("Module Settings", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Typing", "Toggles colorizing of typing notifications. Least reliable module.", this.settings.modules.typing, (checked) => {this.settings.modules.typing = checked;}),
			new PluginSettings.Checkbox("Voice", "Toggles colorizing of voice users.", this.settings.modules.voice, (checked) => {this.settings.modules.voice = checked;}),
			new PluginSettings.Checkbox("Mentions", "Toggles colorizing of user mentions in the current server.", this.settings.modules.mentions, (checked) => {this.settings.modules.mentions = checked;}),
			new PluginSettings.Checkbox("Bot Tags", "Toggles coloring the background of bot tags to match role.", this.settings.modules.botTags, (checked) => {this.settings.modules.botTags = checked;})
		);

		new PluginSettings.ControlGroup("Popout Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Username", "Toggles coloring on the username in popouts.", this.settings.popouts.username, (checked) => {this.settings.popouts.username = checked;}),
			new PluginSettings.Checkbox("Discriminator", "Toggles coloring on the discriminator in popouts.", this.settings.popouts.discriminator, (checked) => {this.settings.popouts.discriminator = checked;}),
			new PluginSettings.Checkbox("Nickname", "Toggles coloring on the nickname in popouts.", this.settings.popouts.nickname, (checked) => {this.settings.popouts.nickname = checked;}),
			new PluginSettings.Checkbox("Enable Fallback", "If nickname is on and username is off, enabling this will automatically color the username.", this.settings.popouts.fallback, (checked) => {this.settings.popouts.fallback = checked;})
		);

		new PluginSettings.ControlGroup("Modal Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Username", "Toggles coloring on the username in modals.", this.settings.modals.username, (checked) => {this.settings.modals.username = checked;}),
			new PluginSettings.Checkbox("Discriminator", "Toggles coloring on the discriminator in popouts.", this.settings.modals.discriminator, (checked) => {this.settings.modals.discriminator = checked;})
		);

		new PluginSettings.ControlGroup("Audit Log Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Username", "Toggles coloring on the usernames in the audit log.", this.settings.auditLog.username, (checked) => {this.settings.auditLog.username = checked;}),
			new PluginSettings.Checkbox("Discriminator", "Toggles coloring on the discriminators in the audit log.", this.settings.auditLog.discriminator, (checked) => {this.settings.auditLog.discriminator = checked;})
		);

		new PluginSettings.ControlGroup("Account Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Username", "Toggles coloring on your username at the bottom.", this.settings.account.username, (checked) => {this.settings.account.username = checked;}),
			new PluginSettings.Checkbox("Discriminator", "Toggles coloring on your discriminator at the bottom.", this.settings.account.discriminator, (checked) => {this.settings.account.discriminator = checked;})
		);

		new PluginSettings.ControlGroup("Mention Options", () => {this.saveSettings();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Hover Color", "Turning this on adjusts the color on hover to match role color, having it off defers to your theme.",
										this.settings.mentions.changeOnHover, (checked) => {this.settings.mentions.changeOnHover = checked;})
		);
			
		var resetButton = $("<button>");
		resetButton.on("click." + this.getShortName(), () => {
			this.settings = this.defaultSettings;
			this.saveSettings();
			panel.empty();
			this.generateSettings(panel);
		});
		resetButton.text("Reset To Defaults");
		resetButton.css("float", "right");
		resetButton.attr("type","button");

		panel.append(resetButton);
	}
}