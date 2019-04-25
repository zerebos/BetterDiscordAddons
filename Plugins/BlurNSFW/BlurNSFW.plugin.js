//META{"name":"BlurNSFW","displayName":"BlurNSFW","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

var BlurNSFW = (() => {
    const config = {"info":{"name":"BlurNSFW","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.2.3","description":"Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["No longer spams errors when you go to the store page."]}],"main":"index.js"};

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
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities} = Api;

    const SelectedChannelStore = DiscordModules.SelectedChannelStore;
    const ChannelStore = DiscordModules.ChannelStore;
    const ReactDOM = DiscordModules.ReactDOM;
    const InlineMediaWrapper = WebpackModules.getByProps("ImageReadyStates").default;

    return class BlurNSFW extends Plugin {
        constructor() {
            super();
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
        }

        onStart() {
            PluginUtilities.addStyle(this.getName(), this.style);  
            const blurAccessory = (thisObject) => {
                const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
                if (!channel || !channel.isNSFW || !channel.isNSFW()) return;
                const element = ReactDOM.findDOMNode(thisObject);
                const mediaElement = element.querySelector("img") || element.querySelector("video");
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
            
            Patcher.after(InlineMediaWrapper.prototype, "componentDidMount", blurAccessory);
            Patcher.after(InlineMediaWrapper.prototype, "componentDidUpdate", blurAccessory);
        }
        
        onStop() {
            Patcher.unpatchAll();
            PluginUtilities.removeStyle(this.getName());
        }

        getSettingsPanel() {
            var panel = $("<form>").addClass("form").css("width", "100%");
            var header = $("<div class=\"formNotice-2tZsrh margin-bottom-20 padded card-3DrRmC\">");
            var headerText = $("<div class=\"default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn\">");
            headerText.html("To update the blur amount change the css variable <span style='font-family: monospace;'>--blur-nsfw</span> to something like <span style='font-family: monospace;'>20px</span>. <br> You can also change the tranistion time by changing <span style='font-family: monospace;'>--blur-nsfw-time</span> to something like <span style='font-family: monospace;'>500ms</span>");
            headerText.css("line-height", "150%");
            headerText.appendTo(header);
            header.appendTo(panel);
            return panel[0];
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/