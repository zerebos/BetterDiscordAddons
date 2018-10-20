//META{"name":"TransparencyPatcher","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/TransparencyPatcher","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/TransparencyPatcher/TransparencyPatcher.plugin.js"}*//

class TransparencyPatcher {
	getName() { return "TransparencyPatcher"; }
	getShortName() { return "TransparencyPatcher"; }
	getDescription() { return "Enables full transparency in discord."; }
	getVersion() { return "0.0.3"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		var libraryScript = document.getElementById('ZLibraryScript');
		if (!window.ZLibrary) {
			if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
			libraryScript.setAttribute("id", "ZLibraryScript");
			document.head.appendChild(libraryScript);
		}

		if (window.ZLibrary) this.showNotice();
		else libraryScript.addEventListener("load", () => { this.showNotice(); });
	}
	
	showNotice() {
		ZLibrary.Modals.showAlertModal("Plugin Outdated (TransparencyPatcher)", `
			Hi there, I am letting you know that this plugin (TransparencyPatcher) is no longer needed as there is a transparency option under Zere's Fork in settings.\n\n
			
			
			For now this is only functional on Windows until the injections are updated on Mac and Linux, however the method TransparencyPatcher used before no longer works so you'll have to be patient for those on Mac and Linux.
		`);
	}
	
	start() {}
	stop() {}
}