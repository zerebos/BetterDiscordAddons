//META{"name":"StatusEverywhere"}*//

/* global PluginUtilities:false, ReactUtilities:false, BdApi:false */

class StatusEverywhere {
	getName() { return "StatusEverywhere"; }
	getShortName() { return "StatusEverywhere"; }
	getDescription() { return "Adds user status everywhere Discord doesn't. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.1.6"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.css = `/* StatusEverywhere */
		@keyframes status-fade-in {
			to {opacity: 1;}
		}
		.status-se {
			animation: status-fade-in 200ms ease;
			animation-fill-mode: forwards;
			opacity: 0;
		}
		`;

		this.switchObserver = new MutationObserver(() => {});
	}
	
	load(){}
	unload(){}
	
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
		$('.message-group .avatar-large').each((index, elem) => {
			if ($(elem).find('.status').length) $(elem).empty();
		});
		BdApi.clearCSS(this.getShortName() + "-style");
		this.switchObserver.disconnect();
	}

	initialize() {
		this.initialized = true;
		BdApi.injectCSS(this.getShortName()  + "-style", this.css);
		this.switchObserver = PluginUtilities.createSwitchObserver(this);
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.currentServer = PluginUtilities.getCurrentServer();
		this.getAllUsers();
		this.attachStatuses();
	}

	onChannelSwitch() {
		if (this.currentServer == PluginUtilities.getCurrentServer()) return;
		this.currentServer = PluginUtilities.getCurrentServer();
		setTimeout(() => {
			this.getAllUsers();
		}, 500);
	}

	getAllUsers() {
		this.users = [];
		var usersToAdd = [];
		if (document.querySelector('.channel-members')) {
			let groups = ReactUtilities.getReactProperty(document.querySelector('.channel-members-wrap'), "return.return.return.memoizedState.memberGroups");
			if (groups) usersToAdd = groups;
		}
		if (!usersToAdd.length && document.querySelector('.channel-members')) {
			usersToAdd = [{users: []}];
			document.querySelectorAll('.member').forEach((elem) => {
				let props = ReactUtilities.getReactProperty(elem, "child.memoizedProps");
				if (!props) return;
				usersToAdd[0].users.push({user: props.user, status: props.status});
			});
		}
		if (!usersToAdd.length && !document.querySelector('.channel-members') && !document.querySelector('#friends') && document.querySelector('.title .channel-private')) {
			var other = ReactUtilities.getReactProperty(document.querySelector('.title'), "child.sibling");
			var user = ReactUtilities.getReactProperty(document.querySelector('.container-iksrDt'), "return.memoizedProps");
			if (!other || !user) return;
			other = {user: {id: other.memoizedProps.userId}, status: other.memoizedState.status};
			user = {user: user.currentUser, status: user.status};
			usersToAdd = [{users: [other, user]}];
		}
		for (let i = 0; i < usersToAdd.length; i++) {
			this.users.push(...usersToAdd[i].users);
		}
	}

	getUserByID(id) {
		var user = this.users.find((user) => {return user.user.id == id;});
		if (!user) this.getAllUsers();
		user = this.users.find((user) => {return user.user.id == id;});
		if (user) return user;
		else return {status: ""};
	}

	getAuthorStatus(id) {
		var status = this.getUserByID(id).status;
		if (!status) status = "offline";
		var statusElement = document.createElement("div");
		statusElement.classList.add("status");
		statusElement.classList.add("status-se");
		statusElement.classList.add("status-" + status);
		return statusElement;
	}

	attachStatuses(elem) {
		var searchSpace = elem ? elem.querySelectorAll('.avatar-large') : document.querySelectorAll('.message-group .avatar-large');
		searchSpace.forEach((elem) => {
				if (!elem.querySelector('.status')) {
					let id = ReactUtilities.getReactProperty(elem.parentElement, "child.child.memoizedProps.user.id");
					elem.append(this.getAuthorStatus(id));
				}
		});
	}

	observer(e){
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		var elem = e.addedNodes[0];

		if (elem.classList.contains("messages-wrapper")) {
			this.attachStatuses();
		}

		if (elem.classList.contains("message-group") && !elem.querySelector('.message-sending')) {
			this.attachStatuses(elem);
		}
	}
}