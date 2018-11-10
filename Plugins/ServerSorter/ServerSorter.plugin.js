//META{"name":"ServerSorter","displayName":"ServerSorter","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSorter","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSorter/ServerSorter.plugin.js"}*//

var ServerSorter = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"ServerSorter","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.4.0","description":"Adds server sorting abilities to Discord. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSorter","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSorter/ServerSorter.plugin.js"},"changelog":[{"title":"New Stuff","items":["Rewrite to use new library."]},{"title":"Bugs Squashed","type":"fixed","items":["Wrong sorting direction on a couple options."]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {PluginUtilities, ContextMenu, DiscordModules, ReactTools} = Api;

    const SortedGuildStore = DiscordModules.SortedGuildStore;

    return class ServerSearch extends Plugin {
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
            PluginUtilities.addStyle(this.getName(), `#sort-options {
	pointer-events: none;
	opacity: 0;
	transition: 300ms cubic-bezier(.2, 0, 0, 1);
	transform-origin: 0 0;
	transform: translateY(-10px);
}

#sort-options.open {
	pointer-events: initial;
	opacity: 1;
	transition: 300ms cubic-bezier(.2, 0, 0, 1);
	transform-origin: 0 0;
	transform: translateY(0px);
}`);
            const sortButton = $(`<div class="guild-1EfMGQ guild-sorter" id="bd-pub-li" style="height: 20px; margin-bottom:10px;">
        <div class="guildInner-3DSoA4" style="height: 20px; border-radius: 4px;">
            <a>
                <div id="bd-pub-button" class="sort-button" style="line-height: 20px; font-size: 12px;">Sort</div>
            </a>
        </div>
    </div>`);
            const contextMenu = new ContextMenu.Menu().addItems(
                new ContextMenu.ItemGroup().addItems(
                    new ContextMenu.TextItem("Alphabetically", {hint: "A > Z", callback: () => {this.doSort("name", false);}}),
                    new ContextMenu.TextItem("Reverse Alphabetical", {hint: "Z > A", callback: () => {this.doSort("name", true);}})
                ),
                new ContextMenu.ItemGroup().addItems(
                    new ContextMenu.TextItem("Newest Joined", {hint: "New", callback: () => {this.doSort("joinedAt", true);}}),
                    new ContextMenu.TextItem("Oldest Joined", {hint: "Old", callback: () => {this.doSort("joinedAt", false);}})
                ),
                new ContextMenu.ItemGroup().addItems(
                    new ContextMenu.TextItem("Newest Created", {callback: () => {this.doSort("id", true);}}),
                    new ContextMenu.TextItem("Oldest Created", {callback: () => {this.doSort("id", false);}})
                ),
                new ContextMenu.ItemGroup().addItems(
                    new ContextMenu.TextItem("Reset", {danger: true, callback: () => {this.doSort("id", false, true);}})
                )
            );
    
            sortButton.find(".sort-button").on("click", (e) => {
                contextMenu.show(e.clientX, e.clientY);
            });
            sortButton.insertBefore($(".dms-rcsEnV + .guildSeparator-1X4GQ1"));
        }
        
        onStop() {
            $(".guild-sorter").remove();
            PluginUtilities.removeStyle(this.getName(), `#sort-options {
	pointer-events: none;
	opacity: 0;
	transition: 300ms cubic-bezier(.2, 0, 0, 1);
	transform-origin: 0 0;
	transform: translateY(-10px);
}

#sort-options.open {
	pointer-events: initial;
	opacity: 1;
	transition: 300ms cubic-bezier(.2, 0, 0, 1);
	transform-origin: 0 0;
	transform: translateY(0px);
}`);
        }

        getGuilds() {
            return $("div.guild-1EfMGQ:has(div[draggable=\"true\"]):not(#server-search)");
        }
        
        getGuildData(guild) {
            return ReactTools.getReactProperty(guild, "return.memoizedProps.guild");
        }
        
        getGuildNames() {
            var names = [];
            this.getGuilds().each((index, elem) => {
                names.push(this.getGuildData(elem).name);
            });
            return names;
        }
        
        doSort(sortType, reverse, reset) {
            var guilds = this.getGuilds();
            guilds.sort((a,b) => {
                var first = this.getGuildData(a)[sortType];
                var second = this.getGuildData(b)[sortType];
                
                if (sortType == "id" && !reset) {
                    first = parseInt(first);
                    second = parseInt(second);
                }
    
                if (sortType == "name") {
                    first = first.toLowerCase();
                    second = second.toLowerCase();
                }
                
                if (reset) {
                    first = SortedGuildStore.guildPositions.indexOf(first.toString());
                    second = SortedGuildStore.guildPositions.indexOf(second.toString());
                }
                
                if (first > second) {
                    return reverse ? -1 : 1;
                }
                if (second > first) {
                    return reverse ? 1 : -1;
                }
                return 0;
            });
            guilds.detach().insertBefore($("button.guild-1EfMGQ"));
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