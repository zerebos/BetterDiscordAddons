//META{"name":"ImageToClipboard","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js"}*//

/* global PluginUtilities:false, ReactUtilities:false, PluginContextMenu:false, DiscordModules:false */

class ImageToClipboard {
	getName() { return "ImageToClipboard"; }
	getShortName() { return "i2c"; }
	getDescription() { return "Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.2.14"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.request = require('request');
		this.nativeImage = require("electron").nativeImage;
		this.clipboard = require("electron").clipboard;
		this.path = require("path");
		this.fileSystem = require("fs");
		this.process = require("process");
		this.link = '<a target="_blank" rel="noreferrer" class="anchor-3Z-8Bb downloadLink-1ywL9o size14-3iUx6q weightMedium-2iZe9B">${modalLabel}</a>';
		// this.contextItem = '<div class="itemGroup-oViAgA i2c-group"><div class="item-1XYaYf i2c-item"><span>${contextMenuLabel}</span><div class="hint"></div></div></div>';
	}
	
	load() {}
	unload() {}
	
	start() {
        let libraryScript = document.getElementById('zeresLibraryScript');
		if (!libraryScript || (window.ZeresLibrary && window.ZeresLibrary.isOutdated)) {
			if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
            document.head.appendChild(libraryScript);
		}

		if (window.ZeresLibrary) this.initialize();
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

	isSupportedImage(imageLink) {
		if (typeof(imageLink) !== "string") return false;
		imageLink = imageLink.toLowerCase();
		return imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg');
	}

	bindMenu(context) {
		// Assume attached image
		var imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.attachment.url");
		var imageLinkCheck = imageLink ? imageLink : "";

		// No attached image? check linked image
		if (!this.isSupportedImage(imageLinkCheck)) {
			imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.href");
			imageLinkCheck = imageLink ? imageLink.split(/\?|:large$/)[0] : null;
		}

		// No linked image? check if embedded image
		if (!this.isSupportedImage(imageLinkCheck)) {
			imageLink = ReactUtilities.getReactProperty(context, "return.memoizedProps.src");
			imageLinkCheck = imageLink ? imageLink.match(/https?\/.*(\.png|\.jpg|\.jpeg)\??/g) : null;
			imageLinkCheck = imageLinkCheck ? imageLinkCheck[0].replace("http/", "http://").replace("https/", "https://").split(/\?|:large$/)[0] : null;
		}

		// No image found
		if (!this.isSupportedImage(imageLinkCheck)) return;

		var item = new PluginContextMenu.TextItem(this.strings.contextMenuLabel, {
			callback: () => {
				$(context).hide();
				this.copyToClipboard(imageLink);
			}
		});
		$(context).prepend(item.element);
	}

	observer(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		var elem = $(e.addedNodes[0]);

		if (elem.hasClass("modal-1UGdnR") && elem.find(".inner-1JeGVc .imageWrapper-2p5ogY").length) {
			var linkElement = $(PluginUtilities.formatString(this.link, this.strings));
			var openElement = $('.inner-1JeGVc>div>a');
			if (openElement.length) {
				var originalLink = openElement.attr("href").replace(/:large$/, '');
				var imageLink = originalLink.split('?')[0];
				if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
					//openElement.after($('<span class="anchor-3Z-8Bb downloadLink-1ywL9o size14-3iUx6q weightMedium-2iZe9B"> | </span>'), linkElement);
					openElement.after(linkElement);
					linkElement.on("click", () => { this.copyToClipboard(originalLink); });
				}
			}
		}

		if (elem.hasClass(DiscordClasses.ContextMenu.contextMenu)) {
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
