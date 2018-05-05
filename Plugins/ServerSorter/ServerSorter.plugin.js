//META{"name":"ServerSorter","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSorter","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/ServerSorter/ServerSorter.plugin.js"}*//

/* global PluginUtilities:false, InternalUtilities:false, ReactUtilities:false, BdApi:false */

class ServerSorter {
	getName() { return "ServerSorter"; }
	getShortName() { return "ServerSorter"; }
	getDescription() { return "Adds server sorting abilities to Discord. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.3.0"; }
	getAuthor() { return "Zerebos"; }
	
	load() {}
	unload() {}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (!window.ZeresLibrary || window.ZeresLibrary.isOutdated) {
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
		$(document).add("*").off(this.getShortName());
		$(".guild-sorter").remove();
		BdApi.clearCSS(this.getShortName());
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		BdApi.injectCSS(this.getShortName(), "#sort-options { pointer-events:none;opacity:0;transition: 300ms cubic-bezier(.2,0,0,1); transform-origin: 0 0;transform: translateY(-10px);}" + 
		"#sort-options.open { pointer-events:initial;opacity:1;transition: 300ms cubic-bezier(.2,0,0,1); transform-origin: 0 0; transform: translateY(0px);}");
		this.SortedGuildStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getSortedGuilds']);
		
		let sortButton = $('<div class="guild guild-sorter" id="bd-pub-li" style="height: 20px; margin-bottom:10px;"><div class="guild-inner" style="height: 20px; border-radius: 4px;"><a><div id="bd-pub-button" class="sort-button" style="line-height: 20px; font-size: 12px;">Sort</div></a></div></div>');

		let contextMenu = new PluginContextMenu.Menu().addItems(
			new PluginContextMenu.ItemGroup().addItems(
				new PluginContextMenu.TextItem("Alphabetically", {hint: "A > Z", callback: () => {this.doSort("name", false);}}),
				new PluginContextMenu.TextItem("Reverse Alphabetical", {hint: "Z > A", callback: () => {this.doSort("name", true);}})
			),
			new PluginContextMenu.ItemGroup().addItems(
				new PluginContextMenu.TextItem("Newest Joined", {hint: "New", callback: () => {this.doSort("joinedAt", false);}}),
				new PluginContextMenu.TextItem("Oldest Joined", {hint: "Old", callback: () => {this.doSort("joinedAt", true);}})
			),
			new PluginContextMenu.ItemGroup().addItems(
				new PluginContextMenu.TextItem("Newest Created", {callback: () => {this.doSort("id", false);}}),
				new PluginContextMenu.TextItem("Oldest Created", {callback: () => {this.doSort("id", true);}})
			),
			new PluginContextMenu.ItemGroup().addItems(
				new PluginContextMenu.TextItem("Reset", {danger: true, callback: () => {this.doSort("id", false, true);}})
			)
		);

		sortButton.find('.sort-button').on("click." + this.getShortName(), (e) => {
			contextMenu.show(e.clientX, e.clientY);
		});
		sortButton.insertBefore($('.dms + .guild-separator'));
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}

	getGuilds() {
		return $('div.guild:has(div[draggable="true"]):not(#server-search)');
	}
	
	getGuildData(guild) {
		return ReactUtilities.getReactProperty(guild, "return.memoizedProps.guild");
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
				first = this.SortedGuildStore.guildPositions.indexOf(first.toString());
				second = this.SortedGuildStore.guildPositions.indexOf(second.toString());
			}
			
			if (first > second) {
				return reverse ? -1 : 1;
			}
			if (second > first) {
				return reverse ? 1 : -1;
			}
			return 0;
		});
		guilds.detach().insertBefore($('button.guild'));
	}
	
	observer() {}
}

