//META{"name":"EmojiUtilities","displayName":"EmojiUtilities","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/EmojiUtilities","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmojiUtilities/EmojiUtilities.plugin.js"}*//
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

var EmojiUtilities = (() => {
    const config = {"info":{"name":"EmojiUtilities","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.4","description":"Allows you to blacklist and favorite emojis. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/EmojiUtilities","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmojiUtilities/EmojiUtilities.plugin.js"},"changelog":[{"title":"Why","type":"fixed","items":["Discord keeps messing stuff up."]}],"main":"index.js"};

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
    const {Patcher, WebpackModules, PluginUtilities, DiscordModules, ContextMenu, DiscordSelectors, ReactTools, Utilities, ReactComponents} = Api;

    const EmojiUtils = DiscordModules.EmojiUtils;
    const EmojiStore = DiscordModules.EmojiStore;
    const ContextMenuActions = WebpackModules.getByProps("closeContextMenu");

    const emojiIdRegex = new RegExp(`([0-9]{10,})`);
    const emojiUrlRegex = new RegExp(`/([0-9]{10,})\\.`);
    const emojiKeyRegex = new RegExp(`(.+)-[0-9]+-[0-9]+$`);

    return class EmojiUtilities extends Plugin {
        onStart() {
            this.disabledEmojis = PluginUtilities.loadData(this.getName(), "disabledEmojis", []);
            this.favoriteEmojis = PluginUtilities.loadData(this.getName(), "favoriteEmojis", []);
            this.disabledEmojis = this.disabledEmojis.filter(e => typeof(e) === "string");
            this.favoriteEmojis = this.favoriteEmojis.filter(e => typeof(e) === "string");

            let EmojiInfo = WebpackModules.getByProps("isEmojiDisabled");
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

            const ReactionsComponent = WebpackModules.getByRegex(/reactionsCount/);
			Patcher.after(ReactionsComponent.prototype, "render", (thisObject, methodArguments, retVal) => {
                if (!retVal || !retVal.props || !retVal.props.children) return;
				const original = retVal.props.children;
				const myself = this;
				retVal.props.children = function() {
					const returnValue = original.apply(thisObject, arguments);
					if (!returnValue) return returnValue;
					const reactions = returnValue.props.children[0]; //[2].props.emoji array.splice(index, 1);
					let hiddenReactionCount = 0;
					for (let r = 0; r < reactions.length; r++) {
						const emoji = reactions[r].props.emoji;
						const resolved = myself.resolveEmojiIdentifier(emoji.id || emoji.name);
						if (resolved && myself.isBlacklisted(resolved)) {
							hiddenReactionCount += reactions[r].props.count;
							reactions.splice(r, 1);
							r = r - 1;
                        }
					}
					if (hiddenReactionCount) {
						returnValue.props.children.splice(1, 0, DiscordModules.TextElement.default({
							style: {margin: "0 5px"},
							className: "reactions-hidden",
							size: DiscordModules.TextElement.Sizes.SMALL,
							color: DiscordModules.TextElement.Colors.GREY,
							children: [`${hiddenReactionCount} reactions hidden`]
						}));
					}
					return returnValue;
				};
            });
            this.patchReactionComponent();

            //favorites
            DiscordModules.Strings.EMOJI_CATEGORY_FAVORITES = "Favorites";
            EmojiUtils.originalCategories = EmojiUtils.categories;
            Object.defineProperty(EmojiUtils, "categories", {writable: true, value: ["favorites", ...EmojiUtils.originalCategories]});
            //EmojiUtils.categories.splice(0, 0, "favorites");

            // Add favorites category and filter other categories
            Patcher.after(EmojiStore, "getByCategory", (_, args, returnValue) => {
                if (args[0] == "favorites") return this.favoriteEmojis.map(e => this.resolveEmoji(e)).filter(e => this.isResolvable(e));
                return returnValue.filter(e => !this.isBlacklisted(e.uniqueName));
            });

            // Patch "Frequently Used"
            const EmojiUtilities = this;
            Patcher.after(DiscordModules.EmojiUtils, "getDisambiguatedEmojiContext", (t, a, returnValue) => {
                const originalFunction = returnValue.getFrequentlyUsedEmojis;
                returnValue.getFrequentlyUsedEmojis = function() {
                    const originalReturn = (originalFunction.bind(this))();
                    return originalReturn.filter(e => !EmojiUtilities.isBlacklisted(e.id || e.uniqueName));
                };
            });

            this.patchEmojiComponent();
            this.patchEmojiPicker();
        }

        async patchReactionComponent() {
            const Reaction = await ReactComponents.getComponent("Reaction", DiscordSelectors.Reactions.reaction, m => m.displayName == "Reaction");
            Patcher.after(Reaction.component.prototype, "render", (thisObject, args, returnValue) => {
                const emoji = Utilities.getNestedProp(returnValue, "props.children.props.children.props.children.0.props");
                const reactionInner = Utilities.getNestedProp(returnValue, "props.children.props.children.props");
                if (!emoji || !reactionInner) return;
                const resolved = this.resolveEmojiIdentifier(emoji.emojiId || emoji.emojiName);
                reactionInner.onContextMenu = (e) => {
                    const isFavorite = this.isFavorite(resolved);
                    const menu = new ContextMenu.Menu().addGroup(new ContextMenu.ItemGroup().addItems(
                        new ContextMenu.TextItem("Blacklist Emoji", {callback: (e) => {
                            e.stopPropagation();
                            menu.removeMenu();
                            this.addBlacklisted(resolved);
                            thisObject.forceUpdate();
                        }}),
                        new ContextMenu.TextItem(isFavorite ? "Remove From Favorites" : "Favorite Emoji", {callback: (e) => {
                            e.stopPropagation();
                            menu.removeMenu();
                            if (isFavorite) this.removeFavorite(resolved);
                            else this.addFavorite(resolved);
                            thisObject.forceUpdate();
                        }})
                    ));
                    menu.show(e.clientX, e.clientY);
                };
            });
            Reaction.forceUpdateAll();
        }

        async patchEmojiComponent() {
            const Emoji = await ReactComponents.getComponentByName("Emoji", ".emoji");
            Patcher.after(Emoji.component.prototype, "render", (thisObject, methodArguments, returnValue) => {

                const emoji = this.resolveEmojiIdentifier(returnValue.props.emojiId || returnValue.props.emojiName);
                const isFavorite = this.isFavorite(emoji);
                const isBlacklisted = this.isBlacklisted(emoji);

                if (isBlacklisted) {
                    const menu = new ContextMenu.Menu().addGroup(new ContextMenu.ItemGroup().addItems(
                        new ContextMenu.TextItem("Remove From Blacklist", {callback: () => {
                            menu.removeMenu();
                            this.removeBlacklisted(emoji);
                            thisObject.forceUpdate();
                        }})
                    ));
                    return DiscordModules.TextElement.default({
                        className: "blocked-emoji",
                        children: [returnValue.props.emojiName],
                        id: returnValue.props.emojiId,
                        name: returnValue.props.emojiName.replace(/:/g, ""),
                        color: DiscordModules.TextElement.Colors.GREY,
                        onContextMenu: (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            menu.show(e.clientX, e.clientY);
                        }
                    });
                }

                const menuGroup = new ContextMenu.ItemGroup().addItems(
                    new ContextMenu.TextItem("Blacklist Emoji", {callback: () => {
                        ContextMenuActions.closeContextMenu();
                        this.addBlacklisted(emoji);
                        thisObject.forceUpdate();
                    }})
                );
                const favItem = new ContextMenu.TextItem(isFavorite ? "Remove From Favorites" : "Favorite Emoji", {callback: () => {
                    ContextMenuActions.closeContextMenu();
                    if (isFavorite) this.removeFavorite(emoji);
                    else this.addFavorite(emoji);
                    thisObject.forceUpdate();
                }});
                if (this.isResolvable(emoji)) menuGroup.addItems(favItem);
                returnValue.props.onContextMenu = async () => {
                    const menu = await this.waitForContextMenu();
                    //menu.append(menuGroup.element[0]);
                    if (menu.querySelectorAll(DiscordSelectors.ContextMenu.itemGroup).length == 1) return;
                    menu.querySelector(DiscordSelectors.ContextMenu.itemGroup).insertAdjacentElement("afterend", menuGroup.element);
                    this.fixMenuLocation(menu);
                };

                // returnValue.props.onClick = () => {
                //     Modals.showConfirmationModal(thisObject.props.emojiName, "You clicked it, what did you expect.");
                // };
                
                return returnValue;
            });
            Emoji.forceUpdateAll();
        }

        // Add context menu to emojis in emoji picker
        async patchEmojiPicker() {
            const EmojiPicker = await ReactComponents.getComponentByName("EmojiPicker", DiscordSelectors.EmojiPicker.emojiPicker);
            Patcher.after(EmojiPicker.component.prototype, "render", (thisObject, args, returnValue) => {
                const rows = returnValue.props.children[2].props.children;
                for (let row of rows) {
                    if (!Array.isArray(row.props.children)) continue;
                    const emojis = row.props.children;
                    for (let e = 0; e < emojis.length; e++) {
                        const emoji = emojis[e];
                        emoji.props.identifier = emoji.key.split("-")[0];
                        const matched = emoji.key.match(emojiKeyRegex); // Grab name if it has colons or diversity
                        if (matched && matched.length == 2) emoji.props.identifier = matched[1];
                        if (emoji.props.style) emoji.props.identifier = emoji.props.style.backgroundImage.match(emojiUrlRegex)[1];
                        emoji.props.onContextMenu = (e) => {
                            const isFavorite = this.isFavorite(emoji.props.identifier);
                            const menu = new ContextMenu.Menu().addGroup(new ContextMenu.ItemGroup().addItems(
                                new ContextMenu.TextItem("Blacklist Emoji", {callback: (e) => {
                                    e.stopPropagation();
                                    menu.removeMenu();
                                    this.addBlacklisted(emoji.props.identifier);
                                    thisObject.forceUpdate();
                                }}),
                                new ContextMenu.TextItem(isFavorite ? "Remove From Favorites" : "Favorite Emoji", {callback: (e) => {
                                    e.stopPropagation();
                                    menu.removeMenu();
                                    if (isFavorite) this.removeFavorite(emoji.props.identifier);
                                    else this.addFavorite(emoji.props.identifier);
                                    thisObject.forceUpdate();
                                }})
                            ));
                            menu.element.css("z-index", "5000");
                            menu.show(e.clientX, e.clientY);
                        };
                    }
                }
            });
            EmojiPicker.forceUpdateAll();
        }
        
        onStop() {
            Patcher.unpatchAll();
            //if (EmojiUtils.categories.includes("favorites")) EmojiUtils.categories.splice(EmojiUtils.categories.indexOf("favorites"), 1);
            if (EmojiUtils.originalCategories) EmojiUtils.categories = EmojiUtils.originalCategories;
        }

        isBlacklisted(value) {
            const resolved = this.resolveEmojiIdentifier(value);
            return this.disabledEmojis.includes(resolved);
        }

        addBlacklisted(value) {
            const emoji = this.resolveEmojiIdentifier(value);
            if (this.isBlacklisted(emoji) || this.isFavorite(emoji)) return;
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
            if (this.isFavorite(emoji) || this.isBlacklisted(emoji)) return;
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
            if (typeof(value) === "object") return value; // if given emote, return emote

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
            return Object.values(EmojiUtils.getGuilds()).map(m => m.emojis).flatten().find(e => e.id == id);
        }

        fixMenuLocation(menu) {
            const owner = ReactTools.getOwnerInstance(menu);
            if (!owner || !owner.props || !owner.props.onHeightUpdate) return;
            owner.props.onHeightUpdate();
        }

        waitForContextMenu() {
            return new Promise(resolve => {
                const observer = new MutationObserver(changes => {
                    for (let m = 0; m < changes.length; m++) {
                        const mutation = changes[m];
                        const nodes = Array.from(mutation.addedNodes);
                        const contextMenu = nodes.find(e => e instanceof Element && e.matches(DiscordSelectors.ContextMenu.contextMenu));
                        if (!contextMenu) continue;
                        observer.disconnect();
                        resolve(contextMenu);
                    }
                });
                observer.observe(document.documentElement, {childList: true, subtree: true});
            });
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/