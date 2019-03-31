
module.exports = (Plugin, Api) => {
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
                if (!channel.isNSFW()) return;
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