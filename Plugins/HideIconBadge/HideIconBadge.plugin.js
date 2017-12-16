//META{"name":"HideIconBadge"}*//

/* global PluginUtilities:false, InternalUtilities:false */

class HideIconBadge {
	getName() { return "HideIconBadge"; }
	getShortName() { return "HideIconBadge"; }
	getDescription() { return "Hides the badge on the app icon. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.cancels = [];
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
		for (let c of this.cancels) c();
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		
		let ElectronModule = InternalUtilities.WebpackModules.findByUniqueProperties(["_getMainWindow"])
		ElectronModule.setBadge(0);
		this.cancels.push(InternalUtilities.monkeyPatch(ElectronModule, "setBadge", {before: ({methodArguments}) => {
			methodArguments[0] = 0;
		}}));
		
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}
}