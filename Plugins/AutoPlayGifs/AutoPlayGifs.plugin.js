//META{"name":"AutoPlayGifs","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js"}*//

/* global DiscordModules:false, PluginUtilities:false, InternalUtilities:false, PluginSettings:false */

class AutoPlayGifs {
	getName() { return "AutoPlayGifs"; }
	getShortName() { return "AutoPlayGifs"; }
	getDescription() { return "Automatically plays avatars. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.3"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.settings = {avatars: true, memberList: true};
		this.cancelChatAvatars = () => {};
		this.cancelMemberListAvatars = () => {};
	}
	
	load(){}
	unload(){}

	loadSettings() {this.settings = PluginUtilities.loadSettings(this.getName(), this.settings);}
	saveSettings() {PluginUtilities.saveSettings(this.getName(), this.settings);}
	
	start(){
        let libraryScript = document.getElementById('zeresLibraryScript');
		if (!libraryScript || (window.ZeresLibrary && window.ZeresLibrary.isOutdated)) {
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

	stop() {
		this.cancelChatAvatars();
		this.cancelMemberListAvatars();
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.loadSettings();

		if (this.settings.avatars) this.patchChatAvatars();
		if (this.settings.memberList) this.patchMemberListAvatars();
		
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}

	patchChatAvatars() {
		let MessageGroup = InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/hasAnimatedAvatar/));
		this.cancelChatAvatars = Patcher.before(this.getName(), MessageGroup.prototype, "render", (thisObject) => {
			thisObject.state.animate = true;
		});
	}

	patchMemberListAvatars() {
		let MemberList = InternalUtilities.WebpackModules.find(m => m.prototype && m.prototype.renderPlaceholder);
		this.cancelMemberListAvatars = Patcher.before(this.getName(), MemberList.prototype, "render", (thisObject) => {
			if (!thisObject.props.user) return;
			let id = thisObject.props.user.id;
			let hasAnimatedAvatar = DiscordModules.ImageResolver.hasAnimatedAvatar(DiscordModules.UserStore.getUser(id));
			if (!hasAnimatedAvatar) return;
			thisObject.props.user.getAvatarURL = () => {return DiscordModules.ImageResolver.getUserAvatarURL(DiscordModules.UserStore.getUser(id)).replace("webp", "gif");};
		});
	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}

	generateSettings(panel) {
		
		new PluginSettings.ControlGroup("Plugin Settings", () => {this.saveSettings();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.Checkbox("Autoplay Avatars", "Autoplays avatars in the chat area for Nitro users.",
				this.settings.avatars, (checked) => {
					this.settings.avatars = checked;
					if (checked) this.patchChatAvatars();
					else this.cancelChatAvatars();
				}
			),
			new PluginSettings.Checkbox("Autoplay Memberlist", "Autoplays avatars in the member list for Nitro users.",
			this.settings.memberList, (checked) => {
				this.settings.memberList = checked;
				if (checked) this.patchMemberListAvatars();
				else this.cancelMemberListAvatars();
			}
			)
		);
	}
}