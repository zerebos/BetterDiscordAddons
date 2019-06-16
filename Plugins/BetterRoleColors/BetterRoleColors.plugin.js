//META{"name":"BetterRoleColors","displayName":"BetterRoleColors","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
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

var BetterRoleColors = (() => {
    const config = {"info":{"name":"BetterRoleColors","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.8.2","description":"Adds server-based role colors to typing, voice, popouts, modals and more! Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterRoleColors","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterRoleColors/BetterRoleColors.plugin.js"},"changelog":[{"title":"Fixes","type":"fixed","items":["Account details are colored again.","Next time when one thing breaks, the rest of the plugin will be fine.","Opening user popouts no longer crash everything."]}],"defaultConfig":[{"type":"category","id":"global","name":"Global Settings","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"important","name":"Use Important","note":"Add !important to role colors. (Only enable this if the plugin isn't working with your theme).","value":false}]},{"type":"category","id":"modules","name":"Module Settings","collapsible":true,"shown":true,"settings":[{"type":"switch","id":"typing","name":"Typing","note":"Toggles colorizing of typing notifications.","value":true},{"type":"switch","id":"voice","name":"Voice","note":"Toggles colorizing of voice users.","value":true},{"type":"switch","id":"mentions","name":"Mentions","note":"Toggles colorizing of user mentions in chat.","value":true},{"type":"switch","id":"botTags","name":"Bot Tags","note":"Toggles coloring the background of bot tags to match role.","value":true},{"type":"switch","id":"memberList","name":"Memberlist Headers","note":"Toggles coloring role names in the member list.","value":true}]},{"type":"category","id":"popouts","name":"Popout Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in popouts.","value":false},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in popouts.","value":false},{"type":"switch","id":"nickname","name":"Nickname","note":"Toggles coloring on the nickname in popouts.","value":true},{"type":"switch","id":"fallback","name":"Enable Fallback","note":"If nickname is on and username is off, enabling this will automatically color the username.","value":true}]},{"type":"category","id":"modals","name":"Modal Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in modals.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in modals.","value":false}]},{"type":"category","id":"auditLog","name":"Audit Log Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in audit log.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in audit log.","value":false}]},{"type":"category","id":"account","name":"Account Details Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"username","name":"Username","note":"Toggles coloring on the username in account details.","value":true},{"type":"switch","id":"discriminator","name":"Discriminator","note":"Toggles coloring on the discriminator in account details.","value":false}]},{"type":"category","id":"mentions","name":"Mention Options","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"changeOnHover","name":"Hover Color","note":"Turning this on adjusts the color on hover to match role color, having it off defers to your theme.","value":true}]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {DiscordSelectors, WebpackModules, DiscordModules, Patcher, ColorConverter, ReactComponents, Utilities, ReactTools} = Api;

    const Flux = WebpackModules.getByProps("connectStores");
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const PopoutWrapper = WebpackModules.getByDisplayName("Popout");
    const VoiceUser = WebpackModules.find(m => typeof(m) === "function" && m.List);

    const DiscordTag = WebpackModules.getByDisplayName("NameTag");
    const ColoredDiscordTag = class ColoredDiscordTag extends DiscordTag {
        render() {
            const returnValue = super.render();
            const username = returnValue.props.children[0];
            const discriminator = returnValue.props.children[1];
            if (username) username.props.className = "username " + username.props.className;
            if (discriminator) discriminator.props.className = "discriminator " + discriminator.props.className;
            const refFunc = (colorString) => (element) => {
                if (!element) return;
                element.style.setProperty("color", colorString, "important");
            };

            const userColor = returnValue.props.colorUsername;
            const discrimColor = returnValue.props.colorDiscriminator;

            if (username && userColor !== undefined) {
                username.props.style = {color: userColor};
                if (returnValue.props.important && userColor) username.ref = refFunc(userColor);
            }
            if (discriminator && discrimColor !== undefined) {
                discriminator.props.style = {color: discrimColor};
                if (returnValue.props.important && discrimColor) username.ref = refFunc(discrimColor);
            }
            return returnValue;
        }
    };

    const FluxTag = WebpackModules.getByDisplayName("FluxContainer(DiscordTag)");
    const ColoredFluxTag = class ColoredFluxTag extends FluxTag {
        render() {
            const returnValue = super.render();
            returnValue.type = ColoredDiscordTag;
            return returnValue;
        }
    };

    return class BetterRoleColors extends Plugin {

        onStart() {
            Utilities.suppressErrors(this.patchAccountDetails.bind(this), "account details patch")();
            Utilities.suppressErrors(this.patchVoiceUsers.bind(this), "voice users patch")();
            Utilities.suppressErrors(this.patchMentions.bind(this), "mentions patch")();

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            Utilities.suppressErrors(this.patchAuditLog.bind(this), "audit log patch")(this.promises.state);
            Utilities.suppressErrors(this.patchTypingUsers.bind(this), "typing users patch")(this.promises.state);
            Utilities.suppressErrors(this.patchUserPopouts.bind(this), "user popout patch")(this.promises.state);
            Utilities.suppressErrors(this.patchUserModals.bind(this), "user modal patch")(this.promises.state);
            Utilities.suppressErrors(this.patchMemberList.bind(this), "member list patch")(this.promises.state);
        }

        onStop() {
            Patcher.unpatchAll();
            this.promises.cancel();
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
            const container = DiscordSelectors.AccountDetails.container || `.${rawClasses.container.split(" ").join(".")}`;
            const AccountContainer = ReactTools.getOwnerInstance(document.querySelector(container));
            if (!AccountContainer) return;
            Patcher.after(AccountContainer.constructor.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.account.username && !this.settings.account.discriminator) return;
                const Username = returnValue.props.children[1].props.children[0];
                const Discriminator = returnValue.props.children[1].props.children[1];
                if (!Username || !Discriminator) return;
                const Text = Username.type;
                const fluxWrapper = Flux.connectStores([SelectedGuildStore], () => ({guildId: SelectedGuildStore.getGuildId()}));
                const wrappedText = (isUsername) => fluxWrapper(({guildId}) => {
                    let member = this.getMember(thisObject.props.currentUser.id, guildId);
                    if (!member || !member.colorString) member = {colorString: ""};
                    const color = isUsername ? (this.settings.account.username ? member.colorString : "") : this.settings.account.discriminator ? member.colorString : "";
                    const refFunc = (element) => {
                        if (!element) return;
                        element.style.setProperty("color", color, "important");
                    };
                    const Component = isUsername ? Username : Discriminator;
                    const retVal = DiscordModules.React.createElement(Text, Component.props);
                    retVal.props.style = {color};
                    if (isUsername) retVal.props.children[0].props.style = {color: "inherit"};
                    if (this.settings.global.important) retVal.ref = refFunc;
                    return retVal;
                });

                Username.type = wrappedText(true);
                Discriminator.type = wrappedText(false);
            });
            ReactTools.getOwnerInstance(document.querySelector(container)).forceUpdate();
        }

        patchVoiceUsers() {
            Patcher.after(VoiceUser.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.voice) return;
                const member = this.getMember(thisObject.props.user.id);
                if (!member || !member.colorString) return;
                const username = Utilities.getNestedProp(returnValue, "props.children.props.children.2");
                if (!username || !username.props) return;
                username.props.style = {color: member.colorString};
                if (!this.settings.global.important) return;
                username.ref = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };
            });
        }

        patchMentions() {
            Patcher.after(PopoutWrapper.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.mentions) return;
                const isMention = returnValue.props.className.toLowerCase().includes("mention");
                if (!isMention) return;
                const userId = thisObject.props.render().props.userId;
                const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), userId);
                if (!member || !member.colorString) return;
                const defaultStyle = {
                    color: member.colorString,
                    background: ColorConverter.rgbToAlpha(member.colorString, 0.1)
                };

                const hoverStyle = {
                    color: "#ffffff",
                    background: ColorConverter.rgbToAlpha(member.colorString, 0.7)
                };

                returnValue.props.onMouseEnter = () => { thisObject.setState({isHovered: true}); };
                returnValue.props.onMouseLeave = () => { thisObject.setState({isHovered: false}); };

                const currentStyle = thisObject.state.isHovered ? hoverStyle : defaultStyle;
                returnValue.props.style = currentStyle;
                if (!this.settings.global.important) return;
                const element = DiscordModules.ReactDOM.findDOMNode(thisObject);
                if (!element) return;
                element.style.setProperty("color", currentStyle.color, "important");
                element.style.setProperty("background", currentStyle.background, "important");
            });
            for (const e of document.querySelectorAll(".mention")) {
                const instance = ReactTools.getOwnerInstance(e, {include: ["Popout"]});
                if (instance) instance.forceUpdate();
            }
        }



        // Start ReactComponents using patches.

        async patchAuditLog(promiseState) {
            const UserHook = await ReactComponents.getComponentByName("UserHook", DiscordSelectors.AuditLog.userHook);
            if (promiseState.cancelled) return;
            Patcher.after(UserHook.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.auditLog.username && !this.settings.auditLog.discriminator) return;
                const auditLogProps = Utilities.findInTree(thisObject._reactInternalFiber, m => m && m.guildId, {walkable: ["return", "stateNode", "props"]});
                const member = this.getMember(thisObject.props.user.id, auditLogProps.guildId);
                if (!member || !member.colorString) return;
                const username = returnValue.props.children[0];
                const discriminator = returnValue.props.children[1];
                const refFunc = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString, "important");
                };

                if (username && this.settings.auditLog.username) {
                    username.props.style = {color: member.colorString};
                    if (this.settings.global.important) username.ref = refFunc;
                }
                if (discriminator && this.settings.auditLog.discriminator) {
                    discriminator.props.style = {color: member.colorString};
                    if (this.settings.global.important) discriminator.ref = refFunc;
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
            const TypingUsers = await ReactComponents.getComponentByName("TypingUsers", DiscordSelectors.Typing.typing);
            if (promiseState.cancelled) return;
            Patcher.after(TypingUsers.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modules.typing) return;
                const typingUsers = this.filterTypingUsers(Object.assign({}, thisObject.props.typingUsers));
                for (let m = 0; m < typingUsers.length; m++) {
                    const member = GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), typingUsers[m].id);
                    if (!member) continue;
                    returnValue.props.children[1].props.children[m * 2].props.style = {color: member.colorString};
                    if (!this.settings.global.important) continue;
                    returnValue.props.children[1].props.children[m * 2].ref = (element) => {
                        if (!element) return;
                        element.style.setProperty("color", member.colorString, "important");
                    };
                }
            });
            TypingUsers.forceUpdateAll();
        }

        async patchUserPopouts(promiseState) {
            const UserPopout = await ReactComponents.getComponentByName("UserPopout", DiscordSelectors.UserPopout.userPopout);
            if (promiseState.cancelled) return;
            Patcher.after(UserPopout.component.prototype, "render", (thisObject, _, returnValue) => {
                const member = thisObject.props.guildMember;
                if (!member || !member.colorString) return;
                const nickname = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.0.props.children.0");
                const tag = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.1.props.children");
                const shouldColorUsername = this.settings.popouts.username || (!nickname && this.settings.popouts.fallback);
                const shouldColorDiscriminator = this.settings.popouts.discriminator;
                const shouldColorNickname = this.settings.popouts.nickname && nickname;
                if (shouldColorNickname) nickname.props.style = {color: member.colorString};
                if ((!shouldColorUsername && !shouldColorDiscriminator) || !tag) return;
                if (shouldColorUsername) tag.props.colorUsername = member.colorString;
                if (shouldColorDiscriminator) tag.props.colorDiscriminator = member.colorString;
                if (this.settings.global.important) tag.props.important = true;
                tag.type = ColoredFluxTag;
            });
            UserPopout.forceUpdateAll();
        }

        async patchUserModals(promiseState) {
            const UserProfileBody = await ReactComponents.getComponentByName("UserProfileBody", DiscordSelectors.UserModal.root);
            if (promiseState.cancelled) return;
            Patcher.after(UserProfileBody.component.prototype, "render", (thisObject, _, returnValue) => {
                if (!this.settings.modals.username && !this.settings.modals.discriminator) return;
                const member = this.getMember(thisObject.props.user.id);
                if (!member || !member.colorString) return;
                const tag = Utilities.getNestedProp(returnValue, "props.children.props.children.0.props.children.0.props.children.1.props.children.0");
                if (!tag) return;
                if (this.settings.modals.username) tag.props.colorUsername = member.colorString;
                if (this.settings.modals.discriminator) tag.props.colorDiscriminator = member.colorString;
                if (this.settings.global.important) tag.props.important = true;
                tag.type = ColoredFluxTag;
            });
            UserProfileBody.forceUpdateAll();
        }

        async patchMemberList(promiseState) {
            const BRC = this;
            const MemberList = await ReactComponents.getComponentByName("ChannelMembers", DiscordSelectors.MemberList.membersWrap);
            if (promiseState.cancelled) return;
            Patcher.after(MemberList.component.prototype, "render", (memberList) => {
                if (memberList.renderSection.__patched) return;
                Patcher.after(memberList, "renderSection", (_, __, section) => {
                    if (!this.settings.modules.memberList) return;
                    const guild = DiscordModules.GuildStore.getGuild(memberList.props.channel.guild_id);
                    if (!guild) return;
                    const roleId = section.props.children ? section.props.children.props.id : section.props.id;
                    const roleColor = guild.roles[roleId] ? guild.roles[roleId].colorString : "";
                    if (!roleColor) return;
                    const originalType = section.props.children ? section.props.children.type : section.type;
                    const myRef = DiscordModules.React.createRef();
                    const ColoredRoleHeader = function() {
                        const label = originalType(...arguments);
                        label.props.style = {color: roleColor};
                        if (!BRC.settings.global.important) return label;
                        label.ref = (element) => {
                            if (!element) return;
                            element.style.setProperty("color", roleColor, "important");
                        };
                        return label;
                    };
                    if (section.props.children) section.props.children.ref = myRef, section.props.children.type = ColoredRoleHeader;
                    else section.ref = myRef, section.type = ColoredRoleHeader;
                    return section;
                });
                memberList.renderSection.__patched = true;
            });
            MemberList.forceUpdateAll();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/