/**
 * @name BetterRoleColors
 * @description Adds server-based role colors to typing, voice, popouts, modals and more!
 * @version 0.10.2
 * @author Zerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js
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
    name: "BetterRoleColors",
    author: "Zerebos",
    version: "0.10.2",
    description: "Adds server-based role colors to typing, voice, popouts, modals and more!",
    github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors",
    github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js",
    changelog: [
        {
            title: "Partially Fixed!",
            type: "fixed",
            items: [
                "Fixed coloring voice users.",
                "Fixed coloring audit log.",
                "Fixed coloring chat text.",
                "Fixed coloring members group.",
                "Popouts and profiles will be fixed in the next update.",
                "Account container will be fixed in the next update."
            ]
        }
    ],
    defaultConfig: [
        {
            type: "category",
            id: "global",
            name: "Global Settings",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "important",
                    name: "Use Important",
                    note: "Add !important to role colors. (Only enable this if the plugin isn't working with your theme).",
                    value: false
                },
                {
                    type: "switch",
                    id: "saturation",
                    name: "Use Saturation",
                    note: "Abide by the saturation level set in Discord's accessibility settings.",
                    value: true
                }
            ]
        },
        {
            type: "category",
            id: "modules",
            name: "Module Settings",
            collapsible: true,
            shown: true,
            settings: [
                {
                    type: "switch",
                    id: "typing",
                    name: "Typing",
                    note: "Toggles colorizing of typing notifications.",
                    value: true
                },
                {
                    type: "switch",
                    id: "voice",
                    name: "Voice",
                    note: "Toggles colorizing of voice users.",
                    value: true
                },
                {
                    type: "switch",
                    id: "mentions",
                    name: "Mentions",
                    note: "Toggles colorizing of user mentions in chat.",
                    value: true
                },
                {
                    type: "switch",
                    id: "chat",
                    name: "Chat",
                    note: "Toggles colorizing the message text of users in chat.",
                    value: true
                },
                {
                    type: "switch",
                    id: "botTags",
                    name: "Bot Tags",
                    note: "Toggles coloring the background of bot tags to match role.",
                    value: true
                },
                {
                    type: "switch",
                    id: "memberList",
                    name: "Memberlist Headers",
                    note: "Toggles coloring role names in the member list.",
                    value: true
                }
            ]
        },
        {
            type: "category",
            id: "popouts",
            name: "Popout Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "username",
                    name: "Username",
                    note: "Toggles coloring on the username in popouts.",
                    value: false
                },
                {
                    type: "switch",
                    id: "discriminator",
                    name: "Discriminator",
                    note: "Toggles coloring on the discriminator in popouts.",
                    value: false
                },
                {
                    type: "switch",
                    id: "nickname",
                    name: "Nickname",
                    note: "Toggles coloring on the nickname in popouts.",
                    value: true
                },
                {
                    type: "switch",
                    id: "fallback",
                    name: "Enable Fallback",
                    note: "If nickname is on and username is off, enabling this will automatically color the username.",
                    value: true
                }
            ]
        },
        {
            type: "category",
            id: "modals",
            name: "Modal Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "username",
                    name: "Username",
                    note: "Toggles coloring on the username in modals.",
                    value: true
                },
                {
                    type: "switch",
                    id: "discriminator",
                    name: "Discriminator",
                    note: "Toggles coloring on the discriminator in modals.",
                    value: false
                }
            ]
        },
        {
            type: "category",
            id: "auditLog",
            name: "Audit Log Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "username",
                    name: "Username",
                    note: "Toggles coloring on the username in audit log.",
                    value: true
                },
                {
                    type: "switch",
                    id: "discriminator",
                    name: "Discriminator",
                    note: "Toggles coloring on the discriminator in audit log.",
                    value: false
                }
            ]
        },
        {
            type: "category",
            id: "account",
            name: "Account Details Options",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "switch",
                    id: "username",
                    name: "Username",
                    note: "Toggles coloring on the username in account details.",
                    value: true
                },
                {
                    type: "switch",
                    id: "discriminator",
                    name: "Discriminator",
                    note: "Toggles coloring on the discriminator in account details.",
                    value: false
                }
            ]
        }
    ],
    main: "index.js"
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
    const {ReactUtils, Utils} = window.BdApi;
    const {DiscordSelectors, WebpackModules, DiscordModules, Patcher, ColorConverter, ReactComponents, Utilities, Logger} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const VoiceUser = WebpackModules.getByPrototypes("renderName", "renderAvatar");

    return class BetterRoleColors extends Plugin {

        onStart() {
            Utilities.suppressErrors(this.patchAccountDetails.bind(this), "account details patch")();
            Utilities.suppressErrors(this.patchVoiceUsers.bind(this), "voice users patch")();
            Utilities.suppressErrors(this.patchMessageContent.bind(this), "message content patch")();

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            Utilities.suppressErrors(this.patchAuditLog.bind(this), "audit log patch")(this.promises.state);
            Utilities.suppressErrors(this.patchTypingUsers.bind(this), "typing users patch")(this.promises.state);
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
            if (this.unpatchAccountDetails) {
                this.unpatchAccountDetails();
                delete this.unpatchAccountDetails;
            }
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

        getMember(userId, guild = "") {
            const guildId = guild || SelectedGuildStore.getGuildId();
            if (!guildId) return null;
            const member = GuildMemberStore.getMember(guildId, userId);
            if (!guildId) return null;
            return member;
        }

        patchAccountDetails() {
            const rawClasses = WebpackModules.getByProps("container", "avatar", "hasBuildOverride");

            const containerSelector = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
            const usernameSelector = `${containerSelector} .${rawClasses.usernameContainer.split(" ").join(".")} > div`;
            const discrimSelector = `${containerSelector} .${rawClasses.usernameContainer.split(" ").join(".")} + div`;

            const colorizeAccountDetails = (reset = false) => {
                let username = document.querySelector(usernameSelector);
                if (!username) username = document.querySelector(usernameSelector.replace(" > div", ""));
                const discrim = document.querySelector(discrimSelector);
                if (!username || !discrim) return Logger.info("Could not get account details username and discrim elements");
                let member = this.getMember(UserStore.getCurrentUser().id, SelectedGuildStore.getGuildId());
                if (!member || !member.colorString) member = {colorString: ""};
                const doImportant = this.settings.global.important ? "important" : undefined;

                const doColorUsername = this.settings.account.username && !reset ? member.colorString : "";
                const doColorDiscrim = this.settings.account.discriminator && !reset ? member.colorString : "";
                username.style.setProperty("color", doColorUsername, doImportant);
                discrim.style.setProperty("color", doColorDiscrim, doImportant);
                if (this.settings.global.saturation) {
                    if (doColorUsername) username.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                    if (doColorUsername) discrim.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                }
            };

            this.onSwitch = colorizeAccountDetails;
            colorizeAccountDetails();
            this.unpatchAccountDetails = () => {
                delete this.onSwitch;
                colorizeAccountDetails(true);
            };
        }

        patchVoiceUsers() {
            Patcher.after(VoiceUser.prototype, "renderName", (thisObject, _, returnValue) => {
                if (!this.settings.modules.voice) return;
                if (!returnValue || !returnValue.props) return;
                const member = this.getMember(thisObject?.props?.user?.id);
                if (!member || !member.colorString) return;
                if (this.settings.global.saturation) returnValue.props["data-accessibility"] = "desaturate"; // Add to desaturation list for Discord
                returnValue.props.style = {color: member.colorString, backfaceVisibility: "hidden"};
                if (!this.settings.global.important) return;
                returnValue.ref = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };
            });
        }

        observer({addedNodes}) {
            if (!addedNodes?.length) return;
            const element = addedNodes[0];
            if (element.nodeType !== 1) return;
            // if (!element.matches) console.log("bad", element);
            this.colorMentions(element);
            this.colorNameTags(element);
            this.colorHeaders(element);
        }

        colorHeaders(element) {
            if (!this.settings.modules.memberList) return;
            if (element.matches(`[class*="membersGroup__"]`)) element = [element];
            else element = element.querySelectorAll(`[class*="membersGroup__"]`);
            
            if (!element?.length) return;
            for (const header of element) {
                const instance = ReactUtils.getInternalInstance(header);
                if (!instance) continue;
                const props = Utils.findInTree(instance, p => p?.id && p?.guildId, {walkable: ["memoizedProps", "return"]});
                if (!props) continue;
                const guild = GuildStore.getGuild(props.guildId);
                if (!guild) continue;
                const role = guild.roles[props.id];
                if (!role?.colorString) continue;

                header.style.setProperty("color", role.colorString, this.settings.global.important ? "important" : "");
                if (this.settings.global.saturation) header.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
            }
        }

        colorNameTags(element) {
            const doColorModals = this.settings.modals.username || this.settings.modals.discriminator;
            const doColorPopouts = this.settings.popouts.username || this.settings.popouts.discriminator || this.settings.popouts.nickname;
            if (!doColorModals && !doColorPopouts) return;

            const nameTag = element.querySelector(`[class*="profile"] [class*="nameTag-"]`);
            if (!nameTag) return;

            const props = Utils.findInTree(ReactUtils.getInternalInstance(nameTag), m => m?.user, {walkable: ["memoizedProps", "return"]});
            if (!props) return;

            const member = this.getMember(props.user?.id);
            if (!member?.colorString) return;

            const important = this.settings.global.important ? "important" : "";
            const isPopout = "usernameIcon" in props;
            if (!isPopout) {
                if (this.settings.modals.username) {
                    const username = nameTag.querySelector(`.${props?.usernameClass?.split(" ")[0]}`);
                    username.style.setProperty("color", member.colorString, important);
                    if (this.settings.global.saturation) username.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                }
                if (this.settings.modals.discriminator) {
                    const discrim = nameTag.querySelector(`.${props?.discriminatorClass?.split(" ")[0]}`);
                    discrim.style.setProperty("color", member.colorString, important);
                    if (this.settings.global.saturation) discrim.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                }
            }
            else {
                const hasNickname = props?.className.toLowerCase().includes("withnickname") && nameTag.previousElementSibling;
                const shouldColorUsername = this.settings.popouts.username || (!hasNickname && this.settings.popouts.fallback);
                const shouldColorDiscriminator = this.settings.popouts.discriminator;
                const shouldColorNickname = this.settings.popouts.nickname && hasNickname;
                if (shouldColorNickname) {
                    nameTag.previousElementSibling.style.setProperty("color", member.colorString, important);
                    if (this.settings.global.saturation) nameTag.previousElementSibling.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                }
                if (shouldColorUsername) {
                    const username = nameTag.querySelector(`.${props?.usernameClass?.split(" ")[0]}`);
                    username.style.setProperty("color", member.colorString, important);
                    if (this.settings.global.saturation) username.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                }
                if (shouldColorDiscriminator) {
                    const discrim = nameTag.querySelector(`.${props?.discriminatorClass?.split(" ")[0]}`);
                    discrim.style.setProperty("color", member.colorString, important);
                    if (this.settings.global.saturation) discrim.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                }
            }
        }

        colorMentions(element) {
            if (!this.settings.modules.mentions) return;
            if (element.matches(".mention")) element = [element];
            element = element.querySelectorAll(".mention");
            if (!element?.length) return;
            for (const mention of element) {
                if (mention.className.includes("role") || mention.className.includes("command")) continue;
                const instance = ReactUtils.getInternalInstance(mention);
                if (!instance) continue;
                const props = Utils.findInTree(instance, p => p?.userId || (p?.id && p?.guildId), {walkable: ["memoizedProps", "return"]});
                if (!props) continue;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), props.userId ?? props.id);
                if (!member?.colorString) continue;
                const important = this.settings.global.important ? "important" : "";
                if (this.settings.global.saturation) mention.dataset.accessibility = "desaturate"; // Add to desaturation list for Discord
                mention.style.setProperty("color", member.colorString, important);
                mention.style.setProperty("background-color", `rgb(${ColorConverter.getRGB(member.colorString).join(", ")}, 0.1)`, important);
                mention.addEventListener("mouseenter", () => mention.style.setProperty("background-color", `rgb(${ColorConverter.getRGB(member.colorString).join(", ")}, 0.3)`, important));
                mention.addEventListener("mouseleave", () => mention.style.setProperty("background-color", `rgb(${ColorConverter.getRGB(member.colorString).join(", ")}, 0.1)`, important));
            }
        }

        patchMessageContent() {
            const MessageContent = WebpackModules.getModule(m => m?.type?.toString().includes("messageContent") && m?.type?.toString().includes("MESSAGE_EDITED"));
            Patcher.after(MessageContent, "type", (_, [props], returnValue) => {
                if (!this.settings.modules.chat) return;
                const channel = DiscordModules.ChannelStore.getChannel(props.message.channel_id);
                if (!channel || !channel.guild_id) return;
                const member = this.getMember(props.message.author.id, channel.guild_id);
                const refFunc = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member?.colorString || "", "important");
                };
                returnValue.props.style = {color: member?.colorString || ""};
                if (this.settings.global.saturation) returnValue.props["data-accessibility"] = "desaturate"; // Add to desaturation list for Discord
                if (this.settings.global.important) returnValue.ref = refFunc;
            });
        }

        async patchAuditLog(promiseState) {
            const UserHook = await ReactComponents.getComponent("UserHook", `[class*="userHook_"]`, c => c?.prototype?.render?.toString().includes("userHook"));
            if (promiseState.cancelled) return;
            Patcher.after(UserHook.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
                const auditLogProps = Utils.findInTree(thisObject._reactInternals, m => m && m.guildId, {walkable: ["return", "stateNode", "props"]});
                const member = this.getMember(thisObject.props.user.id, auditLogProps.guildId);
                if (!member || !member.colorString) return;
                const username = returnValue.props.children[0];
                const discriminator = returnValue.props.children[1];
                const refFunc = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };

                if (username && this.settings.auditLog.username) {
                    if (this.settings.global.saturation) username.props["data-accessibility"] = "desaturate"; // Add to desaturation list for Discord
                    username.props.style = {color: member.colorString};
                    if (this.settings.global.important) username.props.ref = refFunc;
                }
                if (discriminator && this.settings.auditLog.discriminator) {
                    if (this.settings.global.saturation) discriminator.props["data-accessibility"] = "desaturate"; // Add to desaturation list for Discord
                    discriminator.props.style = {color: member.colorString};
                    if (this.settings.global.important) discriminator.props.ref = refFunc;
                }
            });
            UserHook.forceUpdateAll();
        }

        filterTypingUsers(typingUsers) {
            if (!typingUsers) return [];
            return Object.keys(typingUsers).filter((e) => {
                return e != UserStore.getCurrentUser().id;
            }).filter((e) => {
                return !RelationshipStore.isBlocked(e);
            }).map((e) => {
                return UserStore.getUser(e);
            }).filter(function(e) {
                return e != null;
            });
        }

        async patchTypingUsers(promiseState) {
            const TypingUsers = await ReactComponents.getComponent("TypingUsers", DiscordSelectors.Typing.typing, c => c?.prototype?.getCooldownTextStyle);
            if (promiseState.cancelled) return;
            Patcher.after(TypingUsers.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.typing) return;

                const typingUsers = this.filterTypingUsers(Object.assign({}, thisObject.props.typingUsers));
                for (let m = 0; m < typingUsers.length; m++) {
                    const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[m].id);
                    if (!member) continue;

                    const username = Utilities.getNestedProp(returnValue, `props.children.0.props.children.1.props.children.${m * 2}`);
                    if (!username || !username.props) return;
                    if (this.settings.global.saturation) username.props["data-accessibility"] = "desaturate"; // Add to desaturation list for Discord
                    username.props.style = {color: member.colorString};
                    if (!this.settings.global.important) continue;
                    username.ref = (element) => {
                        if (!element) return;
                        element.style.setProperty("color", member.colorString, "important");
                    };
                }
            });
            TypingUsers.forceUpdateAll();
        }

    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/