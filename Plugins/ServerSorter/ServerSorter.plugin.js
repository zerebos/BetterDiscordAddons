//META{"name":"ServerSorter","displayName":"ServerSorter","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSorter","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSorter/ServerSorter.plugin.js"}*//

var ServerSorter = (() => {
    const config = {"info":{"name":"ServerSorter","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.4.1","description":"Adds server sorting abilities to Discord. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSorter","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSorter/ServerSorter.plugin.js"},"changelog":[{"title":"New Stuff","items":["Local loader only."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {PluginUtilities, ContextMenu, DiscordModules, ReactTools} = Api;

    const SortedGuildStore = DiscordModules.SortedGuildStore;

    return class ServerSearch extends Plugin {
        onStart() {
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
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();