/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, Utilities} = Api;
    return class HideDisabledEmojis extends Plugin {
        async onStart() {            
            Patcher.after(DiscordModules.EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
                return returnValue || DiscordModules.EmojiInfo.isEmojiDisabled(methodArguments[0], methodArguments[1]);
            });

            // BdApi.Webpack.Filters.byStrings("topEmojis", "getDisambiguatedEmojiContext")
            let key = "";
            const categoryMemo = WebpackModules.getModule(m => {
                if (typeof(m) !== "object") return false;
                const keys = Object.keys(m);
                if (!keys.length) return false;
                for (let k = 0; k < keys.length; k++) {
                    const val = m[keys[k]];
                    if (typeof(val?.toString) !== "function") continue;
                    const first = val.toString().includes("topEmojis");
                    const second = val.toString().includes("getDisambiguatedEmojiContext");
                    if (first && second) {
                        key = keys[k];
                        return true;
                    }
                }
                return false;
            });

            if (key && categoryMemo) {
                Patcher.before(categoryMemo, key, (_, args) => {
                    // arg 0 = picker intention
                    // arg 1 = channel object
                    // arg 2 = guild id
                    // Create a fake channel object with a null guild id
                    // This fake object forces the categories to check isEmojiFiltered
                    if (args[1] == null) {
                        args[1] = {
                            getGuildId: () => null
                        };
                    }
                });
            }

            const doFiltering = props => {
                props.rowCountBySection = props.rowCountBySection.filter((c, i) => c || props.collapsedSections.has(props.sectionDescriptors[i].sectionId));
                props.sectionDescriptors = props.sectionDescriptors.filter(s => s.count || props.collapsedSections.has(s.sectionId));
                
                const wasFiltered = props.emojiGrid.filtered;
                props.emojiGrid = props.emojiGrid.filter(r => r.length);
                if (wasFiltered) props.emojiGrid.filtered = true; // Reassign
            };

            const PickerWrapMemo = WebpackModules.getModule(m => m?.type?.render?.toString?.()?.includes("EMOJI_PICKER_POPOUT"));
            Patcher.after(PickerWrapMemo.type, "render", (_, [inputProps], ret) => {
                const pickerChild = Utilities.findInTree(ret, m => m?.props?.emojiGrid, {walkable: ["props", "children"]});
                if (!pickerChild?.type?.type) return;
                ret.props.children.props.page = "DM Channel";
                if (pickerChild.type.type.__patched) return;
                Patcher.before(pickerChild.type, "type", (_, [props]) => {
                    if (!props.rowCountBySection) return;
                    if (props.emojiGrid.filtered) return doFiltering(props);
                    props.emojiGrid.filtered = true;
                    let row = 0;
                    for (let s = 0; s < props.sectionDescriptors.length; s++) {
                        const section = props.sectionDescriptors[s];
                        const rowCount = props.rowCountBySection[s];
                        const rowEnd = row + rowCount - 1;
                        let countLeft = 0;
                        let rowsLeft = 0;
                        for (let r = row; r <= rowEnd; r++) {
                            // If it's not disabled or if it's the upload button in status picker
                            props.emojiGrid[r] = props.emojiGrid[r].filter(e => !e.isDisabled && (e.type !== 1 || inputProps?.pickerIntention !== 1));
                            const remaining = props.emojiGrid[r].length;
                            if (remaining) {
                                rowsLeft = rowsLeft + 1;
                                countLeft = countLeft + remaining;
                            }
                        }
                        section.count = countLeft;
                        props.rowCountBySection[s] = rowsLeft;
    
                        row = rowEnd + 1;
                    }
    
                    doFiltering(props);
                });
                pickerChild.type.type.__patched = true;
            });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};