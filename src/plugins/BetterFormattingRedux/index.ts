import Plugin from "@common/plugin";

import type {Meta} from "@betterdiscord/meta";
import type {SettingGroup} from "@betterdiscord/api/ui";
import type {Component, RefObject} from "react";
import type {Message} from "@discord";
import type {ClassModule} from "@discord/modules";

import Config from "./config";
import ToolbarData from "./toolbar";
import Languages from "./languages";
import Toolbar from "./Toolbar.svelte";
import {mount, unmount} from "svelte";


const {ContextMenu, Patcher, ReactUtils, Webpack, Logger} = BdApi;

const MessageActions = Webpack.getByKeys<{sendMessage(): void}>("jumpToMessage", "_sendMessage");
const TextareaClasses = Webpack.getByKeys<ClassModule>("channelTextArea", "textArea") ?? {textArea: "textArea_bdf0de"};

interface ToolbarInstance {
    close: () => void;
}

interface ToolbarEntry {
    container: HTMLDivElement;
    instance: ToolbarInstance;
}

export default class BetterFormattingRedux extends Plugin {
    customWrappers: string[];
    buttonOrder: string[];
    toolbarOpen: boolean = false;
    toolbarEntries: ToolbarEntry[] = [];

    discordWrappers: Record<string, string> = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```", spoiler: "||"};
    replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
    smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ{|}";
    superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
    upsideDownList = " ¡\"#$%℘,)(*+'-˙/0Ɩ↊Ɛ߈ϛ9ㄥ86:;>=<¿@∀ᗺƆᗡƎℲꓨHIՐꓘꓶWNOԀꝹꓤSꓕꓵΛMX⅄Z]\\[^‾,ɐqɔpǝɟᵷɥᴉɾʞꞁɯuodbɹsʇnʌʍxʎz}|{";
    fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
    leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";
    thiccList = "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙{|}";

    constructor(meta: Meta) {
        super(meta, Config);

        this.customWrappers = (this.manifest.config?.find(g => g.id === "wrappers") as SettingGroup).settings.map(s => s.id);
        this.buttonOrder = (this.manifest.config?.find(g => g.id === "toolbar") as SettingGroup).settings.map(s => s.id);
    }

    onStart() {
        this.setupToolbar();

        if (!MessageActions) return Logger.error(this.meta.name, "Could not find MessageActions module!");
        Patcher.before(this.meta.name, MessageActions, "sendMessage", (_, [, msg]: [unknown, Message]) => {
            msg.content = this.format(msg.content);
        });
    }

    onStop() {
        Patcher.unpatchAll(this.meta.name);
        this.removeAllToolbars();
    }

    observer(e: MutationRecord) {
        if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;

        const elem = e.addedNodes[0];
        const textarea = elem.matches(`.${TextareaClasses.textArea}`) ? elem : elem.querySelector(`.${TextareaClasses.textArea}`);
        if (textarea) this.addToolbar(textarea as HTMLDivElement);
    }

    getButtonsConfig() {
        return this.buttonOrder
            .map(key => {
                const name = key.replace("Button", "") as keyof typeof ToolbarData;
                if (!ToolbarData[name]) return null;
                if (!this.settings[key]) return null;
                return {
                    key: name,
                    type: ToolbarData[name].type,
                    name: ToolbarData[name].name,
                    displayName: ToolbarData[name].displayName,
                    icon: ToolbarData[name].icon,
                };
            })
            .filter(Boolean) as Array<{key: string; type: string; name: string; displayName: string; icon: string;}>;
    }

    removeAllToolbars() {
        for (const entry of this.toolbarEntries) {
            unmount(entry.instance as ReturnType<typeof mount>);
            entry.container.remove();
        }
        this.toolbarEntries = [];
    }

    setupToolbar() {
        this.removeAllToolbars();
        document.querySelectorAll(`.${TextareaClasses.textArea}`).forEach(elem => {
            this.addToolbar(elem.children[0] as HTMLDivElement);
        });
    }

    addToolbar(textarea: HTMLDivElement) {
        const inner = textarea.parentElement?.parentElement;
        if (!inner) return;

        const container = document.createElement("div");
        const instance = mount(Toolbar, {
            target: container,
            props: {
                buttons: this.getButtonsConfig(),
                useIcons: this.settings.useIcons as boolean,
                hoverOpen: this.settings.hoverOpen as boolean,
                rightSide: this.settings.rightSide as boolean,
                opacity: this.settings.toolbarOpacity as number,
                fontSize: this.settings.fontSize as number,
                initiallyOpen: this.toolbarOpen,
                onButtonClick: (key: string) => this.onButtonClick(key),
                onCodeblockContext: (e: MouseEvent) => {
                    ContextMenu.open(e, this.getContextMenu());
                },
                onToggle: (isOpen: boolean) => {
                    this.toolbarOpen = isOpen;
                },
            },
        }) as unknown as ToolbarInstance;

        inner.parentElement?.insertBefore(container, inner.nextSibling);
        this.toolbarEntries.push({container, instance});
    }

    onButtonClick(key: string) {
        const wrapper = this.discordWrappers[key] ?? this.settings[key + "Wrapper"] as string;
        this.wrapSelection(wrapper);
    }

    escape(s: string) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    doFormat(text: string, wrapper: string, offset: number) {

        // If this is not a wrapper, return original
        if (text.substring(offset, offset + wrapper.length) != wrapper) return text;

        let returnText = text;
        const len = text.length;
        const begin = text.indexOf(wrapper, offset);

        if (text[begin - 1] == "\\") return text; // If the wrapper is escaped, remove the backslash and return the text

        let end = text.indexOf(wrapper, begin + wrapper.length);
        if (end != -1) end += wrapper.length - 1;

        // Making it to this point means that we have found a full wrapper
        // This block performs inner chaining
        if (this.settings.chainFormats) {
            for (let w = 0; w < this.customWrappers.length; w++) {
                const newText = this.doFormat(returnText, this.settings[this.customWrappers[w]] as string, begin + wrapper.length);
                if (returnText != newText) {
                    returnText = newText;
                    end = end - (this.settings[this.customWrappers[w]] as string).length * 2;
                }
            }
        }

        returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
            let letterNum = 0;
            middle = middle.replace(/./g, (letter: string) => {
                const index = this.replaceList.indexOf(letter);
                letterNum += 1;
                if (wrapper == this.settings.fullwidthWrapper) {
                    if (this.settings.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
                    return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
                }
                else if (wrapper == this.settings.superscriptWrapper) {return index != -1 ? this.superscriptList[index] : letter;}
                else if (wrapper == this.settings.smallcapsWrapper) {return index != -1 ? this.smallCapsList[index] : letter;}
                else if (wrapper == this.settings.upsidedownWrapper) {return index != -1 ? this.upsideDownList[index] : letter;}
                else if (wrapper == this.settings.leetWrapper) {return index != -1 ? this.leetList[index] : letter;}
                else if (wrapper == this.settings.thiccWrapper) {return index != -1 ? this.thiccList[index] : letter;}
                else if (wrapper == this.settings.variedWrapper) {
                    const compare = this.settings.startCaps ? 1 : 0;
                    if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
                    return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
                }
                else if (wrapper == this.settings.firstcapsWrapper) {
                    if (letterNum == 1 || middle[letterNum - 2] === " ") return letter.toUpperCase();
                }
                else if (wrapper == this.settings.uppercaseWrapper) {return letter.toUpperCase();}
                else if (wrapper == this.settings.lowercaseWrapper) {return letter.toLowerCase();}
                return letter;
            });
            if (wrapper == this.settings.upsidedownWrapper && this.settings.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
            return before + middle + after;
        });

        return returnText;
    }

    format(string: string) {
        let text = string;
        for (let i = 0; i < text.length; i++) {
            if (text[i] == "`") {
                const next = text.indexOf("`", i + 1);
                if (next != -1) i = next;
            }
            else if (text[i] == "@") {
                const match = /@.*#[0-9]*/.exec(text.substring(i));
                if (match && match.index == 0) i += match[0].length - 1;
            }
            else {
                for (let w = 0; w < this.customWrappers.length; w++) {
                    if (!this.settings[this.customWrappers[w].replace("Wrapper", "Format")]) continue;
                    const newText = this.doFormat(text, this.settings[this.customWrappers[w]] as string, i);
                    if (text != newText) {
                        text = newText;
                        i = i - (this.settings[this.customWrappers[w]] as string).length * 2;
                    }
                }
            }
        }
        if (this.settings.closeOnSend) {
            for (const entry of this.toolbarEntries) entry.instance.close();
        }
        return text;
    }

    async wrapSelection(leftWrapper: string, rightWrapper?: string) {
        if (!rightWrapper) rightWrapper = leftWrapper;
        if (leftWrapper.startsWith("```")) leftWrapper = leftWrapper + "\n";
        if (rightWrapper.startsWith("```")) rightWrapper = "\n" + rightWrapper;
        const textarea = document.querySelector<HTMLDivElement | HTMLTextAreaElement>(`.${TextareaClasses.textArea}`);
        if (!textarea) return;
        if (textarea.tagName === "TEXTAREA") return this.oldWrapSelection(textarea as HTMLTextAreaElement, leftWrapper, rightWrapper);
        const slateNode = ReactUtils.getOwnerInstance(textarea) as Component & {focus(): void; ref: RefObject<{getSlateEditor(): {selection: {anchor: {path: string, offset: number}, focus: {path: string, offset: number}}, apply<T>(o: T): void;};}>;};
        const slate = slateNode?.ref?.current?.getSlateEditor();
        if (!slate) return; // bail out if no slate

        let offset; // new cursor offset

        if (slate.selection.anchor.offset <= slate.selection.focus.offset) {
            offset = slate.selection.focus.offset + leftWrapper.length;
            slate.apply({type: "insert_text", text: leftWrapper, path: slate.selection.anchor.path, offset: slate.selection.anchor.offset});
            slate.apply({type: "insert_text", text: rightWrapper, path: slate.selection.focus.path, offset: slate.selection.focus.offset});
        }
        else {
            offset = slate.selection.anchor.offset + leftWrapper.length;
            slate.apply({type: "insert_text", text: rightWrapper, path: slate.selection.anchor.path, offset: slate.selection.anchor.offset});
            slate.apply({type: "insert_text", text: leftWrapper, path: slate.selection.focus.path, offset: slate.selection.focus.offset});
        }

        // new selection data
        const newSelection = {
            anchor: {path: slate.selection.anchor.path, offset: offset},
            focus: {path: slate.selection.focus.path, offset: offset}
        };

        slate.selection = newSelection; // update selection data
        slate.apply({type: "insert_text", text: "", path: slate.selection.anchor.path, offset: offset}); // update cursor position
        slateNode.focus();
    }

    oldWrapSelection(textarea: HTMLTextAreaElement, leftWrapper: string, rightWrapper: string) {
        let text = textarea.value;
        const start = textarea.selectionStart;
        const len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
        text = leftWrapper + text.substring(textarea.selectionStart, textarea.selectionEnd) + rightWrapper;
        textarea.focus();
        document.execCommand("insertText", false, text);
        textarea.selectionStart = start + leftWrapper.length;
        textarea.selectionEnd = textarea.selectionStart + len;
    }

    getContextMenu() {
        return ContextMenu.buildMenu(
            Object.keys(Languages).map((letter: keyof typeof Languages) => {
                return {
                    type: "submenu",
                    label: letter,
                    items: Object.keys(Languages[letter]).map(language => {
                        return {
                            label: Languages[letter][language as keyof typeof Languages[keyof typeof Languages]],
                            action: () => {this.wrapSelection("```" + language, "```");}
                        };
                    })
                };
            })
        );
    }

    getSettingsPanel() {
        return this.buildSettingsPanel(this.updateSettings.bind(this));
    }

    updateSettings(group: string, id: string, value: unknown) {
        if (group === "toolbar" || group === "style") {
            this.setupToolbar();
        }
        if (group === "plugin" && id === "hoverOpen") {
            if (value === true) this.toolbarOpen = false;
            this.setupToolbar();
        }
    }
}