//META{"name":"HideIconBadge","displayName":"HideIconBadge","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideIconBadge","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideIconBadge/HideIconBadge.plugin.js"}*//

var HideIconBadge = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"HideIconBadge","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.4","description":"Hides the badge on the app icon and tray icon. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideIconBadge","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/HideIconBadge/HideIconBadge.plugin.js"},"changelog":[{"title":"New Stuff","items":["Rewrite to use new library."]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {Patcher, WebpackModules} = Api;
    const ElectronModule = WebpackModules.getByProps(["setBadge"]);
    return class HideIconBadge extends Plugin {
        onStart() {
            (function (Api) {
    if (window.ZeresPluginLibrary) return; // they already have it
    const hasShownAnnouncement = Api.PluginUtilities.loadData(this.getName(), "announcements", {localLibNotice: false}).localLibNotice;
    if (hasShownAnnouncement) return;
    Api.Modals.showConfirmationModal("Local Library Notice", Api.DiscordModules.React.createElement("span", null, `This version of ${this.getName()} is the final version that will be released using a remotely loaded library. Future versions will require my local library that gets placed in the plugins folder.`, Api.DiscordModules.React.createElement("br"), Api.DiscordModules.React.createElement("br"), "You can download the library now to be prepared, or wait until the next version which will prompt you to download it."), {
        confirmText: "Download Now",
        cancelText: "Wait",
        onConfirm: () => {
            require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
        }
    });
    Api.PluginUtilities.saveData(this.getName(), "announcements", {localLibNotice: true});
})(Api);
            ElectronModule.setBadge(0);
            Patcher.before(ElectronModule, "setBadge", (thisObject, methodArguments) => {
                methodArguments[0] = 0;
            });
    
            ElectronModule.setSystemTrayIcon("DEFAULT");
            Patcher.before(ElectronModule, "setSystemTrayIcon", (thisObject, methodArguments) => {
                methodArguments[0] === "UNREAD" ? methodArguments[0] = "DEFAULT" : void 0;
            });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
		return plugin(Plugin, Api);
	};
	
	return !global.ZLibrary ? class {
		getName() {return config.info.name.replace(" ", "");} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;} stop() {}
		showAlert() {window.BdApi.alert("Loading Error",`Something went wrong trying to load the library for the plugin. You can try using a local copy of the library to fix this.<br /><br /><a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
		async load() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			const vm = require("vm"), plugin = compilePlugin(global.ZLibrary.buildPlugin(config));
			try {new vm.Script(plugin, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be compiled.", error: {message: err.message, stack: err.stack}});}
			global[this.getName()] = plugin;
			try {new vm.Script(`new global["${this.getName()}"]();`, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be constructed", error: {message: err.message, stack: err.stack}});}
			bdplugins[this.getName()].plugin = new global[this.getName()]();
			bdplugins[this.getName()].plugin.load();
		}
		async start() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			bdplugins[this.getName()].plugin.start();
		}
	} : compilePlugin(global.ZLibrary.buildPlugin(config));
})();