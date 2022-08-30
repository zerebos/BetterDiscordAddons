/**
 * @name BlurNSFW
 * @description Blurs images and videos until you hover over them.
 * @version 1.0.0
 * @author Zerebos
 * @authorId 249746236008169473
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js
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
const config = {
    info: {
        name: "BlurNSFW",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "1.0.0",
        description: "Blurs images and videos until you hover over them.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js"
    },
    changelog: [
        {
            title: "What's New?",
            items: [
                "You can now blur *any* channel you want using the context menu!",
                "You can now also unblur specific NSFW channels!",
                "There is an options to change that functionality in plugin settings!"
            ]
        }
    ],
    defaultConfig: [
        {
            type: "switch",
            id: "blurNSFW",
            name: "Blur NSFW Channels",
            note: "This setting automatically blurs media in channels marked NSFW.",
            value: true
        },
        {
            type: "slider",
            id: "blurSize",
            name: "Blur Size",
            note: "The size (in px) of the blurred pixels.",
            value: 10,
            min: 0,
            max: 50,
            units: "px"
        },
        {
            type: "slider",
            id: "blurTime",
            name: "Blur Time",
            note: "The time (in ms) it takes for the blur to disappear and reappear.",
            value: 200,
            min: 0,
            max: 5000,
            units: "ms"
        },
        {
            type: "switch",
            id: "blurOnFocus",
            name: "Blur When Focused",
            note: "This setting keeps the blur when clicking on/expanding an image.",
            value: true
        }
    ],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities, Utilities, DCM} = Api;

    const SelectedChannelStore = DiscordModules.SelectedChannelStore;
    const ChannelStore = DiscordModules.ChannelStore;
    const ReactDOM = DiscordModules.ReactDOM;
    const InlineMediaWrapper = WebpackModules.getByProps("ImageReadyStates").default;
    const MenuSeparator = WebpackModules.getByProps("MenuSeparator").MenuSeparator;
    const Events = require("events");
    const Dispatcher = new Events();

    /* globals BdApi:false */
    return class BlurMedia extends Plugin {
        constructor(meta) {
            super();
            this.meta = meta;
            this.styleTemplate = `
            {{blurOnFocus}}
            img.blur:hover,
            video.blur:hover,
            a:hover + div > .blur {
                transition: {{time}}ms cubic-bezier(.2, .11, 0, 1) !important;
                filter: blur(0px) !important;
            }
            
            img.blur,
            video.blur {
                filter: blur({{size}}px) !important;
                transition: {{time}}ms cubic-bezier(.2, .11, 0, 1) !important;
            }`;

            this.channelChange = this.channelChange.bind(this);
        }

        onStart() {
            /** @type {Set<string>} */
            this.blurredChannels = new Set(BdApi.loadData(this.meta.name, "blurred") ?? []);

            /** @type {Set<string>} */
            this.seenChannels = new Set(BdApi.loadData(this.meta.name, "seen") ?? []);
            const blurAccessory = (thisObject) => {
                const element = ReactDOM.findDOMNode(thisObject);
                const mediaElement = element.querySelector("img") || element.querySelector("video");
                if (!mediaElement) return;
    
                Dispatcher.addListener("blur", thisObject.forceUpdate.bind(thisObject));
                const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
                if (this.hasBlur(channel)) mediaElement.classList.add("blur");
                else mediaElement.classList.remove("blur");
                
                if (mediaElement.tagName !== "VIDEO") return;
                mediaElement.addEventListener("play", () => {
                    if (mediaElement.autoplay) return;
                    mediaElement.classList.remove("blur");
                });
                mediaElement.addEventListener("pause", () => {
                    if (mediaElement.autoplay) return;
                    if (this.hasBlur(channel)) mediaElement.classList.add("blur");
                });
            };
            
            Patcher.after(InlineMediaWrapper.prototype, "componentDidMount", blurAccessory);
            Patcher.after(InlineMediaWrapper.prototype, "componentDidUpdate", blurAccessory);

            this.addStyle();

            SelectedChannelStore.addChangeListener(this.channelChange);

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchChannelContextMenu();
        }
        
        onStop() {
            BdApi.saveData(this.meta.name, "blurred", this.blurredChannels);
            BdApi.saveData(this.meta.name, "sen", this.seenChannels);
            Patcher.unpatchAll();
            this.removeStyle();
            SelectedChannelStore.removeChangeListener(this.channelChange);
        }

        hasBlur(channel) {
            return this.blurredChannels.has(channel.id);
        }

        addBlur(channel) {
            this.blurredChannels.add(channel.id);
            Dispatcher.emit("blur");
        }

        removeBlur(channel) {
            this.blurredChannels.delete(channel.id);
            Dispatcher.emit("blur");
        }

        channelChange() {
            Dispatcher.removeAllListeners();
            const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
            if (this.seenChannels.has(channel.id)) return;

            this.seenChannels.add(channel.id);
            if (this.settings.blurNSFW && channel.nsfw) this.addBlur(channel);
        }

        async patchChannelContextMenu() {
            const MarkReadItem = await DCM.getDiscordMenu("useChannelMarkAsReadItem");
            if (this.promises.state.cancelled) return;

            Patcher.after(MarkReadItem, "default", (_, [channel], original) => {
                const newOne = DCM.buildMenuItem({
                    type: "toggle",
                    label: "Blur Media",
                    active: this.hasBlur(channel),
                    action: () => {
                        if (this.hasBlur(channel)) this.removeBlur(channel);
                        else this.addBlur(channel);
                    }
                });

                if (Array.isArray(original)) {
                    const separatorIndex = original.findIndex(k => !k?.props?.label);
                    const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                    original.splice(insertIndex, 0, newOne);
                    return original;
                }

                return [
                    original,
                    DiscordModules.React.createElement(MenuSeparator),
                    newOne,
                ];
            });
        }

        addStyle() {
            const styleString = Utilities.formatString(this.styleTemplate, {
                size: Math.round(this.settings.blurSize),
                time: Math.round(this.settings.blurTime),
                blurOnFocus: this.settings.blurOnFocus ? "" : ".layer-1Ixpg3 img.blur,"
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
/*@end@*/