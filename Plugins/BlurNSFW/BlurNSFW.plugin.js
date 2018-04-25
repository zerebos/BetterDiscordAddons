//META{"name":"BlurNSFW"}*//

/* global DiscordModules:false, PluginUtilities:false, InternalUtilities:false, BdApi:false */

class BlurNSFW {
	getName() { return "BlurNSFW"; }
	getShortName() { return "bnsfw"; }
	getDescription() { return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.2.0"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
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
		this.cancels = [];
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

		let SelectedChannelStore = DiscordModules.SelectedChannelStore;
		let ChannelStore = DiscordModules.ChannelStore;
		let ReactDOM = DiscordModules.ReactDOM;
		let InlineMediaWrapper = InternalUtilities.WebpackModules.findByUniqueProperties(['ImageReadyStates']).default;

		let blurAccessory = (data) => {
			let channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
			if (!channel.isNSFW()) return;
			let element = ReactDOM.findDOMNode(data.thisObject);
			let mediaElement = element.querySelector("img") || element.querySelector("video");
			if (!mediaElement) return;

			mediaElement.classList.add("blur");
			
			if (mediaElement.tagName !== "VIDEO") return;
			mediaElement.addEventListener("play", () => {
				if (mediaElement.autoplay) return;
				mediaElement.classList.remove("blur");
			});
			mediaElement.addEventListener("pause", () => {
				if (mediaElement.autoplay) return;
				mediaElement.classList.add("blur");
			});
		};
		
		this.cancels.push(InternalUtilities.monkeyPatch(InlineMediaWrapper.prototype, "componentDidMount", {instead: blurAccessory}));
		this.cancels.push(InternalUtilities.monkeyPatch(InlineMediaWrapper.prototype, "componentDidUpdate", {instead: blurAccessory}));
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}

	stop() {
		for (let cancel of this.cancels) cancel();
		BdApi.clearCSS(this.getShortName());
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

