//META{"name":"BlurNSFW"}*//

/* global PluginUtilities:false, InternalUtilities:false, BdApi:false */

class BlurNSFW {
	getName() { return "BlurNSFW"; }
	getShortName() { return "bnsfw"; }
	getDescription() { return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.1.9"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.style = `:root {--blur-nsfw: 10px; --blur-nsfw-time: 200ms;}
		img.blur:hover,
		video.blur:hover {
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
			filter: blur(0px) !important;
		}
		
		img.blur,
		video.blur {
			filter: blur(var(--blur-nsfw)) !important;
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
		}`;
		this.selectors = ['.embedImage-1JnXMa img', '.embedImage-1JnXMa video', '.imageZoom-2suFUV img', '.imageZoom-2suFUV video'];
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
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}

	initialize() {
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		BdApi.injectCSS(this.getShortName(), this.style);
		this.SelectedChannelStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedChannelId']);
		this.ChannelStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getChannels', 'getDMFromUserId']);
		this.blurStuff();
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}

	stop() {
		this.unblurStuff();
		BdApi.clearCSS(this.getShortName());
	}

	isNSFWChannel() {
		if (!document.querySelector('.chat')) return false;
		let channel = this.ChannelStore.getChannel(this.SelectedChannelStore.getChannelId());
		return channel.isNSFW();
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

		if ((elem.find("img").length || elem.find("video").length) && elem.parents(".messages.scroller").length) {
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

