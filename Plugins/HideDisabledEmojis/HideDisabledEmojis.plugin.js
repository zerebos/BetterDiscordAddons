/**
 * @name HideDisabledEmojis
 * @invite TyFxKer
 * @authorLink https://twitter.com/ZackRauen
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis
 * @source https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js
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
    const config = {info:{name:"HideDisabledEmojis",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.0.6",description:"Hides disabled emojis from the emoji picker.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis",github_raw:"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js"},changelog:[{title:"Bugs Squashed",type:"fixed",items:["Emoji headings no longer overlap."]}],main:"index.js"};

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
    const {Patcher, DiscordModules, ReactComponents, DiscordSelectors} = Api;
    return class HideDisabledEmojis extends Plugin {
        async onStart() {            
            Patcher.after(DiscordModules.EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
                return returnValue || DiscordModules.EmojiInfo.isEmojiDisabled(methodArguments[0], methodArguments[1]);
            });

            const EmojiPicker = await ReactComponents.getComponentByName("EmojiPicker", DiscordSelectors.EmojiPicker.emojiPicker);
            Patcher.before(EmojiPicker.component.prototype, "render", (thisObject) => {
                const cats = thisObject.categories;
                const filtered = thisObject.computeMetaData();
                const newcats = {};

                for (const c of filtered) newcats[c.category] ? newcats[c.category] += 1 : newcats[c.category] = 1;

                let i = 0;
                for (const cat of cats) {
                    if (!newcats[cat.category]) {
                        cat.offsetTop = 999999;
                    }
                    else {
                        cat.offsetTop = i * 32;
                        i += newcats[cat.category] + 1;
                    }
                    thisObject.categoryOffsets[cat.category] = cat.offsetTop;
                }

                cats.sort((a,b) => a.offsetTop - b.offsetTop);
            });
            EmojiPicker.forceUpdateAll();
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/