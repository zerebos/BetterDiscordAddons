//META{"name":"SendButton","displayName":"SendButton","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/SendButton","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/SendButton/SendButton.plugin.js"}*//

var SendButton = (() => {
    const config = {"info":{"name":"SendButton","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.1","description":"Adds a clickable send button. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/SendButton","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/SendButton/SendButton.plugin.js"},"changelog":[{"title":"New Stuff","items":["Move to using only the local library."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const css = `.send-button {
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
}`;
    const buttonHTML = `<div class="send-button">
    <img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTIuMDEgMjFMMjMgMTIgMi4wMSAzIDIgMTBsMTUgMi0xNSAyeiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+">
</div>`;
    const {DiscordSelectors, PluginUtilities, DOMTools} = Api;
    return class SendButton extends Plugin {
        onStart() {
            PluginUtilities.addStyle(this.getName(), css);
            if (document.querySelector("form")) this.addButton(document.querySelector("form"));
        }
        
        onStop() {
            const button = document.querySelector(".send-button");
            if (button) button.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addButton(elem) {
            if (elem.querySelector(".send-button")) return;
            const button = DOMTools.createElement(buttonHTML);
            elem.querySelector(DiscordSelectors.Textarea.inner).append(button);
            if (elem.querySelector("[class*=\"emojiButton-\"]")) elem.querySelector("[class*=\"emojiButton-\"]").css("margin-right", (button.outerWidth() + 10) + "px");
            button.on("click", () => {
                const textarea = button.siblings("textarea")[0];
                const press = new KeyboardEvent("keypress", {key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true});
                Object.defineProperties(press, {keyCode: {value: 13}, which: {value: 13}});
                textarea.dispatchEvent(press);
            });
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            if (e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner)) {
                this.addButton(e.addedNodes[0]);
            }
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();