//META{"name":"RoleMembers","displayName":"RoleMembers","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

var RoleMembers = (() => {
    const config = {"info":{"name":"RoleMembers","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.1.10","description":"Allows you to see the members of each role on a server. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Stop crashing cause it's bad."]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, DiscordClasses, Utilities, WebpackModules, PluginUtilities, Patcher} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map( ([k, v]) => ({[k]: v}) ));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const PopoutStack = DiscordModules.PopoutStack;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
    const WrapperClasses = WebpackModules.getByProps("wrapperHover");
    const MenuItem = ZLibrary.DiscordModules.ContextMenuItem;
    const SubMenuItem = WebpackModules.find(m => m.default && m.default.displayName && m.default.displayName.includes("SubMenuItem"));

    const popoutHTML = `<div class="{{className}} popout-role-members" style="margin-top: 0;">
    <div class="popoutList-T9CKZQ guildSettingsAuditLogsUserFilterPopout-3Jg5NE elevationBorderHigh-2WYJ09 role-members-popout">
        <div class="popoutListInput-1l9TUI size14-3iUx6q container-cMG81i small-2oHLgT">
            <div class="inner-2P4tQO"><input class="input-3Xdcic" placeholder="Search Members — {{memberCount}}" value="">
                <div tabindex="0" class="iconLayout-3OgqU3 small-2oHLgT" role="button">
                    <div class="iconContainer-2wXvy1">
                        <svg name="Search" class="icon-1S6UIr visible-3bFCH-" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                        <svg name="Close" class="clear--Eywng icon-1S6UIr" width="12" height="12" viewBox="0 0 12 12"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="divider-3573oO divider-faSUbd marginTop8-1DLZ1n marginBottom8-AtZOdT"></div>
        <div class="scrollerWrap-2lJEkd firefoxFixScrollFlex-cnI2ix scrollerThemed-2oenus themeGhostHairline-DBD-2d scrollerTrack-1ZIpsv">
            <div class="scroller-2FKFPG firefoxFixScrollFlex-cnI2ix systemPad-3UxEGl scroller-2CvAgC role-members">
                
            </div>
        </div>
    </div>
</div>`;
    const itemHTML = `<div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItem-1MP3MQ role-member" style="flex: 1 1 auto; height: auto;">
    <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 selectableItemLabel-1RKQjD" style="flex: 1 1 auto;">
        <div class="avatar-gPqiLm da-avatar flexChild-faoVW3 da-flexChild wrapper-3t9DeA da-wrapper" role="img"
            aria-label="gibzx, Online" aria-hidden="false" style="width: 32px; height: 32px;"><svg width="40"
                height="32" viewBox="0 0 40 32" class="mask-1l8v16 da-mask" aria-hidden="true">
                <foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-status-round-32)"><img
                        src="{{avatar_url}}"
                        alt=" " class="avatar-VxgULZ da-avatar" aria-hidden="true"></foreignObject>
                <rect width="10" height="10" x="22" y="22" fill="#43b581" mask="url(#svg-mask-status-online)"
                    class="pointerEvents-2zdfdO da-pointerEvents"></rect>
            </svg>
        </div>
        <div class="userText-1WdPps" style="flex: 1 1 auto;">
            <span class="username">{{username}}</span><span class="discriminator-3tYCOD">{{discriminator}}</span>
        </div>
    </div>
</div>`;

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
            const GuildContextMenu = await PluginUtilities.getContextMenu("GUILD_ICON_");
            if (promiseState.cancelled) return;

            Patcher.after(GuildContextMenu, "default", (_, args, retVal) => {
				const props = args[0];
                const guildId = props.guild.id;
                const roles = props.guild.roles;
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
            PluginUtilities.forceUpdateContextMenus();
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
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/