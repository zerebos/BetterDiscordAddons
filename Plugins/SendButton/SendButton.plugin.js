//META{"name":"SendButton","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/SendButton","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/SendButton/SendButton.plugin.js"}*//

/* global PluginUtilities:false, BdApi:false */

class SendButton {
	getName() { return "SendButton"; }
	getShortName() { return "SendButton"; }
	getDescription() { return "Adds a clickable send button"; }
	getVersion() { return "0.0.5"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.mainCSS = `/* Send Button Plugin */
.send-button {
	width: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	right: 12px;
	top: 8px;
}

.send-button img {
	opacity: 0.2;
	width: 100%;
	transition: all 200ms ease;
}

.send-button img:hover {
	cursor: pointer;
	opacity: 1;
	transform:scale(1.1);
}
`;
		
		this.buttonString = '<div class="send-button"><img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTIuMDEgMjFMMjMgMTIgMi4wMSAzIDIgMTBsMTUgMi0xNSAyeiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+">';
	}
	
	load() {}
	unload() {}
	
	addButton(elem) {
		if (elem.querySelector(".send-button")) return;
		var button = $(this.buttonString);
		$(elem).find(DiscordSelectors.Textarea.inner.toString()).append(button);
		$(elem).find('[class*="emojiButton-"]').css('margin-right', button.outerWidth() + 10);
		button.on("click", () => {
			var textarea = button.siblings('textarea');
			const press = new KeyboardEvent("keypress", { key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true });
			Object.defineProperties(press, {keyCode: {value: 13}, which: {value: 13}});
			textarea[0].dispatchEvent(press);
		});
	}
	
	start(){
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
		BdApi.injectCSS(this.getShortName(), this.mainCSS);
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		if (document.querySelector('form')) this.addButton(document.querySelector('form'));
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}
	
	stop(){
		BdApi.clearCSS(this.getShortName());
		$(".send-button").remove();
	}
	
	onSwitch() {
	}
	
	observer(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !this.initialized) return;
		if (e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner.toString())) {
			this.addButton(e.addedNodes[0]);
		}
	}
}