/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {ContextMenu, DOM, Utils} = window.BdApi;
    const {DiscordModules, WebpackModules, Toasts, DiscordClasses, Utilities, DOMTools, ColorConverter, ReactTools} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const MemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const DiscordPerms = Object.assign({}, DiscordModules.DiscordPermissions);
    const AvatarDefaults = WebpackModules.getByProps("DEFAULT_AVATARS");
    const ModalClasses = WebpackModules.getByProps("root", "header", "small");
    const Strings = WebpackModules.getModule(m => m.Messages && m.Messages.COPY_ID).Messages;
    const UserPopoutClasses = Object.assign({section: "section_ba4d80", heading: "heading_ba4d80", root: "root_c83b44"}, WebpackModules.getByProps("userPopoutOuter"), WebpackModules.getByProps("defaultColor", "eyebrow"), DiscordClasses.PopoutRoles, WebpackModules.getByProps("root", "expandButton"), WebpackModules.getModule(m => m?.heading && m?.section && Object.keys(m)?.length === 2));
    const RoleClasses = Object.assign({}, DiscordClasses.PopoutRoles, WebpackModules.getByProps("defaultColor", "eyebrow"), WebpackModules.getByProps("role", "roleName", "roleCircle"));

    const getRoles = (guild) => guild?.roles ?? GuildStore.getRoles(guild?.id);

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
            this.sectionHTML = require("list.html");
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
            DOM.addStyle(this.name, this.css);

            this.sectionHTML = Utilities.formatString(this.sectionHTML, DiscordClasses.UserPopout);
            this.sectionHTML = Utilities.formatString(this.sectionHTML, RoleClasses);
            this.sectionHTML = Utilities.formatString(this.sectionHTML, UserPopoutClasses);
            this.itemHTML = Utilities.formatString(this.itemHTML, RoleClasses);
            this.modalHTML = Utilities.formatString(this.modalHTML, DiscordClasses.Backdrop);
            this.modalHTML = Utilities.formatString(this.modalHTML, {root: ModalClasses.root, small: ModalClasses.small});

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            if (this.settings.popouts) this.bindPopouts();
            if (this.settings.contextMenus) this.bindContextMenus();
            this.setDisplayMode(this.settings.displayMode);
        }

        onStop() {
            DOM.removeStyle(this.name);
            this.promises.cancel();
            this.unbindPopouts();
            this.unbindContextMenus();
        }

        setDisplayMode(mode) {
            if (mode === "cozy") DOM.addStyle(this.name + "-jumbo", this.jumbo);
            else DOM.removeStyle(this.name + "-jumbo");
        }

        patchPopouts(e) {
            const popoutMount = (props) => {
                const popout = document.querySelector(`[class*="userPopout_"], [class*="userPopoutOuter_"]`);
                if (!popout || popout.querySelector("#permissions-popout")) return;
                const user = MemberStore.getMember(props.displayProfile.guildId, props.user.id);
                const guild = GuildStore.getGuild(props.displayProfile.guildId);
                const name = MemberStore.getNick(props.displayProfile.guildId, props.user.id) ?? props.user.username;
                if (!user || !guild || !name) return;

                const userRoles = user.roles.slice(0);
                userRoles.push(guild.id);
                userRoles.reverse();
                let perms = 0n;
                const permBlock = DOMTools.createElement(Utilities.formatString(this.sectionHTML, {sectionTitle: this.strings.popoutLabel}));
                const memberPerms = permBlock.querySelector(".member-perms");
                const strings = Strings;

                const referenceRoles = getRoles(guild);
                for (let r = 0; r < userRoles.length; r++) {
                    const role = userRoles[r];
                    if (!referenceRoles[role]) continue;
                    perms = perms | referenceRoles[role].permissions;
                    for (const perm in DiscordPerms) {
                        const permName = strings[perm] || perm.split("_").map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" ");
                        const hasPerm = (perms & DiscordPerms[perm]) == DiscordPerms[perm];
                        if (hasPerm && !memberPerms.querySelector(`[data-name="${permName}"]`)) {
                            const element = DOMTools.createElement(this.itemHTML);
                            // element.classList.add(RoleClasses.rolePill);
                            let roleColor = referenceRoles[role].colorString;
                            element.querySelector(".name").textContent = permName;
                            element.setAttribute("data-name", permName);
                            if (!roleColor) roleColor = "#B9BBBE";
                            element.querySelector(".perm-circle").style.backgroundColor = ColorConverter.rgbToAlpha(roleColor, 1);
                            // element.style.borderColor = ColorConverter.rgbToAlpha(roleColor, 0.6);
                            memberPerms.prepend(element);
                        }
                    }
                }

                permBlock.querySelector(".perm-details").addEventListener("click", () => {
                    this.showModal(this.createModalUser(name, user, guild));
                });
                let roleList = popout.querySelector(`[class*="section_"]`);
                roleList = roleList?.parentElement;
                roleList?.parentNode?.append(permBlock);
                


                const popoutInstance = ReactTools.getOwnerInstance(popout, {include: ["Popout"]});
                if (!popoutInstance || !popoutInstance.updateOffsets) return;
                popoutInstance.updateOffsets();
            };

            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            const element = e.addedNodes[0];
            const popout = element.querySelector(`[class*="userPopout_"], [class*="userPopoutOuter_"]`) ?? element;
            if (!popout || !popout.matches(`[class*="userPopout_"], [class*="userPopoutOuter_"]`)) return;
            const props = Utilities.findInTree(ReactTools.getReactInstance(popout), m => m && m.user, {walkable: ["memoizedProps", "return"]});
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

        patchGuildContextMenu() {
            this.contextMenuPatches.push(ContextMenu.patch("guild-context", (retVal, props) => {
                if (!props?.guild) return retVal; // Ignore non-guild items
                const newItem = ContextMenu.buildItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        this.showModal(this.createModalGuild(props.guild.name, props.guild));
                    }
                });
                retVal.props.children.splice(1, 0, newItem);
            }));
        }

        patchChannelContextMenu() {
            this.contextMenuPatches.push(ContextMenu.patch("channel-context", (retVal, props) => {
                const newItem = ContextMenu.buildItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        if (!Object.keys(props.channel.permissionOverwrites).length) return Toasts.info(`#${props.channel.name} has no permission overrides`);
                        this.showModal(this.createModalChannel(props.channel.name, props.channel, props.guild));
                    }
                });
                retVal.props.children.splice(1, 0, newItem);
            }));
        }

        patchUserContextMenu() {
            this.contextMenuPatches.push(ContextMenu.patch("user-context", (retVal, props) => {
                const guild = GuildStore.getGuild(props.guildId);
                if (!guild) return;

                const newItem = ContextMenu.buildItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        const user = MemberStore.getMember(props.guildId, props.user.id);
                        const name = user.nick ? user.nick : props.user.username;
                        this.showModal(this.createModalUser(name, user, guild));
                    }
                });
                retVal?.props?.children[0]?.props?.children.splice(2, 0, newItem);
            }));
        }

        showModal(modal) {
            const popout = document.querySelector(`[class*="userPopoutOuter-"]`);
            if (popout) popout.style.display = "none";
            const app = document.querySelector(".app-19_DXt");
            if (app) app.append(modal);
            else document.querySelector("#app-mount").append(modal);

            const closeModal = (event) => {
                if (!event.key === "Escape") return;
                modal.classList.add("closing");
                setTimeout(() => {modal.remove();}, 300);
            };
            document.addEventListener("keydown", closeModal, true);
            DOMTools.onRemoved(modal, () => document.removeEventListener("keydown", closeModal, true));
        }

        createModalChannel(name, channel, guild) {
            return this.createModal(`#${name}`, channel.permissionOverwrites, getRoles(guild), true);
        }

        createModalUser(name, user, guild) {
            const guildRoles = Object.assign({}, getRoles(guild));
            const userRoles = user.roles.slice(0).filter(r => typeof(guildRoles[r]) !== "undefined");
            
            userRoles.push(guild.id);
            userRoles.sort((a, b) => {return guildRoles[b].position - guildRoles[a].position;});

            if (user.userId == guild.ownerId) {
                const ALL_PERMISSIONS = Object.values(DiscordModules.DiscordPermissions).reduce((all, p) => all | p);
                userRoles.push(user.userId);
                guildRoles[user.userId] = {name: this.strings.modal.owner, permissions: ALL_PERMISSIONS};
            }
            return this.createModal(name, userRoles, guildRoles);
        }

        createModalGuild(name, guild) {
            return this.createModal(name, getRoles(guild));
        }

        createModal(title, displayRoles, referenceRoles, isOverride = false) {
            if (!referenceRoles) referenceRoles = displayRoles;
            const modal = DOMTools.createElement(Utilities.formatString(Utilities.formatString(this.modalHTML, this.strings.modal), {name: Utils.escapeHTML(title)}));
            const closeModal = () => {
                modal.classList.add("closing");
                setTimeout(() => {modal.remove();}, 300);
            };
            modal.querySelector(".callout-backdrop").addEventListener("click", closeModal);

            const strings = Strings || {};
            for (const r in displayRoles) {
                const role = Array.isArray(displayRoles) ? displayRoles[r] : r;
                const user = UserStore.getUser(role) || {getAvatarURL: () => AvatarDefaults.DEFAULT_AVATARS[Math.floor(Math.random() * AvatarDefaults.DEFAULT_AVATARS.length)], username: role};
                const member = MemberStore.getMember(SelectedGuildStore.getGuildId(), role) || {colorString: ""};
                const item = DOMTools.createElement(!isOverride || displayRoles[role].type == 0 ? this.modalButton : Utilities.formatString(this.modalButtonUser, {avatarUrl: user.getAvatarURL(null, 16, true)})); // getAvatarURL(guildId, size, canAnimate);
                if (!isOverride || displayRoles[role].type == 0) item.style.color = referenceRoles[role].colorString;
                else item.style.color = member.colorString;
                if (isOverride) item.querySelector(".role-name").innerHTML = Utils.escapeHTML(displayRoles[role].type == 0 ? referenceRoles[role].name : user.username);
                else item.querySelector(".role-name").innerHTML = Utils.escapeHTML(referenceRoles[role].name);
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
                    ContextMenu.open(e, ContextMenu.buildMenu([
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
