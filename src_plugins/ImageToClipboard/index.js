
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, Toasts} = Api;

    const request = window.require("request");
    const fs = require("fs");
    const {clipboard, nativeImage} = require("electron");
    const path = require("path");
    const process = require("process");

    const MediaContextGroup = WebpackModules.getModule(m => m.prototype && m.prototype.constructor && m.prototype.constructor.toString().includes("handleCopyLink"));
    const ContextMenuItem = WebpackModules.getByRegex(/.label\b.*\.hint\b.*\.action\b/);
    const ContextMenuActions = WebpackModules.getByProps("closeContextMenu");

    const ImageModal = WebpackModules.getModule(m => m.prototype && m.prototype.render && m.prototype.render.toString().includes("downloadLink"));
    const DownloadLink = WebpackModules.getModule(m => m.toString && m.toString().includes("isSafeRedirect"));
    const DLClasses = WebpackModules.getByProps("downloadLink");

    return class BlurNSFW extends Plugin {

        onStart() {
            Patcher.after(MediaContextGroup.prototype, "render", (thisObject, args, returnValue) => {
                if (!returnValue) return returnValue;
                returnValue.props.children.push(DiscordModules.React.createElement(ContextMenuItem, {
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        ContextMenuActions.closeContextMenu();
                        this.copyToClipboard(thisObject.props.href || thisObject.props.src);
                    }
                }));
            });

            Patcher.after(ImageModal.prototype, "render", (thisObject, args, returnValue) => {
                if (!returnValue) return returnValue;
                returnValue.props.children.push(DiscordModules.React.createElement("span", {
                    className: DLClasses.downloadLink,
                    style: {margin: "0 5px"}
                }, " | ")), returnValue.props.children.push(DiscordModules.React.createElement(DownloadLink, {
                    className: DLClasses.downloadLink,
                    title: this.strings.modalLabel,
                    target: "_blank",
                    rel: "noreferrer noopener",
                    href: thisObject.props.original,
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.copyToClipboard(thisObject.props.original);
                    }
                }, this.strings.modalLabel));
            });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

        copyToClipboard(url) {
            request({url: url, encoding: null}, (error, response, buffer) => {
                if (error) {
                    Toasts.error(this.strings.copyFailed, {type: "danger"});
                    return;
                }
                if (process.platform === "win32" || process.platform === "darwin") {
                    clipboard.write({image: nativeImage.createFromBuffer(buffer)});
                }
                else {
                        const file = path.join(process.env.HOME, "i2ctemp.png");
                        fs.writeFileSync(file, buffer, {encoding: null});
                        clipboard.write({image: file});
                        fs.unlinkSync(file);
                }
                Toasts.success(this.strings.copySuccess, {type: "success"});
            });
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }
    };
};