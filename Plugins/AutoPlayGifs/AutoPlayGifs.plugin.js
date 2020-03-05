/**
 * @name AutoPlayGifs
 * @invite TyFxKer
 * @authorLink https://twitter.com/ZackRauen
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js
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

var AutoPlayGifs = (() => {
    const config = {info:{name:"AutoPlayGifs",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.3",description:"Automatically plays avatars and stuff.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js"},changelog:[{title:"What's New?",items:["Add ability to always animate activity statuses!"]},{title:"Fixed",type:"fixed",items:["Should animate avatars in chat again!"]}],defaultConfig:[{type:"switch",id:"chat",name:"Autoplay Chat",note:"Autoplays avatars in the chat area for Nitro users.",value:true},{type:"switch",id:"memberList",name:"Autoplay Memberlist",note:"Autoplays avatars in the member list for Nitro users.",value:true},{type:"switch",id:"guildList",name:"Autoplay Guids",note:"Autoplays guild icons in the guild list for servers that have been boosted.",value:true},{type:"switch",id:"activityStatus",name:"Activity Status",note:"Autoplays emojis and icons in the activity status like in the member list.",value:true}],main:"index.js"};

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
                    children: [BdApi.React.createElement(TextElement, {color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
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
    const {WebpackModules, DiscordModules, Patcher, ReactComponents, Utilities} = Api;

    return class AutoPlayGifs extends Plugin {
        constructor() {
            super();
            this.cancelChatAvatars = () => {};
            this.cancelMemberListAvatars = () => {};
            this.cancelGuildList = () => {};
            this.cancelActivityStatus = () => {};
        }

        onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            if (this.settings.chat) this.patchChatAvatars();
            if (this.settings.memberList) this.patchMemberListAvatars();
            if (this.settings.guildList) this.patchGuildList(this.promises.state);
            if (this.settings.activityStatus) this.patchActivityStatus();
        }

        onStop() {
            this.cancelChatAvatars();
            this.cancelMemberListAvatars();
            this.cancelGuildList();
            this.cancelActivityStatus();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, value) => {
                if (id == "chat") {
                    if (value) this.patchChatAvatars();
                    else this.cancelChatAvatars();
                }
                if (id == "memberList") {
                    if (value) this.patchMemberListAvatars();
                    else this.cancelMemberListAvatars();
                }
                if (id == "guildList") {
                    if (value) this.patchGuildList();
                    else this.cancelGuildList();
                }
                if (id == "activityStatus") {
                    if (value) this.patchActivityStatus();
                    else this.cancelActivityStatus();
                }
            });
            return panel.getElement();
        }

        async patchGuildList(promiseState) {
            const Guild = await ReactComponents.getComponentByName("Guild", ".listItem-2P_4kh");
            if (promiseState.cancelled) return;
            this.cancelGuildList = Patcher.after(Guild.component.prototype, "render", (thisObject, args, returnValue) => {
                if (!thisObject.props.animatable) return;
                const iconComponent = Utilities.findInReactTree(returnValue, p => p.icon);
                if (!iconComponent) return;
                iconComponent.icon = thisObject.props.guild.getIconURL("gif");
            });
            Guild.forceUpdateAll();
        }

        patchChatAvatars() {
            const MessageHeader = WebpackModules.getByProps("MessageTimestamp");
            this.cancelChatAvatars = Patcher.after(MessageHeader, "default", (_, __, returnValue) => {
                const AvatarComponent = Utilities.getNestedProp(returnValue, "props.children.0");
                if (!AvatarComponent || !AvatarComponent.props || !AvatarComponent.props.renderPopout) return;
                const renderer = Utilities.getNestedProp(AvatarComponent, "props.children");
                if (!renderer || typeof(renderer) !== "function" || renderer.__patchedAPG) return;
                AvatarComponent.props.children = function() {
                    const rv = renderer(...arguments);
                    const id = rv.props.src.split("/")[4];
                    const hasAnimatedAvatar = DiscordModules.ImageResolver.hasAnimatedAvatar(DiscordModules.UserStore.getUser(id));
                    if (!hasAnimatedAvatar) return rv;
                    rv.props.src = DiscordModules.ImageResolver.getUserAvatarURL(DiscordModules.UserStore.getUser(id)).replace("webp", "gif");
                    return rv;
                };
                AvatarComponent.props.children.__patchedAPG = true;
            });
        }

        patchMemberListAvatars() {
            const MemberList = WebpackModules.findByDisplayName("MemberListItem");
            this.cancelMemberListAvatars = Patcher.before(MemberList.prototype, "render", (thisObject) => {
                if (!thisObject.props.user) return;
                const id = thisObject.props.user.id;
                const hasAnimatedAvatar = DiscordModules.ImageResolver.hasAnimatedAvatar(DiscordModules.UserStore.getUser(id));
                if (!hasAnimatedAvatar) return;
                thisObject.props.user.getAvatarURL = () => {return DiscordModules.ImageResolver.getUserAvatarURL(DiscordModules.UserStore.getUser(id)).replace("webp", "gif");};
            });
        }

        patchActivityStatus() {
            const ActivityStatus = WebpackModules.getByProps("ActivityEmoji");
            this.cancelActivityStatus = Patcher.before(ActivityStatus, "default", (_, [props]) => {
                if (!props) return;
                props.animate = true;
            });
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/