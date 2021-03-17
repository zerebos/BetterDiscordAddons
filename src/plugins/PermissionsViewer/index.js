
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, PluginUtilities, Toasts, ReactTools, DiscordClasses, DiscordSelectors, Utilities, DOMTools, ColorConverter, ReactComponents, DCM} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const MemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const DiscordPerms = Object.assign({}, DiscordModules.DiscordConstants.Permissions);
    const AvatarDefaults = WebpackModules.getByProps("DEFAULT_AVATARS");
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
            this.listHTML = require("list.html");
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
            this.listHTML = Utilities.formatTString(this.listHTML, DiscordClasses.PopoutRoles);
            this.itemHTML = Utilities.formatTString(this.itemHTML, DiscordClasses.PopoutRoles);
            this.modalHTML = Utilities.formatTString(this.modalHTML, DiscordClasses.Backdrop);
            this.modalHTML = Utilities.formatTString(this.modalHTML, DiscordClasses.Modals);

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            if (this.settings.popouts) this.bindPopouts(this.promises.state);
            if (this.settings.contextMenus) this.bindContextMenus();
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
            this.promises.cancel();
            this.unbindPopouts();
            this.unbindContextMenus();
        }

        async bindPopouts(promiseState) {
            const pViewer = this;
            const popoutMount = function() {
                const popout = DiscordModules.ReactDOM.findDOMNode(this);
                if (!popout || popout.querySelector("#permissions-popout")) return;
                const user = this.props.guildMember;
                const guild = this.props.guild;
                const name = this.props.nickname ? this.props.nickname : this.props.user.username;
                if (!user || !guild || !name) return;

                const userRoles = user.roles.slice(0);
                userRoles.push(guild.id);
                userRoles.reverse();
                let perms = 0;

                const permBlock = DOMTools.createElement(Utilities.formatTString(pViewer.listHTML, {label: pViewer.strings.popoutLabel}));
                const memberPerms = permBlock.querySelector(".member-perms");
                const strings = DiscordModules.Strings;

                for (let r = 0; r < userRoles.length; r++) {
                    const role = userRoles[r];
                    perms = perms | guild.roles[role].permissions;
                    for (const perm in DiscordPerms) {
                        const permName = strings[perm] || perm.split("_").map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" ");
                        const hasPerm = (perms & DiscordPerms[perm]) == DiscordPerms[perm];
                        if (hasPerm && !memberPerms.querySelector(`[data-name="${permName}"]`)) {
                            const element = DOMTools.createElement(pViewer.itemHTML);
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
                    pViewer.showModal(pViewer.createModalUser(name, user, guild));
                });
                const roleList = popout.querySelector(DiscordSelectors.UserPopout.rolesList);
                roleList.parentNode.insertBefore(permBlock, roleList.nextSibling);
            };

            const UserPopout = await ReactComponents.getComponentByName("UserPopout", DiscordSelectors.UserPopout.userPopout);
            if (promiseState.cancelled) return;
            this.cancelUserPopout = Patcher.after(UserPopout.component.prototype, "componentDidMount", (thisObject) => {
                const bound = popoutMount.bind(thisObject); bound();
            });
            const instance = ReactTools.getOwnerInstance(document.querySelector(DiscordSelectors.UserPopout.userPopout), {include: ["UserPopout"]});
            if (!instance) return;
            popoutMount.bind(instance)();

            const popoutInstance = ReactTools.getOwnerInstance(document.querySelector(DiscordSelectors.UserPopout.userPopout), {include: ["Popout"]});
            if (!popoutInstance || !popoutInstance.updateOffsets) return;
            popoutInstance.updateOffsets();
        }

        unbindPopouts() {
            this.cancelUserPopout();
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
            const GuildContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "GuildContextMenu");
            this.contextMenuPatches.push(Patcher.after(GuildContextMenu, "default", (_, [props], retVal) => {
                const original = retVal.props.children[0].props.children;
                const newOne = DCM.buildMenuItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        this.showModal(this.createModalGuild(props.guild.name, props.guild));
                    }
                });
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            }));
        }

        patchChannelContextMenu() {
            const [VoiceChannelContextMenu] = WebpackModules.getModules(m => m.default && m.default.displayName == "ChannelListVoiceChannelContextMenu");
            const [, CategoryChannelContextMenu, TextChannelContextMenu] = WebpackModules.getModules(m => m.default && m.default.displayName == "ChannelListTextChannelContextMenu");
            const patch = (_, [props], retVal) => {
                const original = retVal.props.children[1].props.children;
                const newOne = DCM.buildMenuItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        const channel = props.channel;
                        if (!Object.keys(channel.permissionOverwrites).length) return Toasts.info(`#${channel.name} has no permission overrides`);
                        this.showModal(this.createModalChannel(channel.name, channel, props.guild));
                    }
                });
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[1].props.children = [original, newOne];
            };
            this.contextMenuPatches.push(Patcher.after(CategoryChannelContextMenu, "default", patch));
            this.contextMenuPatches.push(Patcher.after(TextChannelContextMenu, "default", patch));
            this.contextMenuPatches.push(Patcher.after(VoiceChannelContextMenu, "default", patch));
        }

        patchUserContextMenu() {
            const UserContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "GuildChannelUserContextMenu");

            this.contextMenuPatches.push(Patcher.after(UserContextMenu, "default", (_, [props], retVal) => {
                const guildId = SelectedGuildStore.getGuildId();
                const guild = GuildStore.getGuild(guildId);
                if (!guild) return;
                const original = retVal.props.children.props.children[0].props.children[0];
                const newOne = DCM.buildMenuItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        const user = MemberStore.getMember(guildId, props.user.id);
                        const name = user.nick ? user.nick : UserStore.getUser(user.userId).username;
                        this.showModal(this.createModalUser(name, user, guild));
                    }
                });
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children.props.children[0].props.children[0] = [original, newOne];
            }));
        }

        showModal(modal) {
            const popout = document.querySelector(DiscordSelectors.UserPopout.userPopout);
            if (popout) popout.style.display = "none";
            const app = document.querySelector(".app-19_DXt");
            if (app) app.append(modal);
            else document.querySelector("#app-mount").append(modal);
        }

        createModalChannel(name, channel, guild) {
            return this.createModal(`#${name}`, channel.permissionOverwrites, guild.roles, true);
        }

        createModalUser(name, user, guild) {
            const userRoles = user.roles.slice(0);
            const guildRoles = JSON.parse(JSON.stringify(guild.roles));
            userRoles.push(guild.id);
            userRoles.sort((a, b) => {return guildRoles[b].position - guildRoles[a].position;});

            if (user.userId == guild.ownerId) {
                const ALL_PERMISSIONS = Object.values(DiscordModules.DiscordConstants.Permissions).map(x => Number(x.data)).reduce((all, p) => all | p);
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

            const strings = DiscordModules.Strings;
            for (const r in displayRoles) {
                const role = Array.isArray(displayRoles) ? displayRoles[r] : r;
                const user = UserStore.getUser(role) || {avatarURL: AvatarDefaults.DEFAULT_AVATARS[Math.floor(Math.random() * AvatarDefaults.DEFAULT_AVATARS.length)], username: role};
                const member = MemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), role) || {colorString: ""};
                const item = DOMTools.createElement(!isOverride || displayRoles[role].type == 0 ? this.modalButton : Utilities.formatTString(this.modalButtonUser, {avatarUrl: user.avatarURL}));
                if (!isOverride || displayRoles[role].type == 0) item.style.color = referenceRoles[role].colorString;
                else item.style.color = member.colorString;
                if (isOverride) item.querySelector(".role-name").innerHTML = escapeHTML(displayRoles[role].type == 0 ? referenceRoles[role].name : user.username);
                else item.querySelector(".role-name").innerHTML = escapeHTML(referenceRoles[role].name);
                modal.querySelector(".role-scroller").append(item);
                item.addEventListener("click", () => {
                    modal.querySelectorAll(".role-item.selected").forEach(e => e.removeClass("selected"));
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
                        {label: DiscordModules.Strings.COPY_ID, action: () => {DiscordModules.ElectronModule.copy(role);}}
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
            });
            return panel.getElement();
        }

    };
};
