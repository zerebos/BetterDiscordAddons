/**
 * @name StatusEverywhere
 * @version 0.4.9
 * @authorLink https://twitter.com/IAmZerebos
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js
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
    const config = {info:{name:"StatusEverywhere",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.4.9",description:"Adds user status everywhere Discord doesn't.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/StatusEverywhere",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/StatusEverywhere/StatusEverywhere.plugin.js"},changelog:[{title:"Hot Fixes",type:"fixed",items:["Fix a crashing issue when clicking on a user with default avatar.","Fix an issue where users with default avatars showed the wrong status."]}],main:"index.js"};

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
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities, Utilities, Popouts} = Api;

    const Flux = WebpackModules.getByProps("connectStores");
    const StatusStore = DiscordModules.UserStatusStore;

    return class StatusEverywhere extends Plugin {

        onStart() {
			PluginUtilities.addStyle(this.getName(), `.message-2qnXI6 .avatar-1BDn8e { overflow: visible; position: absolute; }`);
            const Avatar = WebpackModules.getByProps("AnimatedAvatar");
            const original = Avatar.default;
            Patcher.after(Avatar, "default", (_, [props]) => {
                if (props.status || props.size.includes("100")) return;
                const id = props.userId || props.src.split("/")[4];
                const size = props.size.includes("128") ? Avatar.Sizes.SIZE_120 : props.size;
                const fluxWrapper = Flux.connectStores([StatusStore], () => ({status: StatusStore.getStatus(id)}));
                return DiscordModules.React.createElement(fluxWrapper(({status}) => {
                    return DiscordModules.React.createElement(original, Object.assign({}, props, {status, size}));
                }));
            });
            Object.assign(Avatar.default, original);

            const MessageHeader = WebpackModules.getByProps("MessageTimestamp");
            Patcher.after(MessageHeader, "default", (_, [props], returnValue) => {
                const AvatarComponent = Utilities.getNestedProp(returnValue, "props.children.0");
                if (!AvatarComponent || !AvatarComponent.props || !AvatarComponent.props.renderPopout) return;
                const renderer = Utilities.getNestedProp(AvatarComponent, "props.children");
                if (!renderer || typeof(renderer) !== "function" || renderer.__patched) return;
                AvatarComponent.props.children = function() {
                    const rv = renderer(...arguments);
                    if (rv.type !== "img") return rv;
                    return DiscordModules.React.createElement(Avatar.default, Object.assign({}, rv.props, {userId: props.message.author.id, size: Avatar.Sizes.SIZE_40, onClick: (event) => {
                        Popouts.showUserPopout(event.target, props.message.author);
                    }}));
                };
                AvatarComponent.props.children.__patched = true;
            });
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
            Patcher.unpatchAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/