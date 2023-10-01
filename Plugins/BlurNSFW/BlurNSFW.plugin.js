/**
 * @name BlurNSFW
 * @description Blurs images and videos until you hover over them.
 * @version 1.0.3
 * @author Zerebos
 * @authorId 249746236008169473
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
        version: "1.0.3",
        description: "Blurs images and videos until you hover over them.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BlurNSFW",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BlurNSFW/BlurNSFW.plugin.js"
    },
    changelog: [
        {
            title: "What's New?",
            type: "fixed",
            items: [
                "Account switching no longer causes crashes.",
                "Blur/unblur status should be remembered better between reloads."
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
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {ContextMenu, DOM, Webpack, Patcher} = window.BdApi;

    const SelectedChannelStore = Webpack.getModule(m => m.getCurrentlySelectedChannelId);
    const ChannelStore = Webpack.getModule(m => m.getDMFromUserId);
    const InlineMediaWrapper = Webpack.getModule(m => m.toString().includes("renderAccessory"));
    const WrapperClasses = Webpack.getModule(m => m.wrapperPlaying);
    const Events = require("events");
    const Dispatcher = new Events();

    const formatString = (string, values) => {
        for (const val in values) {
            let replacement = values[val];
            if (Array.isArray(replacement)) replacement = JSON.stringify(replacement);
            if (typeof(replacement) === "object" && replacement !== null) replacement = replacement.toString();
            string = string.replace(new RegExp(`{{${val}}}`, "g"), replacement);
        }
        return string;
    };

    /* globals BdApi:false */
    return class BlurMedia extends Plugin {
        constructor(meta) {
            super();
            this.meta = meta;
            this.styleTemplate = `
            {{blurOnFocus}}
            .${WrapperClasses.wrapperPlaying.split(" ").join(".")} video,
            .${WrapperClasses.wrapperControlsHidden.split(" ").join(".")} video,
            .blur:hover img,
            .blur:hover video,
            a:hover + div > .blur {
                transition: {{time}}ms cubic-bezier(.2, .11, 0, 1) !important;
                filter: blur(0px) !important;
            }
            
            .blur img,
            .blur video {
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

            Patcher.after(this.meta.name, InlineMediaWrapper.prototype, "render", (thisObject, _, retVal) => {
                const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
                if (!this.hasBlur(channel)) return;
                if (retVal.props.className) retVal.props.className = retVal.props.className + " blur";
                else retVal.props.className = "blur";
            });

            Patcher.after(this.meta.name, InlineMediaWrapper.prototype, "componentDidMount", (thisObject) => {
                if (thisObject.cancelBlurListener) return;
                const listener = () => thisObject.forceUpdate();
                Dispatcher.on("blur", listener);
                thisObject.cancelBlurListener = () => Dispatcher.off("blur", listener);
            });

            Patcher.after(this.meta.name, InlineMediaWrapper.prototype, "componentWillUnmount", (thisObject) => {
                if (!thisObject.cancelBlurListener) return;
                thisObject.cancelBlurListener();
                delete thisObject.cancelBlurListener;
            });

            this.addStyle();

            SelectedChannelStore.addChangeListener(this.channelChange);

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchChannelContextMenu();
        }
        
        onStop() {
            BdApi.saveData(this.meta.name, "blurred", this.blurredChannels);
            BdApi.saveData(this.meta.name, "seen", this.seenChannels);
            this.contextMenuPatch?.();
            this.removeStyle();
            SelectedChannelStore.removeChangeListener(this.channelChange);
        }

        hasBlur(channel) {
            return this.blurredChannels.has(channel.id);
        }

        addBlur(channel) {
            this.blurredChannels.add(channel.id);
            Dispatcher.emit("blur");
            BdApi.saveData(this.meta.name, "blurred", this.blurredChannels);
        }

        removeBlur(channel) {
            this.blurredChannels.delete(channel.id);
            Dispatcher.emit("blur");
            BdApi.saveData(this.meta.name, "blurred", this.blurredChannels);
        }

        channelChange() {
            const channel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
            if (!channel?.id || this.seenChannels.has(channel.id)) return;

            this.seenChannels.add(channel.id);
            BdApi.saveData(this.meta.name, "seen", this.seenChannels);
            if (this.settings.blurNSFW && channel.nsfw) this.addBlur(channel);
        }

        patchChannelContextMenu() {
            this.contextMenuPatch = ContextMenu.patch("channel-context", (retVal, props) => {
                const newItem = ContextMenu.buildItem({
                    type: "toggle",
                    label: "Blur Media",
                    active: this.hasBlur(props.channel),
                    action: () => {
                        if (this.hasBlur(props.channel)) this.removeBlur(props.channel);
                        else this.addBlur(props.channel);
                    }
                });

                retVal.props.children.splice(1, 0, newItem);
            });
        }

        addStyle() {
            const styleString = formatString(this.styleTemplate, {
                size: Math.round(this.settings.blurSize),
                time: Math.round(this.settings.blurTime),
                blurOnFocus: this.settings.blurOnFocus ? "" : ".layer-1Ixpg3 .blur img,"
            });
            DOM.addStyle(this.meta.name, styleString);
        }

        removeStyle() {
            DOM.removeStyle(this.meta.name);
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