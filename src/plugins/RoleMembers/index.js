
module.exports = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, DiscordClasses, Utilities, WebpackModules, ReactComponents, Patcher, ContextMenu} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const PopoutStack = DiscordModules.PopoutStack;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
    const WrapperClasses = WebpackModules.getByProps("wrapperHover");
    const MenuItem = WebpackModules.getByString("disabled", "brand");
    const SubMenuItem = WebpackModules.find(m => m.default && m.default.displayName && m.default.displayName.includes("SubMenuItem"));

    const popoutHTML = require("popout.html");
    const itemHTML = require("item.html");

    return class RoleMembers extends Plugin {

        onStart() {
            this.patchRoleMention(); // <@&367344340231782410>

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchGuildContextMenu(this.promises.state);
        }

        onStop() {
            $(".popout-role-members").remove();
            $("*").off("." + this.getName());
            Patcher.unpatchAll();
            this.promises.cancel();
        }

        patchRoleMention() {
            const Pill = WebpackModules.getByDisplayName("Pill");
            Patcher.after(Pill.prototype, "componentWillMount", (component) => {
                if (!component || !component.props || !component.props.className) return;
                if (!component.props.className.includes("mention")) return;
                component.props.className += ` ${WrapperClasses.wrapper} ${WrapperClasses.wrapperHover}`;
                component.props.onClick = () => {
                    const currentServer = SelectedGuildStore.getGuildId();

                    const roles = GuildStore.getGuild(currentServer).roles;
                    const name = component.props.children[0].slice(1);
                    let role = filter(roles, r => r.name == name);
                    if (!role) return;
                    role = role[Object.keys(role)[0]];

                    this.showRolePopout(DiscordModules.ReactDOM.findDOMNode(component), currentServer, role.id);
                };
            });
        }

        async patchGuildContextMenu(promiseState) {
            const GuildContextMenu = await ReactComponents.getComponent("GuildContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            if (promiseState.cancelled) return;
            Patcher.after(GuildContextMenu.component.prototype, "render", (component, args, retVal) => {
                const guildId = component.props.guild.id;
                const roles = component.props.guild.roles;
                const roleItems = [];

                for (const roleId in roles) {
                    const role = roles[roleId];
                    const item = DiscordModules.React.createElement(MenuItem, {label: role.name, styles: {color: role.colorString ? role.colorString : ""},
                        action: (e) => {
                            this.showRolePopout(e.target.closest(DiscordSelectors.ContextMenu.item), guildId, role.id);
                        }
                    });
                    roleItems.push(item);
                }

                const original = retVal.props.children[0].props.children;
                const newOne = DiscordModules.React.createElement(SubMenuItem.default, {label: "Role Members", render: roleItems});
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
            GuildContextMenu.forceUpdateAll();
            ContextMenu.updateDiscordMenu(document.querySelector(DiscordSelectors.ContextMenu.contextMenu));
        }

        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

            const popout = $(Utilities.formatString(popoutHTML, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
            const searchInput = popout.find("input");
            searchInput.on("keyup", () => {
                const items = popout[0].querySelectorAll(".role-member");
                for (let i = 0, len = items.length; i < len; i++) {
                    const search = searchInput.val().toLowerCase();
                    const item = items[i];
                    const username = item.querySelector(".username").textContent.toLowerCase();
                    if (!username.includes(search)) item.style.display = "none";
                    else item.style.display = "";
                }
            });
            const scroller = popout.find(".role-members");


            for (const member of members) {
                const user = UserStore.getUser(member.userId);
                const elem = $(Utilities.formatString(itemHTML, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
                elem.on("click", () => {
                    PopoutStack.close("role-members");
                    elem.addClass("popout-open");
                    if (elem.hasClass("popout-open")) Popouts.showUserPopout(elem[0], user, {guild: guildId});
                });
                scroller.append(elem);
            }

            this.showPopout(popout, target);
            searchInput.focus();
        }

        showPopout(popout, target) {
            popout.appendTo(document.querySelector(DiscordSelectors.Popouts.popouts));
            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            const offset = target.getBoundingClientRect();
            if (offset.right + popout.outerHeight() >= maxWidth) {
                popout[0].addClass(DiscordClasses.Popouts.popoutLeft);
                popout.css("left", Math.round(offset.left - popout.outerWidth() - 20));
                popout.animate({left: Math.round(offset.left - popout.outerWidth() - 10)}, 100);
            }
            else {
                popout[0].addClass(DiscordClasses.Popouts.popoutRight);
                popout.css("left", offset.right + 10);
                popout.animate({left: offset.right}, 100);
            }

            if (offset.top + popout.outerHeight() >= maxHeight) popout.css("top", Math.round(maxHeight - popout.outerHeight()));
            else popout.css("top", offset.top);

            const listener = document.addEventListener("click", (e) => {
                const target = $(e.target);
                if (!target.hasClass("popout-role-members") && !target.parents(".popout-role-members").length) popout.remove(), document.removeEventListener("click", listener);
            });
        }

    };
};