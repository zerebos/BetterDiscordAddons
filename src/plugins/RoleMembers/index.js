
module.exports = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, Utilities, WebpackModules, Patcher, DCM, DOMTools, Toasts} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
    // const WrapperClasses = WebpackModules.getByProps("wrapperHover");
    const animate = DOMTools.animate ? DOMTools.animate.bind(DOMTools) : ({timing = _ => _, update, duration}) => {
        // https://javascript.info/js-animation
        const start = performance.now();

        requestAnimationFrame(function renderFrame(time) {
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // calculate the current animation state
            const progress = timing(timeFraction);

            update(progress); // draw it

            if (timeFraction < 1) {
            requestAnimationFrame(renderFrame);
            }

        });
    };

    const popoutHTML = require("popout.html");
    const itemHTML = require("item.html");

    return class RoleMembers extends Plugin {

        onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchRoleMention(); // <@&367344340231782410>
            this.patchGuildContextMenu(this.promises.state);
        }

        onStop() {
            this.promises.cancel();
            if (this.listener) this.listener({target: {classList: {contains: () => {}}, closest: () => {}}});
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll();
        }

        patchRoleMention() {
            const Pill = WebpackModules.getModule(m => m?.default.displayName === "RoleMention");
            Patcher.after(Pill, "default", (_, [props], component) => {
                if (!component || !component.props || !component.props.className) return;
                if (!component.props.className.toLowerCase().includes("mention")) return;
                component.props.className += ` mention interactive`;
                component.props.onClick = (e) => {
                    const roles = GuildStore.getGuild(props.guildId).roles;
                    const name = component.props.children[1][0].slice(1);
                    let role = filter(roles, r => r.name == name);
                    if (!role) return;
                    role = role[Object.keys(role)[0]];
                    this.showRolePopout(e.nativeEvent.target, props.guildId, role.id);
                };
            });
        }

        async patchGuildContextMenu(promiseState) {
            const GuildContextMenu = await DCM.getDiscordMenu("useGuildMarkAsReadItem");
            if (promiseState.cancelled) return;
            Patcher.after(GuildContextMenu, "default", (_, [guild], retVal) => {
                const guildId = guild.id;
                const roles = guild.roles;
                const roleItems = [];

                for (const roleId in roles) {
                    const role = roles[roleId];
                    const item = DCM.buildMenuItem({
                        id: roleId,
                        label: role.name,
                        style: {color: role.colorString ? role.colorString : ""},
                        closeOnClick: false,
                        action: (e) => {
                            if (e.ctrlKey) {
                                try {
                                    DiscordNative.clipboard.copy(role.id);
                                    Toasts.success("Copied Role ID to clipboard!");
                                }
                                catch {
                                    Toasts.success("Could not copy Role ID to clipboard");
                                }
                            }
                            else {
                                this.showRolePopout(e.target.closest(DiscordSelectors.ContextMenu.item), guildId, role.id);
                            }
                        }
                    });
                    roleItems.push(item);
                }
                const original = retVal;
                const newOne = DCM.buildMenuItem({type: "submenu", label: "Role Members", children: roleItems});
                if (Array.isArray(original)) {
                    const separatorIndex = original.findIndex(k => !k?.props?.label);
                    const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                    original.splice(insertIndex, 0, newOne);
                    return original;
                }
                return [original, newOne];
            });
        }

        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

            const popout = DOMTools.createElement(Utilities.formatString(popoutHTML, {memberCount: members.length}));
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
                const elem = DOMTools.createElement(Utilities.formatString(itemHTML, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
                elem.addEventListener("click", () => {
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
                animate({
                    duration: 100,
                    update: function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                    }
                });
            }
            else {
                // popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
                popout.style.left = (offset.right + 10) + "px";
                // popout.animate({left: offset.right}, 100);
                const original = offset.right + 10;
                const endPoint = offset.right;
                animate({
                    duration: 100,
                    update: function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                    }
                });
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