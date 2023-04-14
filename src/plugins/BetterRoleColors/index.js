/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {ReactUtils, Utils} = window.BdApi;
    const {DiscordSelectors, WebpackModules, DiscordModules, Patcher, ColorConverter, ReactComponents, Utilities, Logger} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const UserStore = DiscordModules.UserStore;
    const RelationshipStore = DiscordModules.RelationshipStore;
    const VoiceUser = WebpackModules.getByPrototypes("renderName");

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
            if (element.matches(`[class*="membersGroup-"]`)) element = [element];
            else element = element.querySelectorAll(`[class*="membersGroup-"]`);
            
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
            const MessageContent = WebpackModules.getModule(m => m?.type?.toString().includes("messageContent"));
            Patcher.after(MessageContent, "type", (_, [props], returnValue) => {
                if (!this.settings.modules.chat) return;
                const channel = DiscordModules.ChannelStore.getChannel(props.message.channel_id);
                if (!channel || !channel.guild_id) return;
                const member = this.getMember(props.message.author.id, channel.guild_id);
                const refFunc = (element) => {
                    if (!element) return;
                    element.style.setProperty("color", member.colorString || "", "important");
                };
                returnValue.props.style = {color: member?.colorString || ""};
                if (this.settings.global.saturation) returnValue.props["data-accessibility"] = "desaturate"; // Add to desaturation list for Discord
                if (this.settings.global.important) returnValue.ref = refFunc;
            });
        }

        async patchAuditLog(promiseState) {
            const UserHook = await ReactComponents.getComponent("UserHook", `[class*="userHook-"]`, c => c?.prototype?.render?.toString().includes("userHook"));
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