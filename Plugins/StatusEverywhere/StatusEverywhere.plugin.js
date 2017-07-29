//META{"name":"StatusEverywhere"}*//

var StatusEverywhere = (function() {

class Plugin {
	getName(){return "Status Everywhere"}
	getShortName() {return "StatusEverywhere"}
	getDescription(){return "Adds user status everywhere Discord doesn't."}
	getVersion(){return "0.0.1-beta"}
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
	
	getAuthorStatus(author) {
		author.click()
		var popout = $(".user-popout");
		var block = $(".avatar-popout .status").clone()
		popout.remove()
		return block
	}
	
	start(){
		BdApi.injectCSS(this.getShortName(), ".message-group .avatar-large {margin-left: 5px}")
		$('.message-group .avatar-large').each((index, elem) => {
			if (!$(elem).find('.status').length) $(elem).append(this.getAuthorStatus(elem))
		})
	}
	stop(){
		BdApi.clearCSS(this.getShortName())
		$('.message-group .avatar-large').each((index, elem) => {
			if ($(elem).find('.status').length) $(elem).empty()
		})
	}
	
	observer(e){
		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])
		var self = this
		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			setTimeout(() => {
				elem.find('.avatar-large').each((index, elem) => {
					setTimeout( () => {	if (!$(elem).find('.status').length) $(elem).append(this.getAuthorStatus(elem)) }, 1)
				})
			},1)
		}

	}
}


return Plugin
})();

