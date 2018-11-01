//META{"name":"RoleMembers","displayName":"RoleMembers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"}*//

var RoleMembers = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"RoleMembers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.0","description":"Allows you to see the members of each role on a server. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"},"changelog":[{"title":"What's New?","items":["Rewrite to the new library","Deprecate remote linking library"]},{"title":"Bugs Squashed","type":"fixed","items":["Context menu being misaligned","Roles option not showing in context menu"]}],"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {ContextMenu, Popouts, DiscordModules, Modals, DiscordSelectors, DiscordClasses} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const PopoutStack = DiscordModules.PopoutStack;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;

    return class StatusEverywhere extends Plugin {
        constructor() {
            super();
            this.popout = `<div class="\${className} popout-role-members">
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
			this.showAnnouncement();    
            this.contextObserver.observe(document.querySelector("#app-mount"), {childList: true, subtree: true});
            $(document).on("click." + this.getName(), ".mention", (e) => {
                let isRoleMention = ReactUtilities.getReactProperty(e.target, "return.memoizedState") == null || ReactUtilities.getReactProperty(e.target, "return.memoizedState.isOpen") === undefined;
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

        showAnnouncement() {
            if (window.ZeresPluginLibrary) return; // they already have it
            const hasShownAnnouncement = PluginUtilities.loadData(this.getName(), "announcements", {localLibNotice: false}).localLibNotice;
            if (hasShownAnnouncement) return;
            Modals.showConfirmationModal("Local Library Notice", DiscordModules.React.createElement("span", null, `This version of ${this.getName()} is the final version that will be released using a remotely loaded library. Future versions will require my local library that gets placed in the plugins folder.`, DiscordModules.React.createElement("br"), DiscordModules.React.createElement("br"), "You can download the library now to be prepared, or wait until the next version which will prompt you to download it."), {
                confirmText: "Download Now",
                cancelText: "Wait",
                onConfirm: () => {
                    require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                }
            });
            PluginUtilities.saveData(this.getName(), "announcements", {localLibNotice: true});
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
                popout.addClass(DiscordClasses.Popouts.popoutLeft);
                popout.css("left", Math.round(offset.left - popout.outerWidth() - 20));
                popout.animate({left: Math.round(offset.left - popout.outerWidth() - 10)}, 100);
            }
            else {
                popout.addClass(DiscordClasses.Popouts.POPOUT_DID_RERENDERight).addClass(DiscordClasses.Popouts.popoutRight);
                popout.css("left", offset.right + 10);
                popout.animate({left: offset.right}, 100);
            }
    
            if (offset.top + popout.outerHeight() >= maxHeight) popout.css("top", Math.round(maxHeight - popout.outerHeight()));
            else popout.css("top", offset.top);
    
            let listener = document.addEventListener("click", (e) => {
                let target = $(e.target);
                if (!target.hasClass("popout-role-members") && !target.parents(".popout-role-members").length) popout.remove(), document.removeEventListener(listener);
            });
        }

        observeContextMenus(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
            let elem = e.addedNodes[0];
            let context = elem.matches(DiscordSelectors.ContextMenu.contextMenu) ? elem : elem.querySelector(DiscordSelectors.ContextMenu.contextMenu);
            if (!context) return;
    
            let isGuildContext = ReactUtilities.getReactProperty(context, "return.memoizedProps.type") == "GUILD_ICON_BAR";
            if (!isGuildContext) return;
    
            let guildId = ReactUtilities.getReactProperty(context, "return.memoizedProps.guild.id");
            let roles = GuildStore.getGuild(guildId).roles;
            let roleItems = [];
    
            for (let roleId in roles) {
                //if (roleId == guildId) continue;
                let role = roles[roleId];
                let item = new ContextMenu.TextItem(role.name, {
                    callback: () => {
                        $(".popout-role-members").remove();
                        this.showRolePopout(item.element[0], guildId, role.id);
                        // $(context).hide();
                    }
                });
                if (role.colorString) item.element.css("color", role.colorString);
                roleItems.push(item);
            }
    
            let subMenu = new ContextMenu.SubMenuItem("Role Members", new ContextMenu.Menu(true).addItems(...roleItems));
            $(context).children(DiscordSelectors.ContextMenu.itemGroup).first().append(subMenu.element);
        }
    
        showRolePopout(target, guildId, roleId) {
            let roles = GuildStore.getGuild(guildId).roles;
            let role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
    
            let popout = $(PluginUtilities.formatString(this.popout, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
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
                let elem = $(PluginUtilities.formatString(this.item, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
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
	};
	
	return !global.ZLibrary ? class {
		getName() {return config.info.name.replace(" ", "");} getAuthor() {return config.info.authors.map(a => a.name).join(", ");} getDescription() {return config.info.description;} getVersion() {return config.info.version;} stop() {}
		showAlert() {window.BdApi.alert("Loading Error",`Something went wrong trying to load the library for the plugin. You can try using a local copy of the library to fix this.<br /><br /><a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);}
		async load() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			const vm = require("vm"), plugin = compilePlugin(global.ZLibrary.buildPlugin(config));
			try {new vm.Script(plugin, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be compiled.", error: {message: err.message, stack: err.stack}});}
			global[this.getName()] = plugin;
			try {new vm.Script(`new global["${this.getName()}"]();`, {displayErrors: true});} catch(err) {return bdpluginErrors.push({name: this.getName(), file: this.getName() + ".plugin.js", reason: "Plugin could not be constructed", error: {message: err.message, stack: err.stack}});}
			bdplugins[this.getName()].plugin = new global[this.getName()]();
			bdplugins[this.getName()].plugin.load();
		}
		async start() {
			try {await global.ZLibraryPromise;}
			catch(err) {return this.showAlert();}
			bdplugins[this.getName()].plugin.start();
		}
	} : compilePlugin(global.ZLibrary.buildPlugin(config));
})();