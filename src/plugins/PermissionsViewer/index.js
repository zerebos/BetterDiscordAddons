
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, PluginUtilities, Toasts, DiscordClasses, Utilities, DOMTools, ColorConverter, DCM, Structs, ReactTools} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const MemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const DiscordPerms = Object.assign({}, DiscordModules.DiscordConstants.Permissions);
    const AvatarDefaults = WebpackModules.getByProps("DEFAULT_AVATARS");
    const ModalClasses = WebpackModules.getByProps("root", "header", "small");
    const MenuSeparator = WebpackModules.getByProps("MenuSeparator").MenuSeparator;
    const Strings = WebpackModules.getModule(m => m.Messages && m.Messages.COPY_ID).Messages;
    const UserPopoutClasses = Object.assign({}, WebpackModules.getByProps("userPopout"), WebpackModules.getByProps("rolesList"), WebpackModules.getByProps("eyebrow"));
    const UserPopoutSelectors = {};
    for (const key in UserPopoutClasses) UserPopoutSelectors[key] = new Structs.Selector(UserPopoutClasses[key]);
    const RoleClasses = Object.assign({}, DiscordClasses.PopoutRoles, WebpackModules.getByProps("rolesList"), WebpackModules.getByProps("roleName", "roleIcon"));
    const escapeHTML = DOMTools.escapeHTML ? DOMTools.escapeHTML : function(html) {
        const textNode = document.createTextNode("");
        const spanElement = document.createElement("span");
        spanElement.append(textNode);
        textNode.nodeValue = html;
        return spanElement.innerHTML;
    };

    if (DiscordPerms.STREAM) {
        DiscordPerms.VIDEO = DiscordPerms.STREAM;
        delete DiscordPerms.STREAM;
    }
    if (DiscordPerms.MANAGE_GUILD) {
        DiscordPerms.MANAGE_SERVER = DiscordPerms.MANAGE_GUILD;
        delete DiscordPerms.MANAGE_GUILD;
    }

    return class PermissionsViewer extends Plugin {
        constructor() {
            super();
            this.css = require("styles.css");
            this.jumbo = require("jumbo.css");
            this.listHTML = require("list.html");
            this.skinHTML = require("listnew.html");
            this.itemHTML = require("item.html");
            this.modalHTML = require("modal.html");
            this.modalItem = require("modalitem.html");
            this.modalButton = require("modalbutton.html");
            this.modalButtonUser = require("modalbuttonuser.html");
            this.permAllowedIcon = require("permallowed.svg");
            this.permDeniedIcon = require("permdenied.svg");

            this.cancelUserPopout = () => {};
            this.contextMenuPatches = [];
        }

        onStart() {
            PluginUtilities.addStyle(this.getName(), this.css);

            this.listHTML = Utilities.formatTString(this.listHTML, DiscordClasses.UserPopout);
            this.listHTML = Utilities.formatTString(this.listHTML, RoleClasses);
            this.listHTML = Utilities.formatTString(this.listHTML, UserPopoutClasses);
            this.skinHTML = Utilities.formatTString(this.skinHTML, DiscordClasses.UserPopout);
            this.skinHTML = Utilities.formatTString(this.skinHTML, RoleClasses);
            this.skinHTML = Utilities.formatTString(this.skinHTML, UserPopoutClasses);
            this.itemHTML = Utilities.formatTString(this.itemHTML, RoleClasses);
            this.modalHTML = Utilities.formatTString(this.modalHTML, DiscordClasses.Backdrop);
            this.modalHTML = Utilities.formatTString(this.modalHTML, {root: ModalClasses.root, small: ModalClasses.small});

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            if (this.settings.popouts) this.bindPopouts();
            if (this.settings.contextMenus) this.bindContextMenus();
            this.setDisplayMode(this.settings.displayMode);
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
            this.promises.cancel();
            this.unbindPopouts();
            this.unbindContextMenus();
        }

        setDisplayMode(mode) {
            if (mode === "cozy") PluginUtilities.addStyle(this.getName() + "-jumbo", this.jumbo);
            else PluginUtilities.removeStyle(this.getName() + "-jumbo");
        }

        patchPopouts(e) {
            const popoutMount = (props) => {
                const popout = document.querySelector(`[class*="userPopout-"]`);
                if (!popout || popout.querySelector("#permissions-popout")) return;
                const user = MemberStore.getMember(props.guildId, props.user.id);
                const guild = GuildStore.getGuild(props.guildId);
                const name = MemberStore.getNick(props.guildId, props.user.id) ?? props.user.username;
                if (!user || !guild || !name) return;

                const userRoles = user.roles.slice(0);
                userRoles.push(guild.id);
                userRoles.reverse();
                let perms = 0n;

                const isSkin = popout.id === "user-popout";
                const permBlock = DOMTools.createElement(Utilities.formatTString(isSkin ? this.skinHTML : this.listHTML, {label: this.strings.popoutLabel}));
                const memberPerms = permBlock.querySelector(".member-perms");
                const strings = Strings;

                for (let r = 0; r < userRoles.length; r++) {
                    const role = userRoles[r];
                    if (!guild.roles[role]) continue;
                    perms = perms | guild.roles[role].permissions;
                    for (const perm in DiscordPerms) {
                        const permName = strings[perm] || perm.split("_").map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" ");
                        const hasPerm = (perms & DiscordPerms[perm]) == DiscordPerms[perm];
                        if (hasPerm && !memberPerms.querySelector(`[data-name="${permName}"]`)) {
                            const element = DOMTools.createElement(this.itemHTML);
                            if (isSkin) element.classList.add("rolePill-2Lo5dd");
                            let roleColor = guild.roles[role].colorString;
                            element.querySelector(".name").textContent = permName;
                            element.setAttribute("data-name", permName);
                            if (!roleColor) roleColor = "#B9BBBE";
                            element.querySelector(".perm-circle").style.backgroundColor = ColorConverter.rgbToAlpha(roleColor, 1);
                            element.style.borderColor = ColorConverter.rgbToAlpha(roleColor, 0.6);
                            memberPerms.prepend(element);
                        }
                    }
                }

                permBlock.querySelector(".perm-details").addEventListener("click", () => {
                    this.showModal(this.createModalUser(name, user, guild));
                    props.closePopout();
                });
                let roleList = popout.querySelector(isSkin ? ".roles-1waBHC" : UserPopoutSelectors.rolesList);
                if (isSkin) roleList = roleList.parentElement;
                roleList.parentNode.insertBefore(permBlock, roleList.nextSibling);
                


                const popoutInstance = ReactTools.getOwnerInstance(popout, {include: ["Popout"]});
                if (!popoutInstance || !popoutInstance.updateOffsets) return;
                popoutInstance.updateOffsets();
            };

            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            // console.log(e)
            const element = e.addedNodes[0];
            const popout = element.querySelector(`[class*="userPopout-"]`) ?? element;
            if (!popout || !popout.matches(`[class*="userPopout-"]`)) return;
            const props = Utilities.findInTree(ReactTools.getReactInstance(popout), m => m && m.user, {walkable: ["return", "memoizedProps"]});
            popoutMount(props);
        }

        bindPopouts() {
            this.observer = this.patchPopouts.bind(this);
        }

        unbindPopouts() {
            this.observer = undefined;
        }

        async bindContextMenus() {
            this.patchChannelContextMenu();
            this.patchGuildContextMenu();
            this.patchUserContextMenu();
        }

        unbindContextMenus() {
            for (const cancel of this.contextMenuPatches) cancel();
        }

        async patchGuildContextMenu() {
            const GuildContextMenu = await DCM.getDiscordMenu("useGuildMarkAsReadItem");
            if (this.promises.state.cancelled) return;
            this.contextMenuPatches.push(Patcher.after(GuildContextMenu, "default", (_, [guild], retVal) => {
                const original = retVal;
                const newOne = DCM.buildMenuItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        this.showModal(this.createModalGuild(guild.name, guild));
                    }
                });
                if (Array.isArray(original)) {
                    const separatorIndex = original.findIndex(k => !k?.props?.label);
                    const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                    original.splice(insertIndex, 0, newOne);
                    return original;
                }
                return [original, DiscordModules.React.createElement(MenuSeparator), newOne];
            }));
        }

        async patchChannelContextMenu() {
            const ChannelDeleteItem = await DCM.getDiscordMenu("useChannelMarkAsReadItem");
            if (this.promises.state.cancelled) return;
            const patch = (original, channel, guild) => {
                const newOne = DCM.buildMenuItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        if (!Object.keys(channel.permissionOverwrites).length) return Toasts.info(`#${channel.name} has no permission overrides`);
                        this.showModal(this.createModalChannel(channel.name, channel, guild));
                    }
                });

                if (Array.isArray(original)) {
                    const separatorIndex = original.findIndex(k => !k?.props?.label);
                    const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                    original.splice(insertIndex, 0, newOne);
                    return original;
                }

                return [
                    original,
                    DiscordModules.React.createElement(MenuSeparator),
                    newOne,
                ];
            };

            this.contextMenuPatches.push(Patcher.after(ChannelDeleteItem, "default", (_, [channel], ret) => {
                const guild = GuildStore.getGuild(channel.guild_id);
                return patch(ret, channel, guild);
            }));
        }

        async patchUserContextMenu() {
            const UserContextMenu = await DCM.getDiscordMenu("useUserProfileItem");
            if (this.promises.state.cancelled) return;

            this.contextMenuPatches.push(Patcher.after(UserContextMenu, "default", (_, [userId, guildId], retVal) => {
                const guild = GuildStore.getGuild(guildId);
                if (!guild) return;

                const original = retVal;
                const newOne = DCM.buildMenuItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        const user = MemberStore.getMember(guildId, userId);
                        const name = user.nick ? user.nick : UserStore.getUser(user.userId).username;
                        this.showModal(this.createModalUser(name, user, guild));
                    }
                });
                if (Array.isArray(original)) {
                    const separatorIndex = original.findIndex(k => !k?.props?.label);
                    const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                    original.splice(insertIndex, 0, newOne);
                    return original;
                }
                return [original, newOne];
            }));
        }

        showModal(modal) {
            const popout = document.querySelector(UserPopoutSelectors.userPopout);
            if (popout) popout.style.display = "none";
            const app = document.querySelector(".app-19_DXt");
            if (app) app.append(modal);
            else document.querySelector("#app-mount").append(modal);
        }

        createModalChannel(name, channel, guild) {
            return this.createModal(`#${name}`, channel.permissionOverwrites, guild.roles, true);
        }

        createModalUser(name, user, guild) {
            const guildRoles = Object.assign({}, guild.roles);
            const userRoles = user.roles.slice(0).filter(r => typeof(guildRoles[r]) !== "undefined");
            
            userRoles.push(guild.id);
            userRoles.sort((a, b) => {return guildRoles[b].position - guildRoles[a].position;});

            if (user.userId == guild.ownerId) {
                const ALL_PERMISSIONS = Object.values(DiscordModules.DiscordConstants.Permissions).reduce((all, p) => all | p);
                userRoles.push(user.userId);
                guildRoles[user.userId] = {name: this.strings.modal.owner, permissions: ALL_PERMISSIONS};
            }
            return this.createModal(name, userRoles, guildRoles);
        }

        createModalGuild(name, guild) {
            return this.createModal(name, guild.roles);
        }

        createModal(title, displayRoles, referenceRoles, isOverride = false) {
            if (!referenceRoles) referenceRoles = displayRoles;
            const modal = DOMTools.createElement(Utilities.formatTString(Utilities.formatTString(this.modalHTML, this.strings.modal), {name: escapeHTML(title)}));
            modal.querySelector(".callout-backdrop").addEventListener("click", () => {
                modal.classList.add("closing");
                setTimeout(() => {modal.remove();}, 300);
            });

            const strings = Strings || {};
            for (const r in displayRoles) {
                const role = Array.isArray(displayRoles) ? displayRoles[r] : r;
                const user = UserStore.getUser(role) || {getAvatarURL: () => AvatarDefaults.DEFAULT_AVATARS[Math.floor(Math.random() * AvatarDefaults.DEFAULT_AVATARS.length)], username: role};
                const member = MemberStore.getMember(SelectedGuildStore.getGuildId(), role) || {colorString: ""};
                const item = DOMTools.createElement(!isOverride || displayRoles[role].type == 0 ? this.modalButton : Utilities.formatTString(this.modalButtonUser, {avatarUrl: user.getAvatarURL(null, 16, true)})); // getAvatarURL(guildId, size, canAnimate);
                if (!isOverride || displayRoles[role].type == 0) item.style.color = referenceRoles[role].colorString;
                else item.style.color = member.colorString;
                if (isOverride) item.querySelector(".role-name").innerHTML = escapeHTML(displayRoles[role].type == 0 ? referenceRoles[role].name : user.username);
                else item.querySelector(".role-name").innerHTML = escapeHTML(referenceRoles[role].name);
                modal.querySelector(".role-scroller").append(item);
                item.addEventListener("click", () => {
                    modal.querySelectorAll(".role-item.selected").forEach(e => e.classList.remove("selected"));
                    item.classList.add("selected");
                    const allowed = isOverride ? displayRoles[role].allow : referenceRoles[role].permissions;
                    const denied = isOverride ? displayRoles[role].deny : null;

                    const permList = modal.querySelector(".perm-scroller");
                    permList.innerHTML = "";
                    for (const perm in DiscordPerms) {
                        const element = DOMTools.createElement(this.modalItem);
                        const permAllowed = (allowed & DiscordPerms[perm]) == DiscordPerms[perm];
                        const permDenied = isOverride ? (denied & DiscordPerms[perm]) == DiscordPerms[perm] : !permAllowed;
                        if (!permAllowed && !permDenied) continue;
                        if (permAllowed) {
                            element.classList.add("allowed");
                            element.prepend(DOMTools.createElement(this.permAllowedIcon));
                        }
                        if (permDenied) {
                            element.classList.add("denied");
                            element.prepend(DOMTools.createElement(this.permDeniedIcon));
                        }
                        element.querySelector(".perm-name").textContent = strings[perm] || perm.split("_").map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" ");
                        permList.append(element);
                    }
                });
                item.addEventListener("contextmenu", (e) => {
                    DCM.openContextMenu(e, DCM.buildMenu([
                        {label: Strings.COPY_ID ?? "Copy Id", action: () => {DiscordModules.ElectronModule.copy(role);}}
                    ]));
                });
            }

            modal.querySelector(".role-item").click();

            return modal;
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, checked) => {
                if (id == "popouts") {
                    if (checked) this.bindPopouts();
                    else this.unbindPopouts();
                }
                if (id == "contextMenus") {
                    if (checked) this.bindContextMenus();
                    this.unbindContextMenus();
                }
                if (id == "displayMode") this.setDisplayMode(checked);
            });
            return panel.getElement();
        }

    };
};
