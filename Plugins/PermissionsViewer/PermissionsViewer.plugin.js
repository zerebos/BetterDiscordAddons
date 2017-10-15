//META{"name":"PermissionsViewer","pname":"PermissionsViewer"}*//

/* global DiscordPermissions:false, ReactUtilities:false, PluginUtilities:false, PluginSettings:false, BdApi:false */

class PermissionsViewer {
	getName() { return "PermissionsViewer"; }
	getShortName() { return "PermissionsViewer"; }
	getDescription() { return "Allows you to view a user's permissions. Thanks to Noodlebox for the idea! Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.2"; }
    getAuthor() { return "Zerebos"; }
    
    constructor() {
        this.css = `/* PermissionsViewer */
        .member-perms {
            margin-top: 2px;
            max-height: 160px;
            overflow-y:auto;
        }
        
        .member-perms .member-perm {
            background-color: #f3f3f3;
            border: 1px solid #dbdde1;
            border-radius: 3px;
            color: #737f8d;
            display: inline-block;
            font-size: 12px;
            font-weight: 500;
            line-height: 12px;
            margin-right: 4px;
            margin-bottom: 4px;
            padding: 4px 6px;
        }

        .perm-details-button {
            cursor: pointer;
        }

        .perm-details {
            flex: 1;
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
            border-radius: 0 0 5px 5px;
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
            box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
        }

        #permissions-modal-wrapper .header {
            background-color: #35393e;
            box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
            border-radius: 5px 5px 0 0;
            padding: 12px 20px;
            z-index: 1;
        }

        #permissions-modal-wrapper .header {
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
            width: 150px;
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



        #permissions-modal-wrapper *::-webkit-scrollbar-thumb, #permissions-modal-wrapper *::-webkit-scrollbar-track {
            background-clip: padding-box;
            border-radius: 7.5px;
            border-style: solid;
            border-width: 3px;
            visibility: hidden;
        }

        #permissions-modal-wrapper *:hover::-webkit-scrollbar-thumb, #permissions-modal-wrapper *:hover::-webkit-scrollbar-track {
            visibility: visible;
        }

        #permissions-modal-wrapper *::-webkit-scrollbar-track {
            border-width: initial;
            background-color: transparent;
            border: 2px solid transparent;
        }

        #permissions-modal-wrapper *::-webkit-scrollbar-thumb {
            border: 2px solid transparent;
            border-radius: 4px;
            cursor: move;
            background-color: rgba(32,34,37,.6);
        }

        #permissions-modal-wrapper *::-webkit-scrollbar {
            height: 8px;
            width: 8px;
        }
        `;

        this.listHTML = `<div class="member-perms-header flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO bodyTitle-yehI7c marginBottom8-1mABJ4" style="flex: 1 1 auto;">
                            <svg name="Shield" width="24" height="24" viewBox="0 0 24 24" class="bodyTitleIconForeground-itKW-t member-perms-icon" fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                                <path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                            <div class="bodyTitleText-hSiL7d member-perms-title">Permissions</div>
                            <span class="perm-details">
                                <svg name="Details" viewBox="0 0 24 24" class="bodyTitleIconForeground-itKW-t perm-details-button" fill="currentColor">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                            </span>
                        </div>
                        <ul class="member-perms endBodySection-1WYzxu marginBottom20-2Ifj-2"></ul>`;
        
        this.itemHTML = `<component class="member-perm">
                            <span class="name"></span>
                        </component>`;
        
        this.modalHTML = `<div id="permissions-modal-wrapper">
                            <div class="callout-backdrop"></div>
                            <div class="modal-wrapper">
                                <div id="permissions-modal">
                                    <div class="header"><div class="title">User Permissions</div></div>
                                    <div class="modal-body">
                                        <div class="role-side">
                                            <span class="scroller-title role-list-title">Roles</span>
                                            <div class="role-scroller">
                            
                                            </div>
                                        </div>
                                        <div class="perm-side">
                                            <span class="scroller-title perm-list-title">Permissions</span>
                                            <div class="perm-scroller">
                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        
        this.modalButton = `<div class="role-item">
                                <span class="role-name"></span>
                            </div>`;

        this.permAllowedIcon = `<svg height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>`;

        this.permDeniedIcon = `<svg height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                                </svg>`;

        this.modalItem = `<div class="perm-item">
                            <span class="perm-name"></span>
                        </div>`;

        this.contextItem = '<div class="item"><span>Permissions</span><div class="hint"></div></div>';

        this.initialized = false;
        this.defaultSettings = {plugin: {popouts: true, contextMenus: true}};
        this.settings = this.defaultSettings;
    }
	
	load() {}
    unload() {}

    loadSettings() {
		this.settings = PluginUtilities.loadSettings(this.getShortName(), this.defaultSettings);
	}

	saveSettings() {
		PluginUtilities.saveSettings(this.getShortName(), this.settings);
	}
    
    start() {
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
	
	initialize() {
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
        BdApi.injectCSS(this.getShortName(), this.css);
        this.loadSettings();
        this.contextListener = (e) => {
            this.bindMenu(document.querySelector('.context-menu'), e.target);
        };
        this.popoutObserver = new MutationObserver((changes) => {
            for (let change in changes) this.observePopout(changes[change]);
        });
        if (this.settings.plugin.popouts) this.bindPopouts();
        if (this.settings.plugin.contextMenus) this.bindContextMenus();
        this.initialized = true;
	}

	stop() {
        BdApi.clearCSS(this.getShortName());
        this.unbindPopouts();
        this.unbindContextMenus();
    }

    bindContextMenus() {
        document.addEventListener('contextmenu', this.contextListener);
    }

    unbindContextMenus() {
        document.removeEventListener("contextmenu", this.contextListener);
    }

    bindPopouts() {
        this.popoutObserver.observe(document.querySelector('.app'), {childList: true, subtree: true});
    }

    unbindPopouts() {
        this.popoutObserver.disconnect();
    }
	
    observePopout(e) {
        if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
        let elem = e.addedNodes[0];
        let popout = elem.querySelector('.userPopout-4pfA0d');
        
        if (popout) {
            let {user, guild, name} = this.getInfoFromPopout(popout);
            if (!user || !guild || !name) return;
            let modal = this.createModal(name, user, guild);

            let userRoles = user.roles.slice(0);
            userRoles.push(guild.id);
            let perms = user.userId == guild.ownerId ? DiscordPermissions.FullPermissions : 0;
            userRoles.forEach((role) => {
                perms = perms | guild.roles[role].permissions;
            });

            $('.member-roles').after(this.listHTML);
            let userPerms = new DiscordPermissions(perms);
            for (let perm of userPerms) {
                if (userPerms[perm]) {
                    let element = $(this.itemHTML);
                    element.find('.name').text(this.readablePermName(perm));
                    $('.member-perms').append(element);
                }
            }
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let jPopout = $(elem).find('.userPopout-4pfA0d');
            if (jPopout.offset().top + jPopout.outerHeight() >= maxHeight) {
                let shift = (jPopout.offset().top + jPopout.outerHeight() - maxHeight) + 20;
                popout.style.setProperty("transform", "translateY(-" + shift + "px)");
            }

            $('.perm-details-button').on('click', () => {
                this.showModal(modal);
            });
        }
    }

    getInfoFromPopout(popout) {
        let user = ReactUtilities.getReactProperty(popout, 'return.memoizedProps.guildMember');
        let guild = ReactUtilities.getReactProperty(popout, 'return.memoizedProps.guild');
        let name = user.nick ? user.nick : ReactUtilities.getReactProperty(popout, 'return.memoizedProps.user.username');
        return {user: user, guild: guild, name: name};
    }

    bindMenu(context, target) {
        let contextType = ReactUtilities.getReactProperty(context, "return.memoizedProps.type");
        if (contextType != "USER_CHANNEL_MEMBERS" && contextType != "USER_CHANNEL_MESSAGE" && contextType != "USER_CHANNEL_MENTION") return;

        let item = $(this.contextItem);
        item.on("click." + this.getShortName(), () => {
            $(context).hide();
            $(target).click();
            let popout = $('.userPopout-4pfA0d');
            popout.hide();
            let {user, guild, name} = this.getInfoFromPopout(popout);
            if (!user || !guild || !name) return;
            this.showModal(this.createModal(name, user, guild));
            
        });
        $(context).find('.item:contains("Profile")').after(item);
    }

    showModal(modal) {
        $('.userPopout-4pfA0d').hide();
        $('.app').next('.theme-dark').append(modal);
    }

    createModal(name, user, guild) {
        let modal = $(this.modalHTML);
        modal.find('.callout-backdrop').on('click', () => {
            modal.addClass('closing');
            setTimeout(() => { modal.remove(); }, 300);
        });

        modal.find('#permissions-modal .title').text(name + "'s Permissions");

        let userRoles = user.roles.slice(0);
        userRoles.push(guild.id);

        let guildRoles = JSON.parse(JSON.stringify(guild.roles));
        if (user.userId == guild.ownerId) {
            userRoles.push(user.userId);
            guildRoles[user.userId] = {name: "@Owner", permissions: DiscordPermissions.FullPermissions};
        }

        for (let role of userRoles) {
            let item = $(this.modalButton);
            item.find('.role-name').text(guildRoles[role].name);
            modal.find('.role-scroller').append(item);
            item.on('click', () => {
                modal.find('.role-item').removeClass('selected');
                item.addClass('selected');
                let perms = new DiscordPermissions(guildRoles[role].permissions);
                let permList = modal.find('.perm-scroller');
                permList.empty();
                for (let perm of perms) {
                    let element = $(this.modalItem);
                    if (perms[perm]) {
                        element.addClass('allowed');
                        element.prepend(this.permAllowedIcon);
                    }
                    else {
                        element.addClass('denied');
                        element.prepend(this.permDeniedIcon);
                    }
                    element.find('.perm-name').text(this.readablePermName(perm));
                    permList.append(element);
                }
            });
        }

        modal.find('.role-item').first().click();

        return modal;
    }

    readablePermName(perm) {
        let rest = perm.slice(1);
        let first = perm[0].toUpperCase();
        rest = rest.replace(/([A-Z][a-z])|([A-Z][A-Z][A-Z])/g, " $&");
        return first + rest;
    }

    getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}

    generateSettings(panel) {
		
		new PluginSettings.ControlGroup("Plugin Options", () => {this.saveSettings();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.Checkbox("Show In Popouts", "Shows a user's total permissions in their popout similar to roles.",
								this.settings.plugin.popouts, (checked) => {
                                    this.settings.plugin.popouts = checked;
                                    if (checked) this.bindPopouts();
                                    else this.unbindPopouts();
                                }),
            new PluginSettings.Checkbox("Context Menu Button", "Adds a button to view the permissions modal to select context menus.",
								this.settings.plugin.contextMenus, (checked) => {
                                    this.settings.plugin.contextMenus = checked;
                                    if (checked) this.bindContextMenus();
                                    else this.unbindContextMenus();
                                })
		);
	}
}