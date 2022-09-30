/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
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