//META{"name":"StatusEverywhere"}*//

var StatusEverywhere = (function() {

class Plugin {
	getName(){return "Status Everywhere"}
	getShortName() {return "StatusEverywhere"}
	getDescription(){return "Adds user status everywhere Discord doesn't. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.1.3"}
	getAuthor(){return "Zerebos"}
	loadSettings() {
		try { $.extend(true, this.settings, bdPluginStorage.get(this.getShortName(), "settings")); }
		catch (err) { console.warn(this.getShortName(), "unable to load settings:", err); loaded = this.defaultSettings; }
	}

	saveSettings() {
		try { bdPluginStorage.set(this.getShortName(), "settings", this.settings) }
		catch (err) { console.warn(this.getShortName(), "unable to save settings:", err) }
	}
	
	load(){}
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

	getCurrentServer() {
		return this.getReactInstance($('.channels-wrap')[0]).getReactProperty('_currentElement => props => children => 0 => props => guildId')
	}
	
	start(){
		this.currentServer = this.getCurrentServer()
		this.getAllUsers()
		this.attachStatuses()
	}
	stop() {
		$('.message-group .avatar-large').each((index, elem) => {
			if ($(elem).find('.status').length) $(elem).empty()
		})
	}

	onSwitch() {
		if (this.currentServer == this.getCurrentServer()) return;
		this.currentServer = this.getCurrentServer()
		this.getAllUsers()
	}
	//getReactInstance($('.title')[0])._renderedChildren[".1"]._instance.state.status
	getAllUsers() {
		this.users = []
		var usersToAdd = []
		//var groups = this.getReactInstance($('.channel-members').parent().parent().parent()[0])._renderedChildren[".1"]._instance.state.memberGroups
		if ($('.channel-members').length) {
			var groups = this.getReactInstance($('.channel-members').parent().parent().parent()[0]).getReactProperty('_renderedChildren => [".1"] => _instance => state => memberGroups');
			if (groups) usersToAdd = groups
		}
		if (!usersToAdd.length && $('.channel-members').length) {
			usersToAdd = [{users: []}]
			var dms = this.getReactInstance($('.channel-members')[0]).getReactProperty('_renderedChildren')
			for (var i in dms) {
				if (i == ".1:0") continue;
				usersToAdd[0].users.push({user: dms[i]._instance.props.user, status: dms[i]._instance.state.status})
			}
		}
		if (!usersToAdd.length && !$('.channel-members').length && !$('#friends').length) {
			var other = this.getReactInstance($('.title')[0]).getReactProperty('_renderedChildren => [".1"] => _instance')
			other = {user: {id: other.props.userId}, status: other.state.status}
			var user = this.getReactInstance($('.accountDetails-15i-_e').parent().parent()[0]).getReactProperty('_renderedChildren => [".2"] => _instance => state')
			user = {user: user.currentUser, status: user.status}
			usersToAdd = [{users: [other, user]}]
		}
		for (let i=0; i<usersToAdd.length; i++) {
			this.users.push(...usersToAdd[i].users)
		}
	}

	getUserByID(id) {
		var user = this.users.find((user) => {return user.user.id == id})
		if (!user) this.getAllUsers();
		user = this.users.find((user) => {return user.user.id == id})
		if (user) return user;
		else return {status: ""};
	}

	getAuthorStatus(id) {
		var status = this.getUserByID(id).status
		if (!status) status = "offline";
		return `<div class="status status-se status-${status}">`
	}

	attachStatuses() {
		setTimeout(() => {
			$('.message-group .avatar-large').each((index, elem) => {
				setTimeout( () => {
					if (!$(elem).find('.status').length) {
						let id = this.getReactInstance($(elem).parents('.message-group')[0]).getReactProperty('_currentElement=>props=>children=>0=>props=>children=>props=>user=>id')
						$(elem).append(this.getAuthorStatus(id))
					}
				}, 1)
			})
		},1)
	}
	//<div class="status status-online"></div>
	//this.getReactInstance(elem).getReactProperty('_currentElement.props.children.0.props.children.props.user.id')
	observer(e){
		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])
		var self = this
		if (elem.parents(".messages.scroller").length || elem.find(".message-group:not(.message-sending)").parents(".messages.scroller").length) { //elem.parents(".messages.scroller").length || elem.find(".message-group:not(.message-sending)").parents(".messages.scroller").length
			if (elem.hasClass("message-group").length || elem.hasClass('message')) this.getAllUsers()
			setTimeout(() => {
				elem.find('.avatar-large').each((index, elem) => {
					setTimeout( () => {
						if (!$(elem).find('.status').length) {
							try {
								let id = this.getReactInstance($(elem).parents('.message-group')[0]).getReactProperty('_currentElement=>props=>children=>0=>props=>children=>props=>user=>id')
								$(elem).append(this.getAuthorStatus(id))
							}
							catch (err) {}
						}
					}, 1)
				})
			},1)
		}

	}
}


return Plugin
})();

