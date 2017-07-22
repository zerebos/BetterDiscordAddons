//META{"name":"ServerSorter"}*//

class ServerSorter {
	getName(){return "Server Sorter"}
	getShortName() {return "ServerSorter"}
	getDescription(){return "Adds server sorting abilities to Discord. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.2.3-beta"}
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
	
	load(){}
	unload(){}
	
	getReactInstance(node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}
	
	getGuilds() {
		return $('.guild-separator ~ div.guild');
	}
	
	getGuildData(guild) {
		return this.getReactInstance(guild)._currentElement._owner._instance.props.guild;
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
		this.loadSettings()
		BdApi.injectCSS(this.getShortName(), "#sort-options { transition: 500ms cubic-bezier(.2,0,0,1); transform-origin: 0 0!important;transform: scale(1,0);}" +
											 "#sort-options.open { transition: 500ms cubic-bezier(.2,0,0,1); transform-origin: 0 0!important; transform: scale(1,1);}")
		this.defaultGuilds = this.getGuildNames();
		
		this.sorter = $('<div class="guild guild-sorter" id="bd-pub-li" style="height: 20px; margin-bottom:10px !important;"><div class="guild-inner" style="height: 20px; border-radius: 4px;"><a><div id="bd-pub-button" class="sort-button" style="line-height: 20px; font-size: 12px;">Sort</div></a></div></div>')
		this.options = $('<div id="sort-options" class="context-menu theme-dark" style="left: 10px;"><div class="item-group"><div class="item" data-sort="name" data-reverse="false"><span>Alphabetically</span><div class="hint">A > Z</div></div><div class="item" data-sort="name" data-reverse="true"><span>Reverse Alphabetically</span><div class="hint">Z > A</div></div></div><div class="item-group"><div class="item" data-sort="joinedAt" data-reverse="true"><span>Newest Joined</span><div class="hint">New</div></div><div class="item" data-sort="joinedAt" data-reverse="false"><span>Oldest Joined</span><div class="hint">Old</div></div></div><div class="item-group"><div class="item" data-sort="id" data-reverse="true"><span>Newest Created</span><div class="hint"></div></div><div class="item" data-sort="id" data-reverse="false"><span>Oldest Created</span><div class="hint"></div></div></div><div class="item-group"><div class="item" data-sort="name" data-reset-sort="true"><span>Reset</span></div></div></div>')
		this.options.find('span').attr('style',"width: 110px;display: inline-block;overflow: hidden;text-overflow: ellipsis;")
		this.options.find('.item').on("click."+this.getShortName(), (e) => {
			var item = $(e.currentTarget);
			if (item.data("sort")) this.doSort(item.data("sort"), item.data("reverse"), item.data("reset-sort"));
		}) 
		this.options.appendTo('.platform-win')

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
