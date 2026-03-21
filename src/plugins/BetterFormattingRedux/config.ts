import type {Manifest} from "@betterdiscord/manifest";

const manifest: Manifest = {
    info: {
        name: "BetterFormattingRedux",
        authors: [{
            name: "Zerebos",
            discord_id: "249746236008169473",
            github_username: "zerebos",
            twitter_username: "IAmZerebos"
        }],
        version: "2.3.15",
        description: "Enables different types of formatting in standard Discord chat.",
        github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/BetterFormattingRedux",
        github_raw: "https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js"
    },
    changelog: [
        {
            title: "GUI Works Again",
            type: "fixed",
            items: [
                "All basic formatting buttons are now working again.",
                "Settings appear and work as expected.",
                "Formatting should happen for messages with images."
            ]
        }
    ],
    main: "index.ts",
    config: [
        {
            type: "category",
            id: "toolbar",
            name: "Toolbar Buttons",
            collapsible: true,
            shown: false,
            settings: [
                {type: "switch", id: "boldButton", name: "Bold", value: true},
                {type: "switch", id: "italicButton", name: "Italic", value: true},
                {type: "switch", id: "underlineButton", name: "Underline", value: true},
                {type: "switch", id: "strikethroughButton", name: "Strikethrough", value: true},
                {type: "switch", id: "spoilerButton", name: "Spoiler", value: true},
                {type: "switch", id: "codeButton", name: "Code", value: true},
                {type: "switch", id: "codeblockButton", name: "Codeblock", value: true},
                {type: "switch", id: "superscriptButton", name: "Superscript", value: true},
                {type: "switch", id: "smallcapsButton", name: "Smallcaps", value: true},
                {type: "switch", id: "fullwidthButton", name: "Full Width", value: true},
                {type: "switch", id: "upsidedownButton", name: "Upsidedown", value: true},
                {type: "switch", id: "variedButton", name: "Varied Caps", value: true},
                {type: "switch", id: "leetButton", name: "Leet (1337)", value: false},
                {type: "switch", id: "thiccButton", name: "Extra Thicc", value: false},
                {type: "switch", id: "firstcapsButton", name: "First Caps", value: false},
                {type: "switch", id: "uppercaseButton", name: "Uppercase", value: false},
                {type: "switch", id: "lowercaseButton", name: "Lowercase", value: false}
            ]
        },
        {
            type: "category",
            id: "formats",
            name: "Active Formats",
            collapsible: true,
            shown: false,
            settings: [
                {type: "switch", id: "superscriptFormat", name: "Superscript", value: true},
                {type: "switch", id: "smallcapsFormat", name: "Smallcaps", value: true},
                {type: "switch", id: "fullwidthFormat", name: "Full Width", value: true},
                {type: "switch", id: "upsidedownFormat", name: "Upsidedown", value: true},
                {type: "switch", id: "variedFormat", name: "Varied Caps", value: true},
                {type: "switch", id: "leetFormat", name: "Leet (1337)", value: false},
                {type: "switch", id: "thiccFormat", name: "Extra Thicc", value: false},
                {type: "switch", id: "firstcapsFormat", name: "First Caps", value: false},
                {type: "switch", id: "uppercaseFormat", name: "Uppercase", value: false},
                {type: "switch", id: "lowercaseFormat", name: "Lowercase", value: false}
            ]
        },
        {
            type: "category",
            id: "wrappers",
            name: "Wrapper Options",
            collapsible: true,
            shown: false,
            settings: [
                {type: "text", id: "superscriptWrapper", name: "Superscript", note: "The wrapper for superscripted text", value: "^^"},
                {type: "text", id: "smallcapsWrapper", name: "Smallcaps", note: "The wrapper to make Smallcaps.", value: "%%"},
                {type: "text", id: "fullwidthWrapper", name: "Full Width", note: "The wrapper for E X P A N D E D  T E X T.", value: "##"},
                {type: "text", id: "upsidedownWrapper", name: "Upsidedown", note: "The wrapper to flip the text upsidedown.", value: "&&"},
                {type: "text", id: "variedWrapper", name: "Varied Caps", note: "The wrapper to VaRy the capitalization.", value: "=="},
                {type: "text", id: "leetWrapper", name: "Leet (1337)", note: "The wrapper to talk in 13375p34k.", value: "++"},
                {type: "text", id: "thiccWrapper", name: "Extra Thicc", note: "The wrapper to get 乇乂下尺卂 下卄工匚匚.", value: "$$"},
                {type: "text", id: "firstcapsWrapper", name: "First Caps", note: "The wrapper to capitalize the first letter.", value: "--"},
                {type: "text", id: "uppercaseWrapper", name: "Uppercase", note: "The wrapper to convert to uppercase.", value: ">>"},
                {type: "text", id: "lowercaseWrapper", name: "Lowercase", note: "The wrapper to convert to lowercase.", value: "<<"}
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
                        {label: "T H I S", value: false},
                        {label: "ｔｈｉｓ", value: true}
                    ]
                },
                {type: "switch", id: "reorderUpsidedown", name: "Reorder Upsidedown Text", note: "Having this enabled reorders the upside down text to make it in-order.", value: true},
                {type: "switch", id: "startCaps", name: "Start VaRiEd Caps With Capital", note: "Enabling this starts a varied text string with a capital.", value: true}
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
                        {label: "Click", value: false},
                        {label: "Hover", value: true}
                    ]
                },
                {
                    type: "dropdown",
                    id: "chainFormats",
                    name: "Format Chaining",
                    note: "Swaps priority of wrappers between inner first and outer first. Check the GitHub for more info.",
                    value: true,
                    options: [
                        {label: "Inner", value: false},
                        {label: "Outer", value: true}
                    ]
                },
                {type: "switch", id: "closeOnSend", name: "Close On Send", note: "This option will close the toolbar when a message is sent.", value: true}
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
                    id: "useIcons",
                    name: "Toolbar Style",
                    note: "Switches between icons and text as the toolbar buttons.",
                    value: true,
                    options: [
                        {label: "Text", value: false},
                        {label: "Icons", value: true}
                    ]
                },
                {
                    type: "dropdown",
                    id: "rightSide",
                    name: "Toolbar Location",
                    note: "This option enables swapping toolbar location.",
                    value: true,
                    options: [
                        {label: "Left", value: false},
                        {label: "Right", value: true}
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

export default manifest;