//META{"name":"StatusEverywhere","displayName":"StatusEverywhere","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js"}*//

var StatusEverywhere = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"StatusEverywhere","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.4.0","description":"Adds user status everywhere Discord doesn't. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Updated for Discord changes."]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules} = Api;
    return class HideDisabledEmojis extends Plugin {
        onStart() {
            const Avatar = WebpackModules.getByProps("AvatarWrapper");
            const original = Avatar.default;
            Patcher.before(Avatar, "default", (_, args) => {
                if (args[0].status) return;
                const id = args[0].src.split("/")[4];
                args[0].status = DiscordModules.UserStatusStore.getStatus(id);
            });
            Object.assign(Avatar.default, original);
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
		showAlert() {window.mainCore.alert("Loading Error",`Something went wrong trying to load the library for the plugin. Try reloading?`);}
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