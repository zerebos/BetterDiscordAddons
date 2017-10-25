//META{"name":"ImageToClipboard"}*//

/* global PluginUtilities:false, ReactUtilities:false */

class ImageToClipboard {
	getName() { return "ImageToClipboard"; }
	getShortName() { return "i2c"; }
	getDescription() { return "Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.2.9"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.request = require('request');
		this.nativeImage = require("electron").nativeImage;
		this.clipboard = require("electron").clipboard;
		this.path = require("path");
		this.fileSystem = require("fs");
		this.process = require("process");
		this.link = '<a target="_blank" rel="noreferrer" class="download-button">${modalLabel}</a>';
		this.contextItem = '<div class="item-group i2c-group"><div class="item i2c-item"><span>${contextMenuLabel}</span><div class="hint"></div></div></div>';
		this.strings = this.getStrings();
	}
	
	load() {}
	unload() {}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (!libraryScript) {
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
			document.head.appendChild(libraryScript);
		}

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}

	stop() {
	}

	initialize() {
		this.localize();
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		PluginUtilities.showToast(this.strings.startMessage);
	}

	copyToClipboard(url) {
		this.request({url: url, encoding: null}, (error, response, buffer) => {
			if (error) {
				PluginUtilities.showToast(this.strings.copyFailed, {type: "danger"});
				return;
			}
			if (this.process.platform === "win32" || this.process.platform === "darwin") {
				this.clipboard.write({image: this.nativeImage.createFromBuffer(buffer)});
			}
			else {
					var file = this.path.join(this.process.env["HOME"], "i2ctemp.png");
					this.fileSystem.writeFileSync(file, buffer, {encoding: null});
					this.clipboard.write({image: file});
					this.fileSystem.unlinkSync(file);
			}
			PluginUtilities.showToast(this.strings.copySuccess, {type: "success"});
		});
	}

	bindMenu(context) {
		var imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.attachment.url");
		var imageLinkLower = imageLink ? imageLink.toLowerCase() : "";
		var item = "";
		if (imageLinkLower.endsWith('.png') || imageLinkLower.endsWith('.jpg') || imageLinkLower.endsWith('.jpeg')) {
				item = $(this.contextItem).on("click." + this.getShortName(), ()=>{$(context).hide(); this.copyToClipboard(imageLink);});
				$(context).prepend(item);
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
				$(context).prepend(item);
			}
		}
	}

	observer(e) {
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

	localize() {
		this.strings = this.getStrings();
		this.contextItem = PluginUtilities.formatString(this.contextItem, this.strings);
		this.link = PluginUtilities.formatString(this.link, this.strings);
		this.strings.startMessage = PluginUtilities.formatString(this.strings.startMessage, {pluginName: this.getName(), version: this.getVersion()});
	}

	getStrings() {
		let lang = "";
		if (document.documentElement.getAttribute('lang')) lang = document.documentElement.getAttribute('lang').split('-')[0];
		switch (lang) {
			case "es": // Spanish
				return {
					startMessage: "${pluginName} ${version} ha empezado.",
					contextMenuLabel: "Copiar Imagen",
					modalLabel: "Copiar Original",
					copySuccess: "Imagen copiada al portapapeles.",
					copyFailed: "Hubo un problema al copiar la imagen."
				};
			case "pt": // Portuguese
				return {
					startMessage: "${pluginName} ${version} iniciado",
					contextMenuLabel: "Copiar imagem",
					modalLabel: "Copiar original",
					copySuccess: "Imagem copiada para a área de transferência",
					copyFailed: "Houve um problema ao copiar a imagem"
				};
			case "de": // German
				return {
					startMessage: "${pluginName} ${version} hat begonnen.",
					contextMenuLabel: "Kopiere das Bild",
					modalLabel: "Original Kopieren",
					copySuccess: "Bild in die Zwischenablage kopiert.",
					copyFailed: "Beim Kopieren des Bildes ist ein Problem aufgetreten."
				};
			default: // English
				return {
					startMessage: "${pluginName} ${version} has started.",
					contextMenuLabel: "Copy Image",
					modalLabel: "Copy Original",
					copySuccess: "Image copied to clipboard.",
					copyFailed: "There was an issue copying the image."
				};
		}
	}
}
