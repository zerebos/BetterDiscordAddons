//META{"name":"RoleMembers","displayName":"RoleMembers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"}*//

var RoleMembers = (() => {
    const config = {"info":{"name":"RoleMembers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.5","description":"Allows you to see the members of each role on a server. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Fixed issues with Discord's internal changes."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {window.BdApi.alert("Library Missing",`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
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
    const MenuItem = WebpackModules.getByRegex(/(?=.*disabled)(?=.*brand)/);

    const popoutHTML = `<div class="\${className} popout-role-members" style="margin-top: 0;">
    <div class="popoutList-T9CKZQ guildSettingsAuditLogsUserFilterPopout-3Jg5NE elevationBorderHigh-2WYJ09 role-members-popout">
        <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 searchBar-1MOL6S popoutListInput-1l9TUI size14-3iUx6q" style="flex: 1 1 auto;">
            <input class="input-3Xdcic flexChild-faoVW3" value="" placeholder="Search Members — \${memberCount}" style="flex: 1 1 auto;">
            <div class="searchBarIcon-18QaPq flexChild-faoVW3">
                <i class="icon-1S6UIr eyeGlass-2cMHx7 visible-3bFCH-"></i>
                <i class="icon-1S6UIr clear--Eywng"></i>
            </div>
        </div>
        <div class="divider-3573oO divider-faSUbd marginTop8-1DLZ1n marginBottom8-AtZOdT"></div>
        <div class="scrollerWrap-2lJEkd scrollerThemed-2oenus themeGhostHairline-DBD-2d scrollerTrack-1ZIpsv">
            <div class="scroller-2FKFPG scroller-2CvAgC role-members">

            </div>
        </div>
    </div>
</div>`;
    const itemHTML = `<div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItem-1MP3MQ role-member" style="flex: 1 1 auto; height: auto;">
    <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItemLabel-1RKQjD"
        style="flex: 1 1 auto;">
        <div class="avatar-16XVId small-5Os1Bb flexChild-faoVW3">
            <div class="image-33JSyf" style="flex: 0 1 auto; background-image: url(&quot;\${avatar_url}&quot;);"></div>
        </div>
        <div class="userText-1WdPps" style="flex: 1 1 auto;">
            <span class="username">\${username}</span><span class="discriminator-3tYCOD">\${discriminator}</span>
        </div>
    </div>
</div>`;

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
            const SubMenuItem = await ReactComponents.getComponentByName("FluxContainer", DiscordSelectors.ContextMenu.itemSubMenu, m => {
				try {
					const instance = new m({});
					const rendered = instance.render();
					return rendered.type.displayName == "SubMenuItem";
                }
                catch (e) {return false;}
			});
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
                const newOne = DiscordModules.React.createElement(SubMenuItem.component, {label: "Role Members", render: roleItems});
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
            let roles = GuildStore.getGuild(guildId).roles;
            let role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
    
            let popout = $(Utilities.formatTString(popoutHTML, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
            let searchInput = popout.find("input");
            searchInput.on("keyup", () => {
                let items = popout[0].querySelectorAll(".role-member");
                for (let i = 0, len = items.length; i < len; i++) {
                    let search = searchInput.val().toLowerCase();
                    let item = items[i];
                    let username = item.querySelector(".username").textContent.toLowerCase();
                    if (!username.includes(search)) item.style.display = "none";
                    else item.style.display = "";
                }
            });
            let scroller = popout.find(".role-members");
    
            
            for (let member of members) {
                let user = UserStore.getUser(member.userId);
                let elem = $(Utilities.formatTString(itemHTML, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
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
    
            let offset = target.getBoundingClientRect();
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
    
            let listener = document.addEventListener("click", (e) => {
                let target = $(e.target);
                if (!target.hasClass("popout-role-members") && !target.parents(".popout-role-members").length) popout.remove(), document.removeEventListener("click", listener);
            });
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();