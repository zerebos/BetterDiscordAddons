//META{"name":"AccountDetailsPlus","displayName":"AccountDetailsPlus","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject('WScript.Shell');
	var fs = new ActiveXObject('Scripting.FileSystemObject');
	var pathPlugins = shell.ExpandEnvironmentStrings('%APPDATA%\\BetterDiscord\\plugins');
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup('It looks like you\'ve mistakenly tried to run me directly. \n(Don\'t do that!)', 0, 'I\'m a plugin for BetterDiscord', 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup('I\'m in the correct folder already.\nJust reload Discord with Ctrl+R.', 0, 'I\'m already installed', 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup('I can\'t find the BetterDiscord plugins folder.\nAre you sure it\'s even installed?', 0, 'Can\'t install myself', 0x10);
	} else if (shell.Popup('Should I copy myself to BetterDiscord\'s plugins folder for you?', 0, 'Do you need some help?', 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec('explorer ' + pathPlugins);
		shell.Popup('I\'m installed!\nJust reload Discord with Ctrl+R.', 0, 'Successfully installed', 0x40);
	}
	WScript.Quit();

@else@*/

var AccountDetailsPlus = (() => {
    const config = {"info":{"name":"AccountDetailsPlus","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.3","description":"Lets you view popout, nickname and more from your account panel at the bottom. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"},"defaultConfig":[{"type":"category","id":"popout","name":"User Popout","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"avatar","name":"Avatar","note":"Opens your popout when clicking your avatar.","value":true},{"type":"switch","id":"username","name":"Username","note":"Opens your popout when clicking your username.","value":true}]},{"type":"category","id":"statusPicker","name":"Status Picker","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"avatar","name":"Avatar","note":"Opens your popout when right clicking your avatar.","value":true},{"type":"switch","id":"username","name":"Username","note":"Opens your popout when right clicking your username.","value":true}]},{"type":"category","id":"nickname","name":"Nickname","collapsible":true,"shown":false,"settings":[{"type":"dropdown","id":"showNickname","name":"Name Shown","value":true,"options":[{"label":"Username","value":false},{"label":"Nickname","value":true}]},{"type":"switch","id":"oppositeOnHover","name":"Opposite On Hover","note":"Shows the opposite on hover. e.g. if you are showing nickname, hovering will show your username.","value":true}]}],"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Settings panel and the settings should work now."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, DOMTools} = Api;
    return class AccountDetailsPlus extends Plugin {
        constructor() {
            super();
            this.usernameCSS = `.container-iksrDt .nameTag-26T3kW { cursor: pointer; }`;
            this.popoutOpen = false;
        }

        async onStart() {
            await new Promise(resolve => setTimeout(resolve, 1000));      
            this.FluxContainer = DiscordModules.UserPopout;
            this.currentUser = DiscordModules.UserStore.getCurrentUser();
            this.popoutWrapper = ReactTools.getReactProperty(document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn"), "return.return.return.return.return.return.return.stateNode");
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
            document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").off("." + this.getName());
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
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("click." + this.getName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
            }
            if (this.settings.statusPicker.username) {
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on("contextmenu." + this.getName(), (e) => {
                    if (!this.popoutOpen) this.showStatusPicker(e);
                });
            }
            if (this.settings.statusPicker.avatar) {
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("mousedown." + this.getName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
                document.querySelector(DiscordSelectors.AccountDetails.container + " .inner-1W0Bkn").on("contextmenu." + this.getName(), (e) => {
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
            this.setRender(this.originalRender, {position: "top-left", animationType: "spring"});
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.activateShit.bind(this));
            return panel.getElement();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/