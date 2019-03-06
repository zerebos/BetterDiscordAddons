//META{"name":"ServerSearch","displayName":"ServerSearch","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSearch","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSearch/ServerSearch.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject('WScript.Shell');
	var fs = new ActiveXObject('Scripting.FileSystemObject');
	var pathPlugins = shell.ExpandEnvironmentStrings('%APPDATA%\\BetterDiscord\\plugins');
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup('It looks like you\'ve mistakenly tried to run me directly. \n(Don\'t do that!)', 0, 'I\'m a plugin for BetterDiscord', 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup('I\'m in the correct folder already.\nJust reload Discord with Ctrl+R.', 0, 'I\'m already installed', 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup('I can\'t find the BetterDiscord plugins folder.\nAre you sure it\'s even installed?', 0, 'Can\'t install myself', 0x10);
	} else if (shell.Popup('Should I copy myself to BetterDiscord\'s plugins folder for you?', 0, 'Do you need some help?', 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec('explorer ' + pathPlugins);
		shell.Popup('I\'m installed!\nJust reload Discord with Ctrl+R.', 0, 'Successfully installed', 0x40);
	}
	WScript.Quit();

@else@*/

var ServerSearch = (() => {
    const config = {"info":{"name":"ServerSearch","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.1","description":"Adds a button to search your servers. Search in place or in popout. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSearch","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSearch/ServerSearch.plugin.js"},"defaultConfig":[{"type":"radio","id":"inPlace","name":"Search Style","value":false,"options":[{"name":"Popout","value":false,"desc":"Shows a popout with a list of guilds to search."},{"name":"In Place","value":true,"desc":"Hides guilds in the list that don't match the search."}]}],"changelog":[{"title":"New Stuff","items":["Rewrite to use local library."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {DiscordSelectors, PluginUtilities, ColorConverter, WebpackModules, DiscordModules, ReactTools, Tooltip, Utilities, Structs: {Screen}} = Api;

    const SortedGuildStore = DiscordModules.SortedGuildStore;
    const ImageResolver = DiscordModules.ImageResolver;
    const GuildActions = DiscordModules.GuildActions;
    const GuildInfo = DiscordModules.GuildInfo;
    const Animations = WebpackModules.getByProps("spring");

    return class ServerSearch extends Plugin {
        constructor() {
            super();
            this.cancels = [];
    
            this.css = `.avatar-search {
	background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSI0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE1LjUgMTRoLS43OWwtLjI4LS4yN0MxNS40MSAxMi41OSAxNiAxMS4xMSAxNiA5LjUgMTYgNS45MSAxMy4wOSAzIDkuNSAzUzMgNS45MSAzIDkuNSA1LjkxIDE2IDkuNSAxNmMxLjYxIDAgMy4wOS0uNTkgNC4yMy0xLjU3bC4yNy4yOHYuNzlsNSA0Ljk5TDIwLjQ5IDE5bC00Ljk5LTV6bS02IDBDNy4wMSAxNCA1IDExLjk5IDUgOS41UzcuMDEgNSA5LjUgNSAxNCA3LjAxIDE0IDkuNSAxMS45OSAxNCA5LjUgMTR6Ii8+ICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=);
	background-size: 50%!important;
	background-repeat: no-repeat;
}

#server-search {
	margin-bottom: 10px;
}

.popout-3sVMXz.popout-server-search,
.popout-3sVMXz.popout-server-search-small {
	margin-top: 0;
	z-index: 1005;
}

.popout-3sVMXz.popout-server-search-small {
	padding: 10px;
	background:#2f3136;
	box-shadow: 0 0px 15px rgba(0,0,0,0.6);
	border-radius: 4px;
}

.no-image {
	background: rgb(47, 49, 54);
	font-size: 12px;
	justify-content: center;
	align-items: center;
	display: flex;
}`;
            this.guildHtml = `<div class="guild-1EfMGQ" id="server-search">
        <div draggable="true">
            <div class="guildInner-3DSoA4" draggable="false" style="border-radius: 25px; background-color: rgb(47, 49, 54);">
                <a draggable="false">
                    <div class="icon-3o6xvg guildIcon-CT-ZDq iconSizeLarge-161qtT iconInactive-98JN5i avatar-search" draggable="false"></div>
                </a>
            </div>
        </div>
    </div>`;
            this.separatorHtml = `<div class="guildSeparator-1X4GQ1 server-search-separator"></div>`;
            this.smallPopoutHtml = `<div class="popout-3sVMXz noArrow-3BYQ0Z popoutRight-2ZVwL- popout-server-search-small">
        <div class="search-bar">
            <div class="search-bar-inner">
                <input type="text" placeholder="Search..." value="">
            </div>
        </div>
    </div>`;
            this.largePopoutHtml = `<div class="popout-3sVMXz noArrow-3BYQ0Z popoutRight-2ZVwL- popout-server-search">
        <div class="popoutList-T9CKZQ guildSettingsAuditLogsUserFilterPopout-3Jg5NE elevationBorderHigh-2WYJ09">
            <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 searchBar-1MOL6S popoutListInput-1l9TUI size14-3iUx6q" style="flex: 1 1 auto;">
                <input class="input-3Xdcic flexChild-faoVW3" value="" placeholder="Search Servers - {{count}}" style="flex: 1 1 auto;">
                <div class="searchBarIcon-18QaPq flexChild-faoVW3">
                    <i class="icon-1S6UIr eyeGlass-2cMHx7 visible-3bFCH-"></i>
                    <i class="icon-1S6UIr clear--Eywng"></i>
                </div>
            </div>
            <div class="divider-3573oO divider-faSUbd marginTop8-1DLZ1n marginBottom8-AtZOdT"></div>
            <div class="scrollerWrap-2lJEkd scrollerThemed-2oenus themeGhostHairline-DBD-2d scrollerTrack-1ZIpsv">
                <div class="scroller-2FKFPG scroller-2CvAgC search-results">
    
                </div>
            </div>
        </div>
    </div>`;
            this.popoutItemHtml = `<div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItem-1MP3MQ search-result" style="flex: 1 1 auto; height: auto;">
        <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItemLabel-1RKQjD"
            style="flex: 1 1 auto;">
            <div class="avatar-16XVId small-5Os1Bb flexChild-faoVW3">
                <div class="image-33JSyf" style="flex: 0 1 auto; background-image: url(&quot;{{image_url}}&quot;);"></div>
            </div>
            <div class="userText-1WdPps" style="flex: 1 1 auto;">
                <span class="username">{{name}}</span>
            </div>
        </div>
    </div>`;
        }

        onStart() {
            PluginUtilities.addStyle(this.getName(), this.css);
            this.addSearchButton();
        }
        
        onStop() {
            $(".server-search-separator").remove();
            $("#server-search").remove();
            for (let c of this.cancels) c();
            PluginUtilities.removeStyle(this.getName());
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

        addSearchButton() {
            let guildElement = $(this.guildHtml);
            let guildElementInner = guildElement.find(".guildInner-3DSoA4");
            $(".dms-rcsEnV").after($(this.separatorHtml), guildElement);
    
            
            let gray = "#2F3136";
            let purple = "#7289da";
            let purpleRGB = ColorConverter.getRGB(purple);
            let grayRGB = ColorConverter.getRGB(gray);
            let backgroundColor = new Animations.Value(0);
            backgroundColor.interpolate({
                inputRange: [0, 1],
                outputRange: [purple, gray]
            });
    
            backgroundColor.addListener((value) => {
                let getVal = (i) => {
                    return Math.round((purpleRGB[i] - grayRGB[i]) * value.value + grayRGB[i]);
                };
                guildElementInner.css("background-color", `rgb(${getVal(0)}, ${getVal(1)}, ${getVal(2)})`);
            });
    
            let borderRadius = new Animations.Value(0);
            borderRadius.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 25]
            });
    
            borderRadius.addListener((value) => {
                // (end - start) * value + start
                guildElementInner.css("border-radius", (15 - 25) * value.value + 25);
            });
    
            let animate = (v) => {
                Animations.parallel([
                    Animations.timing(backgroundColor, {toValue: v, duration: 200}),
                    Animations.spring(borderRadius, {toValue: v, friction: 3})
                ]).start();
            };
    
            guildElement.on("mouseenter", () => {animate(1);});
    
            guildElement.on("mouseleave", () => {
                if (!guildElement.hasClass("selected")) animate(0);
            });
    
            new Tooltip(guildElement, "Server Search", {side: "right"});
    
            guildElement.on("click", (e) => {
                if (guildElement.hasClass("selected")) return;
                e.stopPropagation();
                guildElement.addClass("selected");
    
                if (this.settings.inPlace) {
                    return this.showSmallPopout(guildElement[0], {onClose: () => {
                        guildElement.removeClass("selected");
                        this.updateSearch("");
                        animate(0);
                    }});
                }
    
                this.showLargePopout(guildElement[0], {onClose: () => {
                    guildElement.removeClass("selected");
                    animate(0);
                }});
            });
        }
    
        showPopout(popout, target, id, options = {}) {
            const {onClose} = options;
            popout.appendTo(document.querySelector(DiscordSelectors.Popouts.popouts));
            const maxWidth = Screen.width;
            const maxHeight = Screen.height;
    
            let offset = target.getBoundingClientRect();
            if (offset.right + popout.outerHeight() >= maxWidth) {
                popout.addClass("popout-left");
                popout.css("left", Math.round(offset.left - popout.outerWidth() - 20));
                popout.animate({left: Math.round(offset.left - popout.outerWidth() - 10)}, 100);
            }
            else {
                popout.addClass("popout-right");
                popout.css("left", offset.right + 10);
                popout.animate({left: offset.right}, 100);
            }
    
            if (offset.top + popout.outerHeight() >= maxHeight) popout.css("top", Math.round(maxHeight - popout.outerHeight()));
            else popout.css("top", offset.top);
    
            let listener = document.addEventListener("click", (e) => {
                let target = $(e.target);
                if (!target.hasClass(id) && !target.parents(`.${id}`).length) {
                    popout.remove();
                    document.removeEventListener("click", listener);
                    if (onClose) onClose();
                }
            });
        }
    
        showSmallPopout(target, options = {}) {
            const {onClose} = options;
            let popout = $(this.smallPopoutHtml);
            let searchInput = popout.find("input");
            searchInput.on("keyup", () => {
                this.updateSearch(searchInput.val());
            });
    
            this.showPopout(popout, target, "popout-server-search-small", {onClose: onClose});
            searchInput.focus();
        }
    
        showLargePopout(target, options = {}) {
            const {onClose} = options;
    
            let guilds = SortedGuildStore.getSortedGuilds().slice(0);
            for (let i = 0; i < guilds.length; i++) guilds[i] = guilds[i].guild;
    
            let popout = $(Utilities.formatString(this.largePopoutHtml, {count: guilds.length}));
    
            let searchInput = popout.find("input");
            searchInput.on("keyup", () => {
                let items = popout[0].querySelectorAll(".search-result");
                for (let i = 0, len = items.length; i < len; i++) {
                    let search = searchInput.val().toLowerCase();
                    let item = items[i];
                    let username = item.querySelector(".username").textContent.toLowerCase();
                    if (!username.includes(search)) item.style.display = "none";
                    else item.style.display = "";
                }
            });
    
            let scroller = popout.find(".search-results");
            for (let guild of guilds) {
                let image = ImageResolver.getGuildIconURL(guild);
                let elem = $(Utilities.formatString(this.popoutItemHtml, {name: guild.name, image_url: image}));
                if (!image) {
                    let imageElement = elem.find(".image-33JSyf");
                    imageElement.text(GuildInfo.getAcronym(guild.name));
                    imageElement.addClass("no-image");
                }
                elem.on("click", () => {
                    GuildActions.selectGuild(guild.id);
                });
                scroller.append(elem);
            }
    
            this.showPopout(popout, target, "popout-server-search", {onClose: onClose});
            searchInput.focus();
        }
    
        updateSearch(query) {
            if (!query) return this.resetGuilds();
            $(".guild-1EfMGQ:has([draggable=\"true\"]):not(#server-search)").each((_, guild) => {
                let name = ReactTools.getReactProperty(guild, "return.memoizedProps.guild.name");
                if (name.toLowerCase().includes(query.toLowerCase())) guild.style.display = "";
                else guild.style.display = "none";
            });
        }
    
        resetGuilds() {
            $(".guild-1EfMGQ:has([draggable=\"true\"]):not(#server-search)").each((_, guild) => {
                guild.style.display = "";
            });
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/