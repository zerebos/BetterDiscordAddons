
module.exports = (Plugin, Api) => {

    return class EmojiUtilities extends Plugin {

        onStart() {
            Api.Modals.showAlertModal("EmojiUtilities Is Broken", "EmojiUtilities is currently broken. This update was to stop all the crashes and issues occurring from having this plugin enabled. Please be patient while I work to fix it.")
        }

    };

//     const {Patcher, WebpackModules, PluginUtilities, DiscordModules, ContextMenu, DiscordSelectors, ReactTools, Utilities, ReactComponents} = Api;

//     const EmojiUtils = DiscordModules.EmojiUtils;
//     const EmojiStore = DiscordModules.EmojiStore;
//     const ContextMenuActions = WebpackModules.getByProps("closeContextMenu");

//     const emojiIdRegex = new RegExp(`([0-9]{10,})`);
//     const emojiUrlRegex = new RegExp(`/([0-9]{10,})\\.`);
//     const emojiKeyRegex = new RegExp(`(.+)-[0-9]+-[0-9]+$`);

//     return class EmojiUtilities extends Plugin {
//         constructor() {
//             super();
// 			this.mainCSS =  `${DiscordSelectors.EmojiPicker.emojiPicker.value + DiscordSelectors.EmojiPicker.categories.value + DiscordSelectors.EmojiPicker.item.value}[aria-label="favorites"] {
//     background-image: url('data:image/svg+xml; utf8, <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" stroke-width="1" stroke="rgb(142, 149, 165)" fill="transparent"><path d="M11.500 16.250L17.084 19.186L16.018 12.968L20.535 8.564L14.292 7.657L11.500 2.000L8.708 7.657L2.465 8.564L6.982 12.968L5.916 19.186L11.500 16.250"/></svg>');
// }
// ${DiscordSelectors.EmojiPicker.emojiPicker.value + DiscordSelectors.EmojiPicker.categories.value + DiscordSelectors.EmojiPicker.item.value + DiscordSelectors.EmojiPicker.selected.value.trim()}[aria-label="favorites"],
// ${DiscordSelectors.EmojiPicker.emojiPicker.value + DiscordSelectors.EmojiPicker.categories.value + DiscordSelectors.EmojiPicker.item.value}[aria-label="favorites"]:hover {
//     background-image: url('data:image/svg+xml; utf8, <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" stroke-width="1" stroke="rgb(40, 43, 46)" fill="rgb(255, 214, 85)"><path d="M11.500 16.250L17.084 19.186L16.018 12.968L20.535 8.564L14.292 7.657L11.500 2.000L8.708 7.657L2.465 8.564L6.982 12.968L5.916 19.186L11.500 16.250"/></svg>');
// }`;
//         }
        
//         onStart() {
//             PluginUtilities.addStyle(this.getName()  + "-style", this.mainCSS);
//             this.disabledEmojis = PluginUtilities.loadData(this.getName(), "disabledEmojis", []);
//             this.favoriteEmojis = PluginUtilities.loadData(this.getName(), "favoriteEmojis", []);
//             this.disabledEmojis = this.disabledEmojis.filter(e => typeof(e) === "string");
//             this.favoriteEmojis = this.favoriteEmojis.filter(e => typeof(e) === "string");

//             const EmojiInfo = WebpackModules.getByProps("isEmojiDisabled");
//             Patcher.after(EmojiInfo, "isEmojiDisabled", (thisObject, methodArguments, returnValue) => {
//                 const emoji = methodArguments[0];
//                 if (emoji.uniqueName && this.disabledEmojis.includes(emoji.uniqueName)) return true;
//                 if (emoji.id && this.disabledEmojis.includes(emoji.id)) return true;
//                 return returnValue;
//             });

//             Patcher.after(EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
//                 const emoji = methodArguments[0];
//                 if (emoji.uniqueName && this.disabledEmojis.includes(emoji.uniqueName)) return true;
//                 if (emoji.id && this.disabledEmojis.includes(emoji.id)) return true;
//                 return returnValue;
//             });

//             const ReactionsComponent = WebpackModules.getByRegex(/reactionsCount/);
// 			Patcher.after(ReactionsComponent.prototype, "render", (thisObject, methodArguments, retVal) => {
//                 if (!retVal || !retVal.props || !retVal.props.children) return;
// 				const original = retVal.props.children;
// 				const myself = this;
// 				retVal.props.children = function() {
// 					const returnValue = original.apply(thisObject, arguments);
// 					if (!returnValue) return returnValue;
// 					const reactions = returnValue.props.children[0]; //[2].props.emoji array.splice(index, 1);
// 					let hiddenReactionCount = 0;
// 					for (let r = 0; r < reactions.length; r++) {
// 						const emoji = reactions[r].props.emoji;
// 						const resolved = myself.resolveEmojiIdentifier(emoji.id || emoji.name);
// 						if (resolved && myself.isBlacklisted(resolved)) {
// 							hiddenReactionCount += reactions[r].props.count;
// 							reactions.splice(r, 1);
// 							r = r - 1;
//                         }
// 					}
// 					if (hiddenReactionCount) {
// 						returnValue.props.children.splice(1, 0, DiscordModules.TextElement.default({
// 							style: {margin: "0 5px"},
// 							className: "reactions-hidden",
// 							size: DiscordModules.TextElement.Sizes.SMALL,
// 							color: DiscordModules.TextElement.Colors.GREY,
// 							children: [`${hiddenReactionCount} reactions hidden`]
// 						}));
// 					}
// 					return returnValue;
// 				};
//             });
//             this.patchReactionComponent();

//             //favorites
//             DiscordModules.Strings.EMOJI_CATEGORY_FAVORITES = "Favorites";
//             EmojiUtils.originalCategories = EmojiUtils.categories;
//             Object.defineProperty(EmojiUtils, "categories", {writable: true, value: ["favorites", ...EmojiUtils.originalCategories]});
//             //EmojiUtils.categories.splice(0, 0, "favorites");

//             // Add favorites category and filter other categories
//             Patcher.after(EmojiStore, "getByCategory", (_, args, returnValue) => {
//                 if (args[0] == "favorites") return this.favoriteEmojis.map(e => this.resolveEmoji(e)).filter(e => this.isResolvable(e));
//                 return returnValue.filter(e => !this.isBlacklisted(e.uniqueName));
//             });

//             // Patch "Frequently Used"
//             const EmojiUtilities = this;
//             Patcher.after(DiscordModules.EmojiUtils, "getDisambiguatedEmojiContext", (t, a, returnValue) => {
//                 const originalFunction = returnValue.getFrequentlyUsedEmojis;
//                 returnValue.getFrequentlyUsedEmojis = function() {
//                     const originalReturn = (originalFunction.bind(this))();
//                     return originalReturn.filter(e => !EmojiUtilities.isBlacklisted(e.id || e.uniqueName));
//                 };
//             });

//             this.patchEmojiComponent();
//             this.patchEmojiPicker();
//         }

//         async patchReactionComponent() {
//             const Reaction = await ReactComponents.getComponent("Reaction", DiscordSelectors.Reactions.reaction, m => m.displayName == "Reaction");
//             Patcher.after(Reaction.component.prototype, "render", (thisObject, args, returnValue) => {
//                 const emoji = Utilities.getNestedProp(returnValue, "props.children.props.children.props.children.0.props");
//                 const reactionInner = Utilities.getNestedProp(returnValue, "props.children.props.children.props");
//                 if (!emoji || !reactionInner) return;
//                 const resolved = this.resolveEmojiIdentifier(emoji.emojiId || emoji.emojiName);
//                 reactionInner.onContextMenu = (e) => {
//                     const isFavorite = this.isFavorite(resolved);
//                     const menu = new ContextMenu.Menu().addGroup(new ContextMenu.ItemGroup().addItems(
//                         new ContextMenu.TextItem("Blacklist Emoji", {callback: (e) => {
//                             e.stopPropagation();
//                             menu.removeMenu();
//                             this.addBlacklisted(resolved);
//                             thisObject.forceUpdate();
//                         }}),
//                         new ContextMenu.TextItem(isFavorite ? "Remove From Favorites" : "Favorite Emoji", {callback: (e) => {
//                             e.stopPropagation();
//                             menu.removeMenu();
//                             if (isFavorite) this.removeFavorite(resolved);
//                             else this.addFavorite(resolved);
//                             thisObject.forceUpdate();
//                         }})
//                     ));
//                     menu.show(e.clientX, e.clientY);
//                 };
//             });
//             Reaction.forceUpdateAll();
//         }

//         async patchEmojiComponent() {
//             const Emoji = await ReactComponents.getComponentByName("Emoji", ".emoji");
//             Patcher.after(Emoji.component.prototype, "render", (thisObject, methodArguments, returnValue) => {
//                 const emoji = this.resolveEmojiIdentifier(thisObject.props.emojiId || thisObject.props.emojiName);

//                 const isFavorite = this.isFavorite(emoji);
//                 const isBlacklisted = this.isBlacklisted(emoji);

//                 if (isBlacklisted) {
//                     const menu = new ContextMenu.Menu().addGroup(new ContextMenu.ItemGroup().addItems(
//                         new ContextMenu.TextItem("Remove From Blacklist", {callback: () => {
//                             menu.removeMenu();
//                             this.removeBlacklisted(emoji);
//                             thisObject.forceUpdate();
//                         }})
//                     ));
//                     return DiscordModules.TextElement.default({
//                         className: "blocked-emoji",
//                         children: [thisObject.props.emojiName],
//                         id: thisObject.props.emojiId,
//                         name: thisObject.props.emojiName.replace(/:/g, ""),
//                         color: DiscordModules.TextElement.Colors.GREY,
//                         onContextMenu: (e) => {
//                             e.stopPropagation();
//                             e.preventDefault();
//                             menu.show(e.clientX, e.clientY);
//                         },
//                         style: {
//                             display: "inline"
//                         }
//                     });
//                 }

//                 const menuGroup = new ContextMenu.ItemGroup().addItems(
//                     new ContextMenu.TextItem("Blacklist Emoji", {callback: () => {
//                         ContextMenuActions.closeContextMenu();
//                         this.addBlacklisted(emoji);
//                         thisObject.forceUpdate();
//                     }})
//                 );
//                 const favItem = new ContextMenu.TextItem(isFavorite ? "Remove From Favorites" : "Favorite Emoji", {callback: () => {
//                     ContextMenuActions.closeContextMenu();
//                     if (isFavorite) this.removeFavorite(emoji);
//                     else this.addFavorite(emoji);
//                     thisObject.forceUpdate();
//                 }});
//                 if (this.isResolvable(emoji)) menuGroup.addItems(favItem);
//                 returnValue.props.onContextMenu = async () => {
//                     const menu = await this.waitForContextMenu();
//                     //menu.append(menuGroup.element[0]);
//                     if (menu.querySelectorAll(DiscordSelectors.ContextMenu.itemGroup).length == 1) return;
//                     menu.querySelector(DiscordSelectors.ContextMenu.itemGroup).insertAdjacentElement("afterend", menuGroup.element);
//                     this.fixMenuLocation(menu);
//                 };

//                 // returnValue.props.onClick = () => {
//                 //     Modals.showConfirmationModal(thisObject.props.emojiName, "You clicked it, what did you expect.");
//                 // };

//                 return returnValue;
//             });
//             Emoji.forceUpdateAll();
//         }

//         // Add context menu to emojis in emoji picker
//         async patchEmojiPicker() {
//             const EmojiPicker = await ReactComponents.getComponentByName("EmojiPicker", DiscordSelectors.EmojiPicker.emojiPicker);
//             Patcher.after(EmojiPicker.component.prototype, "render", (thisObject, args, returnValue) => {
//                 const rows = returnValue.props.children[2].props.children;
//                 for (const row of rows) {
//                     if (!Array.isArray(row.props.children)) continue;
//                     const emojis = row.props.children;
//                     for (let e = 0; e < emojis.length; e++) {
//                         const emoji = emojis[e];
//                         emoji.props.identifier = emoji.key.split("-")[0];
//                         const matched = emoji.key.match(emojiKeyRegex); // Grab name if it has colons or diversity
//                         if (matched && matched.length == 2) emoji.props.identifier = matched[1];
//                         const urlmatched = emoji.props.style ? emoji.props.style.backgroundImage.match(emojiUrlRegex) : null;
//                         if (urlmatched && urlmatched.length == 2) emoji.props.identifier = urlmatched[1];
//                         emoji.props.onContextMenu = (e) => {
//                             const isFavorite = this.isFavorite(emoji.props.identifier);
//                             const menu = new ContextMenu.Menu().addGroup(new ContextMenu.ItemGroup().addItems(
//                                 new ContextMenu.TextItem("Blacklist Emoji", {callback: (e) => {
//                                     e.stopPropagation();
//                                     menu.removeMenu();
//                                     this.addBlacklisted(emoji.props.identifier);
//                                     thisObject.forceUpdate();
//                                 }}),
//                                 new ContextMenu.TextItem(isFavorite ? "Remove From Favorites" : "Favorite Emoji", {callback: (e) => {
//                                     e.stopPropagation();
//                                     menu.removeMenu();
//                                     if (isFavorite) this.removeFavorite(emoji.props.identifier);
//                                     else this.addFavorite(emoji.props.identifier);
//                                     thisObject.forceUpdate();
//                                 }})
//                             ));
//                             menu.element.css("z-index", "5000");
//                             menu.show(e.clientX, e.clientY);
//                         };
//                     }
//                 }
//             });
//             EmojiPicker.forceUpdateAll();
//         }

//         onStop() {
//             PluginUtilities.removeStyle(this.getName() + "-style");
//             Patcher.unpatchAll();
//             //if (EmojiUtils.categories.includes("favorites")) EmojiUtils.categories.splice(EmojiUtils.categories.indexOf("favorites"), 1);
//             if (EmojiUtils.originalCategories) EmojiUtils.categories = EmojiUtils.originalCategories;
//         }

//         isBlacklisted(value) {
//             const resolved = this.resolveEmojiIdentifier(value);
//             return this.disabledEmojis.includes(resolved);
//         }

//         addBlacklisted(value) {
//             const emoji = this.resolveEmojiIdentifier(value);
//             if (this.isBlacklisted(emoji) || this.isFavorite(emoji)) return;
//             this.disabledEmojis.push(emoji);
//             this.saveBlacklist();
//         }

//         removeBlacklisted(value) {
//             const emoji = this.resolveEmojiIdentifier(value);
//             if (!this.isBlacklisted(emoji)) return;
//             this.disabledEmojis.splice(this.disabledEmojis.indexOf(emoji), 1);
//             this.saveBlacklist();
//         }

//         saveBlacklist() {
//             PluginUtilities.saveData(this.getName(), "disabledEmojis", this.disabledEmojis);
//         }

//         isFavorite(value) {
//             const resolved = this.resolveEmojiIdentifier(value);
//             return this.favoriteEmojis.includes(resolved);
//         }

//         addFavorite(value) {
//             const emoji = this.resolveEmojiIdentifier(value);
//             if (this.isFavorite(emoji) || this.isBlacklisted(emoji)) return;
//             this.favoriteEmojis.push(emoji);
//             this.saveFavorites();
//         }

//         removeFavorite(value) {
//             const emoji = this.resolveEmojiIdentifier(value);
//             if (!this.isFavorite(emoji)) return;
//             this.favoriteEmojis.splice(this.favoriteEmojis.indexOf(emoji), 1);
//             this.saveFavorites();
//         }

//         saveFavorites() {
//             PluginUtilities.saveData(this.getName(), "favoriteEmojis", this.favoriteEmojis);
//         }

//         isResolvable(value) {
//             return !!this.resolveEmoji(value);
//         }

//         resolveEmoji(value) {
//             if (!value) return value;
//             if (typeof(value) === "object") return !value.url && !value.allNamesString ? null : value; // if given an old emote, return null || if given emote, return emote

//             const idMatch = value.match(emojiIdRegex); // Check if it's an ID first
//             if (idMatch && idMatch.length == 2) return this.findEmoji(idMatch[1]);

//             const surrogateToName = EmojiStore.convertSurrogateToName(value); // check if surrogate
//             if (surrogateToName !== "::") value = surrogateToName; // if surrogate, use the original name

//             const matched = value.match(DiscordModules.EmojiStore.EMOJI_NAME_RE); // Grab name if it has colons or diversity
//             if (matched && matched.length == 2) return EmojiStore.getByName(matched[1]);

//             const emoji = EmojiStore.getByName(value); // fallback to using value as the name
//             if (emoji) return emoji;
//             return null;
//         }

//         resolveEmojiIdentifier(value) {
//             if (!value) return value;

//             const idMatch = value.match(emojiIdRegex); // Check if it's an ID first
//             if (idMatch && idMatch.length == 2) return idMatch[1];

//             const surrogateToName = EmojiStore.convertSurrogateToName(value); // check if surrogate first
//             if (surrogateToName !== "::") value = surrogateToName; // if surrogate, use the original name

//             const matched = value.match(DiscordModules.EmojiStore.EMOJI_NAME_RE); // DiscordModules.EmojiStore.EMOJI_NAME_RE
//             if (matched && matched.length == 2) return EmojiStore.getByName(matched[1]).uniqueName;

//             const emoji = EmojiStore.getByName(value); // fallback to using value as the name
//             if (emoji) return emoji.uniqueName;
//             return null;
//         }

//         // resolveEmojiIdentifier(value) {
//         //     if (!value) return value;
//         //     const surrogateToName = EmojiStore.convertSurrogateToName(value); // check if surrogate first
//         //     if (surrogateToName !== "::") value = surrogateToName; // if surrogate, use the original name
//         //     const matched = value.match(DiscordModules.EmojiStore.EMOJI_NAME_RE); // DiscordModules.EmojiStore.EMOJI_NAME_RE
//         //     if (matched && matched.length == 2) return EmojiStore.getByName(matched[1]).uniqueName;
//         //     return value;
//         // }

//         findEmoji(id) {
//             return Object.values(EmojiUtils.getGuilds()).map(m => m.emojis).flat().find(e => e.id == id);
//         }

//         fixMenuLocation(menu) {
//             const owner = ReactTools.getOwnerInstance(menu);
//             if (!owner || !owner.props || !owner.props.onHeightUpdate) return;
//             owner.props.onHeightUpdate();
//         }

//         waitForContextMenu() {
//             return new Promise(resolve => {
//                 const observer = new MutationObserver(changes => {
//                     for (let m = 0; m < changes.length; m++) {
//                         const mutation = changes[m];
//                         const nodes = Array.from(mutation.addedNodes);
//                         const contextMenu = nodes.find(e => e instanceof Element && e.matches(DiscordSelectors.ContextMenu.contextMenu));
//                         if (!contextMenu) continue;
//                         observer.disconnect();
//                         resolve(contextMenu);
//                     }
//                 });
//                 observer.observe(document.documentElement, {childList: true, subtree: true});
//             });
//         }

//     };
};

// const EmojiPicker = WebpackModules.findByDisplayName("EmojiPicker");
// const EmojiUtils = DiscordModules.EmojiUtils;
// DiscordModules.EmojiUtils.originalCategories = DiscordModules.EmojiUtils.categories;
// Object.defineProperty(DiscordModules.EmojiUtils, "categories", {get: })

// Add custom category like above
// Override getByCategory to return favs
// Add title string
// var l = e === P.EMOJI_CATEGORY_RECENT ? c.getFrequentlyUsedEmojis() : T.default.getByCategory(e);
// u(e, m.default.Messages["EMOJI_CATEGORY_" + e.toUpperCase()], l)


