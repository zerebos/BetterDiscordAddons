//META{"name":"SendButton","displayName":"SendButton","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/SendButton","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/SendButton/SendButton.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject('WScript.Shell');
	var fs = new ActiveXObject('Scripting.FileSystemObject');
	var pathPlugins = shell.ExpandEnvironmentStrings('%APPDATA%\\BetterDiscord\\plugins');
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup('It looks like you\'ve mistakenly tried to run me directly. \n(Don\'t do that!)', 0, 'I\'m a plugin for BetterDiscord', 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup('I\'m in the correct folder already.\nJust reload Discord with Ctrl+R.', 0, 'I\'m already installed', 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup('I can\'t find the BetterDiscord plugins folder.\nAre you sure it\'s even installed?', 0, 'Can\'t install myself', 0x10);
	} else if (shell.Popup('Should I copy myself to BetterDiscord\'s plugins folder for you?', 0, 'Do you need some help?', 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec('explorer ' + pathPlugins);
		shell.Popup('I\'m installed!\nJust reload Discord with Ctrl+R.', 0, 'Successfully installed', 0x40);
	}
	WScript.Quit();

@else@*/

var SendButton = (() => {
    const config = {"info":{"name":"SendButton","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.1","description":"Adds a clickable send button. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/SendButton","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/SendButton/SendButton.plugin.js"},"changelog":[{"title":"New Stuff","items":["Move to using only the local library."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
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
/*@end@*/