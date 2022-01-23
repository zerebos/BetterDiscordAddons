/**
 * @name AccountDetailsPlus
 * @version 1.0.1
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
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
    const config = {info:{name:"AccountDetailsPlus",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"1.0.1",description:"Lets you view popout, nickname and more from your account panel at the bottom.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"},changelog:[{title:"Rewrite",items:["Plugin has been completely rewritten and simplified.","Settings are more streamlined and straightforward.","More compatible with Discord's changes."]}],main:"index.js",defaultConfig:[{type:"dropdown",id:"popoutOnClick",name:"Which should be shown on the left click of your avatar? (Opposite will be shown on right click)",value:true,options:[{label:"Status Picker",value:false},{label:"User Popout",value:true}]},{type:"dropdown",id:"nicknameByDefault",name:"Which should be shown by default? (Opposite will be shown on hover)",value:true,options:[{label:"Username",value:false},{label:"Nickname",value:true}]}]};

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
    const {DiscordModules, DiscordSelectors, WebpackModules, Logger, ReactComponents, Patcher, Utilities} = Api;

    const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");
    const container = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
    const username = `.${rawClasses.usernameContainer.split(" ").join(".")}`;

    const renderUserPopout = (props) => {
        const guild = DiscordModules.SelectedGuildStore.getGuildId();
        const channel = DiscordModules.SelectedChannelStore.getChannelId();
        return DiscordModules.React.createElement(DiscordModules.UserPopout, Object.assign({}, props, {
            userId: DiscordModules.UserStore.getCurrentUser().id,
            guildId: guild,
            channelId: channel
        }));
    };

    return class AccountDetailsPlus extends Plugin {

        async onStart() {
            this.currentUser = DiscordModules.UserStore.getCurrentUser();
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchAccountAvatar(this.promises.state);
            this.patchUsername();
        }

        onStop() {
            Patcher.unpatchAll();
            if (this.unpatchUsername) this.unpatchUsername();
        }

        async patchAccountAvatar(promiseState) {
            const Account = await ReactComponents.getComponentByName("Account", ".container-YkUktl");
            if (promiseState.cancelled) return;
            Patcher.after(Account.component.prototype, "render", (thisObject, _, retAccount) => {
                if (!thisObject._renderStatusPickerPopout) thisObject._renderStatusPickerPopout = thisObject.renderStatusPickerPopout;
                const popoutWrap = Utilities.getNestedProp(retAccount, "props.children.0.props");
                const popoutWrapRender = popoutWrap.children;
                if (!popoutWrap || !popoutWrapRender) return retAccount;
                popoutWrap.children = (popoutProps) => {
                    const retPopout = Reflect.apply(popoutWrapRender, thisObject, [popoutProps]);
                    const avatarWrap = Utilities.getNestedProp(retPopout, "props.children.props");
                    const avatarRender = avatarWrap.children;
                    if (!avatarWrap || !avatarRender) return retPopout;

                    avatarWrap.children = avatarProps => {
                        const originalClick = avatarProps.onClick;
                        avatarProps.onContextMenu = (e) => {
                            thisObject.renderStatusPickerPopout = this.settings.popoutOnClick ? thisObject._renderStatusPickerPopout : renderUserPopout;
                            originalClick(e);
                            thisObject.forceUpdate();
                        };
                        avatarProps.onClick = (e) => {
                            thisObject.renderStatusPickerPopout = this.settings.popoutOnClick ? renderUserPopout : thisObject._renderStatusPickerPopout;
                            originalClick(e);
                            thisObject.forceUpdate();
                        };

                        return Reflect.apply(avatarRender, thisObject, [avatarProps]);
                    };
                    return retPopout;
                };
            });
        }

        getNickname(guildId = DiscordModules.SelectedGuildStore.getGuildId()) {
            const nick = DiscordModules.GuildMemberStore.getNick(guildId, this.currentUser.id);
            return nick ? nick : this.currentUser.username;
        }

        patchUsername() {
            this.onSwitch = this.adjustNickname;
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return Logger.err("Could not find accountDetails element");
            const nameElement = accountDetails.querySelector(username);

            const hoverChange = event => {
                const nick = this.getNickname();
                if (this.settings.nicknameByDefault) nameElement.textContent = event.type === "mouseenter" ? this.currentUser.username : nick;
                else nameElement.textContent = event.type === "mouseenter" ? nick : this.currentUser.username;
            };

            accountDetails.addEventListener("mouseenter", hoverChange);
            accountDetails.addEventListener("mouseleave", hoverChange);

            this.unpatchUsername = () => {
                delete this.onSwitch;
                accountDetails.removeEventListener("mouseenter", hoverChange);
                accountDetails.removeEventListener("mouseleave", hoverChange);
                nameElement.textContent = this.currentUser.username;
            };

            this.adjustNickname();
        }

        adjustNickname() {
            const accountDetails = document.querySelector(container);
            if (!accountDetails) return Logger.err("Could not find accountDetails element");
            const nameElement = accountDetails.querySelector(username);
            const nick = this.getNickname();
            if (this.settings.nicknameByDefault) nameElement.textContent = nick;
            else nameElement.textContent = this.currentUser.username;
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