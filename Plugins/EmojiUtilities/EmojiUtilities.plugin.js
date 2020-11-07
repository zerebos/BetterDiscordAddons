/**
 * @name EmojiUtilities
 * @version 0.0.9
 * @authorLink https://twitter.com/IAmZerebos
 * @donate https://paypal.me/ZackRauen
 * @patreon https://patreon.com/Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/EmojiUtilities
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmojiUtilities/EmojiUtilities.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmojiUtilities/EmojiUtilities.plugin.js
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
    const config = {info:{name:"EmojiUtilities",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.0.9",description:"Allows you to blacklist and favorite emojis.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/EmojiUtilities",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmojiUtilities/EmojiUtilities.plugin.js"},changelog:[{title:"Plugin Status",type:"fixed",items:["Favorite emojis show up again as `Favorite Emojis`."]}],main:"index.js"};

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

    const {Patcher, WebpackModules, PluginUtilities, DiscordModules, Utilities, ReactComponents, DCM} = Api;

    const FavoriteIcon = (({DiscordModules}) => {
    const ce = DiscordModules.React.createElement;
    return class FavoriteIcon extends DiscordModules.React.Component {
        render() {
            return ce("svg", {height: this.props.height || "24px", width: this.props.width || "24px", className: this.props.className, viewBox: "0 0 24 24"},
                ce("path", {d: "M0 0h24v24H0z", fill: "none"}),
                ce("path", {d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", fill: "currentColor"}),
            );
        }
    };
})(Api);
    const DisabledIcon = (({DiscordModules}) => {
    const ce = DiscordModules.React.createElement;
    return class BlacklistIcon extends DiscordModules.React.Component {
        render() {
            return ce("svg", {height: this.props.height || "24px", width: this.props.width || "24px", className: this.props.className, viewBox: "0 0 24 24"},
                ce("path", {d: "M0 0h24v24H0z", fill: "none"}),
                ce("path", {d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z", fill: "currentColor"}),
            );
        }
    };
})(Api);

    const EmojiUtils = DiscordModules.EmojiUtils;
    const EmojiStore = DiscordModules.EmojiStore;

    const emojiIdRegex = new RegExp(`([0-9]{10,})`);

    return class EmojiUtilities extends Plugin {
        
        onStart() {
            this.disabledEmojis = PluginUtilities.loadData(this.getName(), "disabledEmojis", []);
            this.favoriteEmojis = PluginUtilities.loadData(this.getName(), "favoriteEmojis", []);
            this.disabledEmojis = this.disabledEmojis.filter(e => typeof(e) === "string");
            this.favoriteEmojis = this.favoriteEmojis.filter(e => typeof(e) === "string");


            this.addBlacklistFilter();
            this.addCategories();

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            Utilities.suppressErrors(this.patchEmojiComponent.bind(this), "Emoji Patch")(this.promises);
            Utilities.suppressErrors(this.patchMessageContextMenu.bind(this), "Message Context Menu Patch")();
            Utilities.suppressErrors(this.patchEmojiPicker.bind(this), "Emoji Picker Patch")(this.promises);
            Utilities.suppressErrors(this.patchReactions.bind(this), "Reactions Patch")();
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
            if (EmojiUtils.originalCategories) EmojiUtils.categories = EmojiUtils.originalCategories;
        }

        addCategories() {
            EmojiUtils.originalCategories = EmojiUtils.categories;
            Object.defineProperty(EmojiUtils, "categories", {writable: true, value: ["favorite emojis", ...EmojiUtils.originalCategories, "blacklist"]});

            // Add favorites and blacklist categories
            Patcher.after(EmojiStore, "getByCategory", (_, args) => {
                if (args[0] == "favorite emojis") return this.favoriteEmojis.map(e => this.resolveEmoji(e)).filter(e => this.isResolvable(e));
                if (args[0] == "blacklist") return this.disabledEmojis.map(e => this.resolveEmoji(e)).filter(e => this.isResolvable(e));
            });

            // Give the fake categories an icon
            const EmojiCategoryIcon = WebpackModules.getModule(m => m.default && m.default.type && m.default.type.toString().includes("FOOD"));
            Patcher.after(EmojiCategoryIcon.default, "type", (_, [props]) => {
                if (props.categoryId == "favorite emojis") return DiscordModules.React.createElement(FavoriteIcon, props);
                if (props.categoryId == "blacklist") return DiscordModules.React.createElement(DisabledIcon, props);
            });
        }

        addBlacklistFilter() {
            const EmojiInfo = WebpackModules.getByProps("isEmojiDisabled");
            Patcher.after(EmojiInfo, "isEmojiDisabled", (thisObject, methodArguments, returnValue) => {
                const emoji = methodArguments[0];
                if (emoji.uniqueName && this.disabledEmojis.includes(emoji.uniqueName)) return true;
                if (emoji.id && this.disabledEmojis.includes(emoji.id)) return true;
                return returnValue;
            });

            Patcher.after(EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
                const emoji = methodArguments[0];
                if (emoji.uniqueName && this.disabledEmojis.includes(emoji.uniqueName)) return true;
                if (emoji.id && this.disabledEmojis.includes(emoji.id)) return true;
                return returnValue;
            });

            // Patch "Frequently Used"
            const plugin = this;
            Patcher.after(DiscordModules.EmojiUtils, "getDisambiguatedEmojiContext", (t, a, returnValue) => {
                const originalFunction = returnValue.getFrequentlyUsedEmojis;
                returnValue.getFrequentlyUsedEmojis = function() {
                    const originalReturn = (originalFunction.bind(this))();
                    return originalReturn.filter(e => !plugin.isBlacklisted(e.id || e.uniqueName));
                };
            });

            // Add favorites category and filter other categories
            Patcher.after(EmojiStore, "getByCategory", (_, args, returnValue) => {
                if (args[0] == "favorite emojis" || args[0] == "blacklist") return;
                return returnValue.filter(e => !this.isBlacklisted(e.uniqueName));
            });
        }

        patchReactions() {
            const ReactionsComponent = WebpackModules.getByDisplayName("Reactions");
            Patcher.after(ReactionsComponent.prototype, "render", (thisObject, methodArguments, returnValue) => {
                if (!returnValue || !returnValue.props || !returnValue.props.children) return;
                let hiddenReactionCount = 0;
                const reactions = returnValue.props.children[0];
                for (let r = 0; r < reactions.length; r++) {
                    if (!reactions[r]) continue;
                    const emoji = this.resolveEmojiIdentifier(reactions[r].props.emoji.id || reactions[r].props.emoji.name);
                    const isBlacklisted = emoji && this.isBlacklisted(emoji);
                    if (isBlacklisted) {
                        hiddenReactionCount = hiddenReactionCount + reactions[r].props.count;
                        reactions.splice(r, 1);
                        r = r - 1;
                    }
                }
                if (!hiddenReactionCount) return;

                returnValue.props.children.splice(1, 0, DiscordModules.React.createElement(DiscordModules.TextElement, {
                    style: {margin: "0 5px"},
                    className: "reactions-hidden",
                    size: DiscordModules.TextElement.Sizes.SMALL,
                    color: DiscordModules.TextElement.Colors.MUTED,
                    children: [`${hiddenReactionCount} reactions hidden`]
                }));
            });
        }

        async patchEmojiComponent(promiseState) {
            const Emoji = await ReactComponents.getComponentByName("Emoji", ".emoji");
            if (promiseState.cancelled) return;
            Patcher.after(Emoji.component.prototype, "render", (thisObject, methodArguments, returnValue) => {
                const emoji = this.resolveEmojiIdentifier(thisObject.props.emojiId || thisObject.props.emojiName);

                const isFavorite = this.isFavorite(emoji);
                const isBlacklisted = this.isBlacklisted(emoji);

                if (isBlacklisted) {                   
                    return DiscordModules.React.createElement(DiscordModules.TextElement, {
                        className: "blocked-emoji",
                        children: [thisObject.props.emojiName],
                        id: thisObject.props.emojiId,
                        name: thisObject.props.emojiName.replace(/:/g, ""),
                        color: DiscordModules.TextElement.Colors.MUTED,
                        onContextMenu: (event) => {
                            const menu = DCM.buildMenu([{
                                type: "group",
                                items: [{
                                    label: "Remove From Blacklist",
                                    closeOnClick: true,
                                    action: () => {
                                        this.removeBlacklisted(emoji);
                                        thisObject.forceUpdate();
                                    }
                                }]}
                            ]);
                            DCM.openContextMenu(event, menu);
                        },
                        style: {display: "inline"}
                    });
                }

                returnValue.props.onContextMenu = async () => {
                    this.currentEmojiContext = {
                        isFavorite: isFavorite,
                        toggleFavorite: () => {
                            if (isFavorite) this.removeFavorite(emoji);
                            else this.addFavorite(emoji);
                            thisObject.forceUpdate();
                        },
                        blacklist: () => {
                            this.addBlacklisted(emoji);
                            thisObject.forceUpdate();
                        }
                    };
                };

                return returnValue;
            });
            Emoji.forceUpdateAll();
        }

        patchMessageContextMenu() {
            const MessageContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "MessageContextMenu");

            Patcher.after(MessageContextMenu, "default", (_, [props], retVal) => {
                if (!props.target || !props.target.classList || !props.target.classList.contains("emoji")) return;
                if (!this.currentEmojiContext) return;
                const actions = [
                    {label: "Blacklist Emoji", closeOnClick: true, action: this.currentEmojiContext.blacklist},
                    {label: this.currentEmojiContext.isFavorite ? "Remove Favorite" : "Favorite Emoji", closeOnClick: true, action: this.currentEmojiContext.toggleFavorite}
                ];

                const original = retVal.props.children;
                const newOne = DCM.buildMenuChildren([{type: "group", items: actions}]);
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
        }

        // Add context menu to emojis in emoji picker
        async patchEmojiPicker() {
            const EmojiPickerListRow = WebpackModules.getModule(m => m.default && m.default.displayName == "EmojiPickerListRow");
            Patcher.after(EmojiPickerListRow, "default", (thisObject, args, returnValue) => {
                const emojiComponents = returnValue.props.children;
                for (let e = 0; e < emojiComponents.length; e++) {
                    const emojiObj = emojiComponents[e].props.children.props.emoji;
                    const emoji = this.resolveEmojiIdentifier(emojiObj.id || emojiObj.allNamesString);
                    emojiComponents[e].props.onContextMenu = (event) => {
                        const isFavorite = this.isFavorite(emoji);
                        const isBlacklisted = this.isBlacklisted(emoji);
                        const menu = DCM.buildMenu([{
                            type: "group",
                            items: [{
                                    label: isBlacklisted ? "Remove From Blacklist" : "Blacklist Emoji",
                                    closeOnClick: true,
                                    action: () => {
                                        if (isBlacklisted) this.removeBlacklisted(emoji);
                                        else this.addBlacklisted(emoji);
                                    }
                            },
                            {
                                label: isFavorite ? "Remove Favorite" : "Favorite Emoji",
                                closeOnClick: true,
                                action: () => {
                                    if (isFavorite) this.removeFavorite(emoji);
                                    else this.addFavorite(emoji);
                                }
                            }]
                        }]);
                        DCM.openContextMenu(event, menu);
                    };
                }
            });
        }

        isBlacklisted(value) {
            const resolved = this.resolveEmojiIdentifier(value);
            return this.disabledEmojis.includes(resolved);
        }

        addBlacklisted(value) {
            const emoji = this.resolveEmojiIdentifier(value);
            if (this.isFavorite(emoji)) this.removeFavorite(emoji);
            if (this.isBlacklisted(emoji)) return;
            this.disabledEmojis.push(emoji);
            this.saveBlacklist();
        }

        removeBlacklisted(value) {
            const emoji = this.resolveEmojiIdentifier(value);
            if (!this.isBlacklisted(emoji)) return;
            this.disabledEmojis.splice(this.disabledEmojis.indexOf(emoji), 1);
            this.saveBlacklist();
        }

        saveBlacklist() {
            PluginUtilities.saveData(this.getName(), "disabledEmojis", this.disabledEmojis);
        }

        isFavorite(value) {
            const resolved = this.resolveEmojiIdentifier(value);
            return this.favoriteEmojis.includes(resolved);
        }

        addFavorite(value) {
            const emoji = this.resolveEmojiIdentifier(value);
            if (this.isBlacklisted(emoji)) this.removeBlacklisted(emoji);
            if (this.isFavorite(emoji)) return;
            this.favoriteEmojis.push(emoji);
            this.saveFavorites();
        }

        removeFavorite(value) {
            const emoji = this.resolveEmojiIdentifier(value);
            if (!this.isFavorite(emoji)) return;
            this.favoriteEmojis.splice(this.favoriteEmojis.indexOf(emoji), 1);
            this.saveFavorites();
        }

        saveFavorites() {
            PluginUtilities.saveData(this.getName(), "favoriteEmojis", this.favoriteEmojis);
        }

        isResolvable(value) {
            return !!this.resolveEmoji(value);
        }

        resolveEmoji(value) {
            if (!value) return value;
            if (typeof(value) === "object") return !value.url && !value.allNamesString ? null : value; // if given an old emote, return null || if given emote, return emote

            const idMatch = value.match(emojiIdRegex); // Check if it's an ID first
            if (idMatch && idMatch.length == 2) return this.findEmoji(idMatch[1]);

            const surrogateToName = EmojiStore.convertSurrogateToName(value); // check if surrogate
            if (surrogateToName !== "::") value = surrogateToName; // if surrogate, use the original name

            const matched = value.match(DiscordModules.EmojiStore.EMOJI_NAME_RE); // Grab name if it has colons or diversity
            if (matched && matched.length == 2) return EmojiStore.getByName(matched[1]);

            const emoji = EmojiStore.getByName(value); // fallback to using value as the name
            if (emoji) return emoji;
            return null;
        }

        resolveEmojiIdentifier(value) {
            if (!value) return value;

            const idMatch = value.match(emojiIdRegex); // Check if it's an ID first
            if (idMatch && idMatch.length == 2) return idMatch[1];

            const surrogateToName = EmojiStore.convertSurrogateToName(value); // check if surrogate first
            if (surrogateToName !== "::") value = surrogateToName; // if surrogate, use the original name

            const matched = value.match(DiscordModules.EmojiStore.EMOJI_NAME_RE); // DiscordModules.EmojiStore.EMOJI_NAME_RE
            if (matched && matched.length == 2) return EmojiStore.getByName(matched[1]).uniqueName;

            const emoji = EmojiStore.getByName(value); // fallback to using value as the name
            if (emoji) return emoji.uniqueName;
            return null;
        }

        // resolveEmojiIdentifier(value) {
        //     if (!value) return value;
        //     const surrogateToName = EmojiStore.convertSurrogateToName(value); // check if surrogate first
        //     if (surrogateToName !== "::") value = surrogateToName; // if surrogate, use the original name
        //     const matched = value.match(DiscordModules.EmojiStore.EMOJI_NAME_RE); // DiscordModules.EmojiStore.EMOJI_NAME_RE
        //     if (matched && matched.length == 2) return EmojiStore.getByName(matched[1]).uniqueName;
        //     return value;
        // }

        findEmoji(id) {
            return Object.values(EmojiUtils.getGuilds()).map(m => m.emojis).flat().find(e => e.id == id);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/