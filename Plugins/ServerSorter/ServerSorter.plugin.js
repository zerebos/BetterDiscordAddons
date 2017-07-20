//META{"name":"ServerSorter"}*//

class ServerSorter {
	getName(){return "Server Sorter"}
	getShortName() {return "ServerSorter"}
	getDescription(){return "Adds server sorting abilities to Discord."}
	getVersion(){return "0.3.0-beta.1"}
	getAuthor(){return "Zerebos"}
	loadSettings() {
		console.log("LOADSETTINGS()")
		try {
			for (settingType in this.settings) {
				this.settings[settingType] = $.extend({}, this.settings[settingType], bdPluginStorage.get(this.getShortName(), settingType));
			}
		} catch (err) {
			console.warn(this.getShortName(), "unable to load settings:", err);
		}
	}

	saveSettings() {
		console.log("SAVESETTINGS()")
		try {
			for (settingType in this.settings) {
				bdPluginStorage.set(this.getShortName(), settingType, this.settings[settingType]);
			}
		} catch (err) {
			console.warn(this.getShortName(), "unable to save settings:", err);
		}
	}
	
	load(){
		//this.settings = {sorting: {type: 0}}
		console.log("LOAD()")
	}
	unload(){}
	
	
	
	getReactInstance(node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}
	
	getGuilds() {
		return $('.guild-separator ~ div.guild');
	}
	
	getGuildName(guild) {
		return this.getReactInstance(guild)._currentElement._owner._instance.props.guild.name
	}
	
	getJoinDate(guild) {
		return this.getReactInstance(guild)._currentElement._owner._instance.props.guild.joinedAt
	}
	
	getGuildID(guild) {
		return parseInt(this.getReactInstance(guild)._currentElement._owner._instance.props.guild.id)
	}
	
	getGuildData(guild) {
		return this.getReactInstance(guild)._currentElement._owner._instance.props.guild;
	}
	
	sortAlphabetically(guilds,reverse) {
		guilds.sort((a,b) => {
			var firstName = this.getGuildName(a)
			var secondName = this.getGuildName(b)
			
			if (firstName > secondName) {
				return reverse ? -1 : 1;
			}
			if (secondName > firstName) {
				return reverse ? 1 : -1;
			}
			return 0;
		})
	}
	
	sortChronologically(guilds,reverse) {
		guilds.sort((a,b) => {
			var first = this.getJoinDate(a)
			var second = this.getJoinDate(b)
			
			if (first < second) {
				return reverse ? -1 : 1;
			}
			if (second < first) {
				return reverse ? 1 : -1;
			}
			return 0;
		})
	}
	
	sortByCreation(guilds,reverse) {
		guilds.sort((a,b) => {
			var first = this.getGuildID(a)
			var second = this.getGuildID(b)
			
			if (first < second) {
				return reverse ? -1 : 1;
			}
			if (second < first) {
				return reverse ? 1 : -1;
			}
			return 0;
		})
	}
	
	doSort(sortType, reverse) {
		//if (!(typeof sortType==='number' && (sortType%1)===0) || sortType < 0) return;
		var guilds = this.getGuilds();
		/*switch (sortType) {
			case 0: this.sortAlphabetically(guilds); break;
			case 1: this.sortAlphabetically(guilds, true); break;
			case 2: this.sortChronologically(guilds); break;
			case 3: this.sortChronologically(guilds, true); break;
			case 4: this.sortByCreation(guilds); break;
			case 5: this.sortByCreation(guilds, true); break;
		}*/
		//console.log(sortType)
		guilds.sort((a,b) => {
			var first = this.getGuildData(a)[sortType]
			var second = this.getGuildData(b)[sortType]
			
			if (sortType == "id") {
				first = parseInt(first)
				second = parseInt(second)
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
		console.log("START()")
		this.loadSettings()
		
		this.sorter = $('<div class="guild guild-sorter" id="bd-pub-li" style="height: 20px; margin-bottom:10px !important;"><div class="guild-inner" style="height: 20px; border-radius: 4px;"><a><div id="bd-pub-button" class="sort-button" style="line-height: 20px; font-size: 12px;">Sort</div></a></div></div>')
		this.options = $('<div id="sort-options" class="context-menu theme-dark" style="left: 10px;"><div class="item-group"><div class="item" data-sort="name" data-reverse="false"><span>Alphabetically</span><div class="hint">A > Z</div></div><div class="item" data-sort="name" data-reverse="true"><span>Reverse Alphabetically</span><div class="hint">Z > A</div></div></div><div class="item-group"><div class="item" data-sort="joinedAt" data-reverse="true"><span>Newest Joined</span><div class="hint">New</div></div><div class="item" data-sort="joinedAt" data-reverse="false"><span>Oldest Joined</span><div class="hint">Old</div></div></div><div class="item-group"><div class="item" data-sort="id" data-reverse="true"><span>Newest Created</span><div class="hint"></div></div><div class="item" data-sort="id" data-reverse="false"><span>Oldest Created</span><div class="hint"></div></div></div></div></div>')
		this.options.find('span').attr('style',"width: 110px;display: inline-block;overflow: hidden;text-overflow: ellipsis;")
		this.options.find('.item').on("click."+this.getShortName(), (e) => {var item = $(e.currentTarget); this.doSort(item.data("sort"), item.data("reverse")); this.isOpen = false;}) 
		this.options.appendTo('.platform-win')
		//this.options.hide()
		BdApi.injectCSS('ServerSorter', `
		@keyframes sort-open {
			0% {
				transform:scale(1,0);
			}
		}
		@keyframes sort-close {
			100% {
				transform:scale(1,0);
			}
		}
		#sort-options { transition: 500ms cubic-bezier(.2,0,0,1); transform-origin: 0 0!important;transform: scale(1,0);}
		#sort-options.open { transition: 500ms cubic-bezier(.2,0,0,1); transform-origin: 0 0!important; transform: scale(1,1);}
		`)
		this.isOpen = false;
		this.sortButton = $(this.sorter.find('.sort-button')[0]);
		this.sortButton.on("click."+this.getShortName(), () => {
			this.options.css("top", 10+this.sorter.offset().top+this.sorter.height()+"px");
			this.options.toggleClass('open')
		})
		this.sorter.insertBefore($('.guild-separator'))
		$(window).on("click."+this.getShortName(), (e) => {
			//console.log("X: " + e.pageX + " | Y: " + e.pageY)
			//console.log("Top: " + this.sortButton.offset().top + " | Bottom: " + (this.sortButton.offset().top+this.sortButton.height()))
			//console.log("Left: " + this.sortButton.offset().left + " | Right: " + (this.sortButton.offset().left+this.sortButton.width()))
			var target = $(e.currentTarget);
			if (!((e.pageY > this.sortButton.offset().top && e.pageY < this.sortButton.offset().top+this.sortButton.height()) &&
				(e.pageX > this.sortButton.offset().left && e.pageX < this.sortButton.offset().left+this.sortButton.width()))) {
				this.options.removeClass('open')
				this.isOpen = false;
			}
		})
	}
	stop(){}
	
	observer(mutation){}
}
