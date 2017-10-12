//META{"name":"SendButton"}*//

/* global PluginUtilities:false, BdApi:false */

class SendButton {
	getName() { return "SendButton"; }
	getShortName() { return "SendButton"; }
	getDescription() { return "Adds a clickable send button"; }
	getVersion() { return "0.0.2"; }
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
        $(elem).find('[class*="innerEnabled"]').append(button);
        $(elem).find('.emojiButton-3c_qrT').css('margin-right', button.outerWidth() + 10);
		button.on("click", () => {
            var textarea = button.siblings('textarea');
            var options = { key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true };
            var down = new KeyboardEvent("keydown", options);
            Object.defineProperty(down, "keyCode", {value: 13});
            Object.defineProperty(down, "which", {value: 13});
            var press = new KeyboardEvent("keypress", options);
            Object.defineProperty(press, "keyCode", {value: 13});
            Object.defineProperty(press, "which", {value: 13});
            textarea[0].dispatchEvent(down);
            textarea[0].dispatchEvent(press);
        });
	}
	
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
    
    initialize() {
        this.initialized = true;
        BdApi.injectCSS(this.getShortName(), this.mainCSS);
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
        this.addButton(document.querySelector('form'));
    }
	
	stop(){
		BdApi.clearCSS(this.getShortName());
        $(".send-button").remove();
	}
	
	onSwitch() {
	}
	
	observer(e) {
        if (!e.addedNodes.length | !(e.addedNodes[0] instanceof Element)) return;
        if (e.addedNodes[0].querySelector('[class*="innerEnabled"]') && this.initialized) {
            this.addButton(e.addedNodes[0]);
        }
    }
}