
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, Toasts, PluginUtilities, Utilities, DCM} = Api;

    const request = window.require("request");
    const fs = require("fs");
    const {clipboard, nativeImage} = require("electron");
    const path = require("path");
    const process = require("process");

    const ImageModal = WebpackModules.getModule(m => m.prototype && m.prototype.render && m.prototype.render.toString().includes("downloadLink"));
    const DownloadLink = WebpackModules.getModule(m => typeof m == "function" && m.toString && m.toString().includes("isSafeRedirect"));
    const DLClasses = WebpackModules.getByProps("downloadLink");

    return class ImageToClipboard extends Plugin {

        onStart() {
            PluginUtilities.addStyle(this.getName(), Utilities.formatString(require("styles.css"), {downloadLink: DLClasses.downloadLink.split(" ").join(".")}));
            this.patchImageModal();
            this.patchContextMenu();
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

        patchContextMenu() {
            const MediaContextGroup = WebpackModules.getModule(m => m.default && m.default.toString && m.default.toString().includes("copy-native-link"));
            Patcher.after(MediaContextGroup, "default", (_, [url], retVal) => {
                if (!this.isImage(url)) return;
                const isValid = this.isValid(url);
                retVal.push(DCM.buildMenuItem({label: this.strings.contextMenuLabel, disabled: !isValid, action: () => {
                    this.copyToClipboard(url);
                }}));
            });
        }

        patchImageModal() {
            Patcher.after(ImageModal.prototype, "render", (thisObject, args, returnValue) => {
                if (!returnValue) return returnValue;
                const image = thisObject.props.original;
                if (!this.isImage(image)) return;

                const isValid = this.isValid(image);
                const copyOriginal = DiscordModules.React.createElement(DownloadLink, {
                    className: DLClasses.downloadLink + (isValid ? "" : " link-disabled"),
                    title: this.strings.modalLabel,
                    target: "_blank",
                    rel: "noreferrer noopener",
                    href: image,
                    style: {right: "0"},
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isValid) return this.copyToClipboard(image);
                        Toasts.warning(this.strings.invalidType);
                    }
                }, this.strings.modalLabel);
                returnValue.props.children.push(copyOriginal);
            });
        }
    };
};