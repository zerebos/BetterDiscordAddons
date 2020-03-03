module.exports = (Plugin, Api) => {
    const {PluginUtilities, ContextMenu, DiscordModules, ReactTools} = Api;

    const SortedGuildStore = DiscordModules.SortedGuildStore;

    return class ServerSearch extends Plugin {
        onStart() {
            PluginUtilities.addStyle(this.getName(), require("styles.css"));
            const sortButton = $(require("button.html"));
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
    
            sortButton.on("click", (e) => {
                contextMenu.show(e.clientX, e.clientY);
            });
            sortButton.insertBefore($(".listItem-2P_4kh .guildSeparator-3s64Iy").first().parent());
        }
        
        onStop() {
            $("#sort-button").remove();
            PluginUtilities.removeStyle(this.getName(), require("styles.css"));
        }

        getGuilds() {
            return $(".listItem-2P_4kh:has(.blobContainer-239gwq)");
        }
        
        getGuildData(guild) {
            return ReactTools.getReactProperty(guild, "return.memoizedProps.guild");
        }
        
        getGuildNames() {
            const names = [];
            this.getGuilds().each((index, elem) => {
                names.push(this.getGuildData(elem).name);
            });
            return names;
        }
        
        doSort(sortType, reverse, reset) {
            const guilds = this.getGuilds();
            guilds.sort((a,b) => {
                let first = this.getGuildData(a)[sortType];
                let second = this.getGuildData(b)[sortType];
                
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
            guilds.detach().insertBefore($(".listItem-2P_4kh:has([name*=Add])"));
        }

    };
};