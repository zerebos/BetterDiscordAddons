//META{"name":"ImageToClipboard","displayName":"ImageToClipboard","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js"}*//

var ImageToClipboard = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"ImageToClipboard","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.3.1","description":"Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ImageToClipboard","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ImageToClipboard/ImageToClipboard.plugin.js"},"strings":{"es":{"contextMenuLabel":"Copiar Imagen","modalLabel":"Copiar Original","copySuccess":"Imagen copiada al portapapeles.","copyFailed":"Hubo un problema al copiar la imagen."},"pt":{"contextMenuLabel":"Copiar imagem","modalLabel":"Copiar original","copySuccess":"Imagem copiada para a área de transferência","copyFailed":"Houve um problema ao copiar a imagem"},"de":{"contextMenuLabel":"Kopiere das Bild","modalLabel":"Original Kopieren","copySuccess":"Bild in die Zwischenablage kopiert.","copyFailed":"Beim Kopieren des Bildes ist ein Problem aufgetreten."},"en":{"contextMenuLabel":"Copy Image","modalLabel":"Copy Original","copySuccess":"Image copied to clipboard.","copyFailed":"There was an issue copying the image."}},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Add separator in image modals."]},{"title":"Internal Changes","type":"improved","items":["Change how string localization is handled."]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
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
            Patcher.after(MediaContextGroup.prototype, "render", (t,a,r) => {
                if (r) r.props.children.push(DiscordModules.React.createElement(ContextMenuItem, {
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        ContextMenuActions.closeContextMenu();
                        this.copyToClipboard(t.props.href || t.props.src);
                    }
                }));
            });

            Patcher.after(ImageModal.prototype, "render", (t,a,r) => {
                if (r) r.props.children.push(DiscordModules.React.createElement("span", {
                            className: DLClasses.downloadLink,
                            style: {margin: "0 5px"}
                        }, " | ")), r.props.children.push(DiscordModules.React.createElement(DownloadLink, {
                            className: DLClasses.downloadLink,
                            title: this.strings.modalLabel,
                            target: "_blank",
                            rel: "noreferrer noopener",
                            href: t.props.original,
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.copyToClipboard(t.props.original);
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
                        const file = path.join(process.env["HOME"], "i2ctemp.png");
                        fs.writeFileSync(file, buffer, {encoding: null});
                        clipboard.write({image: file});
                        fs.unlinkSync(file);
                }
                Toasts.success(this.strings.copySuccess, {type: "success"});
            });
        }
    };
};
		return plugin(Plugin, Api);
	};
	
	return !global.ZLibrary ? class {
		getName() {return config.info.name.replace(" ", "");} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;} stop() {}
		showAlert() {window.mainCore.alert("Loading Error",`Something went wrong trying to load the library for the plugin. Try reloading?`);}
		async load() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			const vm = require("vm"), plugin = compilePlugin(global.ZLibrary.buildPlugin(config));
			try {new vm.Script(plugin, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be compiled.", error: {message: err.message, stack: err.stack}});}
			global[this.getName()] = plugin;
			try {new vm.Script(`new global["${this.getName()}"]();`, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be constructed", error: {message: err.message, stack: err.stack}});}
			bdplugins[this.getName()].plugin = new global[this.getName()]();
			bdplugins[this.getName()].plugin.load();
		}
		async start() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			bdplugins[this.getName()].plugin.start();
		}
	} : compilePlugin(global.ZLibrary.buildPlugin(config));
})();