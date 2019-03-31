
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, ReactComponents, DiscordSelectors} = Api;
    return class HideDisabledEmojis extends Plugin {
        async onStart() {            
            Patcher.after(DiscordModules.EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
                return returnValue || DiscordModules.EmojiInfo.isEmojiDisabled(methodArguments[0], methodArguments[1]);
            });

            const EmojiPicker = await ReactComponents.getComponentByName("EmojiPicker", DiscordSelectors.EmojiPicker.emojiPicker);
            Patcher.before(EmojiPicker.prototype, "render", (thisObject) => {
                let cats = thisObject.categories;
                let filtered = thisObject.computeMetaData();
                let newcats = {};

                for (let c of filtered) newcats[c.category] ? newcats[c.category] += 1 : newcats[c.category] = 1;

                let i = 0;
                for (let cat of cats) {
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
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};