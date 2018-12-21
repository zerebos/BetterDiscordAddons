//META{"name":"ImageToClipboard","displayName":"ImageToClipboard","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js"}*//

var ImageToClipboard = (() => {
    const config = {"info":{"name":"ImageToClipboard","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.3.2","description":"Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js"},"defaultConfig":[{"type":"switch","id":"typing","name":"Typing","note":"Toggles colorizing of typing notifications.","value":true}],"strings":{"es":{"contextMenuLabel":"Copiar Imagen","modalLabel":"Copiar Original","copySuccess":"Imagen copiada al portapapeles.","copyFailed":"Hubo un problema al copiar la imagen.","settings":{"typing":{"name":"No estoy Typing","note":"Doesn't colorize caca."}}},"pt":{"contextMenuLabel":"Copiar imagem","modalLabel":"Copiar original","copySuccess":"Imagem copiada para a área de transferência","copyFailed":"Houve um problema ao copiar a imagem"},"de":{"contextMenuLabel":"Kopiere das Bild","modalLabel":"Original Kopieren","copySuccess":"Bild in die Zwischenablage kopiert.","copyFailed":"Beim Kopieren des Bildes ist ein Problem aufgetreten."},"en":{"contextMenuLabel":"Copy Image","modalLabel":"Copy Original","copySuccess":"Image copied to clipboard.","copyFailed":"There was an issue copying the image.","settings":{"typing":{"name":"Not Typing","note":"Doesn't colorize shit."}}}},"changelog":[{"title":"Internal Changes","type":"improved","items":["Use the more stable local library."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
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
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();