/**
 * @name AccountDetailsPlus
 * @version 0.1.10
 * @authorLink https://twitter.com/IAmZerebos
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js
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

module.exports = (() => {
    const config = {info:{name:"AccountDetailsPlus",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.10",description:"Lets you view popout, nickname and more from your account panel at the bottom.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"},changelog:[{title:"Bugs Squashed",type:"fixed",items:["Fix conflicting popouts.","Stopped using deprecated functions."]}],main:"index.js",defaultConfig:[{type:"category",id:"popout",name:"User Popout",collapsible:true,shown:false,settings:[{type:"switch",id:"avatar",name:"Avatar",note:"Opens your popout when clicking your avatar.",value:true},{type:"switch",id:"username",name:"Username",note:"Opens your popout when clicking your username.",value:true}]},{type:"category",id:"statusPicker",name:"Status Picker",collapsible:true,shown:false,settings:[{type:"switch",id:"avatar",name:"Avatar",note:"Opens your popout when right clicking your avatar.",value:true},{type:"switch",id:"username",name:"Username",note:"Opens your popout when right clicking your username.",value:true}]},{type:"category",id:"nickname",name:"Nickname",collapsible:true,shown:false,settings:[{type:"dropdown",id:"showNickname",name:"Name Shown",value:true,options:[{label:"Username",value:false},{label:"Nickname",value:true}]},{type:"switch",id:"oppositeOnHover",name:"Opposite On Hover",note:"Shows the opposite on hover. e.g. if you are showing nickname, hovering will show your username.",value:true}]}]};

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
    const {PluginUtilities, DiscordModules, DiscordSelectors, ReactTools, Utilities, WebpackModules, Popouts, Logger} = Api;

    const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");
    const container = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
    const username = `.${rawClasses.usernameContainer.split(" ").join(".")}`;
    const nameTag = `.${rawClasses.nameTag.split(" ").join(".")}`;

    const tagSelector = `${container} ${nameTag}`;
    const usernameCSS = tagSelector + "{ cursor: pointer; }";

    return class AccountDetailsPlus extends Plugin {
        constructor() {
            super();
            this.popoutOpen = false;

            this.adjustNickname = this.adjustNickname.bind(this);
            this.showStatusPicker = this.showStatusPicker.bind(this);
            this.showUserPopout = this.showUserPopout.bind(this);
            this.updateIsPopoutOpen = this.updateIsPopoutOpen.bind(this);
        }

        async onStart() {
            // Resolve weird loading issues
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.doSetup();
        }

        onStop() {
            this.doCleanup();
        }

        doSetup() {
            this.FluxContainer = DiscordModules.UserPopout;
            if (!this.FluxContainer) return Logger.err("Could not find UserPopout component");

            this.popoutWrapper = Utilities.findInTree(ReactTools.getReactInstance(document.querySelector(container + " .avatar-SmRMf2")), n => n && n.handleClick && n.toggleShow, {walkable: ["return", "stateNode"]});
            if (!this.popoutWrapper) return Logger.err("Could not find popoutWrapper instance");

            this.currentUser = DiscordModules.UserStore.getCurrentUser();

            this.tagElement = document.querySelector(tagSelector);
            if (!this.tagElement) return Logger.err("Could not find tag element");

            this.avatarElement = document.querySelector(container + " .avatar-SmRMf2");
            if (!this.avatarElement) return Logger.err("Could not find avatar element");
            this.addAllListeners();
        }

        doCleanup() {
            PluginUtilities.removeStyle(this.getName() + "-css");
            document.querySelector(container + ` ${username}`).textContent = this.currentUser.username;
            this.clearAllListeners();
        }

        clearAllListeners() {
            document.removeEventListener("mousemove", this.adjustNickname);

            if (!this.tagElement) return Logger.err("No tag element to remove listeners");
            if (!this.avatarElement) return Logger.err("No avatar element to remove listeners");
            this.tagElement.removeEventListener("mousedown", this.updateIsPopoutOpen);
            this.tagElement.removeEventListener("click", this.showUserPopout);
            this.tagElement.removeEventListener("contextmenu", this.showStatusPicker);

            this.avatarElement.removeEventListener("mousedown", this.updateIsPopoutOpen);
            this.avatarElement.removeEventListener("click", this.showUserPopout);
            this.avatarElement.removeEventListener("contextmenu", this.showStatusPicker);
        }

        addAllListeners() {            
            if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) document.addEventListener("mousemove", this.adjustNickname);

            if (!this.tagElement) return Logger.err("Tag element not available");
            if (!this.avatarElement) return Logger.err("Avatar element not available");
            if (this.settings.popout.username) {
                PluginUtilities.addStyle(this.getName() + "-css", usernameCSS);
                this.tagElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.tagElement.addEventListener("click", this.showUserPopout);
            }
            if (this.settings.popout.avatar) {
                this.tagElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.avatarElement.addEventListener("click", this.showUserPopout);
            }
            if (this.settings.statusPicker.username) {
                this.tagElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.tagElement.addEventListener("contextmenu", this.showStatusPicker);
            }
            if (this.settings.statusPicker.avatar) {
                this.avatarElement.addEventListener("mousedown", this.updateIsPopoutOpen);
                this.avatarElement.addEventListener("contextmenu", this.showStatusPicker);
            }
        }

        adjustNickname(e) {
            if (!this.settings.nickname.showNickname && !this.settings.nickname.oppositeOnHover) return;
            if (!e || !e.target || !(e.target instanceof Element)) return;
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return Logger.err("Could not find accountDetails element");

            const isHovering = accountDetails.contains(e.target);
            const nameElement = accountDetails.querySelector(username);

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

        updateIsPopoutOpen() {
            this.popoutOpen = this.popoutWrapper.state.shouldShowPopout;
        }

        showStatusPicker(e) {
            if (this.popoutOpen) return;
            e.preventDefault();
            e.stopPropagation();
            this.popoutWrapper.toggleShow(e);
        }

        showUserPopout(e) {
            if (this.popoutOpen) return;
            e.preventDefault();
            e.stopPropagation();
            const element = document.querySelector(container);
            Popouts.showUserPopout(element, this.currentUser, {position: "top"});
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(() => {
                this.doCleanup();
                this.doSetup();
            });
            return panel.getElement();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/