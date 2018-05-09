//META{"name":"StatusEverywhere","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js"}*//

/* global PluginUtilities:false, ReactUtilities:false, BdApi:false */

class StatusEverywhere {
	getName() { return "StatusEverywhere"; }
	getShortName() { return "StatusEverywhere"; }
	getDescription() { return "Adds user status everywhere Discord doesn't. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.3.0"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
	}
	
	load() {}
	unload() {}
	
	start() {
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
		$('.message-group .avatar-large').each((index, elem) => {
			if ($(elem).find('.status').length) $(elem).empty();
		});
		Patcher.unpatchAll(this.getName());
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		let Avatar = InternalUtilities.WebpackModules.findByDisplayName("Avatar");

		Patcher.after(this.getName(), Avatar.prototype, "getDefaultProps", (thisObject, args, returnValue) => {
			return returnValue.status = "offline";
		});

		Patcher.after(this.getName(), Avatar.prototype, "componentWillMount", (thisObject) => {	
			if (thisObject.props.size != "large") return;

			let userId = thisObject.props.user.id;
			let channelId = DiscordModules.SelectedChannelStore.getChannelId();

			thisObject.props.onTypingUpdate = () => {
				let newStatus = DiscordModules.UserTypingStore.isTyping(channelId, userId);
				if (thisObject.props.typing == newStatus) return;
				thisObject.props.typing = newStatus;
				thisObject.forceUpdate();
			};

			thisObject.props.onStatusUpdate = () => {
				let newStatus = DiscordModules.UserStatusStore.getStatus(userId);
				if (thisObject.props.status == newStatus) return;
				thisObject.props.status = DiscordModules.UserStatusStore.getStatus(userId);
				thisObject.props.streaming = DiscordModules.UserActivityStore.getActivity(userId) && DiscordModules.UserActivityStore.getActivity(userId).type === 1;
				thisObject.forceUpdate();
			};

			DiscordModules.UserTypingStore.addChangeListener(thisObject.props.onTypingUpdate);
			DiscordModules.UserStatusStore.addChangeListener(thisObject.props.onStatusUpdate);

			thisObject.props.onTypingUpdate();
			thisObject.props.onStatusUpdate();
		});

		Patcher.after(this.getName(), Avatar.prototype, "componentWillUnmount", (thisObject) => {
			if (thisObject.props.size != "large") return;
			DiscordModules.UserTypingStore.removeChangeListener(thisObject.props.onTypingUpdate);
			DiscordModules.UserStatusStore.removeChangeListener(thisObject.props.onStatusUpdate);
		});

		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}
}