//META{"name":"StatusEverywhere"}*//

/* global PluginUtilities:false, ReactUtilities:false, BdApi:false */

class StatusEverywhere {
	getName() { return "StatusEverywhere"; }
	getShortName() { return "StatusEverywhere"; }
	getDescription() { return "Adds user status everywhere Discord doesn't. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.2.0"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.css = `/* StatusEverywhere */
		@keyframes status-fade-in {
			to {opacity: 1;}
		}
		.status-se {
			animation: status-fade-in 200ms ease;
			animation-fill-mode: forwards;
			opacity: 0;
		}
		`;

		this.switchObserver = new MutationObserver(() => {});
	}
	
	load(){}
	unload(){}
	
	start(){
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); })
	}

	stop() {
		$('.message-group .avatar-large').each((index, elem) => {
			if ($(elem).find('.status').length) $(elem).empty();
		});
		BdApi.clearCSS(this.getShortName() + "-style");
		this.switchObserver.disconnect();
	}

	initialize() {
		this.UserMetaStore = PluginUtilities.WebpackModules.findByUniqueProperties(['getStatuses']);
		BdApi.injectCSS(this.getShortName()  + "-style", this.css);
		this.switchObserver = PluginUtilities.createSwitchObserver(this);
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.attachStatuses();
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}

	onChannelSwitch() {
		this.attachStatuses();
	}

	getAuthorStatus(id) {
		var status = this.UserMetaStore.getStatus(id);
		var statusElement = document.createElement("div");
		statusElement.classList.add("status");
		statusElement.classList.add("status-se");
		statusElement.classList.add("status-" + status);
		return statusElement;
	}

	attachStatuses(elem) {
		var searchSpace = elem ? elem.querySelectorAll('.avatar-large') : document.querySelectorAll('.message-group .avatar-large');
		searchSpace.forEach((elem) => {
				if (!elem.querySelector('.status')) {
					let id = ReactUtilities.getReactProperty(elem.parentElement, "child.child.memoizedProps.user.id");
					elem.append(this.getAuthorStatus(id));
				}
		});
	}

	observer(e){
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		var elem = e.addedNodes[0];

		if (elem.classList.contains("message-group") && !elem.querySelector('.message-sending')) {
			this.attachStatuses(elem);
		}
	}
}