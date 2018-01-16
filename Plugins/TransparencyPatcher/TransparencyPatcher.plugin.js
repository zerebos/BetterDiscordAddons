//META{"name":"TransparencyPatcher"}*//

/* global PluginUtilities:false */

class TransparencyPatcher {
	getName() { return "TransparencyPatcher"; }
	getShortName() { return "TransparencyPatcher"; }
	getDescription() { return "Enables full transparency in discord."; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.settings = {patched: false};
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
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.settings = PluginUtilities.loadSettings(this.getName(), this.settings);

		if (!this.settings.patched) {
			try {
				this.patchMainScreen();
				this.settings.patched = true;
				PluginUtilities.saveSettings(this.getName(), this.settings);
				PluginUtilities.showToast("Successfully patched! Restarting...", {type: 'success'});
				this.relaunch();
			}
			catch(e) {
				PluginUtilities.showToast("Something went wrong trying to unpatch.", {type: 'error'});
			}
		}
	}
	
	stop() {
		try {
			this.unpatchMainScreen();
			this.settings.patched = false;
			PluginUtilities.saveSettings(this.getName(), this.settings);
			PluginUtilities.showToast("Successfully unpatched! Restarting...", {type: 'success'});
			this.relaunch();
		}
		catch(e) {
			PluginUtilities.showToast("Something went wrong trying to unpatch.", {type: 'error'});
		}
	}

	relaunch() {
		setTimeout(() => {
			let app = require('electron').remote.app;
			app.relaunch();
			app.exit();
		}, 3000);
	}

	getCorePath() {
		let app = require('electron').remote.app;
		let releaseChannel = require(app.getAppPath() + "/build_info").releaseChannel;
		let discordPath = releaseChannel === "canary" ? "discordcanary" : releaseChannel === "ptb" ? "discordptb" : "discord";
		return `${app.getPath('appData')}/${discordPath}/${app.getVersion()}/modules/discord_desktop_core`;
	}

	patchMainScreen() {
		let fs = require('fs');
		let mainScreenPath = `${this.getCorePath()}/core/app/mainScreen.js`;
		let mainScreen = fs.readFileSync(mainScreenPath).toString().split('\n');

		for (let l = 0, len = mainScreen.length; l < len; l++) {
			let line = mainScreen[l];
			if (line.includes("_electron = require")) {
				mainScreen.splice(l + 1, 0, `_electron.app.commandLine.appendSwitch('enable-transparent-visuals');`);
				len++;
			}
			if (line.includes("backgroundColor: ACCOUNT_GREY")) mainScreen[l] = line.replace("ACCOUNT_GREY", "null");
			if (line.includes("transparent: false")) mainScreen[l] = line.replace("false", "true");
		}

		fs.writeFileSync(mainScreenPath, mainScreen.join('\n'));
	}

	unpatchMainScreen() {
		let fs = require('fs');
		let mainScreenPath = `${this.getCorePath()}/core/app/mainScreen.js`;
		let mainScreen = fs.readFileSync(mainScreenPath).toString().split('\n');
		console.log(mainScreen);

		for (let l = 0, len = mainScreen.length; l < len; l++) {
			let line = mainScreen[l];
			if (line == undefined) console.log(l)
			if (line.includes("_electron.app.commandLine.appendSwitch('enable-transparent-visuals');")) {
				mainScreen.splice(l, 1);
				len--;
			}
			if (line.includes("backgroundColor: null")) mainScreen[l] = line.replace("null", "ACCOUNT_GREY");
			if (line.includes("transparent: true")) mainScreen[l] = line.replace("true", "false");
		}

		fs.writeFileSync(mainScreenPath, mainScreen.join('\n'));
	}
}