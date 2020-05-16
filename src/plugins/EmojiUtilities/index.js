
module.exports = (Plugin, Api) => {

    const {Patcher, WebpackModules, PluginUtilities, DiscordModules, Utilities, ReactComponents, DCM} = Api;

    const FavoriteIcon = require("favorite_icon.js")(Api);
    const DisabledIcon = require("blacklist_icon.js")(Api);

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
            Utilities.suppressErrors(this.patchMessageContextMenu.bind(this), "Message Context Menu Patch")(this.promises);
            Utilities.suppressErrors(this.patchEmojiPicker.bind(this), "Emoji Picker Patch")(this.promises);
            Utilities.suppressErrors(this.patchReactions.bind(this), "Reactions Patch")();
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
            if (EmojiUtils.originalCategories) EmojiUtils.categories = EmojiUtils.originalCategories;
        }

        addCategories() {
            DiscordModules.Strings.EMOJI_CATEGORY_FAVORITES = "Favorites";
            EmojiUtils.originalCategories = EmojiUtils.categories;
            Object.defineProperty(EmojiUtils, "categories", {writable: true, value: ["favorites", ...EmojiUtils.originalCategories, "blacklist"]});

            // Add favorites and blacklist categories
            Patcher.after(EmojiStore, "getByCategory", (_, args) => {
                if (args[0] == "favorites") return this.favoriteEmojis.map(e => this.resolveEmoji(e)).filter(e => this.isResolvable(e));
                if (args[0] == "blacklist") return this.disabledEmojis.map(e => this.resolveEmoji(e)).filter(e => this.isResolvable(e));
            });

            // Give the fake categories an icon
            const EmojiCategoryIcon = WebpackModules.getModule(m => m.default && m.default.type && m.default.type.toString().includes("FOOD"));
            Patcher.after(EmojiCategoryIcon.default, "type", (_, [props]) => {
                if (props.categoryId == "favorites") return DiscordModules.React.createElement(FavoriteIcon, props);
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
                if (args[0] == "favorites" || args[0] == "blacklist") return;
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
                            const menu = DCM.buildMenu([
                                {type: "group", items: [
                                    {label: "Remove From Blacklist", closeOnClick: true, action: () => {
                                        this.removeBlacklisted(emoji);
                                        thisObject.forceUpdate();
                                    }},
                                ]}
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

        async patchMessageContextMenu(promiseState) {
            const MessageContextMenu = await PluginUtilities.getContextMenu("MESSAGE_MAIN");
            if (promiseState.cancelled) return;

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
                        const menu = DCM.buildMenu([
                            {type: "group", items: [
                                {label: isBlacklisted ? "Remove From Blacklist" : "Blacklist Emoji", closeOnClick: true, action: () => {
                                    if (isBlacklisted) this.removeBlacklisted(emoji);
                                    else this.addBlacklisted(emoji);
                                }},
                                {label: isFavorite ? "Remove Favorite" : "Favorite Emoji", closeOnClick: true, action: () => {
                                    if (isFavorite) this.removeFavorite(emoji);
                                    else this.addFavorite(emoji);
                                }},
                            ]}
                        ]);
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