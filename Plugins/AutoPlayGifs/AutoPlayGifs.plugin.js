/**
 * @name AutoPlayGifs
 * @version 0.1.5
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js
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
    const config = {info:{name:"AutoPlayGifs",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.5",description:"Automatically plays avatars and stuff.",github:"https://web.archive.org/web/20220615082126/httpss://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AutoPlayGifs",github_raw:"https://web.archive.org/web/20220615082126/httpss://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/AutoPlayGifs/AutoPlayGifs.plugin.js"},changelog:[{title:"Fixed",type:"fixed",items:["Should animate avatars in chat again!","Guild icons animate again!"]}],defaultConfig:[{type:"switch",id:"avatars",name:"Autoplay User Avatars",note:"Autoplays avatars for Nitro users.",value:true},{type:"switch",id:"guilds",name:"Autoplay Guild Icons",note:"Autoplays guild icons in the guild list for servers that have been boosted.",value:true},{type:"switch",id:"activityStatus",name:"Activity Status",note:"Autoplays emojis and icons in the activity status like in the member list.",value:true}],main:"index.js"};

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
    const {WebpackModules, DiscordModules, Patcher} = Api;

    return class AutoPlayGifs extends Plugin {

        getModuleWithKey(filter) {
            const result = BdApi.Webpack.getModule((e, m, i) => {
                if (filter(e, m, i)) return { module: m, id: i };
            }, { searchExports: true });
        
            const moduleExports = result.module ? result.module.exports : {};
            const key = Object.keys(moduleExports).find(k => filter(moduleExports[k], result.module, result.id));
            return [moduleExports, key];
        }
        
        

        onStart() {
            if (this.settings.avatars) this.patchUsers();
            if (this.settings.guilds) this.patchGuilds();
            if (this.settings.activityStatus) this.patchActivityStatus();
        }

        onStop() {
            Patcher.unpatchAll();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, value) => {
                if (id == "avatars") {
                    if (value) this.patchUsers();
                    else this.cancelUsers();
                }
                if (id == "guilds") {
                    if (value) this.patchGuilds();
                    else this.cancelGuilds();
                }
                if (id == "activityStatus") {
                    if (value) this.patchActivityStatus();
                    else this.cancelActivityStatus();
                }
            });
            return panel.getElement();
        }

        patchGuilds() {
            const getIconURLPatch = ZeresPluginLibrary.WebpackModules.getByPrototypes("getRole","getIconURL")
            this.cancelGuildList = Patcher.before(getIconURLPatch.prototype, "getIconURL", (thisObject, args) => {
                args[1] = true;
            });
        }

        patchUsers() {
            const selfUser = DiscordModules.UserStore.getCurrentUser();
            this.cancelUsers = Patcher.before(selfUser.constructor.prototype, "getAvatarURL", (thisObject, args) => {
                args[2] = true;
            });
        }

        patchActivityStatus() {
            const ActivityStatus = this.getModuleWithKey(BdApi.Webpack.Filters.byStrings("animate","customStatusActivity"))
            console.log(ActivityStatus)
            this.cancelActivityStatus = Patcher.before(ActivityStatus[0], "Z", (_, [props]) => {
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
/*
     FILE ARCHIVED ON 08:21:26 Jun 15, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 00:37:04 Sep 29, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 90.883
  exclusion.robots: 0.067
  exclusion.robots.policy: 0.059
  cdx.remote: 0.051
  esindex: 0.009
  LoadShardBlock: 67.581 (3)
  PetaboxLoader3.datanode: 77.547 (4)
  load_resource: 68.188
  PetaboxLoader3.resolve: 36.827
*/
