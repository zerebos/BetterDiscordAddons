/**
 * @name HideDisabledEmojis
 * @description Hides disabled emojis from the emoji picker.
 * @version 0.0.8
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis
 * @source https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js
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
const config = {
    info: {
        name: "HideDisabledEmojis",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "0.0.8",
        description: "Hides disabled emojis from the emoji picker.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis",
        github_raw: "https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js"
    },
    changelog: [
        {
            title: "Bugs Squashed",
            type: "fixed",
            items: [
                "Updated for Discord's changes."
            ]
        }
    ],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, Utilities} = Api;
    const PickerWrapMemo = WebpackModules.getModule(m => m?.type?.render?.toString().includes(".emojiSize"));
    return class HideDisabledEmojis extends Plugin {
        async onStart() {            
            Patcher.after(DiscordModules.EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
                return returnValue || DiscordModules.EmojiInfo.isEmojiDisabled(methodArguments[0], methodArguments[1]);
            });  
            Patcher.after(PickerWrapMemo.type, "render", (_, args, res) => {
                const pickerChild = Utilities.findInTree(res, m => m?.props?.emojiGrid, {walkable: ["props", "children"]});
                  Patcher.before(pickerChild.type, "type", (_, [props]) => {
                    props.emojiGrid = props.emojiGrid.map(m => m.filter(m => !m.isDisabled)).filter(m => m.length);
                    props.rowCount = props.emojiGrid.length;
                    if (!props.sectionDescriptors) return;
                    const mappedEmojiCount = {};
                    props.emojiGrid.flat(10).forEach(item => {
                      item?.category?.toLowerCase() == "recent" ||  item?.category?.toLowerCase() == "unicode" ? mappedEmojiCount[item.category] = (mappedEmojiCount[item.category] || 0) + 1 : mappedEmojiCount[item?.emoji?.guildId] = (mappedEmojiCount[item?.emoji?.guildId] || 0) + 1 ;
                    });                  
                    props.sectionDescriptors = props.sectionDescriptors.map(m => {
                      if (m?.type?.toLowerCase() == "unicode") return m;
                      m.count =  mappedEmojiCount[m.type] ? mappedEmojiCount[m.type] :  mappedEmojiCount[m.guild.id]
                      return m;
                    }).filter(m => m.count);
                   props.rowCountBySection =  props.sectionDescriptors.map(m => Math.ceil(m.count / 9));                  
                });               
              });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/
