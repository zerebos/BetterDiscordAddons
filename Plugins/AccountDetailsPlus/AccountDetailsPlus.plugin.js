//META{"name":"AccountDetailsPlus","displayName":"AccountDetailsPlus","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"}*//

var AccountDetailsPlus = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"AccountDetailsPlus","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.0","description":"Lets you view popout, nickname and more from your account panel at the bottom. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"},"defaultConfig":[{"type":"category","id":"popout","name":"User Popout","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"avatar","name":"Avatar","note":"Opens your popout when clicking your avatar.","value":true},{"type":"switch","id":"username","name":"Username","note":"Opens your popout when clicking your username.","value":true}]},{"type":"category","id":"statusPicker","name":"Status Picker","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"avatar","name":"Avatar","note":"Opens your popout when right clicking your avatar.","value":true},{"type":"switch","id":"username","name":"Username","note":"Opens your popout when right clicking your username.","value":true}]},{"type":"category","id":"nickname","name":"Nickname","collapsible":true,"shown":false,"settings":[{"type":"dropdown","id":"showNickname","name":"Name Shown","value":true,"options":[{"label":"Username","value":false},{"label":"Nickname","value":true}]},{"type":"switch","id":"oppositeOnHover","name":"Opposite On Hover","note":"Shows the opposite on hover. e.g. if you are showing nickname, hovering will show your username.","value":true}]}],"changelog":[{"title":"What's New?","items":["Rewrite to new library.","Remove more jQuery."]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, DOMTools} = Api;
    return class AccountDetailsPlus extends Plugin {
        constructor() {
            super();
            this.usernameCSS = `.container-iksrDt .nameTag-26T3kW { cursor: pointer; }`;
            this.popoutOpen = false;
        }

        async onStart() {
            (function (Api) {
    if (window.ZeresPluginLibrary) return; // they already have it
    const hasShownAnnouncement = Api.PluginUtilities.loadData(this.getName(), "announcements", {localLibNotice: false}).localLibNotice;
    if (hasShownAnnouncement) return;
    Api.Modals.showConfirmationModal("Local Library Notice", Api.DiscordModules.React.createElement("span", null, `This version of ${this.getName()} is the final version that will be released using a remotely loaded library. Future versions will require my local library that gets placed in the plugins folder.`, Api.DiscordModules.React.createElement("br"), Api.DiscordModules.React.createElement("br"), "You can download the library now to be prepared, or wait until the next version which will prompt you to download it."), {
        confirmText: "Download Now",
        cancelText: "Wait",
        onConfirm: () => {
            require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
        }
    });
    Api.PluginUtilities.saveData(this.getName(), "announcements", {localLibNotice: true});
})(Api);
            await new Promise(resolve => setTimeout(resolve, 1000));      
            this.FluxContainer = DiscordModules.UserPopout;
            this.currentUser = DiscordModules.UserStore.getCurrentUser();
            this.popoutWrapper = ReactTools.getReactProperty(document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small"), "return.return.return.return.stateNode");
            this.originalRender = this.popoutWrapper.props.render;
         
            this.activateShit();
        }
        
        onStop() {
            this.popoutWrapper.props.render = this.originalRender;
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(".AccountDetailsPlus");
            this.saveSettings();
        }

        activateShit() {
            document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).off("." + this.getName());
            document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small").off("." + this.getName());
            this.usernameCSS = DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag + "{ cursor: pointer; }";
            PluginUtilities.removeStyle(this.getName() + "-css");
            DOMTools.off(document, "mousemove." + this.getName());
            document.querySelector(DiscordSelectors.AccountDetails.container.descend(".username")).textContent = this.currentUser.username;
            
            if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) {
                DOMTools.on(document, "mousemove." + this.getName(), (e) => { this.adjustNickname(e); });
            }
            if (this.settings.popout.username) {
                PluginUtilities.addStyle(this.getName() + "-css", this.usernameCSS);
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.popout.avatar) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small").on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.statusPicker.username) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
            if (this.settings.statusPicker.avatar) {
                document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small").on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small").on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
        }
    
        adjustNickname(e) {
            if (!e || !e.target || !(e.target instanceof Element)) return;
            let accountDetails = document.querySelector(DiscordSelectors.AccountDetails.container);
            if (!accountDetails) return;
    
            let isHovering = accountDetails.contains(e.target);
            let nameElement = accountDetails.querySelector(".username");
    
            let nick = DiscordModules.GuildMemberStore.getNick(DiscordModules.SelectedGuildStore.getGuildId(), this.currentUser.id);
            nick = nick ? nick : this.currentUser.username;
    
            if (isHovering && this.settings.nickname.oppositeOnHover) {
                if (this.settings.nickname.showNickname) nameElement.textContent = this.currentUser.username;
                else if (!this.settings.nickname.showNickname) nameElement.textContent = nick;
            }
            else {
                if (this.settings.nickname.showNickname) nameElement.textContent = nick;
                else nameElement.textContent = this.currentUser.username;
            }
        }
    
        setRender(renderer, options = {}) {
            this.popoutWrapper.props.render = renderer;
            Object.assign(this.popoutWrapper.props, options);
        }
    
        showStatusPicker(e) {
            e.preventDefault();
            e.stopPropagation();
            this.setRender(this.originalRender, {position: "top-left", animationType: "spring"});
            this.popoutWrapper.toggle(e);
        }
    
        showUserPopout(e) {
            e.preventDefault();
            e.stopPropagation();
            var element = document.querySelector(DiscordSelectors.AccountDetails.container);
            // e.target = e.currentTarget = e.toElement = e.delegateTarget = document.querySelector(DiscordSelectors.AccountDetails.container);
            this.setRender((props) => {
                let guild = DiscordModules.SelectedGuildStore.getGuildId();
                let channel = DiscordModules.SelectedChannelStore.getChannelId();
                return DiscordModules.React.createElement(this.FluxContainer, Object.assign({}, props, {
                    user: this.currentUser,
                    guildId: guild,
                    channelId: channel
                }));
            }, {position: "top-left", animationType: "default"});
    
            this.popoutWrapper.toggle(Object.assign({}, e, {
                target: element,
                toElement: element,
                currentTarget: element,
                delegateTarget: element
            })); 
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

    };
};
		return plugin(Plugin, Api);
	};
	
	return !global.ZLibrary ? class {
		getName() {return config.info.name.replace(" ", "");} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;} stop() {}
		showAlert() {window.BdApi.alert("Loading Error",`Something went wrong trying to load the library for the plugin. You can try using a local copy of the library to fix this.<br /><br /><a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
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