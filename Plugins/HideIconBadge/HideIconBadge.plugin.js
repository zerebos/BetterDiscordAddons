//META{"name":"HideIconBadge","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideIconBadge","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideIconBadge/HideIconBadge.plugin.js"}*//

/* global PluginUtilities:false, InternalUtilities:false */

class HideIconBadge {
	getName() { return "HideIconBadge"; }
	getShortName() { return "HideIconBadge"; }
	getDescription() { return "Hides the badge on the app icon and tray icon. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.3"; }
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
		Patcher.unpatchAll(this.getName());
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		
		let ElectronModule = InternalUtilities.WebpackModules.findByUniqueProperties(["setBadge"]);

		ElectronModule.setBadge(0);
		Patcher.before(this.getName(), ElectronModule, "setBadge", (thisObject, methodArguments) => {
			methodArguments[0] = 0;
		});

		ElectronModule.setSystemTrayIcon("DEFAULT");
		Patcher.before(this.getName(), ElectronModule, "setSystemTrayIcon", (thisObject, methodArguments) => {
			methodArguments[0] === "UNREAD" ? methodArguments[0] = "DEFAULT" : void 0;
		});
		
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}
}