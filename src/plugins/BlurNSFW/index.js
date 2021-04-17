
module.exports = (Plugin, Api) => {
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