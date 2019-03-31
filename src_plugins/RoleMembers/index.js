
module.exports = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, DiscordClasses, Utilities, WebpackModules, ReactComponents, Patcher, ReactTools} = Api;

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
    const SubMenuItem = WebpackModules.find(m => {
        if (!m.render) return false;
        try {
            const container = m.render({}).type;
            const item = new container({});
            const rendered = item.render();
            return rendered.type.displayName == "SubMenuItem";
        }
        catch (e) {return false;}
    });

    const popoutHTML = require("popout.html");
    const itemHTML = require("item.html");

    return class RoleMembers extends Plugin {

        onStart() {
            this.patchGuildContextMenu();
            this.patchRoleMention();
        }
        
        onStop() {
            $(".popout-role-members").remove();
            $("*").off("." + this.getName());
            Patcher.unpatchAll();
        }

        async patchRoleMention() {
            const Pill = WebpackModules.getByDisplayName("Pill");
            Patcher.after(Pill.prototype, "componentWillMount", (component) => {
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

        async patchGuildContextMenu() {
            const GuildContextMenu = await ReactComponents.getComponent("GuildContextMenu", DiscordSelectors.ContextMenu.contextMenu);
            Patcher.after(GuildContextMenu.component.prototype, "render", (component, args, retVal) => {
                const guildId = component.props.guild.id;
                const roles = component.props.guild.roles;
                const roleItems = [];
        
                for (const roleId in roles) {
                    //if (roleId == guildId) continue;
                    const role = roles[roleId];
                    const item = new MenuItem({label: role.name, styles: {color: role.colorString ? role.colorString : ""},
                        action: (e) => {
                            this.showRolePopout(e.target.closest(DiscordSelectors.ContextMenu.item), guildId, role.id);
                        }
                    });
                    roleItems.push(item);
                }

                const original = retVal.props.children[0].props.children;
                const newOne = DiscordModules.React.createElement(SubMenuItem.render, {label: "Role Members", render: roleItems});
                // console.log(roleItems, newOne);
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
            GuildContextMenu.forceUpdateAll();
            for (const element of document.querySelectorAll(DiscordSelectors.ContextMenu.contextMenu)) {
				const updater = ReactTools.getReactProperty(element, "return.stateNode.props.onHeightUpdate");
				if (typeof(updater) == "function") updater();
			}
        }
    
        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
    
            const popout = $(Utilities.formatTString(popoutHTML, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
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
                const elem = $(Utilities.formatTString(itemHTML, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
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