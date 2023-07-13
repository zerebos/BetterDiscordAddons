/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
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
            this.contextMenuPatch1?.();
            this.contextMenuPatch2?.();
            this.contextMenuPatch3?.();
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

        patchUserContextMenu() {
            this.contextMenuPatch1 = ContextMenu.patch("user-context", (retVal, props) => {
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

        patchChannelContextMenu() {
            this.contextMenuPatch2 = ContextMenu.patch("channel-context", (retVal, props) => {
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

        patchGroupContextMenu() {
            this.contextMenuPatch3 = ContextMenu.patch("gdm-context", (retVal, props) => {
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
