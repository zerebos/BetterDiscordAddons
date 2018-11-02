//META{"name":"PermissionsViewer","displayName":"PermissionsViewer","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/PermissionsViewer","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/PermissionsViewer/PermissionsViewer.plugin.js"}*//

var PermissionsViewer = (() => {
	if (!global.ZLibrary && !global.ZLibraryPromise) global.ZLibraryPromise = new Promise((resolve, reject) => {
		require("request").get({url: "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js", timeout: 10000}, (err, res, body) => {
			if (err || 200 !== res.statusCode) return reject(err || res.statusMessage);
			try {const vm = require("vm"), script = new vm.Script(body, {displayErrors: true}); resolve(script.runInThisContext());}
			catch(err) {reject(err);}
		});
	});
	const config = {"info":{"name":"PermissionsViewer","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.0","description":"Allows you to view a user's permissions. Thanks to Noodlebox for the idea! Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/PermissionsViewer","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/PermissionsViewer/PermissionsViewer.plugin.js"},"changelog":[{"title":"What's New?","items":["Right click on guilds to view permissions for all roles in a server.","Right click on a channel (in the channel list) to view the specific overrides for that channel.","Rewrite to the new library.","Deprecate remote linking library."]}],"defaultConfig":[{"type":"switch","id":"contextMenus","name":"Context Menus","note":"Toggles colorizing of typing notifications.","value":true},{"type":"switch","id":"popouts","name":"Popouts","note":"Toggles colorizing of typing notifications.","value":true}],"strings":{"es":{"contextMenuLabel":"Permisos","popoutLabel":"Permisos","modal":{"header":"Permisos de ${name}","rolesLabel":"Roles","permissionsLabel":"Permisos","owner":"@propietario"},"settings":{"popouts":{"name":"Mostrar en Popouts","note":"Mostrar los permisos de usuario en popouts como los roles."},"contextMenus":{"name":"Botón de menú contextual","note":"Añadir un botón para ver permisos en los menús contextuales."}}},"pt":{"contextMenuLabel":"Permissões","popoutLabel":"Permissões","modal":{"header":"Permissões de ${name}","rolesLabel":"Cargos","permissionsLabel":"Permissões","owner":"@dono"},"settings":{"popouts":{"name":"Mostrar em Popouts","note":"Mostrar as permissões em popouts como os cargos."},"contextMenus":{"name":"Botão do menu de contexto","note":"Adicionar um botão parar ver permissões ao menu de contexto."}}},"de":{"contextMenuLabel":"Berechtigungen","popoutLabel":"Berechtigungen","modal":{"header":"${name}s Berechtigungen","rolesLabel":"Rollen","permissionsLabel":"Berechtigungen","owner":"@eigentümer"},"settings":{"popouts":{"name":"In Popouts anzeigen","note":"Zeigt die Gesamtberechtigungen eines Benutzers in seinem Popup ähnlich den Rollen an."},"contextMenus":{"name":"Kontextmenü-Schaltfläche","note":"Fügt eine Schaltfläche hinzu, um die Berechtigungen mithilfe von Kontextmenüs anzuzeigen."}}},"en":{"contextMenuLabel":"Permissions","popoutLabel":"Permissions","modal":{"header":"${name}'s Permissions","rolesLabel":"Roles","permissionsLabel":"Permissions","owner":"@owner"},"settings":{"popouts":{"name":"Show In Popouts","note":"Shows a user's total permissions in their popout similar to roles."},"contextMenus":{"name":"Context Menu Button","note":"Adds a button to view the permissions modal to select context menus."}}}},"main":"index.js"};
	const compilePlugin = ([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
    const {Patcher, DiscordModules, PluginUtilities, Modals, DiscordClasses, DiscordSelectors, Utilities, DOMTools, ReactTools, ContextMenu, ColorConverter} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const MemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const DiscordPerms = Object.assign({}, DiscordModules.DiscordConstants.Permissions);

    if (DiscordPerms.SEND_TSS_MESSAGES) {
        DiscordPerms.SEND_TTS_MESSAGES = DiscordPerms.SEND_TSS_MESSAGES;
        delete DiscordPerms.SEND_TSS_MESSAGES;
    }
    if (DiscordPerms.MANAGE_GUILD) {
        DiscordPerms.MANAGE_SERVER = DiscordPerms.MANAGE_GUILD;
        delete DiscordPerms.MANAGE_GUILD;
    }

    return class PermissionsViewer extends Plugin {
        constructor() {
            super();
            this.css = `/* PermissionsViewer */
            .member-perms-header {
				display: flex;
				justify-content: space-between;
            }
    
            .member-perms {
                display: flex;
                flex-wrap: wrap;
                margin-top: 2px;
                max-height: 160px;
                overflow-y: auto;
            }
    
            .member-perms .member-perm .perm-circle {
                border-radius: 50%;
                height: 12px;
                margin-right: 4px;
                width: 12px;
            }
    
            .member-perms .member-perm .name {
                margin-right: 4px;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
    
            .perm-details-button {
                cursor: pointer;
                height: 12px;
            }
    
            .perm-details {
                display: flex;
                justify-content: flex-end;
            }
    
            .member-perm-details {
                cursor: pointer;
            }
    
            .member-perm-details-button {
                fill: #72767d;
                height: 10px;
            }
    
            /* Modal */
    
            @keyframes permissions-backdrop {
                to { opacity: 0.85; }
            }
    
            @keyframes permissions-modal-wrapper {
                to { transform: scale(1); opacity: 1; }
            }
    
            @keyframes permissions-backdrop-closing {
                to { opacity: 0; }
            }
    
            @keyframes permissions-modal-wrapper-closing {
                to { transform: scale(0.7); opacity: 0; }
            }
    
            #permissions-modal-wrapper .callout-backdrop {
                animation: permissions-backdrop 250ms ease;
                animation-fill-mode: forwards;
                opacity: 0;
                background-color: rgb(0, 0, 0);
                transform: translateZ(0px);
            }
    
            #permissions-modal-wrapper.closing .callout-backdrop {
                animation: permissions-backdrop-closing 200ms linear;
                animation-fill-mode: forwards;
                animation-delay: 50ms;
                opacity: 0.85;
            }
    
            #permissions-modal-wrapper.closing .modal-wrapper {
                animation: permissions-modal-wrapper-closing 250ms cubic-bezier(0.19, 1, 0.22, 1);
                animation-fill-mode: forwards;
                opacity: 1;
                transform: scale(1);
            }
    
            #permissions-modal-wrapper .modal-wrapper {
                animation: permissions-modal-wrapper 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
                animation-fill-mode: forwards;
                transform: scale(0.7);
                transform-origin: 50% 50%;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                contain: content;
                justify-content: center;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                opacity: 0;
                pointer-events: none;
                position: absolute;
                user-select: none;
                z-index: 1000;
            }
    
            #permissions-modal-wrapper .modal-body {
                background-color: #36393f;
                height: 440px;
                width: auto;
                /*box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);*/
                flex-direction: row;
                overflow: hidden;
                display: flex;
                flex: 1;
                contain: layout;
                position: relative;
            }
    
            #permissions-modal-wrapper #permissions-modal {
                display: flex;
                contain: layout;
                flex-direction: column;
                pointer-events: auto;
                border: 1px solid rgba(28,36,43,.6);
                border-radius: 5px;
                box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
                overflow: hidden;
            }
    
            #permissions-modal-wrapper .header {
                background-color: #35393e;
                box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
                padding: 12px 20px;
                z-index: 1;
                color: #fff;
                font-size: 16px;
                font-weight: 700;
                line-height: 19px;
            }
    
            .role-side, .perm-side {
                flex-direction: column;
                padding-left: 6px;
            }
    
            .role-scroller, .perm-scroller {
                contain: layout;
                flex: 1;
                min-height: 1px;
                overflow-y: scroll;
            }
    
            #permissions-modal-wrapper .scroller-title {
                color: #fff;
                padding: 8px 0 4px 4px;
                margin-right: 8px;
                border-bottom: 1px solid rgba(0,0,0,0.3);
                display: none;
            }
    
            #permissions-modal-wrapper .role-side {
                width: auto;
                min-width: 150px;
                background: #2f3136;
                flex: 0 0 auto;
                overflow: hidden;
                display: flex;
                height: 100%;
                min-height: 1px;
                position: relative;
            }
    
            #permissions-modal-wrapper .role-scroller {
                contain: layout;
                flex: 1;
                min-height: 1px;
                overflow-y: scroll;
                padding-top: 8px;
            }
    
            #permissions-modal-wrapper .role-item {
                display: flex;
                border-radius: 2px;
                padding: 6px;
                margin-bottom: 5px;
                cursor: pointer;
                color: #dcddde;
            }
    
            #permissions-modal-wrapper .role-item:hover {
                background-color: rgba(0,0,0,0.1);
            }
    
            #permissions-modal-wrapper .role-item.selected {
                background-color: rgba(0,0,0,0.2);
            }
    
            #permissions-modal-wrapper .perm-side {
                width: 250px;
                background-color: #36393f;
                flex: 0 0 auto;
                display: flex;
                height: 100%;
                min-height: 1px;
                position: relative;
                padding-left: 10px;
            }
    
            #permissions-modal-wrapper .perm-item {
                box-shadow: inset 0 -1px 0 rgba(79,84,92,.3);
                box-sizing: border-box;
                height: 44px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                display: flex;
            }
    
            #permissions-modal-wrapper .perm-item.allowed svg {
                fill: #43B581;
            }
    
            #permissions-modal-wrapper .perm-item.denied svg {
                fill: #F04747;
            }
    
            #permissions-modal-wrapper .perm-name {
                display: inline;
                flex: 1;
                font-size: 16px;
                font-weight: 400;
                overflow: hidden;
                text-overflow: ellipsis;
                user-select: text;
                color: #dcddde;
                margin-left: 10px;
            }
    
    
            .member-perms::-webkit-scrollbar-thumb, .member-perms::-webkit-scrollbar-track,
            #permissions-modal-wrapper *::-webkit-scrollbar-thumb, #permissions-modal-wrapper *::-webkit-scrollbar-track {
                background-clip: padding-box;
                border-radius: 7.5px;
                border-style: solid;
                border-width: 3px;
                visibility: hidden;
            }
    
            .member-perms:hover::-webkit-scrollbar-thumb, .member-perms:hover::-webkit-scrollbar-track,
            #permissions-modal-wrapper *:hover::-webkit-scrollbar-thumb, #permissions-modal-wrapper *:hover::-webkit-scrollbar-track {
                visibility: visible;
            }
    
            .member-perms::-webkit-scrollbar-track,
            #permissions-modal-wrapper *::-webkit-scrollbar-track {
                border-width: initial;
                background-color: transparent;
                border: 2px solid transparent;
            }
    
            .member-perms::-webkit-scrollbar-thumb,
            #permissions-modal-wrapper *::-webkit-scrollbar-thumb {
                border: 2px solid transparent;
                border-radius: 4px;
                cursor: move;
                background-color: rgba(32,34,37,.6);
            }
    
            .member-perms::-webkit-scrollbar,
            #permissions-modal-wrapper *::-webkit-scrollbar {
                height: 8px;
                width: 8px;
            }
            `;
    
            this.listHTML = `<div id="permissions-popout">
                                    <div class="member-perms-header \${bodyTitle}">
                                    <div class="member-perms-title">\${label}</div>
                                    <span class="perm-details">
                                        <svg name="Details" viewBox="0 0 24 24" class="perm-details-button" fill="currentColor">
                                            <path d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                        </svg>
                                    </span>
                                </div>
                                <ul class="member-perms \${root} \${rolesList} \${endBodySection}"></ul>
                            </div>`;
                            
            this.itemHTML = `<li class="member-perm \${role}">
                                <div class="perm-circle \${roleCircle}"></div>
                                <div class="name \${roleName}"></div>
                            </li>`;
    
            this.modalHTML = `<div id="permissions-modal-wrapper">
                                <div class="callout-backdrop \${backdrop}"></div>
                                <div class="modal-wrapper \${modal}">
                                    <div id="permissions-modal" class="\${inner}">
                                        <div class="header"><div class="title">\${header}</div></div>
                                        <div class="modal-body">
                                            <div class="role-side">
                                                <span class="scroller-title role-list-title">\${rolesLabel}</span>
                                                <div class="role-scroller">
                                
                                                </div>
                                            </div>
                                            <div class="perm-side">
                                                <span class="scroller-title perm-list-title">\${permissionsLabel}</span>
                                                <div class="perm-scroller">
                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
            
            this.modalButton = `<div class="role-item"><span class="role-name"></span></div>`;
            this.modalButtonUser = `<div class="role-item"><div class="wrapper-2F3Zv8 xsmall-3afG_L"><div class="image-33JSyf xsmall-3afG_L" style="background-image: url('\${avatarUrl}');"></div></div><span class="role-name marginLeft8-1YseBe"></span></div>`;
            this.permAllowedIcon = `<svg height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
            this.permDeniedIcon = `<svg height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>`;
            this.modalItem = `<div class="perm-item"><span class="perm-name"></span></div>`;
    
            this.contextObserver = new MutationObserver((changes) => {
                for (let change in changes) this.observeContextMenus(changes[change]);
            });
    
            this.cancelUserPopout = () => {};
        }

        onStart() {
            this.showAnnouncement();
            PluginUtilities.addStyle(this.getName(), this.css);
            
            this.listHTML = Utilities.formatTString(this.listHTML, DiscordClasses.UserPopout);
            this.listHTML = Utilities.formatTString(this.listHTML, DiscordClasses.PopoutRoles);
            this.itemHTML = Utilities.formatTString(this.itemHTML, DiscordClasses.PopoutRoles);
            this.modalHTML = Utilities.formatTString(this.modalHTML, DiscordClasses.Backdrop);
            this.modalHTML = Utilities.formatTString(this.modalHTML, DiscordClasses.Modals);

            if (this.settings.popouts) this.bindPopouts();
            if (this.settings.contextMenus) this.bindContextMenus();
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
            PluginUtilities.removeStyle(this.getName());
            this.unbindPopouts();
            this.unbindContextMenus();
        }

        bindPopouts() {
            let pViewer = this;
            let UserPopout = DiscordModules.UserPopout;
            let popoutMount = function() {
                const user = this.state.guildMember;
                const guild = this.state.guild;
                const name = this.state.nickname ? this.state.nickname : this.props.user.username;
                if (!user || !guild || !name) return;
    
                const userRoles = user.roles.slice(0);
                userRoles.push(guild.id);
                userRoles.reverse();
                let perms = 0;
        
                const permBlock = DOMTools.createElement(Utilities.formatTString(pViewer.listHTML, {label: pViewer.strings.popoutLabel}));
				const memberPerms = permBlock.find(".member-perms");
                const strings = DiscordModules.Strings;
    
                for (let r = 0; r < userRoles.length; r++) {
                    const role = userRoles[r];
                    perms = perms | guild.roles[role].permissions;
                    for (let perm in DiscordPerms) {
                        var permName = strings[perm];
                        const hasPerm = (perms & DiscordPerms[perm]) == DiscordPerms[perm];
                        if (hasPerm && !memberPerms.find(`[data-name="${permName}"]`)) {
                            const element = DOMTools.createElement(pViewer.itemHTML);
							let roleColor = guild.roles[role].colorString;
                            element.find(".name").textContent = permName;
                            element.setAttribute("data-name", permName);
                            if (!roleColor) roleColor = "#B9BBBE";
                            element.find(".perm-circle").css("background-color", ColorConverter.rgbToAlpha(roleColor, 1));
                            element.css("border-color", ColorConverter.rgbToAlpha(roleColor, 0.6));
                            memberPerms.prepend(element);
                        }
                    }
				}
				
                const popout = DiscordModules.ReactDOM.findDOMNode(this);
                permBlock.find(".perm-details").on("click", () => {
                    pViewer.showModal(pViewer.createModalUser(name, user, guild));
                });
                permBlock.insertAfter(popout.querySelector(DiscordSelectors.UserPopout.rolesList));
            };
    
            this.cancelUserPopout = Patcher.after(UserPopout.prototype, "componentDidMount", (thisObject) => {
                let bound = popoutMount.bind(thisObject); bound();
            });
            
        }
    
        unbindPopouts() {
            this.cancelUserPopout();
        }
    
        bindContextMenus() {
            this.contextObserver.observe(document.querySelector("#app-mount"), {childList: true, subtree: true});
        }
    
        unbindContextMenus() {
            this.contextObserver.disconnect();
        }
    
        observeContextMenus(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
            const elem = e.addedNodes[0];
            const isContextMenu = elem.matches(DiscordSelectors.ContextMenu.contextMenu);
            if (!isContextMenu) return;
            const contextMenu = elem;
            const memberContext = ReactTools.getReactProperty(contextMenu, "return.return.return.return.memoizedProps.user");
            const messageUser = ReactTools.getReactProperty(contextMenu, "return.return.return.return.memoizedProps.guildId");
            if (memberContext || messageUser) return this.userContextMenu(contextMenu, memberContext.id);

            let isGuildContext = ReactTools.getReactProperty(contextMenu, "return.memoizedProps.type") == "GUILD_ICON_BAR";
            if (isGuildContext) return this.guildContextMenu(contextMenu, ReactTools.getReactProperty(contextMenu, "return.memoizedProps.guild"));
    
            let isChannelContext = ReactTools.getReactProperty(contextMenu, "return.memoizedProps.type");
            if (isChannelContext && isChannelContext.startsWith("CHANNEL_LIST")) return this.channelContextMenu(contextMenu, ReactTools.getReactProperty(contextMenu, "return.memoizedProps.channel"), ReactTools.getReactProperty(contextMenu, "return.memoizedProps.guild"));
        }

        channelContextMenu(contextMenu, channel, guild) {
            const item = new ContextMenu.TextItem(this.strings.contextMenuLabel, {callback: () => {
                contextMenu.style.display = "none";
                this.showModal(this.createModalChannel(channel.name, channel, guild));
                
			}});
            contextMenu.find(DiscordSelectors.ContextMenu.item).after(item.getElement()[0]);
        }

        guildContextMenu(contextMenu, guild) {
            const item = new ContextMenu.TextItem(this.strings.contextMenuLabel, {callback: () => {
                contextMenu.style.display = "none";
                this.showModal(this.createModalGuild(guild.name, guild));
                
			}});
            contextMenu.find(DiscordSelectors.ContextMenu.item).after(item.getElement()[0]);
        }

        userContextMenu(contextMenu, id) {
            const item = new ContextMenu.TextItem(this.strings.contextMenuLabel, {callback: () => {
                contextMenu.style.display = "none";
                const guildId = SelectedGuildStore.getGuildId();
                const user = MemberStore.getMember(guildId, id);
                const guild = GuildStore.getGuild(guildId);
                const name = user.nick ? user.nick : UserStore.getUser(user.userId).username;
                if (!user || !guild || !name) return;
                this.showModal(this.createModalUser(name, user, guild));
                
			}});
            contextMenu.find(DiscordSelectors.ContextMenu.item).after(item.getElement()[0]);
        }
    
        showModal(modal) {
            const popout = document.querySelector("[class*=\"userPopout-\"]");
            if (popout) popout.style.display = "none";
            const app = document.querySelector("[class*=\"app-\"]");
            if (app) app.append(modal);
            else document.querySelector("#app-mount").append(modal);
        }

        createModalChannel(name, channel, guild) {
            return this.createModal(`#${name}`, channel.permissionOverwrites, guild.roles, true);
        }
    
        createModalUser(name, user, guild) {   
            const userRoles = user.roles.slice(0);
            const guildRoles = JSON.parse(JSON.stringify(guild.roles));
            userRoles.push(guild.id);
            userRoles.sort((a, b) => {return guildRoles[b].position - guildRoles[a].position;});
    
            if (user.userId == guild.ownerId) {
                userRoles.push(user.userId);
                guildRoles[user.userId] = {name: this.strings.modal.owner, permissions: DiscordPerms.FullPermissions};
            }
            return this.createModal(name, userRoles, guildRoles);
        }

        createModalGuild(name, guild) {
            return this.createModal(name, guild.roles);
        }

        createModal(title, displayRoles, referenceRoles, isOverride = false) {
            if (!referenceRoles) referenceRoles = displayRoles;
            const modal = DOMTools.createElement(Utilities.formatTString(Utilities.formatTString(this.modalHTML, this.strings.modal), {name: title}));
            modal.find(".callout-backdrop").on("click", () => {
                modal.addClass("closing");
                setTimeout(() => { modal.remove(); }, 300);
            });

            const strings = DiscordModules.Strings;
            for (const r in displayRoles) {
                const role = Array.isArray(displayRoles) ? displayRoles[r] : r;
                let item = DOMTools.createElement(!isOverride || displayRoles[role].type == "role" ? this.modalButton : Utilities.formatTString(this.modalButtonUser, {avatarUrl: UserStore.getUser(role).avatarURL}));
                if (!isOverride || displayRoles[role].type == "role") item.css("color", referenceRoles[role].colorString);
                else item.css("color", MemberStore.getMember(DiscordModules.SelectedGuildStore.getGuildId(), role).colorString);
                if (isOverride) item.find(".role-name").textContent = displayRoles[role].type == "role" ? referenceRoles[role].name : UserStore.getUser(role).username;
                else item.find(".role-name").textContent = referenceRoles[role].name;
                modal.find(".role-scroller").append(item);
                item.on("click", () => {
                    modal.findAll(".role-item.selected").forEach(e => e.removeClass("selected"));
                    item.addClass("selected");
                    let allowed = isOverride ? displayRoles[role].allow : referenceRoles[role].permissions;
                    let denied = isOverride ? displayRoles[role].deny : null;

                    let permList = modal.find(".perm-scroller");
                    permList.innerHTML = "";
                    for (let perm in DiscordPerms) {
						let element = DOMTools.createElement(this.modalItem);
                        let permAllowed = (allowed & DiscordPerms[perm]) == DiscordPerms[perm];
                        let permDenied = isOverride ? (denied & DiscordPerms[perm]) == DiscordPerms[perm] : !permAllowed;
                        if (!permAllowed && !permDenied) continue;
                        if (permAllowed) {
                            element.addClass("allowed");
                            element.prepend(DOMTools.createElement(this.permAllowedIcon));
                        }
                        if (permDenied) {
                            element.addClass("denied");
                            element.prepend(DOMTools.createElement(this.permDeniedIcon));
                        }
                        element.find(".perm-name").textContent = strings[perm];
                        permList.append(element);
                    }
                });
            }
    
            modal.find(".role-item").click();
    
            return modal;
        }
    
        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(() => {
                this.unbindPopouts();
                this.unbindContextMenus();
                if (this.settings.popouts) this.bindPopouts();
                if (this.settings.contextMenu) this.bindContextMenus();
            });
            return panel.getElement();
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