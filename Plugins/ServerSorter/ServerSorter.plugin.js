//META{"name":"ServerSorter"}*//

var ServerSorter = (function() {

class ServerSorter {
	getName(){return "ServerSorter"}
	getShortName() {return "ServerSorter"}
	getDescription(){return "Adds server sorting abilities to Discord. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.2.4"}
	getAuthor(){return "Zerebos"}
	loadSettings() {
		try {
			for (settingType in this.settings) {
				this.settings[settingType] = $.extend({}, this.settings[settingType], bdPluginStorage.get(this.getShortName(), settingType));
			}
		} catch (err) {
			console.warn(this.getShortName(), "unable to load settings:", err);
		}
	}

	saveSettings() {
		try {
			for (settingType in this.settings) {
				bdPluginStorage.set(this.getShortName(), settingType, this.settings[settingType]);
			}
		} catch (err) {
			console.warn(this.getShortName(), "unable to save settings:", err);
		}
	}

	checkForUpdate() {
		const githubRaw = "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/"+this.getName()+"/"+this.getName()+".plugin.js"
		$.get(githubRaw, (result) => {
			var ver = result.match(/"[0-9]+\.[0-9]+\.[0-9]+"/i);
			if (!ver) return;
			ver = ver.toString().replace(/"/g, "")
			this.remoteVersion = ver;
			ver = ver.split(".")
			var lver = this.getVersion().split(".")
			if (ver[0] > lver[0]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1] > lver[1]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1]==lver[1] && ver[2] > lver[2]) this.hasUpdate = true;
			else this.hasUpdate = false;
			if (this.hasUpdate) {
				this.showUpdateNotice()
			}
		});
	}

	showUpdateNotice() {
		const updateLink = "https://betterdiscord.net/ghdl?url=https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/"+this.getName()+"/"+this.getName()+".plugin.js"
		BdApi.clearCSS("pluginNoticeCSS")
		BdApi.injectCSS("pluginNoticeCSS", "#pluginNotice span, #pluginNotice span a {-webkit-app-region: no-drag;color:#fff;} #pluginNotice span a:hover {text-decoration:underline;}")
		let noticeElement = '<div class="notice notice-info" id="pluginNotice"><div class="notice-dismiss" id="pluginNoticeDismiss"></div>The following plugins have updates: &nbsp;<strong id="outdatedPlugins"></strong></div>'
		if (!$('#pluginNotice').length)  {
			$('.app.flex-vertical').children().first().before(noticeElement);
			$('.win-buttons').addClass("win-buttons-notice")
			$('#pluginNoticeDismiss').on('click', () => {
				$('.win-buttons').animate({top: 0}, 400, "swing", () => {$('.win-buttons').css("top","").removeClass("win-buttons-notice")});
				$('#pluginNotice').slideUp({complete: () => {$('#pluginNotice').remove()}});
			})
		}
		let pluginNoticeID = this.getName()+'-notice'
		let pluginNoticeElement = $('<span id="'+pluginNoticeID+'">')
		pluginNoticeElement.html('<a href="'+updateLink+'" target="_blank">'+this.getName()+'</a>')
		if (!$('#'+pluginNoticeID).length) {
			if ($('#outdatedPlugins').children('span').length) pluginNoticeElement.html(', ' + pluginNoticeElement.html());
			$('#outdatedPlugins').append(pluginNoticeElement)
		}
	}
	
	load(){this.checkForUpdate()}
	unload(){}
	
	getReactInstance(node) { 
		let instance = node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))]
		instance['getReactProperty'] = function(path) {
			path = path.replace(/\["?([^"]*)"?\]/g, "$1")
			var value = path.split(/\s?=>\s?/).reduce(function(obj, prop) {
				return obj && obj[prop];
			}, this);
			return value;
		};
		return instance;
	}

	getReactKey(config) {
		if (config === undefined) return null;
		if (config.node === undefined || config.key === undefined) return null;
		var defaultValue = config.default ? config.default : null;
		
		var inst = this.getReactInstance(config.node);
		if (!inst) return defaultValue;
		
		
		// to avoid endless loops (parentnode > childnode > parentnode ...)
		var maxDepth = config.depth === undefined ? 30 : config.depth;
			
		var keyWhiteList = typeof config.whiteList === "object" ? config.whiteList : {
			"_currentElement":true,
			"_renderedChildren":true,
			"_instance":true,
			"_owner":true,
			"props":true,
			"state":true,
			"user":true,
			"guild":true,
			"stateNode":true,
			"refs":true,
			"updater":true,
			"children":true,
			"type":true,
			"memoizedProps":true,
			"memoizedState":true,
			"child":true,
			"firstEffect":true,
			"return":true
		};
		
		var keyBlackList = typeof config.blackList === "object" ? config.blackList : {};
		
		return searchKeyInReact(inst, 0);

		function searchKeyInReact (ele, depth) {
			if (!ele || depth > maxDepth) return defaultValue;
			var keys = Object.getOwnPropertyNames(ele);
			var result = null;
			for (var i = 0; result === null && i < keys.length; i++) {
				var key = keys[i];
				var value = ele[keys[i]];
				
				if (config.key === key && (config.value === undefined || config.value === value)) {
					result = config.returnParent ? ele : value;
				}
				else if ((typeof value === "object" || typeof value === "function") && ((keyWhiteList[key] && !keyBlackList[key]) || key[0] == "." || !isNaN(key[0]))) {
					result = searchKeyInReact(value, depth++);
				}
			}
			return result;
		}
	};
	
	getGuilds() {
		return $('div.guild:has(div[draggable="true"])');
	}
	
	getGuildData(guild) {
		return this.getReactKey({node: guild, key: "guild"}) || {name: ""};
	}
	
	getGuildNames() {
		var names = []
		this.getGuilds().each((index, elem) => {
			names.push(this.getGuildData(elem).name);
		});
		return names;
	}
	
	doSort(sortType, reverse, reset) {
		var guilds = this.getGuilds();
		guilds.sort((a,b) => {
			var first = this.getGuildData(a)[sortType]
			var second = this.getGuildData(b)[sortType]
			
			if (sortType == "id") {
				first = parseInt(first)
				second = parseInt(second)
			}
			
			if (reset) {
				first = this.defaultGuilds.indexOf(first)
				second = this.defaultGuilds.indexOf(second)
			}
			
			if (first > second) {
				return reverse ? -1 : 1;
			}
			if (second > first) {
				return reverse ? 1 : -1;
			}
			return 0;
		})
		guilds.detach().insertBefore($('button.guild'))
	}
	
	start(){
		this.checkForUpdate()
		this.loadSettings()
		BdApi.injectCSS(this.getShortName(), "#sort-options { display:none; transition: 300ms cubic-bezier(.2,0,0,1); transform-origin: 0 0!important;transform: scale(1,0.8);}" +
											 "#sort-options.open { display:block;transition: 300ms cubic-bezier(.2,0,0,1); transform-origin: 0 0!important; transform: scale(1,1);}")
		this.defaultGuilds = this.getGuildNames();
		
		this.sorter = $('<div class="guild guild-sorter" id="bd-pub-li" style="height: 20px; margin-bottom:10px !important;"><div class="guild-inner" style="height: 20px; border-radius: 4px;"><a><div id="bd-pub-button" class="sort-button" style="line-height: 20px; font-size: 12px;">Sort</div></a></div></div>')
		this.options = $('<div id="sort-options" class="context-menu theme-dark" style="left: 10px;"><div class="item-group"><div class="item" data-sort="name" data-reverse="false"><span>Alphabetically</span><div class="hint">A > Z</div></div><div class="item" data-sort="name" data-reverse="true"><span>Reverse Alphabetically</span><div class="hint">Z > A</div></div></div><div class="item-group"><div class="item" data-sort="joinedAt" data-reverse="true"><span>Newest Joined</span><div class="hint">New</div></div><div class="item" data-sort="joinedAt" data-reverse="false"><span>Oldest Joined</span><div class="hint">Old</div></div></div><div class="item-group"><div class="item" data-sort="id" data-reverse="true"><span>Newest Created</span><div class="hint"></div></div><div class="item" data-sort="id" data-reverse="false"><span>Oldest Created</span><div class="hint"></div></div></div><div class="item-group"><div class="item" data-sort="name" data-reset-sort="true"><span>Reset</span></div></div></div>')
		this.options.find('span').attr('style',"width: 110px;display: inline-block;overflow: hidden;text-overflow: ellipsis;")
		this.options.find('.item').on("click."+this.getShortName(), (e) => {
			var item = $(e.currentTarget);
			if (item.data("sort")) this.doSort(item.data("sort"), item.data("reverse"), item.data("reset-sort"));
		}) 
		this.options.appendTo('div[class*="platform-"]')

		this.sortButton = $(this.sorter.find('.sort-button')[0]);
		this.sortButton.on("click."+this.getShortName(), () => {
			this.options.css("top", 10+this.sorter.offset().top+this.sorter.height()+"px");
			this.options.toggleClass('open')
		})
		this.sorter.insertBefore($('.guild-separator'))
		$(window).on("click."+this.getShortName(), (e) => {
			if (!((e.pageY > this.sortButton.offset().top && e.pageY < this.sortButton.offset().top+this.sortButton.height()) &&
				(e.pageX > this.sortButton.offset().left && e.pageX < this.sortButton.offset().left+this.sortButton.width()))) {
				this.options.removeClass('open')
			}
		})
	}
	stop(){
		$(document).add("*").off(this.getShortName());
		$(".guild-sorter").remove();
		$("#sort-options").remove();
		BdApi.clearCSS(this.getShortName())
	}
	
	observer(mutation){}
}


return ServerSorter
})();

