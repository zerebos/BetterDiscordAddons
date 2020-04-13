/**
 * @name ImageToClipboard
 * @invite TyFxKer
 * @authorLink https://twitter.com/ZackRauen
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
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

var ImageToClipboard = (() => {
    const config = {info:{name:"ImageToClipboard",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.3.4",description:"Copies images (png/jpg) directly to clipboard.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js"},defaultConfig:[{type:"switch",id:"typing",name:"Typing",note:"Toggles colorizing of typing notifications.",value:true}],strings:{es:{contextMenuLabel:"Copiar Imagen",modalLabel:"Copiar Original",copySuccess:"Imagen copiada al portapapeles.",copyFailed:"Hubo un problema al copiar la imagen.",invalidType:"No se puede copiar este tipo de imagen.",settings:{typing:{name:"No estoy Typing",note:"Doesn't colorize caca."}}},pt:{contextMenuLabel:"Copiar imagem",modalLabel:"Copiar original",copySuccess:"Imagem copiada para a área de transferência",copyFailed:"Houve um problema ao copiar a imagem",invalidType:"Não é possível copiar este tipo de imagem"},de:{contextMenuLabel:"Kopiere das Bild",modalLabel:"Original Kopieren",copySuccess:"Bild in die Zwischenablage kopiert.",copyFailed:"Beim Kopieren des Bildes ist ein Problem aufgetreten.",invalidType:"Dieser Bildtyp kann nicht kopiert werden"},en:{contextMenuLabel:"Copy Image",modalLabel:"Copy Original",copySuccess:"Image copied to clipboard.",copyFailed:"There was an issue copying the image.",invalidType:"Cannot copy this image type.",settings:{typing:{name:"Not Typing",note:"Doesn't colorize shit."}}}},changelog:[{title:"Fixes",type:"fixed",items:["It works again!","Won't make you think it copied when it didn't.","Won't tell you that it's BlurNSFW when it's not."]},{title:"Improved",type:"improved",items:["Both the context menu and image preview buttons will show as disabled for unsupported image types.","Attempting to copy invalid types will give you a warning."]}],main:"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
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
            PluginUtilities.addStyle(this.getName(), Utilities.formatString(`.{{downloadLink}}.link-disabled {
    opacity: 0.3;
    cursor: not-allowed;
}`, {downloadLink: DLClasses.downloadLink.split(" ").join(".")}));

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
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/