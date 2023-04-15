/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {DOM, ContextMenu, Patcher, Webpack, UI, Utils} = window.BdApi;
    const {DiscordModules, DiscordSelectors, Utilities, Popouts} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;

    const popoutHTML = require("popout.html");
    const itemHTML = require("item.html");

    return class RoleMembers extends Plugin {

        onStart() {
            this.patchRoleMention(); // <@&367344340231782410>
            this.patchGuildContextMenu();
        }

        onStop() {
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll(this.name);
            this.contextMenuPatch?.();
        }

        patchRoleMention() {
            const Pill = Webpack.getModule(Webpack.Filters.byStrings("interactive", "iconType"), {defaultExport: false});
            Patcher.before(this.name, Pill, "Z", (_, [props]) => {
                if (!props?.className.toLowerCase().includes("rolemention")) return;
                props.className += ` interactive`;
                props.onClick = (e) => {
                    const roles = GuildStore.getGuild(SelectedGuildStore.getGuildId()).roles;
                    const name = props.children[1][0].slice(1);
                    let role = filter(roles, r => r.name == name);
                    if (!role) return;
                    role = role[Object.keys(role)[0]];
                    this.showRolePopout(e.nativeEvent.target, SelectedGuildStore.getGuildId(), role.id);
                };
            });
        }

        patchGuildContextMenu() {
            this.contextMenuPatch = ContextMenu.patch("guild-context", (retVal, props) => {
                const guild = props.guild;
                const guildId = guild.id;
                const roles = guild.roles;
                const roleItems = [];

                for (const roleId in roles) {
                    const role = roles[roleId];
                    const item = ContextMenu.buildItem({
                        id: roleId,
                        label: role.name,
                        style: {color: role.colorString ? role.colorString : ""},
                        closeOnClick: false,
                        action: (e) => {
                            if (e.ctrlKey) {
                                try {
                                    DiscordNative.clipboard.copy(role.id);
                                    UI.showToast("Copied Role ID to clipboard!", {type: "success"});
                                }
                                catch {
                                    UI.showToast("Could not copy Role ID to clipboard", {type: "success"});
                                }
                            }
                            else {
                                this.showRolePopout({
                                    getBoundingClientRect() {
                                        return {
                                            top: e.pageY,
                                            bottom: e.pageY,
                                            left: e.pageX,
                                            right: e.pageX
                                        };
                                    }
                                }, guildId, role.id);
                            }
                        }
                    });
                    roleItems.push(item);
                }

                const newOne = ContextMenu.buildItem({type: "submenu", label: "Role Members", children: roleItems});

                const separatorIndex = retVal.props.children.findIndex(k => !k?.props?.label);
                const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                retVal.props.children.splice(insertIndex, 0, newOne);
                // return original;

            });
        }

        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

            const popout = DOM.parseHTML(Utilities.formatString(popoutHTML, {memberCount: members.length}));
            const searchInput = popout.querySelector("input");
            searchInput.addEventListener("keyup", () => {
                const items = popout.querySelectorAll(".role-member");
                for (let i = 0, len = items.length; i < len; i++) {
                    const search = searchInput.value.toLowerCase();
                    const item = items[i];
                    const username = item.querySelector(".username").textContent.toLowerCase();
                    if (!username.includes(search)) item.style.display = "none";
                    else item.style.display = "";
                }
            });

            const scroller = popout.querySelector(".role-members");
            for (const member of members) {
                const user = UserStore.getUser(member.userId);
                const elem = DOM.parseHTML(Utilities.formatString(itemHTML, {username: Utils.escapeHTML(user.username), discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
                elem.addEventListener("click", () => {
                    // UI.showToast("User popouts are currently broken!", {type: "error"});
                    setTimeout(() => Popouts.showUserPopout(elem, user, {guild: guildId}), 1);
                });
                scroller.append(elem);
            }

            this.showPopout(popout, target);
            searchInput.focus();
        }

        showPopout(popout, relativeTarget) {
            if (this.listener) this.listener({target: {classList: {contains: () => {}}, closest: () => {}}}); // Close any previous popouts
            
            document.querySelector(`[class*="app-"] ~ ${DiscordSelectors.TooltipLayers.layerContainer}`).append(popout);

            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            const offset = relativeTarget.getBoundingClientRect();
            if (offset.right + popout.offsetHeight >= maxWidth) {
                // popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
                popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
                // popout.animate({left: Math.round(offset.left - popout.offsetWidth - 10)}, 100);
                const original = Math.round(offset.left - popout.offsetWidth - 20);
                const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
                DOM.animate(function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                }, 100);
            }
            else {
                // popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
                popout.style.left = (offset.right + 10) + "px";
                // popout.animate({left: offset.right}, 100);
                const original = offset.right + 10;
                const endPoint = offset.right;
                DOM.animate(function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                }, 100);
            }

            if (offset.top + popout.offsetHeight >= maxHeight) popout.style.top = Math.round(maxHeight - popout.offsetHeight) + "px";
            else popout.style.top = offset.top + "px";

            this.listener = (e) => {
                const target = e.target;
                if (!target.classList.contains("popout-role-members") && !target.closest(".popout-role-members")) {
                    popout.remove();
                    document.removeEventListener("click", this.listener);
                    delete this.listener;
                }
            };
            setTimeout(() => document.addEventListener("click", this.listener), 500);
        }

    };
};