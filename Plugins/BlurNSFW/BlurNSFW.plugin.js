//META{"name":"BlurNSFW"}*//

var BlurNSFW = (function() {

class Plugin {
	getName(){return "BlurNSFW"}
	getShortName() {return "bnsfw"}
	getDescription(){return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.1.6"}
	getAuthor(){return "Zerebos"}

	constructor() {
		this.style = `:root {--blur-nsfw: 10px; --blur-nsfw-time: 200ms;}
		.attachment-image img.blur:hover, .embed-thumbnail img.blur:hover, .attachment-image canvas.blur:hover, .embed-thumbnail canvas.blur:hover, .attachment-image video.blur:hover, .embed-thumbnail video.blur:hover {
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
			filter: blur(0px) !important;
		}
		.attachment-image img.blur, .embed-thumbnail img.blur, .attachment-image canvas.blur, .embed-thumbnail canvas.blur, .attachment-image video.blur, .embed-thumbnail video.blur {
			filter: blur(var(--blur-nsfw)) !important;
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
		}`
		this.selectors = ['.attachment-image img', '.attachment-image canvas', '.attachment-image video', '.embed-thumbnail img', '.embed-thumbnail canvas', '.embed-thumbnail video']
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
	
	load() {this.checkForUpdate()}
	unload(){}
	
	start(){
		this.checkForUpdate()
		BdApi.injectCSS(this.getShortName(), this.style)
		this.blurStuff()
	}
	stop(){
		this.unblurStuff()
		BdApi.clearCSS(this.getShortName())
	}

	getReactInstance(node) { 
	        return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
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

	isNSFWChannel() {
		if (!$('.title-wrap').length) return false;
		let channel = this.getReactKey({node: $('.title-wrap')[0], key: "channel", defaultValue: {name: null, nsfw: false}})
		let channelName = channel.name
		let isNSFW = channel.nsfw
		if (channelName !== undefined && channelName !== null) channelName = channelName.toLowerCase().indexOf("nsfw") !== -1;
		return isNSFW || channelName
	}

	blurStuff() {
		if (!this.isNSFWChannel()) return;

		var blurAction = (index, elem) => {
			var img = $(elem)
			if (!img.hasClass("blur")) {
				img.addClass("blur");
				img.parent().css("overflow", "hidden")
			}
		}

		for (var i=0; i<this.selectors.length; i++) $(this.selectors[i]).each(blurAction);
	}

	unblurStuff() {
		var unblurAction = (index, elem) => {
			var img = $(elem)
			if (img.hasClass("blur")) img.removeClass("blur");
		}

		for (var i=0; i<this.selectors.length; i++) $(this.selectors[i]).each(unblurAction);
	}

	observer(e){

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])

		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			this.blurStuff()
		}

		if (elem.hasClass(".image").length || elem.find("span.image").parents(".messages.scroller").length) {
			this.blurStuff()
		}

	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded card-3DrRmC">')//.css("background", SettingField.getAccentColor()).css("border-color", "transparent")
		var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
		headerText.html("To update the blur amount change the css variable <span style='font-family: monospace;'>--blur-nsfw</span> to something like <span style='font-family: monospace;'>20px</span>. <br> You can also change the tranistion time by changing <span style='font-family: monospace;'>--blur-nsfw-time</span> to something like <span style='font-family: monospace;'>500ms</span>")
		headerText.css("line-height", "150%")
		headerText.appendTo(header)
		header.appendTo(panel)
		return panel[0]
	}
}


return Plugin
})();

