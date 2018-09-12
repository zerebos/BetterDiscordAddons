//META{"name":"BlurNSFW","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/BlurNSFW/BlurNSFW.plugin.js"}*//

/* global DiscordModules:false, PluginUtilities:false, InternalUtilities:false, BdApi:false */

class BlurNSFW {
	getName() { return "BlurNSFW"; }
	getShortName() { return "bnsfw"; }
	getDescription() { return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.3.0"; }
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
		this.defaults = {
			settings: {
				allChannels:	{value:false, 	description:"Blur in all channels, not just NSFW"},
			}
		};
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

	initialize() {
		this.initialized = true;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		BdApi.injectCSS(this.getShortName(), this.style);

		let SelectedChannelStore = DiscordModules.SelectedChannelStore;
		let ChannelStore = DiscordModules.ChannelStore;
		let ReactDOM = DiscordModules.ReactDOM;
		let InlineMediaWrapper = InternalUtilities.WebpackModules.findByUniqueProperties(['ImageReadyStates']).default;

		let blurAccessory = (thisObject) => {
			let channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
			if (!channel.isNSFW() && !this.settings.allChannels) return;
			let element = ReactDOM.findDOMNode(thisObject);
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
		
		Patcher.after(this.getName(), InlineMediaWrapper.prototype, "componentDidMount", blurAccessory);
		Patcher.after(this.getName(), InlineMediaWrapper.prototype, "componentDidUpdate", blurAccessory);
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.settings = BDFDB.getAllData(this, "settings");
	}

	stop() {
		Patcher.unpatchAll(this.getName());
		BdApi.clearCSS(this.getShortName());
	}

	getSettingsPanel() {
		console.log("Starting settings load");
		if (typeof BDFDB !== "object") return;
		var settings = BDFDB.getAllData(this, "settings"); 
		var settingshtml = `<div class="${this.getName()}-settings DevilBro-settings"><div class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.size18 + BDFDB.disCNS.height24 + BDFDB.disCNS.weightnormal + BDFDB.disCN.marginbottom8}">${this.getName()}</div><div class="DevilBro-settings-inner">`;
		for (let key in settings) {
			settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">${this.defaults.settings[key].description}</h3><div class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.switchenabled + BDFDB.disCNS.switch + BDFDB.disCNS.switchvalue + BDFDB.disCNS.switchsizedefault + BDFDB.disCNS.switchsize + BDFDB.disCN.switchthemedefault}" style="flex: 0 0 auto;"><input type="checkbox" value="${key}" class="${BDFDB.disCNS.switchinnerenabled + BDFDB.disCN.switchinner}"${settings[key] ? " checked" : ""}></div></div>`;
		}
		settingshtml += `</div></div>`;
		
		var settingspanel = $(settingshtml)[0];

		BDFDB.initElements(settingspanel);

		$(settingspanel)
			.on("click", BDFDB.dotCN.switchinner, () => {this.updateSettings(settingspanel);})
		
		//var panel = $("<form>").addClass("form").css("width", "100%");
		var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded card-3DrRmC">');
		var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">');
		headerText.html("To update the blur amount change the css variable <span style='font-family: monospace;'>--blur-nsfw</span> to something like <span style='font-family: monospace;'>20px</span>. <br> You can also change the tranistion time by changing <span style='font-family: monospace;'>--blur-nsfw-time</span> to something like <span style='font-family: monospace;'>500ms</span>");
		headerText.css("line-height", "150%");
		headerText.appendTo(header);
		header.appendTo(settingspanel);

		return settingspanel;
	}

	updateSettings (settingspanel) {
		this.settings = {};
		for (var input of settingspanel.querySelectorAll(BDFDB.dotCN.switchinner)) {
			settings[input.value] = input.checked;
		}
		BDFDB.saveAllData(this.settings, this, "settings");
	}
}

