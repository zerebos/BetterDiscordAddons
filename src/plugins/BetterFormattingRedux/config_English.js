module.exports = {
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
        },
        {
            type: "category",
            id: "language",
            name: "language Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "selectlanguage",
                    name: "Language Setting",
                    note: "Set your language.",
                    value: "English",
                    options: [
                        {
                            label: "English",
                            value: "English"
                        },
                        {
                            label: "한국어",
                            value: "Korean"
                        }
                    ]
                },
            ]
        }
    ]
};
