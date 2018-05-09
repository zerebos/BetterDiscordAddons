//META{"name":"HideDisabledEmojis","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js"}*//

/* global PluginUtilities:false, InternalUtilities:false */

class HideDisabledEmojis {
	getName() { return "HideDisabledEmojis"; }
	getShortName() { return "hde"; }
	getDescription() { return "Hides disabled emojis from the emoji picker. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.2"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
        this.initialized = false;
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
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());

        let EmojiInfo = InternalUtilities.WebpackModules.findByUniqueProperties(['isEmojiDisabled']);
        let EmojiPicker = InternalUtilities.WebpackModules.findByDisplayName('EmojiPicker');
        Patcher.after(this.getName(), EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
            return returnValue || EmojiInfo.isEmojiDisabled(methodArguments[0], methodArguments[1]);
        });

        Patcher.before(this.getName(), EmojiPicker.prototype, "render", (thisObject) => {
            let cats = thisObject.categories;
            let filtered = thisObject.computeMetaData();
            let newcats = {};

            for (let c of filtered) newcats[c.category] ? newcats[c.category] += 1 : newcats[c.category] = 1;

            let i = 0;
            for (let cat of cats) {
                if (!newcats[cat.category]) cat.offsetTop = 999999;
                else {
                    cat.offsetTop = i * 32;
                    i += newcats[cat.category] + 1;
                }
                thisObject.categoryOffsets[cat.category] = cat.offsetTop;
            }

            cats.sort((a,b) => a.offsetTop - b.offsetTop);
        });

        PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
        this.initialized = true;
	}
	
    stop() {
       Patcher.unpatchAll(this.getName());
    }

}