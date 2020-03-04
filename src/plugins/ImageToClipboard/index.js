
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, Toasts, PluginUtilities, Utilities} = Api;

    const request = window.require("request");
    const fs = require("fs");
    const {clipboard, nativeImage} = require("electron");
    const path = require("path");
    const process = require("process");

    const MediaContextGroup = WebpackModules.getByDisplayName("NativeLinkGroup");
    const ContextMenuItem = WebpackModules.getByRegex(/.label\b.*\.hint\b.*\.action\b/);
    const ContextMenuActions = WebpackModules.getByProps("closeContextMenu");

    const ImageModal = WebpackModules.getModule(m => m.prototype && m.prototype.render && m.prototype.render.toString().includes("downloadLink"));
    const DownloadLink = WebpackModules.getModule(m => typeof m == "function" && m.toString && m.toString().includes("isSafeRedirect"));
    const DLClasses = WebpackModules.getByProps("downloadLink");

    return class ImageToClipboard extends Plugin {

        onStart() {
            PluginUtilities.addStyle(this.getName(), Utilities.formatString(require("styles.css"), {downloadLink: DLClasses.downloadLink.split(" ").join(".")}));

            const index = WebpackModules.getIndexByModule(MediaContextGroup);
            const groupModule = WebpackModules.getByIndex(index);

            Patcher.after(groupModule, "default", (_, [props], returnValue) => {
                if (!returnValue) return returnValue;
                const image = props.href || props.src;
                if (!this.isImage(image)) return;
                const isValid = this.isValid(image);
                returnValue.props.children.push(DiscordModules.React.createElement(ContextMenuItem, {
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        ContextMenuActions.closeContextMenu();
                        this.copyToClipboard(props.href || props.src);
                    },
                    disabled: !isValid
                }));
            });

            Patcher.after(ImageModal.prototype, "render", (thisObject, args, returnValue) => {
                if (!returnValue) return returnValue;
                const image = thisObject.props.original;
                if (!this.isImage(image)) return;

                const components = returnValue.props.children;
                const openOriginal = components[components.length - 1];

                const separator = DiscordModules.React.createElement("span", {
                    className: DLClasses.downloadLink,
                    style: {margin: "0 5px"}
                }, " | ");

                const isValid = this.isValid(image);
                const copyOriginal = DiscordModules.React.createElement(DownloadLink, {
                    className: DLClasses.downloadLink + (isValid ? "" : " link-disabled"),
                    title: this.strings.modalLabel,
                    target: "_blank",
                    rel: "noreferrer noopener",
                    href: image,
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isValid) return this.copyToClipboard(image);
                        Toasts.warning(this.strings.invalidType);
                    }
                }, this.strings.modalLabel);

                const wrapper = DiscordModules.React.createElement("div", {
                    className: ""
                }, openOriginal, separator, copyOriginal);

                components[components.length - 1] = wrapper;
            });
        }

        onStop() {
            Patcher.unpatchAll();
            PluginUtilities.removeStyle(this.getName());
        }

        copyToClipboard(url) {
            request({url: url, encoding: null}, (error, response, buffer) => {
                if (error) return Toasts.error(this.strings.copyFailed);

                if (process.platform === "win32" || process.platform === "darwin") {
                    clipboard.write({image: nativeImage.createFromBuffer(buffer)});
                }
                else {
                        const file = path.join(process.env.HOME || process.env.USERPROFILE, "i2ctemp.png");
                        fs.writeFileSync(file, buffer, {encoding: null});
                        clipboard.write({image: file});
                        fs.unlinkSync(file);
                }
                Toasts.success(this.strings.copySuccess);
            });
        }

        isImage(url) {
            const file = DiscordModules.URLParser.parse(url).pathname.toLowerCase();
            return file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png") || file.endsWith(".gif") || file.endsWith(".apng") || file.endsWith(".webp");
        }

        isValid(url) {
            const file = DiscordModules.URLParser.parse(url).pathname.toLowerCase();
            return file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png");
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }
    };
};