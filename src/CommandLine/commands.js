/* global V2C_CssEditorDetached */
module.exports = (Api, CommandLine) => [
    {
        name: "commands", description: "Shows a list of all commands",
        callback: () => {
            let modal = $(Api.Utilities.formatTString(CommandLine.modalHTML, {modalTitle: "Command List", id: "command-list"}));
            for (let c = 0; c < CommandLine.commands.length; c++) {
                let html = `<div class="flex-1xMQg5 flex-1O1GKY vertical-V37hAW flex-1O1GKY directionColumn-35P_nr justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 switchItem-2hKKKK marginBottom20-32qID7" style="flex: 1 1 auto;">
                <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignStart-H-X2h- noWrap-3jynv6" style="flex: 1 1 auto;">
                    <h3 class="titleDefault-a8-ZSr title-31JmR4 marginReset-236NPn weightMedium-2iZe9B size16-14cGz5 height24-3XzeJx flexChild-faoVW3" style="flex: 1 1 auto;">
                        ${CommandLine.commands[c].name}
                    </h3>
                    <div class="flexChild-faoVW3 title-31JmR4" style="flex: 0 0 auto;">
                        ${CommandLine.commands[c].arguments ? CommandLine.commands[c].arguments.length : 0}
                    </div>
                </div>
                <div class="description-3_Ncsb formText-3fs7AJ note-1V3kyJ marginTop4-2BNfKC modeDefault-3a2Ph1 primary-jw0I4K" style="flex: 1 1 auto;">${CommandLine.commands[c].description}</div>
                <div class="divider-3573oO dividerDefault-3rvLe- marginTop20-3TxNs6"></div>
            </div>`;
                modal.find(".selectable").append(html);
            }
            
            modal.find(".backdrop, .close-button, .done-button").on("click", () => {modal.remove();});
            modal.appendTo("#app-mount");
        }
    },
    {
        name: "prefix", description: "Sets the prefix for CommandLine",
        arguments: [
            {validator: p => p != "/" && p != "#" && p != "@"}
        ],
        callback: (prefix) => {
            CommandLine.prefix = prefix;
            Api.Toasts.show("CommandLine prefix changed to " + prefix, {type: "success"});
        }
    },
    {
        name: "status", description: "Changes your status",
        arguments: [
            {validator: ["online", "idle", "dnd", "invisible", "offline"]}
        ],
        callback: (status) => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({status: status});
            Api.Toasts.show("Status changed to " + status, {type: "success"});
        }
    },
    {
        name: "nativetheme", description: "Change between dark and light theme",
        arguments: [
            {validator: ["light", "dark"]}
        ],
        callback: (theme) => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({theme: theme});
        }
    },
    {
        name: "display", description: "Switches message display style",
        arguments: [
            {validator: ["cozy", "compact"]}
        ],
        callback: (style) => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({messageDisplayCompact: style == "compact"});
        }
    },
    {
        name: "devmode", description: "Toggles developer mode",
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({developerMode: !Api.DiscordModules.UserSettingsStore.developerMode});
        }
    },
    {
        name: "animateemojis", description: "Toggles auto animating emojis",
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({animateEmoji: !Api.DiscordModules.UserSettingsStore.animateEmoji});
        }
    },
    {
        name: "convertemojis", description: "Toggles converting things like :) into emojis",
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({convertEmoticons: !Api.DiscordModules.UserSettingsStore.convertEmoticons});
        }
    },
    {
        name: "tts", description: "Toggles allowing TTS messages",
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({enableTTSCommand: !Api.DiscordModules.UserSettingsStore.enableTTSCommand});
        }
    },
    {
        name: "autoplay", description: "Toggles autoplay of gifs",
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({gifAutoPlay: !Api.DiscordModules.UserSettingsStore.gifAutoPlay});
        }
    },
    {
        name: "gamestatus", description: "Changes if game should show as status",
        arguments: [
            {validator: ["show", "hide"]}
        ],
        callback: (action) => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({showCurrentGame: action == "show"});
        }
    },
    {
        name: "embedmedia", description: "Toggles inlining media embeds",
        argumentValidators: [],
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({inlineEmbedMedia: !Api.DiscordModules.UserSettingsStore.inlineEmbedMedia});
        }
    },
    {
        name: "attachmentmedia", description: "Toggles inlining media attachments",
        argumentValidators: [],
        callback: () => {
            Api.DiscordModules.UserSettingsUpdater.updateLocalSettings({inlineAttachmentMedia: !Api.DiscordModules.UserSettingsStore.inlineAttachmentMedia});
        }
    },
    {
        name: "locale", description: "Updates your locale",
        arguments: [
            {get validator() {return Api.DiscordModules.LocaleManager.languages.map(m => {return {name: m.englishName, description: m.name, value: m.code};});}}
        ],
        callback: (code) => {
            Api.DiscordModules.LocaleManager.setLocale(code);
        }
    },
    {
        name: "plugin", description: "Actions for plugins",
        subcommands: [
            {
                name: "enable", description: "Enable a plugin",
                arguments: [
                    {get validator() {return Object.keys(window.bdplugins).filter(p => !window.pluginCookie[p]);}, rest: true, unique: true}
                ],
                callback: (...plugins) => {
                    for (let p = 0; p < plugins.length; p++) if (!window.pluginCookie[plugins[p]]) window.pluginModule.enablePlugin(plugins[p]);
                }
            },
            {
                name: "disable", description: "Disable a plugin",
                arguments: [
                    {get validator() {return Object.keys(window.bdplugins).filter(p => window.pluginCookie[p]);}, rest: true}
                ],
                callback: (...plugins) => {
                    for (let p = 0; p < plugins.length; p++) if (window.pluginCookie[plugins[p]]) window.pluginModule.disablePlugin(plugins[p]);
                }
            },
            {
                name: "settings", description: "Open a plugin's settings",
                arguments: [
                    {
                        get validator() {
                            return Object.keys(window.bdplugins).filter(p => {
                                if (!window.pluginCookie[p]) return false;
                                let plugin = window.bdplugins[p].plugin;
                                if (!plugin.getSettingsPanel || typeof(plugin.getSettingsPanel) != "function") return false;
                                return true;
                            });
                        }
                    }
                ],
                callback: (pluginName) => {
                    let plugin = window.bdplugins[pluginName].plugin;
                    let panel = plugin.getSettingsPanel();
                    if (!panel) return Api.Toasts.show(`${pluginName} does not have a settings panel.`, {type: "info"});
                    let modal = $(Api.Utilities.formatTString(CommandLine.modalHTML, {modalTitle: `${pluginName} Settings`, id: "bd-settingspane-container"}));
                    modal.find(".selectable").append(panel);
                    modal.find(".backdrop, .close-button, .done-button").on("click", () => {modal.remove();});
                    modal.appendTo("#app-mount");
                }
            }
        ],
        arguments: [
            {get validator() {return Object.keys(window.bdplugins);}}
        ],
        callback: (plugin) => {
            if (window.pluginCookie[plugin]) Api.Toasts.show(`${plugin} is enabled.`, {type: "info"});
            else Api.Toasts.show(`${plugin} is disabled.`, {type: "info"});
        }
    },
    {
        name: "theme", description: "Actions for themes",
        subcommands: [
            {
                name: "enable", description: "Enable a theme",
                arguments: [
                    {get validator() {return Object.keys(window.bdthemes).filter(t => window.themeCookie[t]);}, rest: true}
                ],
                callback: (...themes) => {
                    for (let t = 0; t < themes.length; t++) if (!window.themeCookie[themes[t]]) window.themeModule.enableTheme(themes[t]);
                }
            },
            {
                name: "disable", description: "Disable a theme",
                arguments: [
                    {get validator() {return Object.keys(window.bdthemes).filter(t => !window.themeCookie[t]);}, rest: true}
                ],
                callback: (...themes) => {
                    for (let t = 0; t < themes.length; t++) if (window.themeCookie[themes[t]]) window.themeModule.disableTheme(themes[t]);
                }
            }
        ],
        arguments: [
            {get validator() {return Object.keys(window.bdthemes);}}
        ],
        callback: (plugin) => {
            if (window.themeCookie[plugin]) Api.Toasts.show(`${plugin} is enabled.`, {type: "info"});
            else Api.Toasts.show(`${plugin} is disabled.`, {type: "info"});
        }
    },
    {
        name: "customcss", description: "Shows the detached custom css window",
        callback: () => {
            let cde = new V2C_CssEditorDetached();
            cde.injectRoot();
            Api.DiscordModules.ReactDOM.render(Api.DiscordModules.React.createElement(V2C_CssEditorDetached), cde.root);
        }
    },
    {
        name: "bdsetting", description: "Allows updating BD's settings",
        subcommands: [
            {
                name: "enable", description: "Enable a bd setting",
                arguments: [
                    {get validator() {return Object.keys(window.settings);}, rest: true}
                ],
                callback: (...settings) => {
                    for (let s = 0; s < settings.length; s++) {
                        window.settingsCookie[window.settings[settings[s]].id] = true;
                        if (window.settingsPanel.v2SettingsPanel) window.settingsPanel.v2SettingsPanel.updateSettings();
                        else window.settingsPanel.updateSettings();
                    }
                }
            },
            {
                name: "disable", description: "Disable a bd setting",
                arguments: [
                    {get validator() {return Object.keys(window.settings);}, rest: true}
                ],
                callback: (...settings) => {
                    for (let s = 0; s < settings.length; s++) {
                        window.settingsCookie[window.settings[settings[s]].id] = false;
                        if (window.settingsPanel.v2SettingsPanel) window.settingsPanel.v2SettingsPanel.updateSettings();
                        else window.settingsPanel.updateSettings();
                    }
                }
            }
        ]
    },
    // {
    // 	name: "guildmenu", description: "Shows the settings window for the current guild",
    // 	arguments: [
    // 		{get validator() {return Object.keys(Api.DiscordModules.DiscordConstants.GuildSettingsSections);}}
    // 	],
    // 	callback: (section) => {
    // 		Api.DiscordModules.GuildSettingsWindow = InternalUtilities.WebpackModules.findByUniqueProperties(['open', 'updateGuild']);
    // 		Api.DiscordModules.GuildSettingsWindow.setSection(section);
    // 		Api.DiscordModules.GuildSettingsWindow.open(Api.DiscordModules.SelectedGuildStore.getGuildId());
    // 	}
    // },
    // {
    // 	name: "settingsmenu", description: "Shows the user settings window",
    // 	arguments: [
    // 		{get validator() {return Object.keys(Api.DiscordModules.DiscordConstants.UserSettingsSections);}}
    // 	],
    // 	callback: (section) => {
    // 		Api.DiscordModules.UserSettingsWindow.setSection(section);
    // 		Api.DiscordModules.UserSettingsWindow.open();
    // 	}
    // },
    {
        name: "nextmention", description: "Goes to the next mention",
        callback: () => {
            CommandLine.KeyboardActions.MENTION_CHANNEL_NEXT.action();
        }
    },
    {
        name: "prevmention", description: "Goes to the previous mention",
        callback: () => {
            CommandLine.KeyboardActions.MENTION_CHANNEL_PREV.action();
        }
    },
    {
        name: "nextunread", description: "Goes to the next unread channel",
        callback: () => {
            CommandLine.KeyboardActions.UNREAD_NEXT.action();
        }
    },
    {
        name: "prevunread", description: "Goes to the previous unread channel",
        callback: () => {
            CommandLine.KeyboardActions.UNREAD_PREV.action();
        }
    },
    {
        name: "zoom", description: "Changes the zoom level",
        arguments: [
            {validator: ["in", "out", "reset"]}
        ],
        callback: (zoom) => {
            if (zoom == "in") CommandLine.KeyboardActions.ZOOM_IN.action();
            else if (zoom == "out") CommandLine.KeyboardActions.ZOOM_OUT.action();
            else CommandLine.KeyboardActions.ZOOM_RESET.action();
        }
    },
    {
        name: "debug", description: "Testing only",
        arguments: [
            {
                get validator() {
                    return [Math.random(),Math.random(),Math.random(),Math.random()];
                },
                getElement: (value) => {
                    return "<strong>" + value + "</strong>";
                },
                horizontal: true
            }
        ],
        callback: (zoom) => {
            if (zoom == "in") CommandLine.KeyboardActions.ZOOM_IN.action();
            else if (zoom == "out") CommandLine.KeyboardActions.ZOOM_OUT.action();
            else CommandLine.KeyboardActions.ZOOM_RESET.action();
        }
    },
    {
        name: "emote", description: "Testing only",
        arguments: [
            {
                get validator() {
                    let emotes = [...Object.keys(window.bdEmotes.TwitchGlobal).filter(e => e.length > 3), ...Object.keys(window.bdEmotes.FrankerFaceZ).filter(e => e.length > 3), ...Object.keys(window.bdEmotes.BTTV).filter(e => e.length > 3), ...Object.keys(window.bdEmotes.BTTV2).filter(e => e.length > 3)];
                    delete CommandLine.validator;
                    CommandLine.validator = emotes;
                }
            }
        ],
        callback: (emote) => {
            Api.DiscordModules.MessageActions._sendMessage(Api.DiscordModules.SelectedChannelStore.getChannelId(), {content: emote});
        }
    }
];