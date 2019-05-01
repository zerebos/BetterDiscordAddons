
module.exports = (Plugin, Api) => {
    const {Patcher, DiscordModules, WebpackModules, PluginUtilities, Toasts, DiscordClasses, DiscordSelectors, Utilities, DOMTools, ColorConverter, ReactComponents} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const MemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const DiscordPerms = Object.assign({}, DiscordModules.DiscordConstants.Permissions);
    const AvatarDefaults = WebpackModules.getByProps("DEFAULT_AVATARS");
    const MenuActions = DiscordModules.ContextMenuActions;
    const MenuItem = WebpackModules.getByString("disabled", "brand");
    const escapeHTML = DOMTools.escapeHTML ? DOMTools.escapeHTML : function(html) {
		const textNode = document.createTextNode("");
		const spanElement = document.createElement("span");
		spanElement.append(textNode);
		textNode.nodeValue = html;
		return spanElement.innerHTML;
	};

    if (DiscordPerms.SEND_TSS_MESSAGES) {
        DiscordPerms.SEND_TTS_MESSAGES = DiscordPerms.SEND_TSS_MESSAGES;
        delete DiscordPerms.SEND_TSS_MESSAGES;
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

            if (this.settings.popouts) this.bindPopouts();
            if (this.settings.contextMenus) this.bindContextMenus();
        }
        
        onStop() {
            PluginUtilities.removeStyle(this.getName());
            this.unbindPopouts();
            this.unbindContextMenus();
        }

        async bindPopouts() {
            const pViewer = this;
            const popoutMount = function() {
                const user = this.props.guildMember;
                const guild = this.props.guild;
                const name = this.props.nickname ? this.props.nickname : this.props.user.username;
                if (!user || !guild || !name) return;
    
                const userRoles = user.roles.slice(0);
                userRoles.push(guild.id);
                userRoles.reverse();
                let perms = 0;
        
                const permBlock = DOMTools.createElement(Utilities.formatTString(pViewer.listHTML, {label: pViewer.strings.popoutLabel}));
				const memberPerms = permBlock.find(".member-perms");
                const strings = DiscordModules.Strings;
    
                for (let r = 0; r < userRoles.length; r++) {
                    const role = userRoles[r];
                    perms = perms | guild.roles[role].permissions;
                    for (const perm in DiscordPerms) {
                        const permName = strings[perm];
                        const hasPerm = (perms & DiscordPerms[perm]) == DiscordPerms[perm];
                        if (hasPerm && !memberPerms.find(`[data-name="${permName}"]`)) {
                            const element = DOMTools.createElement(pViewer.itemHTML);
							let roleColor = guild.roles[role].colorString;
                            element.find(".name").textContent = permName;
                            element.setAttribute("data-name", permName);
                            if (!roleColor) roleColor = "#B9BBBE";
                            element.find(".perm-circle").css("background-color", ColorConverter.rgbToAlpha(roleColor, 1));
                            element.css("border-color", ColorConverter.rgbToAlpha(roleColor, 0.6));
                            memberPerms.prepend(element);
                        }
                    }
				}
				
                const popout = DiscordModules.ReactDOM.findDOMNode(this);
                permBlock.find(".perm-details").on("click", () => {
                    pViewer.showModal(pViewer.createModalUser(name, user, guild));
                });
                permBlock.insertAfter(popout.querySelector(DiscordSelectors.UserPopout.rolesList));
            };
    
            const UserPopout = await ReactComponents.getComponentByName("UserPopout", DiscordSelectors.UserPopout.userPopout);
            this.cancelUserPopout = Patcher.after(UserPopout.component.prototype, "componentDidMount", (thisObject) => {
                const bound = popoutMount.bind(thisObject); bound();
            });
            UserPopout.forceUpdateAll();
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
            for (const cancel in this.contextMenuPatches) cancel();
        }

        async patchChannelContextMenu() {
            const ChannelContextMenu = await ReactComponents.getComponentByName("ChannelContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            this.contextMenuPatches.push(Patcher.after(ChannelContextMenu.component.prototype, "render", (component, args, retVal) => {
                if (!component.props.type.startsWith("CHANNEL_LIST_")) return;
                const original = retVal.props.children[0].props.children;
                const newOne = new MenuItem({label: this.strings.contextMenuLabel, action: () => {
                    MenuActions.closeContextMenu();
                    const channel = component.props.channel;
                    if (!Object.keys(channel.permissionOverwrites).length) return Toasts.info(`#${channel.name} has no permission overrides`);
                    this.showModal(this.createModalChannel(channel.name, channel, component.props.guild));
                }});
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            }));
            ChannelContextMenu.forceUpdateAll();
        }

        async patchGuildContextMenu() {
            const GuildContextMenu = await ReactComponents.getComponentByName("GuildContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            this.contextMenuPatches.push(Patcher.after(GuildContextMenu.component.prototype, "render", (component, args, retVal) => {
                const original = retVal.props.children[0].props.children;
                const newOne = new MenuItem({label: this.strings.contextMenuLabel, action: () => {
                    MenuActions.closeContextMenu();
                    this.showModal(this.createModalGuild(component.props.guild.name, component.props.guild));
                }});
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            }));
            GuildContextMenu.forceUpdateAll();
        }

        async patchUserContextMenu() {//props.children.props.children.props.children[0].props.children
            const UserContextMenu = await ReactComponents.getComponentByName("UserContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            this.contextMenuPatches.push(Patcher.after(UserContextMenu.component.prototype, "render", (component, args, retVal) => {
                const guildId = SelectedGuildStore.getGuildId();
                const guild = GuildStore.getGuild(guildId);
                if (!guild) return;
                const original = retVal.props.children.props.children.props.children[0].props.children;
                const newOne = new MenuItem({label: this.strings.contextMenuLabel, action: () => {
                    MenuActions.closeContextMenu();
                    const user = MemberStore.getMember(guildId, component.props.user.id);
                    const name = user.nick ? user.nick : UserStore.getUser(user.userId).username;
                    this.showModal(this.createModalUser(name, user, guild));
                }});
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children.props.children.props.children[0].props.children = [original, newOne];
            }));
            UserContextMenu.forceUpdateAll();
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
                userRoles.push(user.userId);
                guildRoles[user.userId] = {name: this.strings.modal.owner, permissions: DiscordModules.Permissions.ALL};
            }
            return this.createModal(name, userRoles, guildRoles);
        }

        createModalGuild(name, guild) {
            return this.createModal(name, guild.roles);
        }

        createModal(title, displayRoles, referenceRoles, isOverride = false) {
            if (!referenceRoles) referenceRoles = displayRoles;
            const modal = DOMTools.createElement(Utilities.formatTString(Utilities.formatTString(this.modalHTML, this.strings.modal), {name: escapeHTML(title)}));
            modal.find(".callout-backdrop").on("click", () => {
                modal.addClass("closing");
                setTimeout(() => { modal.remove(); }, 300);
            });

            const strings = DiscordModules.Strings;
            for (const r in displayRoles) {
                const role = Array.isArray(displayRoles) ? displayRoles[r] : r;
                const user = UserStore.getUser(role) || {avatarURL: AvatarDefaults.DEFAULT_AVATARS[Math.floor(Math.random() * AvatarDefaults.DEFAULT_AVATARS.length)], username: role};
                const member = MemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), role) || {colorString: ""};
                const item = DOMTools.createElement(!isOverride || displayRoles[role].type == "role" ? this.modalButton : Utilities.formatTString(this.modalButtonUser, {avatarUrl: user.avatarURL}));
                if (!isOverride || displayRoles[role].type == "role") item.css("color", referenceRoles[role].colorString);
                else item.css("color", member.colorString);
                if (isOverride) item.find(".role-name").textContent = escapeHTML(displayRoles[role].type == "role" ? referenceRoles[role].name : user.username);
                else item.find(".role-name").textContent = escapeHTML(referenceRoles[role].name);
                modal.find(".role-scroller").append(item);
                item.on("click", () => {
                    modal.findAll(".role-item.selected").forEach(e => e.removeClass("selected"));
                    item.addClass("selected");
                    const allowed = isOverride ? displayRoles[role].allow : referenceRoles[role].permissions;
                    const denied = isOverride ? displayRoles[role].deny : null;

                    const permList = modal.find(".perm-scroller");
                    permList.innerHTML = "";
                    for (const perm in DiscordPerms) {
						const element = DOMTools.createElement(this.modalItem);
                        const permAllowed = (allowed & DiscordPerms[perm]) == DiscordPerms[perm];
                        const permDenied = isOverride ? (denied & DiscordPerms[perm]) == DiscordPerms[perm] : !permAllowed;
                        if (!permAllowed && !permDenied) continue;
                        if (permAllowed) {
                            element.addClass("allowed");
                            element.prepend(DOMTools.createElement(this.permAllowedIcon));
                        }
                        if (permDenied) {
                            element.addClass("denied");
                            element.prepend(DOMTools.createElement(this.permDeniedIcon));
                        }
                        element.find(".perm-name").textContent = strings[perm];
                        permList.append(element);
                    }
                });
            }
    
            modal.find(".role-item").click();
    
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