//META{"name":"RoleMembers"}*//

/* global PluginUtilities:false, PluginContextMenu:false, ReactUtilities:false, InternalUtilities:false, BdApi:false */

class RoleMembers {
	getName() { return "RoleMembers"; }
	getShortName() { return "RoleMembers"; }
	getDescription() { return "Allows you to see the members of each role on a server. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
		this.initialized = false;
		this.cancels = [];

		this.popout = `<div class="popout no-arrow popout-role-members">
						<div class="popoutList-2NT_IY guildSettingsAuditLogsUserFilterPopout-PQPPs5 elevationBorderHigh-3Y6y6W role-members-popout">
							<div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO searchBar-YMJBu9 popoutListInput-3v5O8b size14-1wjlWP" style="flex: 1 1 auto;">
								<input class="input-yt44Uw flexChild-1KGW5q" value="" placeholder="Search Members" style="flex: 1 1 auto;">
								<div class="searchBarIcon-vCfmUl flexChild-1KGW5q">
									<i class="icon-11Zny- eyeGlass-6rahZf visible-4lw4vs"></i>
									<i class="icon-11Zny- clear-4pSDsx"></i>
								</div>
							</div>
							<div class="divider-1G01Z9 divider-2joH7h marginTop8-2gOa2N marginBottom8-1mABJ4"></div>
							<div class="scrollerWrap-2uBjct scrollerThemed-19vinI themeGhostHairline-2H8SiW scrollerTrack-3hhmU0">
								<div class="scroller-fzNley scroller-3J0bdT role-members">
					
								</div>
							</div>
						</div>
					</div>`;

		this.item = `<div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO selectableItem-3PW5_y role-member" style="flex: 1 1 auto; height: auto;">
						<div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO selectableItemLabel-3pYgaR"
							style="flex: 1 1 auto;">
							<div class="avatar-1BXaQj small-TEeAkX flexChild-1KGW5q">
								<div class="image-EVRGPw" style="flex: 0 1 auto; background-image: url(&quot;\${avatar_url}&quot;);"></div>
							</div>
							<div class="userText-3aBzJF" style="flex: 1 1 auto;">
								<span class="username">\${username}</span><span class="discriminator-fb98O0">\${discriminator}</span>
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
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
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
		popout.appendTo($('.popouts'));
		const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		let offset = target.getBoundingClientRect();
		if (offset.right + popout.outerHeight() >= maxWidth) {
			popout.addClass("popout-left");
			popout.css("left", Math.round(offset.left - popout.outerWidth() - 20));
			popout.animate({left: Math.round(offset.left - popout.outerWidth() - 10)}, 100);
		}
		else {
			popout.addClass("popout-right");
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
		let context = elem.classList.contains('contextMenu-uoJTbz') ? elem : elem.querySelector('.contextMenu-uoJTbz');
		if (!context) return;

		let isGuildContext = ReactUtilities.getReactProperty(context, "return.stateNode.props.type") == "GUILD_ICON_BAR";
		if (!isGuildContext) return;

		let guildId = ReactUtilities.getReactProperty(context, "return.memoizedProps.guild.id");
		let roles = this.GuildStore.getGuild(guildId).roles;
		let roleItems = [];

		for (let roleId in roles) {
			if (roleId == guildId) continue;
			let role = roles[roleId];
			let item = new PluginContextMenu.TextItem(role.name, {
				callback: () => {
					$(".popout-role-members").remove();
					this.showRolePopout(item.element[0], guildId, role.id);
					// $(context).hide();
				}
			});

			roleItems.push(item);
		}

		let subMenu = new PluginContextMenu.SubMenuItem("Role Members", new PluginContextMenu.Menu(true).addItems(...roleItems));
		$(context).children(".itemGroup-oViAgA").first().append(subMenu.element);
	}

	showRolePopout(target, guildId, roleId) {
		let roles = this.GuildStore.getGuild(guildId).roles;
		let role = roles[roleId];

		let popout = $(this.popout);
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

		let members = this.GuildMemberStore.getMembers(guildId);
		members = members.filter(m => m.roles.includes(role.id));
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