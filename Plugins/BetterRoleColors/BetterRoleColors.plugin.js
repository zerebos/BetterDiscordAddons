//META{"name":"BetterRoleColors"}*//

let BetterRoleColors = (function() {

var appName = "Better Role Colors";
var appNameShort = "BRC"; // Used for namespacing, settings, and logging
var appDescription = "Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer";
var appAuthor = "Zerebos";
var appVersion = "0.3.7";
var appGithubLink = "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js";

class ControlGroup {
	constructor(groupName, callback) {
		this.group = $("<div>").addClass("control-group");

		var label = $("<h2>").text(groupName);
		label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
		label.css("margin-top", "30px")
		this.group.append(label);
		
		if (typeof callback != 'undefined') {
			this.group.on("change."+appNameShort, "input", callback)
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
		this.input.on("keyup."+appNameShort+" change."+appNameShort, () => {
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

		this.input.on("change."+appNameShort, function() {
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

class Plugin {
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
		this.mainCSS =  ""

		this.colorData = {}
	}
	
	getName() { return appName }

	getShortName() { return appNameShort }

	getDescription() { return appDescription }

	getVersion() { return appVersion }

	getAuthor() { return appAuthor }

	getGithubLink() { return appGithubLink }
	
	loadSettings() {
		var loaded;
		try { loaded = $.extend({}, this.settings, bdPluginStorage.get(this.getShortName(), "plugin-settings")) }
		catch (err) { console.warn(this.getShortName(), "unable to load settings:", err); loaded = this.defaultSettings; }

		for (var settingType in loaded) {
			this.settings[settingType] = $.extend({}, this.settings[settingType], loaded[settingType]);
		}
	}

	saveSettings() {
		try { bdPluginStorage.set(this.getShortName(), "plugin-settings", this.settings) }
		catch (err) { console.warn(this.getShortName(), "unable to save settings:", err) }
	}

	loadData() {
		try { this.colorData = $.extend({}, this.colorData, bdPluginStorage.get(this.getShortName(), "color-data")) }
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
		this.loadSettings();
		this.loadData()
		BdApi.injectCSS(this.getShortName()+"-style", this.mainCSS);
		BdApi.injectCSS(this.getShortName()+"-settings", SettingField.getCSS(this.getName()));
		this.getAllColors()
	}
	
	stop() {
		this.saveData()
		this.decolorize()
		this.saveSettings();
		$("*").off("." + this.getShortName());
		BdApi.clearCSS(this.getShortName()+"-style");
		BdApi.clearCSS(this.getShortName()+"-settings");
	}
	
	onSwitch() {};
	
	observer(e) {

		if (e.removedNodes.length) {
			var removed = $(e.removedNodes[0])
			if (removed.hasClass("spinner") || removed.prop("tagName") == "STRONG") {
				this.colorizeTyping()
			}
		}

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0]);

		if (elem.find(".containerDefault-7RImuF").length || elem.find(".avatarContainer-303pFz").length) {
			this.getVoiceColors()
        	this.colorizeVoice()
		}

		if (elem.find("strong").length || elem.find(".spinner").length || elem.hasClass("typing") || elem.prop("tagName") == "STRONG") {
        	this.colorizeTyping()
    	}

    	if (elem.find(".guild-settings-audit-logs").length || elem.hasClass("guild-settings-audit-logs") || elem.find(".userHook-DFT5u7").length || elem.hasClass("userHook-DFT5u7")) {
    		this.colorizeAuditLog()
    	}

    	if (elem.find('div[class*="userPopout"]').length || elem.hasClass("userPopout-4pfA0d")) {
        	this.colorizePopout()
    	}

    	if (elem.find("#user-profile-modal").length || elem.is("#user-profile-modal")) {
        	this.colorizeModal()
    	}

    	if (elem.find(".message-group").length || elem.hasClass("message-group")) {
        	this.colorizeMentions(elem)
    	}

    	if (elem.find(".message").length || elem.hasClass("message")) {
    		this.colorizeMentions(elem.parents('.message-group'))
    	}

		if (elem.find(".member-username-inner").length) {
			this.getMemberListColors()
			this.colorize()
		}

		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			this.getMessageColors()
			this.colorize()
		}

    	if (elem.find("#friends").length || elem.is("#friends")) {
        	this.colorize()
    	}
	}

	getReactInstance(node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}

	isServer() { return this.getCurrentServer() ? true : false}

	getCurrentServer() {
		return this.getReactInstance($('.channels-wrap')[0])._currentElement.props.children["0"].props.guildId
	}

	getRGB(color) {
	    var result;
	    
	    // Look for rgb(num,num,num)
	    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

	    // Look for rgb(num%,num%,num%)
	    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];

	    // Look for #a0b1c2
	    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];

	    // Look for #fff
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

	addColorData(server, user, color) {
		if (this.colorData[server] === undefined) this.colorData[server] = {};
		if (color) this.colorData[server][user] = color;
		else if (this.colorData[server][user] !== undefined) delete this.colorData[server][user];
	}

	getColorData(server, user) {
		if (server === undefined || this.colorData[server] === undefined || this.colorData[server][user] === undefined) return "";
		else return this.colorData[server][user];
	}

	getAllColors() {
		this.getMemberListColors()
		this.getVoiceColors()
		this.getMessageColors()
		this.saveData()
	}

	getRoleFromPopout() {
		if (!$('div[class*="userPopout"]').find(".member-role").length) return "";
		return $('div[class*="userPopout"]').find(".member-role")[0].style.color;
	}

	findPopoutUsername(popout) {
		if (popout.find('div[class*="headerUsername"]').length) return popout.find('div[class*="headerUsername"]');
		else return popout.find('div[class*="headerTag"]').children(':first')
	}

	getMemberListColors() {
		if (!this.isServer()) return;
		let server = this.getCurrentServer()
		$('.member').each((index, elem) => {
			//var user = this.getReactInstance(elem)._currentElement.props.children["0"].props.user.id
			var user = $(elem).find('.member-username-inner').text()
			if (user) {
				var color = $(elem).find('.member-username-inner')[0].style.color;
				if (this.settings.modules.typing) this.addColorData(server, user, color);
				this.addColorData(server, this.getReactInstance(elem)._currentElement.props.children["0"].props.user.id, color)
			}
		});
	}

	getVoiceColors() {
		if (!this.isServer()) return;
		let server = this.getCurrentServer()
		$('.draggable-3SphXU').each((index, elem) => {
			//var user = this.getReactInstance(elem)._currentElement.props.children.props.user.id
			var user = $(elem).find(".avatarContainer-303pFz").siblings().first().text()
			var userAlt = this.getReactInstance(elem)._currentElement.props.children.props.user.id
			if (this.getColorData(server,user) && (!this.getColorData(server,userAlt) == !this.settings.modules.typing)) return;
			$(elem).children().first().click()
			var popout = $('div[class*="userPopout"]');
			var color = this.getRoleFromPopout()
			popout.remove()
			if (this.settings.modules.typing) this.addColorData(server, user, color);
			this.addColorData(server, userAlt, color)
		});
	}

	getMessageColors() {
		if (!this.isServer()) return;
		let server = this.getCurrentServer()
		$('.message-group').each((index, elem) => {
			//var user = this.getReactInstance(elem)._currentElement.props.children["0"].props.children.props.user.id
			var user = $(elem).find('.user-name').text()
			if (user) {
				var color = $(elem).find('.user-name')[0].style.color;
				if (this.settings.modules.typing) this.addColorData(server, user, color);
				this.addColorData(server, this.getReactInstance(elem)._currentElement.props.children["0"].props.children.props.user.id, color)
			}
		});
	}

	colorize() {
		this.colorizeTyping()
		this.colorizeVoice()
		this.colorizeMentions()
		this.colorizeAccountStatus()
	}

	colorizeAccountStatus() {
		if (!this.settings.account.username && !this.settings.account.discriminator) return;
		let server = this.getCurrentServer()
		let account = $('div[class*="accountDetails"]')
		let user = this.getReactInstance(account[0])._hostParent._currentElement.props.children[1].props.user.id
		let color = this.getColorData(server, user)
		if (this.settings.account.username) account.find(".username")[0].style.setProperty("color", color, "important");
		if (this.settings.account.discriminator) account.find(".discriminator").css("opacity", 1)[0].style.setProperty("color", color, "important");
	}

	colorizeTyping() {
		if (!this.settings.modules.typing) return;
		let server = this.getCurrentServer()
	    $(".typing strong").each((index, elem) => {
	        var user = $(elem).text();
	        $(elem).css("color", this.getColorData(server, user));
	    });
	}

	colorizeVoice() {
		if (!this.settings.modules.voice) return;
		let server = this.getCurrentServer()
	    $(".draggable-3SphXU").each((index, elem) => {
	        var user = this.getReactInstance(elem)._currentElement.props.children.props.user.id
			$(elem).find(".avatarContainer-303pFz").siblings().first().css("color", this.getColorData(server, user));
	    });
	}

	colorizeMentions(node) {
		if (!this.settings.modules.mentions) return;
		let server = this.getCurrentServer()
		var searchSpace = node === undefined ? $(".message-group .message") : node
	    $(".message-group .message").each((index, elem) => {
	    	var messageNum = $(elem).index()
	    	var instance = this.getReactInstance(elem)
	    	$(elem).find('.message-text > .markup > .mention:contains("@")').each((index, elem) => {
	        	var users = instance._hostParent._currentElement.props.children[0][messageNum].props.message.content.match(/<@!?[0-9]+>/g)
	        	var user = users[index].replace(/<|@|!|>/g, "")
	        	var textColor = this.getColorData(server, user)
				$(elem).css("color", textColor);
				if (textColor) {
					$(elem).css("background", this.rgbToAlpha(textColor,0.1));

					$(elem).on("mouseenter."+this.getShortName(), ()=>{
						$(elem).css("color", "#FFFFFF");
						$(elem).css("background", this.rgbToAlpha(textColor,0.7));
					})
					$(elem).on("mouseleave."+this.getShortName(), ()=> {
						$(elem).css("color", textColor);
						$(elem).css("background", this.rgbToAlpha(textColor,0.1));
					})
				}
	    	})
	    });
	}

	colorizePopout() {
		if (!this.settings.popouts.username && !this.settings.popouts.discriminator && !this.settings.popouts.nickname) return;
		let server = this.getCurrentServer()
	    $('div[class*="userPopout"]').each((index, elem) => {
	        var user = $(elem).text()
	        var user = this.getReactInstance(elem)._currentElement._owner._currentElement.props.user.id
	        var color = this.getColorData(server, user)
	        var hasNickname = $(elem).find('.nickname').length
	        if (!color) color = this.getRoleFromPopout();
	        if ((color && this.settings.popouts.username) || (!hasNickname && this.settings.popouts.fallback)) this.findPopoutUsername($(elem))[0].style.setProperty("color", color, "important");
	        if (color && this.settings.popouts.discriminator) $(elem).find('div[class*="headerDiscriminator"]')[0].style.setProperty("color", color, "important");
	        if (color && this.settings.popouts.nickname && hasNickname) $(elem).find('.nickname')[0].style.setProperty("color", color, "important");
	    });
	}

	colorizeModal() {
		if (!this.settings.modals.username && !this.settings.modals.discriminator) return;
		let server = this.getCurrentServer()
	    $("#user-profile-modal").each((index, elem) => {
	        var user = this.getReactInstance(elem)._currentElement.props.children[3].props.user.id
	        var color = this.getColorData(server, user)
	        if (color && this.settings.modals.username) $(elem).find('.username')[0].style.setProperty("color", color, "important");
	        if (color && this.settings.modals.discriminator) $(elem).find('.discriminator')[0].style.setProperty("color", color, "important");
	    });
	}

	colorizeAuditLog() {
		if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
		let server = this.getReactInstance($('.guild-settings-audit-logs')[0])._currentElement.props.children.props.children._owner._currentElement.props.guildId
	    $(".userHook-DFT5u7").each((index, elem) => {
	    	var index = $(elem).index() ? 2 : 0
	        let user = this.getReactInstance(elem)._hostParent._currentElement.props.children[index].props.user.id
	        let color = this.getColorData(server, user)
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
			this.findPopoutUsername($(elem)).each((index, elem)=>{$(elem).css("color","")})
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
		resetButton.on("click."+appNameShort, () => {
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

return Plugin;
})();