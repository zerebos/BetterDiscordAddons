//META{"name":"BetterRoleColors", "pname":"BetterRoleColors"}*//

/* global PluginSettings:false, PluginUtilities:false, ReactUtilities:false, DOMUtilities:false, ColorUtilities:false, InternalUtilities:false */

class BetterRoleColors {
	getName() { return "BetterRoleColors"; }
	getShortName() { return "BRC"; }
	getDescription() { return "Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.6.3"; }
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

		this.switchObserver = new MutationObserver(() => {});
		this.documentObserver = new MutationObserver((changes) => {
			for (let change in changes) this.observe(changes[change]);
		});
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
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.loadSettings();

		this.GuildStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getMembers']);
		this.SelectedGuildStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedGuildId']);
		this.UserTypingStore = PluginUtilities.WebpackModules.findByUniqueProperties(['isTyping']);
		this.SelectedChannelStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedChannelId']);
		this.UserStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getCurrentUser']);
		this.RelationshipStore = PluginUtilities.WebpackModules.findByUniqueProperties(['isBlocked']);

		let TypingUsers = InternalUtilities.WebpackModules.findByDisplayName("TypingUsers");
		this.typingCancel = InternalUtilities.monkeyPatch(TypingUsers.prototype, "render", {after: (data) => {
			setImmediate(() => {this.colorizeTyping(data.thisObject.state.typingUsers);});
		}});

		this.switchObserver = PluginUtilities.createSwitchObserver(this);
		this.documentObserver.observe(document.querySelector('#app-mount'), {childList: true, subtree: true});
		this.colorize();
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}
	
	stop() {
		this.decolorize();
		this.saveSettings();
		$("*").off("." + this.getShortName());
		this.switchObserver.disconnect();
		this.documentObserver.disconnect();
		for (let cancel of this.cancels) cancel();
	}
	
	onChannelSwitch() {
		this.colorize();
	}
	
	observe(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
		var elem = e.addedNodes[0];

		if (elem.querySelector("#friends") || elem.id == "friends") this.onChannelSwitch();

		if (elem.querySelector(".draggable-3SphXU") || elem.classList.contains("draggable-3SphXU")) {
			this.colorizeVoice();
		}

		if (elem.querySelector(".guild-settings-audit-logs") || elem.classList.contains("guild-settings-audit-logs") || elem.querySelector(".userHook-DFT5u7") || elem.classList.contains("userHook-DFT5u7")) {
			this.colorizeAuditLog();
		}

		if (elem.querySelector('.userPopout-11hFKo')) {
			this.colorizePopout();
		}

		if (elem.querySelector(".root-2sNHUF")) {
			this.colorizeModal();
		}

		if (elem.classList.contains("message-group")) {
			this.colorizeMentions(elem.querySelector('.message'));
		}

		if (elem.classList.contains("message") && !elem.classList.contains("message-sending")) {
			this.colorizeMentions(elem);
			
		}

		if (elem.classList.contains("messages-wrapper")) {
			this.colorizeMentions();
			this.colorizeBotTags();
		}
	}

	getColorData(server, user) {
		if (!server || !user || !this.GuildStore.getMember(server, user)) return "";
		else return this.GuildStore.getMember(server, user).colorString;
	}

	getUserColor(user, server = null) {
		return this.getColorData(server ? server : this.SelectedGuildStore.getGuildId(), user);
	}

	colorize() {
		this.colorizeVoice();
		this.colorizeMentions();
		this.colorizeAccountStatus();
		this.colorizeBotTags();
	}

	colorizeAccountStatus() {
		if (!this.settings.account.username && !this.settings.account.discriminator) return;
		let account = document.querySelector('.accountDetails-15i-_e');
		if (!account) return;
		let color = this.getUserColor(this.UserStore.getCurrentUser().id);
		if (this.settings.account.username) account.querySelector(".username").style.setProperty("color", color, "important");
		if (this.settings.account.discriminator) {
			account.querySelector(".discriminator").style.setProperty("color", color, "important");
			account.querySelector(".discriminator").style.setProperty("opacity", "1");
		}
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

	colorizeTyping(typingUsers) {
		if (!this.settings.modules.typing) return;
		typingUsers = this.filterTypingUsers(typingUsers);
		document.querySelectorAll(".typing-3eiiL_ strong").forEach((elem, index) => {
			var ID = typingUsers[index].id;
			elem.style.setProperty("color", this.getUserColor(ID));
		});
	}

	colorizeVoice() {
		if (!this.settings.modules.voice) return;
		document.querySelectorAll(".draggable-3SphXU").forEach((elem) => {
			let user = ReactUtilities.getReactProperty(elem, "return.memoizedProps.user");
			elem.querySelector('[class*="name"]').style.setProperty("color", this.getUserColor(user.id));
		});
	}

	colorizeMentions(elem) {
		if (!this.settings.modules.mentions) return;
		var searchSpace = elem ? [elem] : document.querySelectorAll(".message-group .message");
		searchSpace.forEach((elem) => {
			let messages = ReactUtilities.getReactProperty(elem.parentElement.parentElement, "return.memoizedProps.messages");
			if (!messages || !messages.length) return true;
			var messageNum = DOMUtilities.indexInParent(elem);
			if (!messages[messageNum] || !messages[messageNum].content) return true;
			var mentions = messages[messageNum].content.match(/<@&?!?[0-9]+>/g);
			if (!mentions || !mentions.length) return true;
			var mentionNum = 0;
			mentions.forEach((mention, number, self) => {
				self[number] = mention.replace(/<|@|&|!|>/g, "");
			});
			elem.querySelectorAll('.message-text > .markup > .mention').forEach((elem) => {
				let isUserMention = ReactUtilities.getReactProperty(elem, "memoizedProps.onContextMenu.name") == "bound handleUserContextMenu";
				var user = mentions[mentionNum];
				mentionNum += 1;
				if (!user || !isUserMention) return true;
				var textColor = this.getUserColor(user);
				if (textColor) {
					elem.style.setProperty("color", textColor);
					elem.style.setProperty("background", ColorUtilities.rgbToAlpha(textColor,0.1));

					if (!this.settings.mentions.changeOnHover) return;
					$(elem).on("mouseenter." + this.getShortName(), (e)=>{
						e.target.style.setProperty("color", "#FFFFFF");
						e.target.style.setProperty("background", ColorUtilities.rgbToAlpha(textColor,0.7));
					});
					$(elem).on("mouseleave." + this.getShortName(), (e)=> {
						e.target.style.setProperty("color", textColor);
						e.target.style.setProperty("background", ColorUtilities.rgbToAlpha(textColor,0.1));
					});
				}
			});
		});
	}

	colorizePopout() {
		if (!this.settings.popouts.username && !this.settings.popouts.discriminator && !this.settings.popouts.nickname) return;
		let popout = document.querySelector('.userPopout-11hFKo');
		let user = ReactUtilities.getReactProperty(popout, "return.memoizedProps.user");
		if (!user) return true;
		let color = this.getUserColor(user.id);
		var hasNickname = Boolean(popout.querySelector('.headerName-3U6eDn'));
		if ((color && this.settings.popouts.username) || (!hasNickname && this.settings.popouts.fallback)) popout.querySelector('.username').style.setProperty("color", color, "important");
		if (color && this.settings.popouts.discriminator) popout.querySelector('.discriminator').style.setProperty("color", color, "important");
		if (color && this.settings.popouts.nickname && hasNickname) popout.querySelector('.headerName-3U6eDn').style.setProperty("color", color, "important");
	}

	colorizeModal() {
		if (!this.settings.modals.username && !this.settings.modals.discriminator) return;
		let modal = document.querySelector(".root-2sNHUF");
		let user = ReactUtilities.getReactProperty(modal, "return.return.memoizedProps.user");
		let color = this.getUserColor(user.id);
		if (color && this.settings.modals.username) modal.querySelector('.username').style.setProperty("color", color, "important");
		if (color && this.settings.modals.discriminator) modal.querySelector('.discriminator').style.setProperty("color", color, "important");
	}

	colorizeAuditLog() {
		if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
		let server = ReactUtilities.getReactProperty(document.querySelector(".ui-standard-sidebar-view"), "return.return.return.memoizedProps.guild");
		document.querySelectorAll('.userHook-DFT5u7').forEach((elem) => {
			let user = ReactUtilities.getReactProperty(elem, "return.memoizedProps.user");
			let color = this.getUserColor(user.id, server.id);
			if (this.settings.auditLog.username) elem.children[0].style.color = color;
			if (this.settings.auditLog.discriminator) { elem.querySelector(".discrim-xHdOK3").style.color = color;elem.querySelector(".discrim-xHdOK3").style.opacity = 1;}
		});
	}

	colorizeBotTags() {
		if (!this.settings.modules.botTags) return;
		document.querySelectorAll('.botTagRegular-288-ZL').forEach(node => {
			node.style.backgroundColor = node.previousSibling.style.color;
		});
	}

	decolorize() {
		this.decolorizeTyping();
		this.decolorizeMentions();
		this.decolorizeVoice();
		this.decolorizePopouts();
		this.decolorizeModals();
		this.decolorizeAuditLog();
		this.decolorizeAccountStatus();
		this.decolorizeBotTags();
	}

	decolorizeTyping() { if (this.typingCancel) this.typingCancel(); }
	decolorizeVoice() { $('.draggable-3SphXU').each((index, elem)=>{$(elem).find(".avatarContainer-303pFz").siblings().first().css("color", "");}); }
	decolorizeMentions() { $('.mention').each((index, elem)=>{$(elem).css("color","");$(elem).css("background","");}); $(".mention").off("." + this.getShortName()); }
	decolorizePopouts() {
		$('div[class*="userPopout"]').each((index, elem) => {
			$(elem).find('.headerTag-3zin_i span:first-child').each((index, elem)=>{$(elem).css("color","");});
			$(elem).find('div[class*="headerDiscriminator"]').each((index, elem)=>{$(elem).css("color","");});
			$(elem).find('div[class*="headerName"]').each((index, elem)=>{$(elem).css("color","");});
		});
	}

	decolorizeModals() {
		$("#user-profile-modal").each((index, elem) => {
			$(elem).find('.discriminator').each((index, elem)=>{$(elem).css("color","");});
			$(elem).find('.username').each((index, elem)=>{$(elem).css("color","");});
		});
	}

	decolorizeAuditLog() {
		$(".userHook-DFT5u7").each((index, elem) => {
			$(elem).children().first().each((index, elem)=>{$(elem).css("color","");});
			$(elem).children(".discrim-xHdOK3").each((index, elem)=>{$(elem).css("color","").css("opacity", "");});
		});
	}

	decolorizeAccountStatus() {
		$('div[class*="accountDetails"]').find('.username').css("color","");
		$('div[class*="accountDetails"]').find('.discriminator').css("color","").css("opacity", "");
	}

	decolorizeBotTags() {
		document.querySelectorAll('.bot-tag').forEach(node => {
			node.style.backgroundColor = "";
		});
	}
	
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}
	
	generateSettings(panel) {

		new PluginSettings.ControlGroup("Module Settings", () => {this.saveSettings(); this.decolorize(); this.colorize();}).appendTo(panel).append(
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

		new PluginSettings.ControlGroup("Account Options", () => {this.saveSettings(); this.decolorizeAccountStatus(); this.colorizeAccountStatus();}).appendTo(panel).append(
			new PluginSettings.Checkbox("Username", "Toggles coloring on your username at the bottom.", this.settings.account.username, (checked) => {this.settings.account.username = checked;}),
			new PluginSettings.Checkbox("Discriminator", "Toggles coloring on your discriminator at the bottom.", this.settings.account.discriminator, (checked) => {this.settings.account.discriminator = checked;})
		);

		new PluginSettings.ControlGroup("Mention Options", () => {this.saveSettings(); this.decolorizeAccountStatus(); this.colorizeAccountStatus();}).appendTo(panel).append(
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