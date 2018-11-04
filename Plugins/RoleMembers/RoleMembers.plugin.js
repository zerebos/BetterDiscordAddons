//META{"name":"RoleMembers","displayName":"RoleMembers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"}*//

var RoleMembers = (() => {
    const config = {"info":{"name":"RoleMembers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.3","description":"Allows you to see the members of each role on a server. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"},"changelog":[{"title":"Sorry","type":"fixes","items":["I keep breaking shit, hopefully this time it's fixed."]}],"main":"index.js"};

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
    const {ContextMenu, Popouts, DiscordModules, DiscordSelectors, DiscordClasses, ReactTools, Utilities} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const PopoutStack = DiscordModules.PopoutStack;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;

    return class RoleMembers extends Plugin {
        constructor() {
            super();
            this.popout = `<div class="\${className} popout-role-members" style="margin-top: 0;">
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

            this.item = `<div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItem-1MP3MQ role-member" style="flex: 1 1 auto; height: auto;">
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
            this.contextObserver = new MutationObserver((changes) => {
                for (let change in changes) this.observeContextMenus(changes[change]);
            });
        }

        onStart() {   
            this.contextObserver.observe(document.querySelector("#app-mount"), {childList: true, subtree: true});
            $(document).on("click." + this.getName(), ".mention", (e) => {
                let isRoleMention = ReactTools.getReactProperty(e.target, "return.memoizedState") == null || ReactTools.getReactProperty(e.target, "return.memoizedState.isOpen") === undefined;
                if (!isRoleMention) return;
                let currentServer = SelectedGuildStore.getGuildId();
    
                let roles = GuildStore.getGuild(currentServer).roles;
                let name = e.target.textContent.slice(1);
                let role = filter(roles, r => r.name == name);
                if (!role) return;
    
                role = role[Object.keys(role)[0]];
    
                this.showRolePopout(e.target, currentServer, role.id);
            });
        }
        
        onStop() {
            $(".popout-role-members").remove();
            $("*").off("." + this.getName());
            $(document).off("click." + this.getName(), ".mention");
            this.contextObserver.disconnect();
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

        observeContextMenus(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
            let elem = e.addedNodes[0];
            let context = elem.matches(DiscordSelectors.ContextMenu.contextMenu) ? elem : elem.querySelector(DiscordSelectors.ContextMenu.contextMenu);
            if (!context) return;
    
            let isGuildContext = ReactTools.getReactProperty(context, "return.memoizedProps.type") == "GUILD_ICON_BAR";
            if (!isGuildContext) return;
    
            let guildId = ReactTools.getReactProperty(context, "return.memoizedProps.guild.id");
            let roles = GuildStore.getGuild(guildId).roles;
            let roleItems = [];
    
            for (let roleId in roles) {
                //if (roleId == guildId) continue;
                let role = roles[roleId];
                let item = new ContextMenu.TextItem(role.name, {
                    callback: (event) => {
                        event.stopPropagation();
                        $(".popout-role-members").remove();
                        this.showRolePopout(item.element, guildId, role.id);
                        // $(context).hide();
                    }
                });
                if (role.colorString) item.element.css("color", role.colorString);
                roleItems.push(item);
            }
    
            let subMenu = new ContextMenu.SubMenuItem("Role Members", new ContextMenu.Menu(true).addItems(...roleItems));
            $(context).children(DiscordSelectors.ContextMenu.itemGroup).first().append(subMenu.element);
            ContextMenu.updateDiscordMenu(context);
        }
    
        showRolePopout(target, guildId, roleId) {
            let roles = GuildStore.getGuild(guildId).roles;
            let role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
    
            let popout = $(Utilities.formatTString(this.popout, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
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
                let elem = $(Utilities.formatTString(this.item, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
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

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();