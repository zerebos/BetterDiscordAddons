//META{"name":"AutoPlayGifs"}*//

/* global PluginUtilities:false, InternalUtilities:false, PluginSettings:false */

class AutoPlayGifs {
	getName() { return "AutoPlayGifs"; }
	getShortName() { return "AutoPlayGifs"; }
	getDescription() { return "Automatically plays avatars, GIFs and GIFVs. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.settings = {avatars: true, gifs: true, gifvs: true};
		this.cancelAvatars = () => {};
		this.cancelGIFs = () => {};
		this.cancelGIFVs = () => {};
	}
	
	load(){}
	unload(){}

	loadSettings() {this.settings = PluginUtilities.loadSettings(this.getName(), this.settings);}
	saveSettings() {PluginUtilities.saveSettings(this.getName(), this.settings);}
	
	start(){
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

	stop() {
		this.cancelAvatars();
		this.cancelGIFs();
		this.cancelGIFVs();
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.loadSettings();

		if (this.settings.avatars) this.patchAvatars();
		if (this.settings.gifs) this.patchGIFs();
		if (this.settings.gifvs) this.patchGIFVs();
		
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;
	}

	patchAvatars() {
		let MessageGroup = InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/hasAnimatedAvatar/));
		this.cancelAvatars = InternalUtilities.monkeyPatch(MessageGroup.prototype, "render", {before: ({thisObject}) => {
			thisObject.state.animate = true;
		}});
	}

	patchGIFs() {
		let ImageComponent = InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byPrototypeFields(['getSrc']));
		ImageComponent.defaultProps.autoPlay = true;
		this.cancelGIFs = () => {ImageComponent.defaultProps.autoPlay = false;};
	}

	patchGIFVs() {
		let ReactDOM = InternalUtilities.WebpackModules.findByUniqueProperties(['findDOMNode']);
		let EmbedComponents = InternalUtilities.WebpackModules.findByUniqueProperties(['EmbedGIFV']);
		EmbedComponents.EmbedGIFV.prototype.componentDidMount = function() {
			let wrapper = ReactDOM.findDOMNode(this);
			if (!wrapper) return;
			let video = wrapper.querySelector('video');
			if (!video) return;
			video.addEventListener('mouseout', (e) => {e.stopPropagation();});
			video.play();
		};
		this.cancelGIFVs = () => {delete EmbedComponents.EmbedGIFV.prototype.componentDidMount;};
	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}

	generateSettings(panel) {
		
		new PluginSettings.ControlGroup("Plugin Settings", () => {this.saveSettings();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.Checkbox("Autoplay Avatars", "Autoplays avatars in the chat area for Nitro users.",
								this.settings.avatars, (checked) => {
									this.settings.avatars = checked;
									if (checked) this.patchAvatars();
									else this.cancelAvatars();
								}),
			new PluginSettings.Checkbox("Autoplay GIFs", "Autoplays GIFs in the chat area.",
								this.settings.gifs, (checked) => {
									this.settings.gifs = checked;
									if (checked) this.patchGIFs();
									else this.cancelGIFs();
								}),
			new PluginSettings.Checkbox("Autoplay GIFVs", "Autoplays GIFVs in the chat area.",
								this.settings.gifvs, (checked) => {
									this.settings.gifvs = checked;
									if (checked) this.patchGIFVs();
									else this.cancelGIFVs();
								})
		);
	}
}