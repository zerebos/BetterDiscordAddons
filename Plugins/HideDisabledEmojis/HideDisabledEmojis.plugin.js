//META{"name":"HideDisabledEmojis"}*//

/* global PluginUtilities:false, InternalUtilities:false */

class HideDisabledEmojis {
	getName() { return "HideDisabledEmojis"; }
	getShortName() { return "hde"; }
	getDescription() { return "Hides disabled emojis from the emoji picker. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
        this.initialized = false;
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
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());

        let EmojiInfo = InternalUtilities.WebpackModules.findByUniqueProperties(['isEmojiDisabled']);
        let EmojiPicker = InternalUtilities.WebpackModules.findByDisplayName('EmojiPicker');
        this.cancels.push(InternalUtilities.monkeyPatch(EmojiInfo, "isEmojiFiltered", {after: (data) => {
            data.returnValue = data.returnValue || EmojiInfo.isEmojiDisabled(data.methodArguments[0], data.methodArguments[1]);
        }}));

        this.cancels.push(InternalUtilities.monkeyPatch(EmojiPicker.prototype, "render", {before: (data) => {
            let cats = data.thisObject.categories;
            let filtered = data.thisObject.computeMetaData();
            let newcats = {};

            for (let c of filtered) newcats[c.category] ? newcats[c.category] += 1 : newcats[c.category] = 1;

            let i = 0;
            for (let cat of cats) {
                if (!newcats[cat.category]) cat.offsetTop = 999999;
                else {
                    cat.offsetTop = i == 0 ? i * 32 : (i + 1) * 32;
                    i += newcats[cat.category] + 1;
                }
                data.thisObject.categoryOffsets[cat.category] = cat.offsetTop;
            }

            cats.sort((a,b) => a.offsetTop - b.offsetTop);
        }}));

        PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
        this.initialized = true;
	}
	
    stop() {
       for (let cancel of this.cancels) cancel();
    }

}