//META{"name":"DoNotTrack","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/DoNotTrack","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/DoNotTrack/DoNotTrack.plugin.js"}*//

class DoNotTrack {
	getName() { return "DoNotTrack"; }
	getShortName() { return "DoNotTrack"; }
	getDescription() { return "Stops Discord from tracking everything you do like Sentry and Analytics. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }
	
	load() {}
	
	async start() {
        let libraryScript = document.getElementById('zeresLibraryScript');
		if (!window.ZeresLibraryPromise && libraryScript) window.ZeresLibraryPromise = new Promise(resolve => libraryScript.addEventListener("load", resolve));
		if (!libraryScript || (window.ZeresLibrary && window.ZeresLibrary.isOutdated)) {
			if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
            document.head.appendChild(libraryScript);
			window.ZeresLibraryPromise = new Promise(resolve => libraryScript.addEventListener("load", resolve));
		}

		await window.ZeresLibraryPromise;
		this.initialize();
	}

	stop() {
		Patcher.unpatchAll(this.getName());
	}

	initialize() {
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());

        const Analytics = InternalUtilities.WebpackModules.findByUniqueProperties(["AnalyticEventConfigs"]);
        Patcher.instead(this.getName(), Analytics.default, "track", () => {});

        const Warning = InternalUtilities.WebpackModules.findByUniqueProperties(["consoleWarning"]);
        Patcher.instead(this.getName(), Warning, "consoleWarning", () => {});

        const MethodWrapper = InternalUtilities.WebpackModules.findByUniqueProperties(["wrapMethod"]);
        Patcher.instead(this.getName(), MethodWrapper, "wrapMethod", () => {});

        const Sentry = InternalUtilities.WebpackModules.findByUniqueProperties(["_originalConsoleMethods", "_wrappedBuiltIns"]);
        Sentry.uninstall();
        Patcher.instead(this.getName(), Sentry, "_breadcrumbEventHandler", () => {});
        Patcher.instead(this.getName(), Sentry, "captureBreadcrumb", () => {});
        Patcher.instead(this.getName(), Sentry, "_makeRequest", () => {});
        Patcher.instead(this.getName(), Sentry, "_sendProcessedPayload", () => {});
        Patcher.instead(this.getName(), Sentry, "_send", () => {});
        Object.assign(window.console, Sentry._originalConsoleMethods);
	}
}

