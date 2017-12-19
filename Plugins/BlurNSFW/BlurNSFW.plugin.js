//META{"name":"BlurNSFW"}*//

/* global PluginUtilities:false, ReactUtilities:false, BdApi:false */

class BlurNSFW {
	getName() { return "BlurNSFW"; }
	getShortName() { return "bnsfw"; }
	getDescription() { return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.1.8"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.style = `:root {--blur-nsfw: 10px; --blur-nsfw-time: 200ms;}
		.attachment-image img.blur:hover, .embed-thumbnail img.blur:hover, .attachment-image canvas.blur:hover, .embed-thumbnail canvas.blur:hover, .attachment-image video.blur:hover, .embed-thumbnail video.blur:hover, img.embed-rich-thumb:hover {
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
			filter: blur(0px) !important;
		}
		.attachment-image img.blur, .embed-thumbnail img.blur, .attachment-image canvas.blur, .embed-thumbnail canvas.blur, .attachment-image video.blur, .embed-thumbnail video.blur, .embed-rich-thumb.blur {
			filter: blur(var(--blur-nsfw)) !important;
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
		}`;
		this.selectors = ['.attachment-image img', '.attachment-image canvas', '.attachment-image video', '.embed-thumbnail img', '.embed-thumbnail canvas', '.embed-thumbnail video', '.embed-rich-thumb'];
	}
	
	load() {}
	unload() {}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); })
	}

	initialize() {
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		BdApi.injectCSS(this.getShortName(), this.style);
		this.blurStuff();
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}

	stop() {
		this.unblurStuff();
		BdApi.clearCSS(this.getShortName());
	}

	isNSFWChannel() {
		if (!document.querySelector('.chat')) return false;
		let channel = ReactUtilities.getReactProperty(document.querySelector('.chat'), "return.memoizedState.channel");
		if (!channel) return false;
		let channelName = channel.name;
		let isNSFW = channel.nsfw;
		if (channelName !== undefined && channelName !== null) channelName = channelName.toLowerCase().indexOf("nsfw") !== -1;
		return isNSFW || channelName;
	}

	blurStuff() {
		if (!this.isNSFWChannel()) return;

		for (var i = 0; i < this.selectors.length; i++) {
			document.querySelectorAll(this.selectors[i]).forEach((elem) => {
				if (!elem.classList.contains("blur")) {
					elem.classList.add("blur");
					elem.parentElement.style.setProperty("overflow", "hidden");
				}
			});
		}
	}

	unblurStuff() {
		for (var i = 0; i < this.selectors.length; i++) {
			document.querySelectorAll(this.selectors[i]).forEach((elem) => {
				if (elem.classList.contains("blur")) {
					elem.classList.remove("blur");
					elem.parentElement.style.setProperty("overflow", "");
				}
			});
		}
	}

	observer(e){

		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		var elem = $(e.addedNodes[0]);

		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			this.blurStuff();
		}

		if (elem.hasClass(".image").length || elem.find("span.image").parents(".messages.scroller").length) {
			this.blurStuff();
		}

	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded card-3DrRmC">');
		var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">');
		headerText.html("To update the blur amount change the css variable <span style='font-family: monospace;'>--blur-nsfw</span> to something like <span style='font-family: monospace;'>20px</span>. <br> You can also change the tranistion time by changing <span style='font-family: monospace;'>--blur-nsfw-time</span> to something like <span style='font-family: monospace;'>500ms</span>");
		headerText.css("line-height", "150%");
		headerText.appendTo(header);
		header.appendTo(panel);
		return panel[0];
	}
}
