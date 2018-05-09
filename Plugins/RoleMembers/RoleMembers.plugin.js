//META{"name":"RoleMembers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/RoleMembers/RoleMembers.plugin.js"}*//

/* global PluginUtilities:false, DiscordModules:false, PluginContextMenu:false, ReactUtilities:false, InternalUtilities:false */

class RoleMembers {
	getName() { return "RoleMembers"; }
	getShortName() { return "RoleMembers"; }
	getDescription() { return "Allows you to see the members of each role on a server. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.4"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.cancels = [];

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
	
	load(){}
	unload(){}
	
	start(){
        let libraryScript = document.getElementById('zeresLibraryScript');
		if (!libraryScript || (window.ZeresLibrary && window.ZeresLibrary.isOutdated)) {
			if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
            document.head.appendChild(libraryScript);
		}

		if (window.ZeresLibrary) this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}

	stop() {
		$('.popout-role-members').remove();
		$("*").off("." + this.getShortName());
		$(document).off("click." + this.getShortName(), ".mention");
		this.contextObserver.disconnect();
		for (let c of this.cancels) c();
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		this.FluxContainer = InternalUtilities.WebpackModules.find(m => m.displayName == "FluxContainer(SubscribeGuildMembersContainer(t))");
		const from = arr => arr && arr.length > 0 && Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
		this.filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

		this.GuildStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getGuild']);
		this.SelectedGuildStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedGuildId']);
		this.DiscordConstants = InternalUtilities.WebpackModules.findByUniqueProperties(['ComponentActions']);
		this.PopoutStack = InternalUtilities.WebpackModules.findByUniqueProperties(['open', 'close', 'closeAll']);
		this.PopoutOpener = InternalUtilities.WebpackModules.findByUniqueProperties(['openPopout']);
		this.SelectedChannelStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedChannelId']);
		this.React = InternalUtilities.WebpackModules.findByUniqueProperties(['createElement']);
		this.GuildMemberStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getMember']);
		this.UserStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getCurrentUser']);
		this.ImageResolver = InternalUtilities.WebpackModules.findByUniqueProperties(["getUserAvatarURL"]);
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
		this.initialized = true;

		this.contextObserver.observe(document.querySelector('#app-mount'), {childList: true, subtree: true});
		$(document).on("click." + this.getShortName(), ".mention", (e) => {
			let isRoleMention = ReactUtilities.getReactProperty(e.target, "return.memoizedState") == null || ReactUtilities.getReactProperty(e.target, "return.memoizedState.isOpen") === undefined;
			if (!isRoleMention) return;
			let currentServer = this.SelectedGuildStore.getGuildId();

			let roles = this.GuildStore.getGuild(currentServer).roles;
			let name = e.target.textContent.slice(1);
			let role = this.filter(roles, r => r.name == name);
			if (!role) return;

			role = role[Object.keys(role)[0]];

			this.showRolePopout(e.target, currentServer, role.id);
		});
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

	showUserPopout(user, target, guildId, channelId) {
		const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		let guild = guildId ? guildId : this.SelectedGuildStore.getGuildId();
		let channel = channelId ? channelId : this.SelectedChannelStore.getChannelId();
		let position = "right";
		if (target.getBoundingClientRect().right + 250 >= maxWidth) position = "left";
		this.PopoutOpener.openPopout(target, {
			position: position,
			offsetX: 0,
			offsetY: 0,
			animationType: "default",
			preventInvert: false,
			zIndexBoost: 0,
			closeOnScroll: false,
			shadow: false,
			backdrop: false,
			toggleClose: true,
			render: (props) => {
				return this.React.createElement(this.FluxContainer, Object.assign({}, props, {
					user: user,
					guildId: guild,
					channelId: channel
				}));
			}
		}, "role-members");
	}
	
	observeContextMenus(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
		let elem = e.addedNodes[0];
		let context = elem.classList.contains(DiscordClasses.ContextMenu.contextMenu) ? elem : elem.querySelector(DiscordSelectors.ContextMenu.contextMenu);
		if (!context) return;

		let isGuildContext = ReactUtilities.getReactProperty(context, "return.stateNode.props.type") == "GUILD_ICON_BAR";
		if (!isGuildContext) return;

		let guildId = ReactUtilities.getReactProperty(context, "return.memoizedProps.guild.id");
		let roles = this.GuildStore.getGuild(guildId).roles;
		let roleItems = [];

		for (let roleId in roles) {
			//if (roleId == guildId) continue;
			let role = roles[roleId];
			let item = new PluginContextMenu.TextItem(role.name, {
				callback: () => {
					$(".popout-role-members").remove();
					this.showRolePopout(item.element[0], guildId, role.id);
					// $(context).hide();
				}
			});
			if (role.colorString) item.element.css("color", role.colorString);
			roleItems.push(item);
		}

		let subMenu = new PluginContextMenu.SubMenuItem("Role Members", new PluginContextMenu.Menu(true).addItems(...roleItems));
		$(context).children(DiscordSelectors.ContextMenu.itemGroup).first().append(subMenu.element);
	}

	showRolePopout(target, guildId, roleId) {
		let roles = this.GuildStore.getGuild(guildId).roles;
		let role = roles[roleId];
		let members = this.GuildMemberStore.getMembers(guildId);
		if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

		let popout = $(PluginUtilities.formatString(this.popout, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), memberCount: members.length}));
		let searchInput = popout.find('input');
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
			let user = this.UserStore.getUser(member.userId);
			let elem = $(PluginUtilities.formatString(this.item, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: this.ImageResolver.getUserAvatarURL(user)}));
			elem.on('click', () => {
				this.PopoutStack.close("role-members");
				elem.addClass("popout-open");
				if (elem.hasClass("popout-open")) this.showUserPopout(user, elem[0], guildId);
			});
			scroller.append(elem);
		}

		this.showPopout(popout, target);
		searchInput.focus();
	}
}