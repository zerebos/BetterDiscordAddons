//META{"name":"ServerSearch"}*//

/* global ColorUtilities:false, PluginUtilities:false, InternalUtilities:false, ReactUtilities:false, PluginTooltip:false, PluginSettings:false, BdApi:false */

class ServerSearch {
	getName() { return "ServerSearch"; }
	getDescription() { return "Adds a button to search your servers. Search in place or in popout. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.2"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.cancels = [];

		this.css = `.avatar-search {
			background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSI0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE1LjUgMTRoLS43OWwtLjI4LS4yN0MxNS40MSAxMi41OSAxNiAxMS4xMSAxNiA5LjUgMTYgNS45MSAxMy4wOSAzIDkuNSAzUzMgNS45MSAzIDkuNSA1LjkxIDE2IDkuNSAxNmMxLjYxIDAgMy4wOS0uNTkgNC4yMy0xLjU3bC4yNy4yOHYuNzlsNSA0Ljk5TDIwLjQ5IDE5bC00Ljk5LTV6bS02IDBDNy4wMSAxNCA1IDExLjk5IDUgOS41UzcuMDEgNSA5LjUgNSAxNCA3LjAxIDE0IDkuNSAxMS45OSAxNCA5LjUgMTR6Ii8+ICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=);
			background-size: 50%!important;
		}

		#server-search {
			margin-bottom: 10px;
		}

		#server-search .guild-inner {
		}
		
		#server-search:hover .guild-inner {

		}

		#server-search.selected .guild-inner {

		}

		.popout-2RRwAO.popout-server-search,
		.popout-2RRwAO.popout-server-search-small {
			margin-top: 0;
			z-index: 1005;
		}

		.popout-2RRwAO.popout-server-search-small {
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
		}
		`;

		this.guildHtml = `<div class="guild" id="server-search">
								<div draggable="true">
									<div class="guild-inner" draggable="false" style="border-radius: 25px; background-color: rgb(47, 49, 54);">
										<a draggable="false" class="avatar-small avatar-search"></a>
									</div>
								</div>
							</div>`;
		this.separatorHtml = `<div class="guild-separator server-search-separator"></div>`;

		this.smallPopoutHtml = `<div class="popout-2RRwAO noArrow-2iqI6w POPOUT_DID_RERENDERight-ru2QHm popoutRight-ru2QHm popout-server-search-small">
								<div class="search-bar">
									<div class="search-bar-inner">
										<input type="text" placeholder="Search..." value="">
									</div>
								</div>
							</div>`;

		this.largePopoutHtml = `<div class="popout-2RRwAO noArrow-2iqI6w POPOUT_DID_RERENDERight-ru2QHm popoutRight-ru2QHm popout-server-search">
							<div class="popoutList-2NT_IY guildSettingsAuditLogsUserFilterPopout-PQPPs5 elevationBorderHigh-3Y6y6W">
								<div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO searchBar-YMJBu9 popoutListInput-3v5O8b size14-1wjlWP" style="flex: 1 1 auto;">
									<input class="input-yt44Uw flexChild-1KGW5q" value="" placeholder="Search Servers - \${count}" style="flex: 1 1 auto;">
									<div class="searchBarIcon-vCfmUl flexChild-1KGW5q">
										<i class="icon-11Zny- eyeGlass-6rahZf visible-4lw4vs"></i>
										<i class="icon-11Zny- clear-4pSDsx"></i>
									</div>
								</div>
								<div class="divider-1G01Z9 divider-2joH7h marginTop8-2gOa2N marginBottom8-1mABJ4"></div>
								<div class="scrollerWrap-2uBjct scrollerThemed-19vinI themeGhostHairline-2H8SiW scrollerTrack-3hhmU0">
									<div class="scroller-fzNley scroller-3J0bdT search-results">
						
									</div>
								</div>
							</div>
						</div>`;
	
		this.popoutItemHtml = `<div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO selectableItem-3PW5_y search-result" style="flex: 1 1 auto; height: auto;">
						<div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO selectableItemLabel-3pYgaR"
							style="flex: 1 1 auto;">
							<div class="avatar-1BXaQj small-TEeAkX flexChild-1KGW5q">
								<div class="image-EVRGPw" style="flex: 0 1 auto; background-image: url(&quot;\${image_url}&quot;);"></div>
							</div>
							<div class="userText-3aBzJF" style="flex: 1 1 auto;">
								<span class="username">\${name}</span>
							</div>
						</div>
					</div>`;

		this.defaultSettings = {search: {inPlace: false}};
		this.settings = this.defaultSettings;
	}
	
	load(){}
	unload(){}

	loadSettings() {
		this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
	}

	saveSettings() {
		PluginUtilities.saveSettings(this.getName(), this.settings);
	}
	
	start(){
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

	stop() {
		$(".server-search-separator").remove();
		$("#server-search").remove();
		for (let c of this.cancels) c();
		BdApi.clearCSS(this.getName());
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.loadSettings();
		this.Animations = InternalUtilities.WebpackModules.findByUniqueProperties(['spring']);
		this.DiscordConstants = InternalUtilities.WebpackModules.findByUniqueProperties(['ComponentActions']);
		this.SortedGuildStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getSortedGuilds']);
		this.ImageResolver = InternalUtilities.WebpackModules.findByUniqueProperties(["getUserAvatarURL"]);
		this.GuildActions = InternalUtilities.WebpackModules.findByUniqueProperties(['markGuildAsRead']);
		this.GuildInfo = InternalUtilities.WebpackModules.findByUniqueProperties(["getAcronym"]);
		this.initialized = true;
		BdApi.injectCSS(this.getName(), this.css);
		this.addSearchButton();
	}

	addSearchButton() {
		let guildElement = $(this.guildHtml);
		let guildElementInner = guildElement.find('.guild-inner');
		$(".dms").after($(this.separatorHtml), guildElement);

		
		let gray = this.DiscordConstants.Colors.CHANNELS_GREY;
		let purple = this.DiscordConstants.Colors.BRAND_PURPLE;
		let purpleRGB = ColorUtilities.getRGB(purple);
		let grayRGB = ColorUtilities.getRGB(gray);
		let backgroundColor = new this.Animations.Value(0);
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

		let borderRadius = new this.Animations.Value(0);
		borderRadius.interpolate({
			inputRange: [0, 1],
			outputRange: [15, 25]
		});

		borderRadius.addListener((value) => {
			// (end - start) * value + start
			guildElementInner.css("border-radius", (15 - 25) * value.value + 25);
		});

		let animate = (v) => {
			this.Animations.parallel([
				this.Animations.timing(backgroundColor, {toValue: v, duration: 200}),
				this.Animations.spring(borderRadius, {toValue: v, friction: 3})
			]).start();
		};

		guildElement.on("mouseenter", () => {animate(1);});

		guildElement.on("mouseleave", () => {
			if (!guildElement.hasClass("selected")) animate(0);
		});

		new PluginTooltip.Native(guildElement, "Server Search", {side: "right"});

		guildElement.on("click", (e) => {
			if (guildElement.hasClass("selected")) return;
			e.stopPropagation();
			guildElement.addClass("selected");

			if (this.settings.search.inPlace) return this.showSmallPopout(guildElement[0], {onClose: () => {
				guildElement.removeClass("selected");
				this.updateSearch("");
				animate(0);
			}});

			this.showLargePopout(guildElement[0], {onClose: () => {
				guildElement.removeClass("selected");
				animate(0);
			}});
		});
	}

	showPopout(popout, target, id, options = {}) {
		const {onClose} = options;
		popout.appendTo($('.popouts, .popouts-1TN9u9'));
		const maxWidth = window.ZeresLibrary.Screen.width;
		const maxHeight = window.ZeresLibrary.Screen.height;

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
				document.removeEventListener(listener);
				if (onClose) onClose();
			}
		});
	}

	showSmallPopout(target, options = {}) {
		const {onClose} = options;
		let popout = $(this.smallPopoutHtml);
		let searchInput = popout.find('input');
		searchInput.on("keyup", () => {
			this.updateSearch(searchInput.val());
		});

		this.showPopout(popout, target, "popout-server-search-small", {onClose: onClose});
		searchInput.focus();
	}

	showLargePopout(target, options = {}) {
		const {onClose} = options;

		let guilds = this.SortedGuildStore.getSortedGuilds().slice(0);
		for (let i = 0; i < guilds.length; i++) guilds[i] = guilds[i].guild;

		let popout = $(PluginUtilities.formatString(this.largePopoutHtml, {count: guilds.length}));

		let searchInput = popout.find('input');
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
			let image = this.ImageResolver.getGuildIconURL(guild);
			let elem = $(PluginUtilities.formatString(this.popoutItemHtml, {name: guild.name, image_url: image}));
			if (!image) {
				let imageElement = elem.find('.image-EVRGPw');
				imageElement.text(this.GuildInfo.getAcronym(guild.name));
				imageElement.addClass("no-image");
			}
			elem.on('click', () => {
				this.GuildActions.selectGuild(guild.id);
			});
			scroller.append(elem);
		}

		this.showPopout(popout, target, "popout-server-search", {onClose: onClose});
		searchInput.focus();
	}

	updateSearch(query) {
		if (!query) return this.resetGuilds();
		$('.guild:has([draggable="true"]):not(#server-search)').each((_, guild) => {
			let name = ReactUtilities.getReactProperty(guild, "return.memoizedProps.guild.name");
			if (name.toLowerCase().includes(query.toLowerCase())) guild.style.display = "";
			else guild.style.display = "none";
		});
	}

	resetGuilds() {
		$('.guild:has([draggable="true"]):not(#server-search)').each((_, guild) => {
			guild.style.display = "";
		});
	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}

	generateSettings(panel) {
		
		new PluginSettings.ControlGroup("Search Options", () => {this.saveSettings();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.PillButton("Search Style", "Switches between searching in place (where guilds are) or in a popout", "Popout", "In Place",
				this.settings.search.inPlace, (checked) => {
					this.settings.search.inPlace = checked;
				}
			)
		);
	}

}