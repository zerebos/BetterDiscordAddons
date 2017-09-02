//META{"name":"BetterRoleColors", "pname":"BetterRoleColors"}*//

let BetterRoleColors = (function() {

class Plugin {
	getName() { return "BetterRoleColors" }
	getShortName() { return "BRC" }
	getDescription() { return "Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer" }
	getVersion() { return "0.5.0" }
	getAuthor() { return "Zerebos" }
	getGithubLink() { return "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js" }

	constructor() {
		this.isOpen = false
		this.hasUpdate = false
		this.remoteVersion = ""
		this.defaultSettings = {modules: {typing: true, voice: true, mentions: true},
								popouts: {username: false, discriminator: false, nickname: true, fallback: true},
								modals: {username: true, discriminator: false},
								auditLog: {username: true, discriminator: false},
								account: {username: true, discriminator: false}}
		this.settings = {modules: {typing: true, voice: true, mentions: true},
						 popouts: {username: false, discriminator: false, nickname: true, fallback: true},
						 modals: {username: true, discriminator: false},
						 auditLog: {username: true, discriminator: false},
						 account: {username: true, discriminator: false}}

		this.colorData = {}
	}
	
	loadSettings() {
		try { $.extend(true, this.settings, bdPluginStorage.get(this.getShortName(), "plugin-settings")); }
		catch (err) { console.warn(this.getShortName(), "unable to load settings:", err); loaded = this.defaultSettings; }
	}

	saveSettings() {
		try { bdPluginStorage.set(this.getShortName(), "plugin-settings", this.settings) }
		catch (err) { console.warn(this.getShortName(), "unable to save settings:", err) }
	}

	loadData() {
		try { this.colorData = $.extend(true, this.colorData, bdPluginStorage.get(this.getShortName(), "color-data")) }
		catch (err) { console.warn(this.getShortName(), "unable to load data:", err) }
	}

	saveData() {
		try { bdPluginStorage.set(this.getShortName(), "color-data", this.colorData) }
		catch (err) { console.warn(this.getShortName(), "unable to save data:", err) }
	}
	
	load() {
		$.get(this.getGithubLink(), (result) => {
			var ver = result.match(/"[0-9]+\.[0-9]+\.[0-9]+"/i).toString().replace(/"/g, "")
			this.remoteVersion = ver;
			ver = ver.split(".")
			var lver = this.getVersion().split(".")
			if (ver[0] > lver[0]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1] > lver[1]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1]==lver[1] && ver[2] > lver[2]) this.hasUpdate = true;
			else this.hasUpdate = false;
		});
	}
	unload() {};
	
	start() {
		this.loadData();
		this.loadSettings();
		BdApi.injectCSS(this.getShortName()+"-settings", SettingField.getCSS(this.getName()));
		this.currentServer = this.getCurrentServer()
		this.getAllUsers()
		this.colorize()
	}
	
	stop() {
		this.saveData();
		this.decolorize()
		this.saveSettings();
		$("*").off("." + this.getShortName());
		BdApi.clearCSS(this.getShortName()+"-settings");
	}
	
	onSwitch() {
		if (this.currentServer == this.getCurrentServer()) return;
		this.currentServer = this.getCurrentServer()
		this.getAllUsers()
		this.colorizeAccountStatus()
		this.colorizeVoice()
		//this.colorize()
	}

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

	isServer() { return this.getCurrentServer() ? true : false}

	getCurrentServer() {
		return this.getReactInstance(document.querySelector('.channels-wrap')).getReactProperty('_currentElement => props => children => 0 => props => guildId')
	}

	getRGB(color) {
	    var result;
	    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
	    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
	    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
	    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
	}

	darkenColor(color, percent) {
	    var rgb = this.getRGB(color);
	    
	    for(var i = 0; i < rgb.length; i++){
	        rgb[i] = Math.round(Math.max(0, rgb[i] - rgb[i]*(percent/100)));
	    }
	    
	    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	}

	lightenColor(color, percent) {
	    var rgb = this.getRGB(color);
	    
	    for(var i = 0; i < rgb.length; i++){
	        rgb[i] = Math.round(Math.min(255, rgb[i] + rgb[i]*(percent/100)));
	    }
	    
	    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	}

	rgbToAlpha(color, alpha) {
	    var rgb = this.getRGB(color);	    
	    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
	}
	
	observer(e) {

		if (e.removedNodes.length && e.removedNodes[0] instanceof Element) {
			var removed = e.removedNodes[0]
			if (removed.classList.contains("spinner") || removed.tagName == "STRONG") {
				this.colorizeTyping()
			}
		}

		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
		var elem = e.addedNodes[0]

		if (elem.querySelector("#friends") || elem.id == "friends") this.onSwitch();

		if (elem.classList.contains("message-group")) this.getMessageColor(elem);

		if (elem.querySelector(".draggable-3SphXU") || elem.classList.contains("draggable-3SphXU")) {
        	this.colorizeVoice()
		}

		if (elem.querySelector("strong") || elem.querySelector(".spinner") || elem.classList.contains("typing") || elem.tagName == "STRONG") {
        	this.colorizeTyping()
    	}

    	if (elem.querySelector(".guild-settings-audit-logs") || elem.classList.contains("guild-settings-audit-logs") || elem.querySelector(".userHook-DFT5u7") || elem.classList.contains("userHook-DFT5u7")) {
    		this.colorizeAuditLog()
    	}

    	if (elem.querySelector('.userPopout-4pfA0d')) {
        	this.colorizePopout()
    	}

    	if (elem.querySelector("#user-profile-modal")) {
        	this.colorizeModal()
    	}

    	if (elem.classList.contains("message-group") || elem.classList.contains("messages-wrapper")) {
    		this.getAllMessageColors()
        	this.colorizeMentions()
    	}

    	if (elem.classList.contains("message")) {
    		this.colorizeMentions()
    	}
	}
	
	getParents(selector) {
		var parents = [];
		while (element = element.parentElement.closest(selector))
		    parents.push(element);
		return parents
	}

	indexInParent(node) {
	    var children = node.parentNode.childNodes;
	    var num = 0;
	    for (var i=0; i<children.length; i++) {
	         if (children[i]==node) return num;
	         if (children[i].nodeType==1) num++;
	    }
	    return -1;
	}

	getAllUsers() {
		this.users = []
		var server = this.getCurrentServer()
		if (!document.querySelector('.channel-members') || document.querySelector('.private-channels')) return;
		let groups = this.getReactInstance(document.querySelector('.channel-members').parentElement.parentElement.parentElement).getReactProperty('_renderedChildren => [".1"] => _instance => state => memberGroups')
		for (let g=0; g<groups.length; g++) {
			// this.users.push(...groups[i].users)
			for (let u=0; u<groups[g].users.length; u++) {
				let user = groups[g].users[u]
				this.addColorData(this.currentServer, user.user.id, user.colorString ? user.colorString : "")
				this.addColorData(this.currentServer, user.nick, user.colorString ? user.colorString : "")
			}
		}
		this.saveData()
	}

	getAllMessageColors() {
		document.querySelectorAll(".message-group").forEach((elem, _) => {this.getMessageColor(elem)})
	}

	getMessageColor(message) {
		if (!this.isServer()) return;
		let msg = this.getReactInstance(message).getReactProperty('_currentElement => props => children => [1] => props => children => ["0"] => ["0"] => props => message')
		if (!msg) return;
		this.addColorData(this.currentServer, msg.author.id, msg.colorString ? msg.colorString : "")
		this.addColorData(this.currentServer, msg.nick ? msg.nick : msg.author.username, msg.colorString ? msg.colorString : "")
	}

	addColorData(server, user, color) {
		if (server === undefined || user === undefined || color === undefined) return;
		if (this.colorData[server] === undefined) this.colorData[server] = {};
		if (color) this.colorData[server][user] = color;
		else if (this.colorData[server][user] !== undefined) delete this.colorData[server][user];
	}

	getColorData(server, user) {
		if (server === undefined || user === undefined || this.colorData[server] === undefined || this.colorData[server][user] === undefined) return "";
		else return this.colorData[server][user];
	}

	getUserColor(user) {
		return this.getColorData(this.currentServer, user)
	}

	// getUserByID(id) {
	// 	var user = this.users.find((user) => {return user.user.id == id})
	// 	if (!user) this.getAllUsers();
	// 	user = this.users.find((user) => {return user.user.id == id})
	// 	if (user) return user;
	// 	else return {colorString: ""};
	// }

	// getUserByNick(nickname) {
	// 	var user = this.users.find((user) => {return user.nick == nickname})
	// 	if (!user) this.getAllUsers();
	// 	user = this.users.find((user) => {return user.nick == nickname})
	// 	if (user) return user;
	// 	else return {colorString: ""};
	// }

	// getColorByID(id) {
	// 	// let color = this.getUserByID(id).colorString
	// 	// if (color) return color;
	// 	// else return "";
	// 	return this.getColorData(this.currentServer, id)
	// }

	// getColorByNick(nickname) {
	// 	// let color = this.getUserByNick(nickname).colorString
	// 	// if (color) return color;
	// 	// else return "";
	// 	return this.getColorData(this.currentServer, nickname)
	// }

	colorize() {
		this.colorizeTyping()
		this.colorizeVoice()
		this.colorizeMentions()
		this.colorizeAccountStatus()
	}

	colorizeAccountStatus() {
		if (!this.settings.account.username && !this.settings.account.discriminator) return;
		let server = this.getCurrentServer()
		let account = document.querySelector('.accountDetails-15i-_e')
		let user = this.getReactInstance(account).getReactProperty('_hostParent => _currentElement => props => children => 1 => props => user => id')
		let color = this.getUserColor(user)
		if (this.settings.account.username) account.querySelector(".username").style.setProperty("color", color, "important");
		if (this.settings.account.discriminator) {
			account.querySelector(".discriminator").style.setProperty("color", color, "important");
			account.querySelector(".discriminator").style.setProperty("opacity", "1");
		}
	}

	colorizeTyping() {
		if (!this.settings.modules.typing) return;
		let server = this.getCurrentServer()
	    document.querySelectorAll(".typing strong").forEach((elem, index) => {
	        var user = elem.textContent;
	        elem.style.setProperty("color", this.getUserColor(user));
	    });
	}

	colorizeVoice() {
		if (!this.settings.modules.voice) return;
		let server = this.getCurrentServer()
	    document.querySelectorAll(".draggable-3SphXU").forEach((elem, index) => {
	        var user = this.getReactInstance(elem).getReactProperty('_currentElement => props => children => props => user => id')
	        console.log(user)
			//$(elem).find(".avatarContainer-303pFz").siblings().first().css("color", this.getColorByID(user));
			elem.querySelector('[class*="name"]').style.setProperty("color", this.getUserColor(user))
	    });
	}

	colorizeMentions(node) {
		if (!this.settings.modules.mentions) return;
		let server = this.getCurrentServer()
		// var searchSpace = node === undefined ? document : node
	    document.querySelectorAll(".message-group .message").forEach((elem, index) => {
	    	var messageNum = this.indexInParent(elem)
	    	var instance = this.getReactInstance(elem)
	    	var mentionNum = 0
	    	elem.querySelectorAll('.message-text > .markup > .mention').forEach((elem, index) => {
	    		if (elem.textContent.indexOf("@") == -1) return;
	        	var users = instance.getReactProperty(`_hostParent => _currentElement => props => children => 0 => ${messageNum} => props => message => content`).match(/<@!?[0-9]+>/g)
	        	if (!users) return true;
	        	var user = users[mentionNum]
	        	if (!user) return true;
	        	user = user.replace(/<|@|!|>/g, "")
	        	var textColor = this.getUserColor(user)
				if (textColor) {
					elem.style.setProperty("color", textColor);
					elem.style.setProperty("background", this.rgbToAlpha(textColor,0.1));

					elem.addEventListener()
					elem.addEventListener("mouseenter"+this.getShortName(), (e)=>{
						e.target.style.setProperty("color", "#FFFFFF");
						e.target.style.setProperty("background", this.rgbToAlpha(textColor,0.7));
					})
					elem.addEventListener("mouseleave"+this.getShortName(), (e)=> {
						e.target.style.setProperty("color", textColor);
						e.target.style.setProperty("background", this.rgbToAlpha(textColor,0.1));
					})
				}
			mentionNum += 1;
	    	})
	    });
	}

	colorizePopout() {
		if (!this.settings.popouts.username && !this.settings.popouts.discriminator && !this.settings.popouts.nickname) return;
		let server = this.getCurrentServer()
	    let popout = document.querySelector('.userPopout-4pfA0d')
        var user = this.getReactInstance(popout).getReactProperty('_hostParent => _currentElement => props => children => props => user => id')
        if (!user) return true;
        let color = this.getUserColor(user)
        var hasNickname = Boolean(popout.querySelector('.headerName-2N8Pdz'))
        if ((color && this.settings.popouts.username) || (!hasNickname && this.settings.popouts.fallback)) popout.querySelector('.headerTag-3zin_i span:first-child').style.setProperty("color", color, "important");
        if (color && this.settings.popouts.discriminator) popout.querySelector('.headerDiscriminator-3fLlCR').style.setProperty("color", color, "important");
        if (color && this.settings.popouts.nickname && hasNickname) popout.querySelector('.headerName-2N8Pdz').style.setProperty("color", color, "important");
	}

	colorizeModal() {
		if (!this.settings.modals.username && !this.settings.modals.discriminator) return;
		let server = this.getCurrentServer()
	    let modal = document.querySelector("#user-profile-modal")
        var user = this.getReactInstance(modal).getReactProperty('_currentElement => props => children => 3 => props => user => id')
        let color = this.getUserColor(user)
        if (color && this.settings.modals.username) modal.querySelector('.username').style.setProperty("color", color, "important");
        if (color && this.settings.modals.discriminator) modal.querySelector('.discriminator').style.setProperty("color", color, "important");
	}

	colorizeAuditLog() {
		if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
		let server = this.getReactInstance($('.guild-settings-audit-logs')[0]).getReactProperty('_currentElement => props => children => props => children => _owner => _currentElement => props => guildId')
	    $(".userHook-DFT5u7").each((index, elem) => {
	    	var index = $(elem).index() ? 2 : 0
	        let user = this.getReactInstance(elem).getReactProperty(`_hostParent => _currentElement => props => children => ${index} => props => user => id`)
	        let color = this.getUserColor(user)
			if (this.settings.auditLog.username) $(elem).children().first().css("color", color);
			if (this.settings.auditLog.discriminator) { $(elem).children(".discrim-xHdOK3").css("color", color).css("opacity", 1)}
	    });
	}

	decolorize() {
		this.decolorizeTyping()
		this.decolorizeMentions()
		this.decolorizeVoice()
		this.decolorizePopouts()
		this.decolorizeModals()
		this.decolorizeAuditLog()
		this.decolorizeAccountStatus()
	}

	decolorizeTyping() { $(".typing strong").each((index, elem)=>{$(elem).css("color","")}) }
	decolorizeVoice() { $('.draggable-3SphXU').each((index, elem)=>{$(elem).find(".avatarContainer-303pFz").siblings().first().css("color", "");}) }
	decolorizeMentions() { $('.mention').each((index, elem)=>{$(elem).css("color","");$(elem).css("background","")}); $(".mention").off("." + this.getShortName()); }
	decolorizePopouts() {
		$('div[class*="userPopout"]').each((index, elem) => {
			$(elem).find('.headerTag-3zin_i span:first-child').each((index, elem)=>{$(elem).css("color","")})
			$(elem).find('div[class*="headerDiscriminator"]').each((index, elem)=>{$(elem).css("color","")})
			$(elem).find('div[class*="headerName"]').each((index, elem)=>{$(elem).css("color","")})
		})
	}

	decolorizeModals() {
		$("#user-profile-modal").each((index, elem) => {
			$(elem).find('.discriminator').each((index, elem)=>{$(elem).css("color","")})
			$(elem).find('.username').each((index, elem)=>{$(elem).css("color","")})
		})
	}

	decolorizeAuditLog() {
		$(".userHook-DFT5u7").each((index, elem) => {
			$(elem).children().first().each((index, elem)=>{$(elem).css("color","")})
			$(elem).children(".discrim-xHdOK3").each((index, elem)=>{$(elem).css("color","").css("opacity", "")})
		})
	}

	decolorizeAccountStatus() {
		$('div[class*="accountDetails"]').find('.username').css("color","")
		$('div[class*="accountDetails"]').find('.discriminator').css("color","").css("opacity", "")
	}
	
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		this.generateSettings(panel)
		return panel[0];
	}
	
	generateSettings(panel) {
		
		if (this.hasUpdate) {
			var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded cardWarning-31DHBH card-3DrRmC">').css("background", SettingField.getAccentColor()).css("border-color", "transparent")
			var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
			headerText.html("Update Available! Your version: " + this.getVersion() + " | Current version: " + this.remoteVersion + "<br>Get it on Zere's GitHub! http://bit.ly/ZerebosBD")
			headerText.css("line-height", "150%")
			headerText.appendTo(header)
			header.appendTo(panel)
		}

		new ControlGroup("Module Settings", () => {this.saveSettings(); this.decolorize(); this.colorize();}).appendTo(panel).append(
			new CheckboxSetting("Typing", "Toggles colorizing of typing notifications. Least reliable module due to discord issues and double saves data.", this.settings.modules.typing, (checked) => {this.settings.modules.typing = checked}),
			new CheckboxSetting("Voice", "Toggles colorizing of voice users. Laggy at first on large servers.", this.settings.modules.voice, (checked) => {this.settings.modules.voice = checked}),
			new CheckboxSetting("Mentions", "Toggles colorizing of user mentions in the current server.", this.settings.modules.mentions, (checked) => {this.settings.modules.mentions = checked})
		)

		new ControlGroup("Popout Options", () => {this.saveSettings()}).appendTo(panel).append(
			new CheckboxSetting("Username", "Toggles coloring on the username in popouts.", this.settings.popouts.username, (checked) => {this.settings.popouts.username = checked}),
			new CheckboxSetting("Discriminator", "Toggles coloring on the discriminator in popouts.", this.settings.popouts.discriminator, (checked) => {this.settings.popouts.discriminator = checked}),
			new CheckboxSetting("Nickname", "Toggles coloring on the nickname in popouts.", this.settings.popouts.nickname, (checked) => {this.settings.popouts.nickname = checked}),
			new CheckboxSetting("Enable Fallback", "If nickname is on and username is off, enabling this will automatically color the username.", this.settings.popouts.fallback, (checked) => {this.settings.popouts.fallback = checked})
		)

		new ControlGroup("Modal Options", () => {this.saveSettings()}).appendTo(panel).append(
			new CheckboxSetting("Username", "Toggles coloring on the username in modals.", this.settings.modals.username, (checked) => {this.settings.modals.username = checked}),
			new CheckboxSetting("Discriminator", "Toggles coloring on the discriminator in popouts.", this.settings.modals.discriminator, (checked) => {this.settings.modals.discriminator = checked})
		)

		new ControlGroup("Audit Log Options", () => {this.saveSettings()}).appendTo(panel).append(
			new CheckboxSetting("Username", "Toggles coloring on the usernames in the audit log.", this.settings.auditLog.username, (checked) => {this.settings.auditLog.username = checked}),
			new CheckboxSetting("Discriminator", "Toggles coloring on the discriminators in the audit log.", this.settings.auditLog.discriminator, (checked) => {this.settings.auditLog.discriminator = checked})
		)

		new ControlGroup("Account Options", () => {this.saveSettings(); this.decolorizeAccountStatus(); this.colorizeAccountStatus();}).appendTo(panel).append(
			new CheckboxSetting("Username", "Toggles coloring on your username at the bottom.", this.settings.account.username, (checked) => {this.settings.account.username = checked}),
			new CheckboxSetting("Discriminator", "Toggles coloring on your discriminator at the bottom.", this.settings.account.discriminator, (checked) => {this.settings.account.discriminator = checked})
		)
			
		var resetButton = $("<button>");
		resetButton.on("click."+this.getShortName(), () => {
			this.settings = this.defaultSettings;
			this.saveSettings();
			panel.empty()
			this.generateSettings(panel)
		});
		resetButton.text("Reset To Defaults");
		resetButton.css("float", "right");
		resetButton.attr("type","button")

		panel.append(resetButton);
	}
}

class ControlGroup {
	constructor(groupName, callback) {
		this.group = $("<div>").addClass("control-group");

		var label = $("<h2>").text(groupName);
		label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
		label.css("margin-top", "30px")
		this.group.append(label);
		
		if (typeof callback != 'undefined') {
			this.group.on("change", "input", callback)
		}
	}
	
	getElement() {return this.group;}
	
	append(...nodes) {
		for (var i = 0; i < nodes.length; i++) {
			this.group.append(nodes[i].getElement())
		}
		return this
	}
	
	appendTo(node) {
		this.group.appendTo(node)
		return this
	}
}

class SettingField {
	constructor(name, helptext, inputData, callback, disabled = false) {
		this.name = name;
		this.helptext = helptext;
		this.row = $("<div>").addClass("ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item").css("margin-top", 0);
		this.top = $("<div>").addClass("ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap plugin-setting-input-row")
		this.settingLabel = $("<h3>").attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child").text(name);
		
		this.help = $("<div>").addClass("ui-form-text style-description margin-top-4").css("flex", "1 1 auto").text(helptext);
		
		this.top.append(this.settingLabel);
		this.row.append(this.top, this.help);
		
		inputData.disabled = disabled
		
		this.input = $("<input>", inputData)
		this.getValue = () => {return this.input.val();}
		this.input.on("keyup change", () => {
			if (typeof callback != 'undefined') {
				var returnVal = this.getValue()
				callback(returnVal)
			}
		})
	}
	
	setInputElement(node) {
		this.top.append(node)
	}
	
	getElement() {return this.row}
	
	static getAccentColor() {
		var bg = $('<div class="ui-switch-item"><div class="ui-switch-wrapper"><input type="checkbox" checked="checked" class="ui-switch-checkbox"><div class="ui-switch checked">')
		bg.appendTo($("#bd-settingspane-container"))
		var bgColor = $(".ui-switch.checked").first().css("background-color")
		var afterColor = window.getComputedStyle(bg.find(".ui-switch.checked")[0], ':after').getPropertyValue('background-color'); // For beardy's theme
		bgColor = afterColor == "rgba(0, 0, 0, 0)" ? bgColor : afterColor
		bg.remove();
		return bgColor
	}
	
	static getCSS(appName) {
		return 'li[data-reactid*="'+appName+'"] input:focus{outline:0}li[data-reactid*="'+appName+'"] input[type=range]{-webkit-appearance:none;border:none!important;border-radius:5px;height:5px;cursor:pointer}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-runnable-track{background:0 0!important}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;background:#f6f6f7;width:10px;height:20px}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-thumb:hover{box-shadow:0 2px 10px rgba(0,0,0,.5)}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-thumb:active{box-shadow:0 2px 10px rgba(0,0,0,1)}.plugin-setting-label{color:#f6f6f7;font-weight:500}.plugin-setting-input-row{padding-right:5px!important}.plugin-setting-input-container{display:flex;align-items:center;justify-content:center}';
	}
}

class CheckboxSetting extends SettingField {
	constructor(label, help, isChecked, callback, disabled) {
		super(label, help, {type: "checkbox", checked: isChecked}, callback, disabled);
		this.getValue = () => {return this.input.prop("checked")}
		this.input.addClass("ui-switch-checkbox");

		this.input.on("change", function() {
			if ($(this).prop("checked")) switchDiv.addClass("checked");
			else switchDiv.removeClass("checked");
		})
		
		this.checkboxWrap = $('<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">');
		this.checkboxWrap.append(this.input);
		var switchDiv = $('<div class="ui-switch">');
		if (isChecked) switchDiv.addClass("checked");
		this.checkboxWrap.append(switchDiv);
		this.checkboxWrap.css("right", "0px")

		this.setInputElement(this.checkboxWrap);
	}
}

return Plugin;
})();