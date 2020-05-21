
module.exports = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, DiscordClasses, Utilities, WebpackModules, Patcher, DCM, DOMTools} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const PopoutStack = DiscordModules.PopoutStack;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
    const WrapperClasses = WebpackModules.getByProps("wrapperHover");
    const animate = DOMTools.animate ? DOMTools.animate.bind(DOMTools) :  ({timing = _ => _, update, duration}) => {
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
            this.patchRoleMention(); // <@&367344340231782410>
            this.patchGuildContextMenu();
        }

        onStop() {
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll();
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

        patchGuildContextMenu() {
            const GuildContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "GuildContextMenu");
            Patcher.after(GuildContextMenu, "default", (_, args, retVal) => {
				const props = args[0];
                const guildId = props.guild.id;
                const roles = props.guild.roles;
                const roleItems = [];

                for (const roleId in roles) {
                    const role = roles[roleId];
                    const item = DCM.buildMenuItem({label: role.name, style: {color: role.colorString ? role.colorString : ""}, closeOnClick: false,
                        action: (e) => {
                            this.showRolePopout(e.target.closest(DiscordSelectors.ContextMenu.item), guildId, role.id);
                        }
                    });
                    roleItems.push(item);
                }
                // props.children[""0""].props.children
                const original = retVal.props.children[0].props.children;
                const newOne = DCM.buildMenuItem({type: "submenu", label: "Role Members", children: roleItems});
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
        }

        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

            const popout = DOMTools.createElement(Utilities.formatString(popoutHTML, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
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
                    PopoutStack.close("role-members");
                    elem.classList.add("popout-open");
                    if (elem.classList.contains("popout-open")) Popouts.showUserPopout(elem, user, {guild: guildId});
                });
                scroller.append(elem);
            }

            this.showPopout(popout, target);
            searchInput.focus();
        }

        showPopout(popout, relativeTarget) {
            document.querySelector(DiscordSelectors.Popouts.popouts).append(popout);
            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            const offset = relativeTarget.getBoundingClientRect();
            if (offset.right + popout.offsetHeight >= maxWidth) {
                popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
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
                popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
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

            const listener = document.addEventListener("click", (e) => {
                const target = e.target;
                if (!target.classList.contains("popout-role-members") && !target.closest(".popout-role-members")) {
                    popout.remove();
                    document.removeEventListener("click", listener);
                }
            });
        }

    };
};