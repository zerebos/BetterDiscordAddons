//META{"name":"ImageToClipboard"}*//

/* global PluginUtilities:false, ReactUtilities:false */

class ImageToClipboard {
	getName() { return "ImageToClipboard"; }
	getShortName() { return "i2c"; }
	getDescription() { return "Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.2.10"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.request = require('request');
		this.nativeImage = require("electron").nativeImage;
		this.clipboard = require("electron").clipboard;
		this.path = require("path");
		this.fileSystem = require("fs");
		this.process = require("process");
		this.link = '<a target="_blank" rel="noreferrer" class="downloadLink-wANcd8 size14-1wjlWP weightMedium-13x9Y8">${modalLabel}</a>';
		this.contextItem = '<div class="itemGroup-oViAgA i2c-group"><div class="item-1XYaYf i2c-item"><span>${contextMenuLabel}</span><div class="hint"></div></div></div>';
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

	stop() {}

	initialize() {
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		PluginUtilities.showToast(PluginUtilities.formatString(this.strings.startMessage, {pluginName: this.getName(), version: this.getVersion()}));
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
				item = $(PluginUtilities.formatString(this.contextItem, this.strings)).on("click." + this.getShortName(), ()=>{$(context).hide(); this.copyToClipboard(imageLink);});
				$(context).prepend(item);
		}
		else {
			imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.href");
			if (!imageLink) return;
			imageLinkLower = imageLink.split(/\?|:large$/)[0].toLowerCase();
			if (imageLinkLower.endsWith('.png') || imageLinkLower.endsWith('.jpg') || imageLinkLower.endsWith('.jpeg')) {
				item = $(PluginUtilities.formatString(this.contextItem, this.strings)).on("click." + this.getShortName(), ()=>{$(context).hide();this.copyToClipboard(imageLink);});
				$(context).prepend(item);
			}
		}
	}

	observer(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		var elem = $(e.addedNodes[0]);

		if (elem.hasClass("modal-2LIEKY") && elem.find(".inner-1_1f7b .imageWrapper-38T7d9").length) {
			var linkElement = $(PluginUtilities.formatString(this.link, this.strings));
			var openElement = $('.inner-1_1f7b>div>div>a');
			var imageLink = openElement.attr("href");
			imageLink = imageLink.replace(/:large$/, '');
			if (imageLink.split('?')[0].endsWith('.png') || imageLink.split('?')[0].endsWith('.jpg') || imageLink.split('?')[0].endsWith('.jpeg')) {
				openElement.after($('<span class="downloadLink-wANcd8 size14-1wjlWP weightMedium-13x9Y8"> | </span>'),linkElement);
				linkElement.on("click", () => { this.copyToClipboard(imageLink); });
			}
		}

		if (elem.hasClass("contextMenu-uoJTbz")) {
			this.bindMenu(elem[0]);
		}

	}

	getSettingsPanel() {}

	get strings() {
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
