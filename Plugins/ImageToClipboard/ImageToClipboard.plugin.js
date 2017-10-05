//META{"name":"ImageToClipboard"}*//

var ImageToClipboard = (function() {

class Plugin {
	getName(){return "ImageToClipboard"}
	getShortName() {return "i2c"}
	getDescription(){return "Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.2.5"}
	getAuthor(){return "Zerebos"}

	constructor() {
		this.fs = require("fs");
		this.nativeImage = require("electron").nativeImage;
		this.clipboard = require("electron").clipboard;
		this.path = require("path")
		this.fileSystem = require("fs")
		this.process = require("process")
		this.link = '<a target="_blank" rel="noreferrer" class="download-button">Copy original</a>'
		this.contextItem = '<div class="item"><span>Copy Image</span><div class="hint"></div></div>'
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
	
	start(){this.checkForUpdate()}
	stop(){
	}

	getReactInstance(node) { 
	        return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}

	getReactKey(config) {
		if (config === undefined) return null;
		if (config.node === undefined || config.key === undefined) return null;
		
		var inst = this.getReactInstance(config.node);
		if (!inst) return null;
		
		
		// to avoid endless loops (parentnode > childnode > parentnode ...)
		var maxDepth = config.depth === undefined ? 5 : config.depth;
			
		var keyWhiteList = typeof config.whiteList === "object" ? config.whiteList : {
			"props":true,
			"children":true,
			"memoizedProps":true
		};
		
		var keyBlackList = typeof config.blackList === "object" ? config.blackList : {};
		
		return searchKeyInReact(inst, 0);

		function searchKeyInReact (ele, depth) {
			if (!ele || depth > maxDepth) return null;
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

	getDataUri(targetUrl, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.onload = function () {
	        var reader = new FileReader();
	        reader.onloadend = function () {
	            callback(reader.result);
	        };
	        reader.readAsDataURL(xhr.response);
	    };
	    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
	    //if (targetUrl.startsWith("https://cdn.discordapp.com/")) proxyUrl="";
	    xhr.open('GET', proxyUrl + targetUrl);
	    xhr.responseType = 'blob';
	    xhr.send();
	}

	copyToClipboard(url) {
		this.getDataUri(url, (uri) => {
			if (this.process.platform === "win32" || this.process.platform === "darwin") {
				this.clipboard.write({image: this.nativeImage.createFromBuffer(new Buffer(uri.split(",")[1], 'base64'))});
			}
			else {
				var file = this.path.join(this.process.env[this.process.platform === "win32" ? "USERPROFILE" : "HOME"], "i2ctemp.png")
				this.fileSystem.writeFileSync(file, uri.split(",")[1], 'base64');
				this.clipboard.write({image: file});
				this.fileSystem.unlinkSync(file)
			}
		});
	}

	bindMenu(context) {
		var imageLink = this.getReactKey({node: context, key: "href"});
		var imageLinkLower = imageLink ? imageLink.toLowerCase() : ""
		if (imageLinkLower.endsWith('.png') || imageLinkLower.endsWith('.jpg') || imageLinkLower.endsWith('.jpeg')) {
				var item = $(this.contextItem).on("click."+this.getShortName(), ()=>{$(context).hide();this.copyToClipboard(imageLink);});
				$(context).find('.item:contains("Copy Link")').after(item)
		}
		else {
			imageLink = this.getReactKey({node: context, key: "src"});
			if (!imageLink) return;
			imageLink = imageLink.match(/https?\/.*(\.png|\.jpg|\.jpeg)\??/g)
			if (!imageLink) return;
			imageLink = imageLink[0].replace("http/", "http://").replace("https/", "https://").replace('?', '')
			imageLinkLower = imageLink.toLowerCase()
			if (imageLinkLower.endsWith('.png') || imageLinkLower.endsWith('.jpg') || imageLinkLower.endsWith('.jpeg')) {
				var item = $(this.contextItem).on("click."+this.getShortName(), ()=>{$(context).hide();this.copyToClipboard(imageLink);});
				$(context).find('.item:contains("Copy Link")').after(item)
			}
		}
	}

	observer(e){

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])

		if (elem.hasClass("modal-image").length || elem.find(".modal-image").length) {
			var linkElement = $(this.link)
			var openElement = $('.modal-image a')
			var imageLink = openElement.attr("href")
			if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
				openElement.after($('<span class="download-button"> | </span>'),linkElement)
				linkElement.on("click", () => {this.copyToClipboard(imageLink)})
			}
		}

		if (elem.hasClass("context-menu")) {
			this.bindMenu(elem[0])
		}

	}

	getSettingsPanel() {}
}


return Plugin
})();

