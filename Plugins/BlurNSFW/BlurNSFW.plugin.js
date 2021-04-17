/**
 * @name BlurNSFW
 * @version 0.2.5
 * @authorLink https://twitter.com/IAmZerebos
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
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

module.exports = (() => {
    const config = {info:{name:"BlurNSFW",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.2.5",description:"Blurs images in NSFW channels until you hover over it.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js"},changelog:[{title:"New Option",items:["An option to stop blurring a picture when clicking on it/expanding it was added to settings."]}],defaultConfig:[{type:"slider",id:"blurSize",name:"Blur Size",note:"The size (in px) of the blurred pixels.",value:10,min:0,max:50,units:"px"},{type:"slider",id:"blurTime",name:"Blur Time",note:"The time (in ms) it takes for the blur to disappear and reappear.",value:200,min:0,max:5000,units:"ms"},{type:"switch",id:"blurOnFocus",name:"Blur When Focused",note:"This setting keeps the blur when clicking on/expanding an image.",value:true}],main:"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities, Utilities} = Api;

    const SelectedChannelStore = DiscordModules.SelectedChannelStore;
    const ChannelStore = DiscordModules.ChannelStore;
    const ReactDOM = DiscordModules.ReactDOM;
    const InlineMediaWrapper = WebpackModules.getByProps("ImageReadyStates").default;

    return class BlurNSFW extends Plugin {
        constructor() {
            super();
            this.styleTemplate = `
            {{blurOnFocus}}
            img.blur:hover,
            video.blur:hover {
                transition: {{time}}ms cubic-bezier(.2, .11, 0, 1) !important;
                filter: blur(0px) !important;
            }
            
            img.blur,
            video.blur {
                filter: blur({{size}}px) !important;
                transition: {{time}}ms cubic-bezier(.2, .11, 0, 1) !important;
            }`;
        }

        onStart() {
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

            this.addStyle();
        }
        
        onStop() {
            Patcher.unpatchAll();
            this.removeStyle();
        }

        addStyle() {
            const styleString = Utilities.formatString(this.styleTemplate, {
                size: Math.round(this.settings.blurSize),
                time: Math.round(this.settings.blurTime),
                blurOnFocus: this.settings.blurOnFocus ? "" : ".layer-2KE1M9 img.blur,"
            });
            PluginUtilities.addStyle(this.getName(), styleString);
        }

        removeStyle() {
            PluginUtilities.removeStyle(this.getName());
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(() => {
                this.removeStyle();
                this.addStyle();
            });
            return panel.getElement();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/