//META{"name":"ImageToClipboard"}*//

/* global PluginUtilities:false, ReactUtilities:false */

class ImageToClipboard {
	getName() { return "ImageToClipboard"; }
	getShortName() { return "i2c"; }
	getDescription() { return "Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.2.5"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.fs = require("fs");
		this.nativeImage = require("electron").nativeImage;
		this.clipboard = require("electron").clipboard;
		this.path = require("path");
		this.fileSystem = require("fs");
		this.process = require("process");
		this.link = '<a target="_blank" rel="noreferrer" class="download-button">Copy original</a>';
		this.contextItem = '<div class="item"><span>Copy Image</span><div class="hint"></div></div>';
	}
	
	load() {}
	unload() {}
	
	start() {
		if (typeof window.ZeresLibrary === "undefined" || !$("#zeresLibraryScript").length) {
			var libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "//rawgit.com/rauenzi/BetterDiscordAddons/master/Plugins/PluginLibrary.js?" + performance.now());
			libraryScript.setAttribute("id", "zeresLibraryScript");
			document.head.appendChild(libraryScript);
		}

		if (typeof window.ZeresLibrary !== "undefined") {
			this.initialize();
		}
		else {
			document.getElementById('zeresLibraryScript').addEventListener("load", () => {this.initialize();});
		}
	}

	stop() {
	}

	initialize() {
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
	}

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
				var file = this.path.join(this.process.env[this.process.platform === "win32" ? "USERPROFILE" : "HOME"], "i2ctemp.png");
				this.fileSystem.writeFileSync(file, uri.split(",")[1], 'base64');
				this.clipboard.write({image: file});
				this.fileSystem.unlinkSync(file);
			}
		});
	}

	bindMenu(context) {
		var imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.attachment.url");
		var imageLinkLower = imageLink ? imageLink.toLowerCase() : "";
		var item = "";
		if (imageLinkLower.endsWith('.png') || imageLinkLower.endsWith('.jpg') || imageLinkLower.endsWith('.jpeg')) {
				item = $(this.contextItem).on("click." + this.getShortName(), ()=>{$(context).hide(); this.copyToClipboard(imageLink);});
				$(context).find('.item:contains("Copy Link")').after(item);
		}
		else {
			imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.src");
			if (!imageLink) return;
			imageLink = imageLink.match(/https?\/.*(\.png|\.jpg|\.jpeg)\??/g);
			if (!imageLink) return;
			imageLink = imageLink[0].replace("http/", "http://").replace("https/", "https://").replace('?', '');
			imageLinkLower = imageLink.toLowerCase();
			if (imageLinkLower.endsWith('.png') || imageLinkLower.endsWith('.jpg') || imageLinkLower.endsWith('.jpeg')) {
				item = $(this.contextItem).on("click." + this.getShortName(), ()=>{$(context).hide();this.copyToClipboard(imageLink);});
				$(context).find('.item:contains("Copy Link")').after(item);
			}
		}
	}

	observer(e){
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		var elem = $(e.addedNodes[0]);

		if (elem.hasClass("modal-image").length || elem.find(".modal-image").length) {
			var linkElement = $(this.link);
			var openElement = $('.modal-image a');
			var imageLink = openElement.attr("href");
			if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
				openElement.after($('<span class="download-button"> | </span>'),linkElement);
				linkElement.on("click", () => { this.copyToClipboard(imageLink); });
			}
		}

		if (elem.hasClass("context-menu")) {
			this.bindMenu(elem[0]);
		}

	}

	getSettingsPanel() {}
}