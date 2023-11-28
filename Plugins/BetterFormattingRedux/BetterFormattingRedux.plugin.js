/**
 * @name BetterFormattingRedux
 * @description Enables different types of formatting in standard Discord chat.
 * @version 2.3.14
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterFormattingRedux
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js
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
        name: "BetterFormattingRedux",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "2.3.14",
        description: "Enables different types of formatting in standard Discord chat.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterFormattingRedux",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js"
    },
    changelog: [
        {
            title: "GUI Works Again",
            type: "fixed",
            items: [
                "Clicking the buttons works again!",
                "Dragging to reorder the buttons is broken."
            ]
        }
    ],
    main: "index.js",
    defaultConfig: [
        {
            type: "category",
            id: "toolbar",
            name: "Toolbar Buttons",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "bold",
                    name: "Bold",
                    value: true
                },
                {
                    type: "switch",
                    id: "italic",
                    name: "Italic",
                    value: true
                },
                {
                    type: "switch",
                    id: "underline",
                    name: "Underline",
                    value: true
                },
                {
                    type: "switch",
                    id: "strikethrough",
                    name: "Strikethrough",
                    value: true
                },
                {
                    type: "switch",
                    id: "spoiler",
                    name: "Spoiler",
                    value: true
                },
                {
                    type: "switch",
                    id: "code",
                    name: "Code",
                    value: true
                },
                {
                    type: "switch",
                    id: "codeblock",
                    name: "Codeblock",
                    value: true
                },
                {
                    type: "switch",
                    id: "superscript",
                    name: "Superscript",
                    value: true
                },
                {
                    type: "switch",
                    id: "smallcaps",
                    name: "Smallcaps",
                    value: true
                },
                {
                    type: "switch",
                    id: "fullwidth",
                    name: "Full Width",
                    value: true
                },
                {
                    type: "switch",
                    id: "upsidedown",
                    name: "Upsidedown",
                    value: true
                },
                {
                    type: "switch",
                    id: "varied",
                    name: "Varied Caps",
                    value: true
                },
                {
                    type: "switch",
                    id: "leet",
                    name: "Leet (1337)",
                    value: false
                },
                {
                    type: "switch",
                    id: "thicc",
                    name: "Extra Thicc",
                    value: false
                }
            ]
        },
        {
            type: "category",
            id: "formats",
            name: "Active Formats",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "superscript",
                    name: "Superscript",
                    value: true
                },
                {
                    type: "switch",
                    id: "smallcaps",
                    name: "Smallcaps",
                    value: true
                },
                {
                    type: "switch",
                    id: "fullwidth",
                    name: "Full Width",
                    value: true
                },
                {
                    type: "switch",
                    id: "upsidedown",
                    name: "Upsidedown",
                    value: true
                },
                {
                    type: "switch",
                    id: "varied",
                    name: "Varied Caps",
                    value: true
                },
                {
                    type: "switch",
                    id: "leet",
                    name: "Leet (1337)",
                    value: false
                },
                {
                    type: "switch",
                    id: "thicc",
                    name: "Extra Thicc",
                    value: false
                }
            ]
        },
        {
            type: "category",
            id: "wrappers",
            name: "Wrapper Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "textbox",
                    id: "superscript",
                    name: "Superscript",
                    note: "The wrapper for superscripted text",
                    value: "^^"
                },
                {
                    type: "textbox",
                    id: "smallcaps",
                    name: "Smallcaps",
                    note: "The wrapper to make Smallcaps.",
                    value: "%%"
                },
                {
                    type: "textbox",
                    id: "fullwidth",
                    name: "Full Width",
                    note: "The wrapper for E X P A N D E D  T E X T.",
                    value: "##"
                },
                {
                    type: "textbox",
                    id: "upsidedown",
                    name: "Upsidedown",
                    note: "The wrapper to flip the text upsidedown.",
                    value: "&&"
                },
                {
                    type: "textbox",
                    id: "varied",
                    name: "Varied Caps",
                    note: "The wrapper to VaRy the capitalization.",
                    value: "=="
                },
                {
                    type: "textbox",
                    id: "leet",
                    name: "Leet (1337)",
                    note: "The wrapper to talk in 13375p34k.",
                    value: "++"
                },
                {
                    type: "textbox",
                    id: "thicc",
                    name: "Extra Thicc",
                    note: "The wrapper to get 乇乂下尺卂 下卄工匚匚.",
                    value: "$$"
                }
            ]
        },
        {
            type: "category",
            id: "formatting",
            name: "Formatting Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "fullWidthMap",
                    name: "Fullwidth Style",
                    note: "Which style of fullwidth formatting should be used.",
                    value: true,
                    options: [
                        {
                            label: "T H I S",
                            value: false
                        },
                        {
                            label: "ｔｈｉｓ",
                            value: true
                        }
                    ]
                },
                {
                    type: "switch",
                    id: "reorderUpsidedown",
                    name: "Reorder Upsidedown Text",
                    note: "Having this enabled reorders the upside down text to make it in-order.",
                    value: true
                },
                {
                    type: "switch",
                    id: "fullwidth",
                    name: "Start VaRiEd Caps With Capital",
                    note: "Enabling this starts a varied text string with a capital.",
                    value: true
                }
            ]
        },
        {
            type: "category",
            id: "plugin",
            name: "Functional Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "hoverOpen",
                    name: "Opening Toolbar",
                    note: "Determines when to show the toolbar.",
                    value: true,
                    options: [
                        {
                            label: "Click",
                            value: false
                        },
                        {
                            label: "Hover",
                            value: true
                        }
                    ]
                },
                {
                    type: "dropdown",
                    id: "chainFormats",
                    name: "Format Chaining",
                    note: "Swaps priority of wrappers between inner first and outer first. Check the GitHub for more info.",
                    value: true,
                    options: [
                        {
                            label: "Inner",
                            value: false
                        },
                        {
                            label: "Outer",
                            value: true
                        }
                    ]
                },
                {
                    type: "switch",
                    id: "closeOnSend",
                    name: "Close On Send",
                    note: "This option will close the toolbar when a message is sent.",
                    value: true
                }
            ]
        },
        {
            type: "category",
            id: "style",
            name: "Style Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "icons",
                    name: "Toolbar Style",
                    note: "Switches between icons and text as the toolbar buttons.",
                    value: true,
                    options: [
                        {
                            label: "Text",
                            value: false
                        },
                        {
                            label: "Icons",
                            value: true
                        }
                    ]
                },
                {
                    type: "dropdown",
                    id: "rightSide",
                    name: "Toolbar Location",
                    note: "This option enables swapping toolbar location.",
                    value: true,
                    options: [
                        {
                            label: "Left",
                            value: false
                        },
                        {
                            label: "Right",
                            value: true
                        }
                    ]
                },
                {
                    type: "slider",
                    id: "toolbarOpacity",
                    name: "Opacity",
                    note: "This allows the toolbar to be partially seethrough.",
                    value: 1,
                    min: 0,
                    max: 1
                },
                {
                    type: "slider",
                    id: "fontSize",
                    name: "Font Size",
                    note: "Adjusts the font size between 0 and 100%.",
                    value: 85,
                    min: 0,
                    max: 100
                }
            ]
        }
    ]
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
    const {ContextMenu, DOM, Patcher, UI} = window.BdApi;
    const {DiscordSelectors, PluginUtilities, DiscordModules, Utilities, ReactTools} = Api;

    return class BetterFormattingRedux extends Plugin {
        constructor() {
            super();
            this.isOpen = false;
            this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
            this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
            this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
            this.upsideDownList = " ¡\"#$%℘,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXλZ]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
            this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
            this.leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";
            this.thiccList = "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙{|}";

            this.toolbarString = `<div id="bfredux" class='bf-toolbar'><div class='bf-arrow'></div></div>`;

            this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```", spoiler: "||"};

            this.customWrappers = Object.keys(this.defaultSettings.wrappers);
            this.buttonOrder = Object.keys(this.defaultSettings.toolbar);


            this.toolbarData = (() => {return {
    bold: {type: "native-format",
            name: "Bold",
            displayName: "<b>Bold</b>",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`},
    italic: {type: "native-format",
            name: "Italic",
            displayName: "<i>Italic</i>",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>'>`},
    underline: {type: "native-format",
                name: "Underline",
                displayName: "<u>Underline</u>",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>'>`},
    strikethrough: {type: "native-format",
                    name: "Strikethrough",
                    displayName: "<s>Strikethrough</s>",
                    icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>'>`},
    spoiler: {type: "native-format",
              name: "Spoiler",
              displayName: "Spoiler",
              icon: `<img src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'>`},
    code: {type: "native-format",
            name: "Code",
            displayName: "<span style='font-family:monospace;'>Code</span>",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>'>`},
    codeblock: {type: "native-format",
                name: "Codeblock",
                displayName: "<span style='font-family:monospace;text-decoration: underline overline;'>|Codeblock|</span>",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"/></svg>'>`},
    superscript: {type: "bfr-format",
                name: "Superscript",
                displayName: "ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ",
                icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC9UlEQVR4nO2av08UQRTH+WFhDDFXUFhcYcKBFMRYWtgLgdLS4go7IHAJBYl2FJb8UOsrLC0sjJyGPwMTf5xWJFhYUFBcYfRjsUOczL1d9sfczuwyn+Sa2/fefWdu33ffwI2NBQKBQIUBFoBdoA+cA7+Ad8AO0HStb2QAN4Bt4JR4PgEd4KZrvVYBrgNvExZu8tq1ZqsATzMs/oIt17qtADSJel2nDzxS16aBJ0ReoDMAFlzrLwzwXFh8Q4hrAj+N2F0Xmq0C9IxFPU6IbRuxn8vUOhKAL8ai7iTE3jViT8vU6hzgvrEBZ641lQZwCzgxNuDIta5SIJoOzcUDrLjWNnKU8ZmPSYCdvAW7QrG2XdmiYwN0M+TfJjoDSLwBruUVNgUcGwXPsThUqFvW/NaOgakUuQ2i2WAgLPw3sO1UYIrauTaY6DywBZzFfOsnwIOi+vQPLHSLJtTtCnXbCfEN4BnDU55OD5guqq2w2BT1Mm8q8q2emrxaLz68BRwaNb8BizlqLapcnUOgdUleIfKv/r+AJaIDiM57YCZDjZbK0ekDSyly3W6AErEu1N7PkL8v5K+nzHW/AUrIgVH7L7CWIm9NxeocWBNWFsh+8JUEPwAeqhidS/veW8jgB8AMOfvea5D9YE+I2xPiUvW99zDsB3+AVe36qnpPp3p9HwcJ4ywjHKO9ImGhIz1IeUWMH9Sz7+MQ/KCefR8H8nwAVX7eZyFswFVugSttgsiPwT7Do3L9HoPIg9AAuKde5l9x6jUIxfR9R7veEa7Xww+Q+/4VMKnFTKr3TKrtB8jH4Y/AvBA7r67pVPc4jPy8/0HC/9+AFRWjU835ALnvN1PkbQp51fID5L5/CUykyJ1QsSbV8APkvv8AzGWoMadydPz3A+S+/w4s56i1rHJ1/PYD5L7fKFBvQ6jnpx8g9/0LYLxAzXFVw8QvP0Du+x4wa6H2LMM/ffPHD5D73qrAmA32ww+Q+976LRrTYn76QSAQCAQCgUAgEKg8/wD8huCrKK8/kQAAAABJRU5ErkJggg=='>"},
    smallcaps: {type: "bfr-format",
                name: "Smallcaps",
                displayName: "SᴍᴀʟʟCᴀᴘs",
                icon: `<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><defs><path d="M24 24H0V0h24v24z" id="a"/></defs><clipPath id="b"><use overflow="visible" href="#a"/></clipPath><path clip-path="url(#b)" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>`},
    fullwidth: {type: "bfr-format",
                name: "Fullwidth",
                displayName: "Ｆｕｌｌｗｉｄｔｈ",
                icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA80lEQVR4nO3XzQ2CMBxAcQ4MwcFFHIRBWIQF2MBBZBAGeV5ogkSj1JQife9s0n9/Uj6qyszMzMzMLCIyl3v/AghQOkBsp9lIbAIIIIAAAggggAACCCCAAAIIIIAAuefZPQEEEEAAAQQQQIDTAAA1MGz4fRQAMAB13JSJAhpg3OOfnL1GoEm91lcBLXDf61JeXDR3oE293qdhOmDa8yyvTs4EdKnXfDXEBejX5zgDQKgHLqnXDgNcgdubQXJ2A66pN/903g9Y2vsCpQPMCOUegQVCuTfB1TBlPgZXA5X7IhSi5FfhEBs/hn5Y53gfQ2ZmZv/ZAxEIe1ZZ+BlyAAAAAElFTkSuQmCC'>"},
    upsidedown: {type: "bfr-format",
                name: "Upsidedown",
                displayName: "uʍopǝpᴉsd∩",
                icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`},
    varied: {type: "bfr-format",
            name: "Varied",
            displayName: "VaRiEd CaPs",
            icon: `<img src='data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l-4 4h3v7c0 1.1-.9 2-2 2s-2-.9-2-2V8c0-2.21-1.79-4-4-4S5 5.79 5 8v7H2l4 4 4-4H7V8c0-1.1.9-2 2-2s2 .9 2 2v7c0 2.21 1.79 4 4 4s4-1.79 4-4V8h3l-4-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'>`},
    leet: {type: "bfr-format",
            name: "Leet",
            displayName: "1337",
            icon: "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABnklEQVRoge2YL1MCQRiHCRf8EATCBZwhEPwARILR4DeQaDDeDIFgMPAhDAQDgaDdYDAQcMYZMThDNBgIBsJj2GXmXFdub937g/M+kfe3w+/ZeQ8YGg1BEITaAbSAa2BF9ayACRDnKb+utrOVNS4SqJuvK1MXgUXVLXfw4iLwDae9K5DcfUQgMCKQev3OnBXIrAiB81KqK86KEDgE3kooPweawQX0zPYl1wNGwDJnyQQ4sswuXfv4CPQsb9hJzbs7ZLal41S+Y2Q2pG4/uICePxuRgSXTtAg0LbmBkZnk7eMj0DciCyAyMolFYGhkIuAxNf8EWoUL6MzUiN0AMermE9QqmGyAoc7E+kyaxLePj0BL31gWc9we7iVwUJqAztnWZMsGONW5CBhnCPT/2sdHIOLnGmzLn1jyV7+UH4fo43VAS4xQq/IB3ALdHflj4F5nH4CLkH38DhSMCJTQMWyf/yDwZB6qEa8uAraPxrowcxGIqe8fW23XvWujfu+8V9sZUB1muJYX9p2sfai6XyZ7IxDi6axUTAREQBAEoQ58Aaheq+k8olaNAAAAAElFTkSuQmCC'>"},
    thicc: {type: "bfr-format",
            name: "Extra Thicc",
            displayName: "乇乂下尺卂 下卄工匚匚",
            icon: `<img src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGRpc3BsYXk9Im5vbmUiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNS42LDEwLjc5YzAuOTcxLTAuNjcsMS42NS0xLjc3LDEuNjUtMi43OWMwLTIuMjYtMS43NS00LTQtNEg3djE0aDcuMDQNCgljMi4wOSwwLDMuNzEtMS43LDMuNzEtMy43OUMxNy43NSwxMi42ODksMTYuODkxLDExLjM5LDE1LjYsMTAuNzl6IE0xMCw2LjVoM2MwLjgzLDAsMS41LDAuNjcsMS41LDEuNVMxMy44Myw5LjUsMTMsOS41aC0zVjYuNXoNCgkgTTEzLjUsMTUuNUgxMHYtM2gzLjVjMC44MywwLDEuNSwwLjY3LDEuNSwxLjVTMTQuMzMsMTUuNSwxMy41LDE1LjV6Ii8+DQo8cGF0aCBmaWxsPSJub25lIiBkPSJNMCwwaDI0djI0SDBWMHoiLz4NCjx0ZXh0IHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgNS45MzU1IDE0Ljk5NzEpIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZm9udC1mYW1pbHk9IidLb3pHb1ByNk4tUmVndWxhci04M3B2LVJLU0otSCciIGZvbnQtc2l6ZT0iMTIuNTY0Ij7kuYc8L3RleHQ+DQo8L3N2Zz4NCg=='>`
            }
};})();
            this.allLanguages = (() => {return {
    C: {cpp: "C++", csharp: "C#", coffeescript: "CoffeeScript", css: "CSS"},
    H: {html: "HTML/XML"},
    J: {java: "Java", js: "JavaScript", json: "JSON"},
    M: {markdown: "Markdown"},
    P: {perl: "Perl", php: "PHP", py: "Python"},
    R: {ruby: "Ruby"},
    S: {sql: "SQL"},
    V: {vbnet: "VB.NET", vhdl: "VHDL"}
};})();
            this.mainCSS = `.bf-toolbar {
	user-select: none;
	white-space: nowrap;
	font-size:85%;
	display:block;
	position: absolute;
	color: rgba(255, 255, 255, .5);
	width:auto!important;
	right:0;
	bottom:auto;
	border-radius:3px;
	height:27px!important;
	top:0px;
	transform:translate(0,-100%);
	opacity:1;
	overflow: hidden!important;
	pointer-events: none;
	padding:10px 30px 15px 5px;
	margin: 0 5px 0 0;
}

.bf-toolbar.bf-visible,
.bf-toolbar.bf-hover:hover{
	pointer-events: initial;
}

.bf-toolbar::before {
	content:"";
	display: block;
	width:100%;
	height:calc(100% - 15px);
	position: absolute;
	z-index: -1;
	background:#424549;
	pointer-events: initial;
	left:0px;
	top:5px;
	border-radius:3px;
	transform:translate(0,55px);
	transition:all 200ms ease;
}

.theme-light .bf-toolbar::before {
	background: #97A0AA;
}

.bf-toolbar.bf-visible:before,
.bf-toolbar.bf-hover:hover:before {
	transform:translate(0,0px);
	transition:all 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format {
	display: inline;
	padding: 7px 5px;
	cursor: pointer;
	display : inline-flex;
	align-items : center;
	transform:translate(0,55px);
	transition:all 50ms,transform 200ms ease;
	position:relative;
	pointer-events: initial;
	border-radius:2px;
	max-height: 27px;
	box-sizing: border-box;
	vertical-align: middle;
}

.bf-toolbar .format > img,
.bf-toolbar .format > svg {
	opacity: 0.6;
	vertical-align: middle;
	max-height: inherit;
}

.bf-toolbar .format .format-border {
	border: 1px solid rgba(255, 255, 255, .5);
	border-radius: inherit;
}

.bf-toolbar .format:hover{
	background:rgba(255,255,255,.1);
	color:rgba(255,255,255,.9);
}

.bf-toolbar .format:active{
	background:rgba(0,0,0,.1)!important;
	transition:all 0ms,transform 200ms ease;
}

.bf-toolbar.bf-visible .format,
.bf-toolbar.bf-hover:hover .format{
	transform:translate(0,0);
	transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format.disabled {
	display: none;
}

.bf-toolbar .format.ghost {
	color: transparent;
	background: rgba(0,0,0,.1);
}

.bf-toolbar .format.ghost > img,
.bf-toolbar .format.ghost > svg {
	opacity: 0;
}

.theme-light .bf-toolbar:hover .bf-arrow,
.bf-toolbar .bf-arrow {
	content:"";
	display:block;
	background: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
	height:30px;
	width:30px;
	right:5px;
	position: absolute;
	pointer-events: initial;
	bottom:0;
	background-repeat: no-repeat;
	background-position: 50%;
	transition:all 200ms ease;
	opacity: .3;
	cursor:pointer;
}
.theme-light .bf-toolbar .bf-arrow {
	background: url('data:image/svg+xml;utf8,<svg fill="rgb(127,129,134)" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
}
.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
	transform:translate(0,-14px)rotate(-90deg);
	transition:all 200ms cubic-bezier(0,0,0,1);
	opacity: .9;
}

.message-group .bf-toolbar{
	padding: 10px 5px 15px 5px;
	animation:slide-up 300ms cubic-bezier(0,0,0,1), opacity 300ms ease
}
.upload-modal .bf-toolbar {
	position: relative;
	transform: none;
	padding: 5px 0;
	margin-right: 0;
	border-radius: 2px;
	text-align: center;
	background: #424549;
}
.upload-modal .bf-toolbar::before {
	display: none;
}
.upload-modal .bf-toolbar .format:hover{
	background:rgba(255,255,255,.1);
}
.upload-modal .bf-toolbar .format:active{
	background:rgba(0,0,0,.1);
}
.upload-modal .bf-toolbar .format,
.upload-modal .bf-toolbar:before,
.message-group .bf-toolbar .format,
.message-group .bf-toolbar:before{
	transform:translate(0,0);
}
.upload-modal .bf-toolbar .bf-arrow,
.message-group .bf-toolbar .bf-arrow{
	display: none;
}

.bf-toolbar.bf-left {
	left: 0!important;
	right: auto!important;
	margin-right: 0!important;
	margin-left: 5px!important;
	padding: 10px 10px 15px 30px!important;
}

.bf-toolbar.bf-left .bf-arrow {
	left: 5px!important;
	right: auto!important;
}

.bf-toolbar.bf-left.bf-hover:hover .bf-arrow,.bf-toolbar.bf-left.bf-visible .bf-arrow {
	-webkit-transform: translate(0,-14px) rotate(90deg)!important;
	-ms-transform: translate(0,-14px) rotate(90deg)!important;
	transform: translate(0,-14px) rotate(90deg)!important;
}
.bf-languages {
	display: block;
	position: fixed !important;
	transform: scale(1,0);
	transform-origin: 100% 100%!important;
	background: #424549;
	border-radius: 3px;
	color: rgba(255,255,255,.5);
	padding: 3px;
}
.bf-languages.bf-visible {
	height: auto;
	transition: 200ms cubic-bezier(.2,0,0,1);
	transform: scale(1,1);
	transform-origin: 100% 100%!important;
}

.bf-languages div {
	display: block;
	cursor: pointer;
	padding: 5px 7px;
	border-radius: 2px;
}

.bf-languages div:hover {
	background: rgba(255,255,255,.1);
	color: rgba(255,255,255,.9);
}`;
        }

        async onStart() {
            // await PluginUtilities.addScript("sortableScript", "//rauenzi.github.io/BetterDiscordAddons/Plugins/Sortable.js");
            DOM.addStyle(this.name + "-style", this.mainCSS);
            this.buttonOrder = PluginUtilities.loadData(this.name, "buttonOrder", this.buttonOrder);
            this.setupToolbar();
            Patcher.before(this.name, DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                msg.content = this.format(msg.content);
            });
        }

        onStop() {
            Patcher.unpatchAll(this.name);
            // $("*").off("." + this.name);
            document.querySelector(".bf-toolbar")?.remove();
            // PluginUtilities.removeScript("sortableScript");
            DOM.removeStyle(this.name + "-style");
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;

            const elem = e.addedNodes[0];
            const textarea = elem.matches(DiscordSelectors.Textarea.textArea) ? elem : elem.querySelector(DiscordSelectors.Textarea.textArea);
            if (textarea) this.addToolbar(textarea);
        }

        updateStyle() {
            this.updateSide();
            this.updateOpacity();
            this.updateFontSize();
        }

        updateSide() {
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            if (this.settings.style.rightSide) toolbar.classList.remove("bf-left");
            else toolbar.classList.add("bf-left");
        }

        updateOpacity() {
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            toolbar.style.opacity = this.settings.style.toolbarOpacity;
        }

        updateFontSize() {
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            toolbar.style.fontSize = this.settings.style.fontSize + "%";
        }

        openClose() {
            this.isOpen = !this.isOpen;
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            toolbar.classList.toggle("bf-visible");
        }

        escape(s) {
            return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        }

        doFormat(text, wrapper, offset) {

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
            if (this.settings.plugin.chainFormats) {
                for (let w = 0; w < this.customWrappers.length; w++) {
                    const newText = this.doFormat(returnText, this.settings.wrappers[this.customWrappers[w]], begin + wrapper.length);
                    if (returnText != newText) {
                        returnText = newText;
                        end = end - this.settings.wrappers[this.customWrappers[w]].length * 2;
                    }
                }
            }

            returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
                let letterNum = 0;
                middle = middle.replace(/./g, letter => {
                    const index = this.replaceList.indexOf(letter);
                    letterNum += 1;
                    if (wrapper == this.settings.wrappers.fullwidth) {
                        if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
                        return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
                    }
                    else if (wrapper == this.settings.wrappers.superscript) {return index != -1 ? this.superscriptList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.smallcaps) {return index != -1 ? this.smallCapsList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.upsidedown) {return index != -1 ? this.upsideDownList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.leet) {return index != -1 ? this.leetList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.thicc) {return index != -1 ? this.thiccList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.varied) {
                        const compare = this.settings.formatting.startCaps ? 1 : 0;
                        if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
                        return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
                    }
                    return letter;
                });
                if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
                return before + middle + after;
            });

            return returnText;
        }

        format(string) {
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
                        if (!this.settings.formats[this.customWrappers[w]]) continue;
                        const newText = this.doFormat(text, this.settings.wrappers[this.customWrappers[w]], i);
                        if (text != newText) {
                            text = newText;
                            i = i - this.settings.wrappers[this.customWrappers[w]].length * 2;
                        }
                    }
                }
            }
            if (this.settings.plugin.closeOnSend) document.querySelector(".bf-toolbar")?.classList.remove("bf-visible");
            return text;
        }

        async wrapSelection(leftWrapper, rightWrapper) {
            if (!rightWrapper) rightWrapper = leftWrapper;
            if (leftWrapper.startsWith("```")) leftWrapper = leftWrapper + "\n";
            if (rightWrapper.startsWith("```")) rightWrapper = "\n" + rightWrapper;
            const textarea = document.querySelector(DiscordSelectors.Textarea.textArea);
            if (!textarea) return;
            if (textarea.tagName === "TEXTAREA") return this.oldWrapSelection(textarea, leftWrapper, rightWrapper);
            const slateNode = ReactTools.getOwnerInstance(textarea);
            const slate = slateNode?.ref?.current?.getSlateEditor();
            if (!slate) return; // bail out if no slate

            const currentSelection = Utilities.deepclone(slate.selection);
            slate.apply({type: "insert_text", text: leftWrapper, path: slate.selection.anchor.path, offset: slate.selection.anchor.offset});
            slate.apply({type: "insert_text", text: rightWrapper, path: slate.selection.focus.path, offset: slate.selection.focus.offset});

            currentSelection.anchor.offset += leftWrapper.length;
            currentSelection.focus.offset += rightWrapper.length;
            slateNode.focus();
        }

        oldWrapSelection(textarea, leftWrapper, rightWrapper) {
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
                Object.keys(this.allLanguages).map(letter => {
                    return {
                        type: "submenu",
                        label: letter,
                        items: Object.keys(this.allLanguages[letter]).map(language => {
                            return {label: this.allLanguages[letter][language], action: () => {this.wrapSelection("```" + language + "\n", "```");}};
                        })
                    };
                })
            );
        }

        buildToolbar() {
            const toolbar = DOM.parseHTML(this.toolbarString);
            const sorted = Object.keys(this.settings.toolbar).sort((a,b) => {return this.buttonOrder.indexOf(a) - this.buttonOrder.indexOf(b);});
            for (let i = 0; i < sorted.length; i++) {
                const button = DOM.parseHTML("<div class='format'>");
                if (!this.toolbarData[sorted[i]]) continue;
                button.classList.add(this.toolbarData[sorted[i]].type);
                UI.createTooltip(button, this.toolbarData[sorted[i]].name);
                if (!this.settings.toolbar[sorted[i]]) button.classList.add("disabled");
                if (sorted[i] === "codeblock") {
                    const contextMenu = this.getContextMenu();
                    button.addEventListener("contextmenu", (e) => {
                        ContextMenu.open(e, contextMenu, {align: "bottom"});
                    });
                }
                button.dataset.name = sorted[i];
                if (this.settings.style.icons) button.innerHTML = this.toolbarData[sorted[i]].icon;
                else button.innerHTML = this.toolbarData[sorted[i]].displayName;
                toolbar.append(button);
            }
            // window.Sortable.create(toolbar, {
            //     draggable: ".format", // css-selector of elements, which can be sorted
            //     ghostClass: "ghost",
            //     onUpdate: () => {
            //         const buttons = toolbar.querySelectorAll(".format");
            //         for (let i = 0; i < buttons.length; i++) {
            //             this.buttonOrder[i] = buttons[i].dataset.name;
            //         }
            //         PluginUtilities.saveData(this.name, "buttonOrder", this.buttonOrder);
            //     }
            // });
            if (!this.settings.style.icons) {
                toolbar.addEventListener("mousemove", (e) => {
                    const target = e.currentTarget;
                    const pos = e.pageX - target.parentElement.getBoundingClientRect().left;
                    const width = parseInt(getComputedStyle(target).width);
                    let diff = -1 * width;
                    Array.from(target.children).forEach(elem => {
                        diff += elem.offsetWidth;
                    });
                    target.scrollLeft = (pos / width * diff);
                });
            }

            return toolbar;
        }

        setupToolbar() {
            document.querySelector(".bf-toolbar")?.remove();
            document.querySelectorAll(`${DiscordSelectors.Textarea.textArea}`).forEach(elem => {
                this.addToolbar(elem.children[0]);
            });
        }

        addToolbar(textarea) {
            const toolbarElement = this.buildToolbar();
            if (this.settings.plugin.hoverOpen == true) toolbarElement.classList.add("bf-hover");
            if (this.isOpen) toolbarElement.classList.add("bf-visible");

            const inner = textarea.parentElement.parentElement;
            inner.parentElement.insertBefore(toolbarElement, inner.nextSibling);

            toolbarElement.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const button = e.target.closest("div");
                    if (button.classList.contains("bf-arrow")) {
                        if (!this.settings.plugin.hoverOpen) this.openClose();
                    }
                    else if (button.classList.contains("format")) {
                        let wrapper = "";
                        if (button.classList.contains("native-format")) wrapper = this.discordWrappers[button.dataset.name];
                        else wrapper = this.settings.wrappers[button.dataset.name];
                        this.wrapSelection(wrapper);
                    }
                });

            // textarea.parent().parent().after(toolbarElement)
            //     .siblings(".bf-toolbar")
            //     .off("click." + this.name)
            //     .on("click." + this.name, "div", e => {
            //         e.preventDefault();
            //         e.stopPropagation();
            //         const button = e.currentTarget;
            //         if (button.classList.contains("bf-arrow")) {
            //             if (!this.settings.plugin.hoverOpen) this.openClose();
            //         }
            //         else {
            //             let wrapper = "";
            //             if (button.classList.contains("native-format")) wrapper = this.discordWrappers[button.data("name")];
            //             else wrapper = this.settings.wrappers[button.data("name")];
            //             this.wrapSelection(wrapper);
            //         }
            //     });
            this.updateStyle();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

        updateSettings(group, id, value) {

            if (group == "toolbar") this.setupToolbar();
            if (group == "plugin" && id == "hoverOpen") {
                const toolbar = document.querySelector(".bf-toolbar");
                if (value) {
                    toolbar?.classList.remove("bf-visible");
                    toolbar?.classList.add("bf-hover");
                }
                else {
                    toolbar?.classList.remove("bf-hover");
                }
            }

            if (group == "style") {
                if (id == "icons") this.setupToolbar();
                if (id == "rightSide") this.updateSide();
                if (id == "toolbarOpacity") this.updateOpacity();
                if (id == "fontSize") this.updateFontSize();
            }

            // let resetButton = $("<button>");
            // resetButton.on("click", () => {
            //     this.settings = this.defaultSettings;
            //     this.saveSettings();
            //     this.setupToolbar();
            //     panel.empty();
            //     this.generateSettings(panel);
            // });
            // resetButton.text("Reset To Defaults");
            // resetButton.css("float", "right");
            // resetButton.attr("type","button");

            // panel.append(resetButton);
        }

    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/