/**
 * @name RoleMembers
 * @description Allows you to see the members of each role on a server.
 * @version 0.1.22
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/RoleMembers
 * @source https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
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
const config = {
    info: {
        name: "RoleMembers",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "zerebos",
                twitter_username: "IAmZerebos"
            }
        ],
        version: "0.1.22",
        description: "Allows you to see the members of each role on a server.",
        github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/RoleMembers",
        github_raw: "https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"
    },
    changelog: [
        {
            title: "Small New Feature!",
            type: "added",
            items: [
                "You can now show member counts for each role directly in the context menu, just enable it in the plugin's settings."
            ]
        },
        {
            title: "Mostly Fixed!",
            type: "fixed",
            items: [
                "Updated for Discord's changes!",
                "User popouts will not show on click, that *may* come in a later update from the library."
            ]
        }
    ],
    defaultConfig: [
        {
            type: "switch",
            id: "showCounts",
            name: "Show Member Counts",
            note: "Enabling this shows the members counts of each role in the context menu",
            value: false
        }
    ],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {DOM, ContextMenu, Patcher, Webpack, UI, Utils} = window.BdApi;
    const {DiscordModules, DiscordSelectors, Utilities} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;

    const getRoles = (guild) => guild?.roles ?? GuildStore.getRoles(guild?.id);

    const popoutHTML = `<div class="theme-dark layer_cd0de5" style="z-index: 100">
<div class="animatorBottom_f88ae3 translate_f88ae3 didRender_f88ae3 popout-role-members" style="margin-top: 0;">
    <div class="container_ac201b selectFilterPopout_cfe282 elevationBorderHigh_ff8688 scroller_ac201b role-members-popout">
        <div class="searchWithScrollbar_eef3ef container_c18ec9 medium_c18ec9">
            <div class="inner_c18ec9">
                <input class="input_c18ec9" placeholder="Search Members — {{memberCount}}" value="">
                <div tabindex="0" class="iconLayout_c18ec9 medium_c18ec9" role="button">
                    <div class="iconContainer_c18ec9">
                        <svg name="Search" class="icon_c18ec9 visible_c18ec9" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="list_eef3ef list_ac201b scroller_eef3ef thin_eed6a8 scrollerBase_eed6a8 role-members" dir="ltr" style="overflow: hidden scroll; padding-right: 0px; max-height: 400px;">
                
            </div>
        </div>
    </div>
</div>
</div>`;
    const itemHTML = `<div class="item_eef3ef role-member">
    <div class="itemCheckbox_eef3ef">
        <div class="wrapper_c51b4e avatar_cfe282" role="img" aria-hidden="false" style="width: 32px; height: 32px;">
            <svg width="40" height="32" viewBox="0 0 40 32" class="mask_c51b4e svg_c51b4e" aria-hidden="true">
                <foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-default)">
                        <div class="avatarStack_c51b4e">
                            <img src="{{avatar_url}}" alt=" " class="avatar_c51b4e" aria-hidden="true">
                        </div>
                </foreignObject>
            </svg>
        </div>
    </div>
    <div class="itemLabel_eef3ef">
        <span class="defaultColor_a595eb text-sm/normal_dc00ef username">{{username}}</span>
    </div>
</div>`;

    return class RoleMembers extends Plugin {

        onStart() {
            this.patchRoleMention(); // <@&367344340231782410>
            this.patchGuildContextMenu();
        }

        onStop() {
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll(this.name);
            this.contextMenuPatch?.();
        }

        patchRoleMention() {
            const Pill = Webpack.getModule(Webpack.Filters.byStrings("interactive", "iconType"), {defaultExport: false});
            Patcher.before(this.name, Pill, "Z", (_, [props]) => {
                if (!props?.className.toLowerCase().includes("rolemention")) return;
                props.className += ` interactive`;
                props.onClick = (e) => {
                    const roles = getRoles({id: SelectedGuildStore.getGuildId()});
                    const name = props.children[1][0].slice(1);
                    let role = filter(roles, r => r.name == name);
                    if (!role) return;
                    role = role[Object.keys(role)[0]];
                    this.showRolePopout(e.nativeEvent.target, SelectedGuildStore.getGuildId(), role.id);
                };
            });
        }

        patchGuildContextMenu() {
            this.contextMenuPatch = ContextMenu.patch("guild-context", (retVal, props) => {
                const guild = props.guild;
                const guildId = guild.id;
                const roles = getRoles(guild);
                const roleItems = [];

                for (const roleId in roles) {
                    const role = roles[roleId];
                    let label = role.name;
                    if (this.settings.showCounts) {
                        let members = GuildMemberStore.getMembers(guildId);
                        if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
                        label = `${label} (${members.length})`;
                    }
                    const item = ContextMenu.buildItem({
                        id: roleId,
                        label: label,
                        style: {color: role.colorString ? role.colorString : ""},
                        closeOnClick: false,
                        action: (e) => {
                            if (e.ctrlKey) {
                                try {
                                    DiscordNative.clipboard.copy(role.id);
                                    UI.showToast("Copied Role ID to clipboard!", {type: "success"});
                                }
                                catch {
                                    UI.showToast("Could not copy Role ID to clipboard", {type: "success"});
                                }
                            }
                            else {
                                this.showRolePopout({
                                    getBoundingClientRect() {
                                        return {
                                            top: e.pageY,
                                            bottom: e.pageY,
                                            left: e.pageX,
                                            right: e.pageX
                                        };
                                    }
                                }, guildId, role.id);
                            }
                        }
                    });
                    roleItems.push(item);
                }

                const newOne = ContextMenu.buildItem({type: "submenu", label: "Role Members", children: roleItems});

                const separatorIndex = retVal.props.children.findIndex(k => !k?.props?.label);
                const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                retVal.props.children.splice(insertIndex, 0, newOne);
                // return original;

            });
        }

        showRolePopout(target, guildId, roleId) {
            const roles = getRoles({id: guildId});
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

            const popout = DOM.parseHTML(Utilities.formatString(popoutHTML, {memberCount: members.length}));
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
                const discriminator = user.discriminator != 0 ? "#" + user.discriminator : "";
                const elem = DOM.parseHTML(Utilities.formatString(itemHTML, {username: Utils.escapeHTML(user.username), discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
                elem.addEventListener("click", () => {
                    UI.showToast("Sorry, user popouts are currently broken!", {type: "error"});
                    // setTimeout(() => Popouts.showUserPopout(elem, user, {guild: guildId}), 1);
                });
                scroller.append(elem);
            }

            this.showPopout(popout, target);
            searchInput.focus();
        }

        showPopout(popout, relativeTarget) {
            if (this.listener) this.listener({target: {classList: {contains: () => {}}, closest: () => {}}}); // Close any previous popouts
            
            document.querySelector(`[class*="app_"] ~ ${DiscordSelectors.TooltipLayers.layerContainer}`).append(popout);

            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            const offset = relativeTarget.getBoundingClientRect();
            if (offset.right + popout.offsetHeight >= maxWidth) {
                // popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
                popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
                // popout.animate({left: Math.round(offset.left - popout.offsetWidth - 10)}, 100);
                const original = Math.round(offset.left - popout.offsetWidth - 20);
                const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
                DOM.animate(function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                }, 100);
            }
            else {
                // popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
                popout.style.left = (offset.right + 10) + "px";
                // popout.animate({left: offset.right}, 100);
                const original = offset.right + 10;
                const endPoint = offset.right;
                DOM.animate(function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                }, 100);
            }

            if (offset.top + popout.offsetHeight >= maxHeight) popout.style.top = Math.round(maxHeight - popout.offsetHeight) + "px";
            else popout.style.top = offset.top + "px";

            this.listener = (e) => {
                const target = e.target;
                if (!target.classList.contains("popout-role-members") && !target.closest(".popout-role-members")) {
                    popout.remove();
                    document.removeEventListener("click", this.listener);
                    delete this.listener;
                }
            };
            setTimeout(() => document.addEventListener("click", this.listener), 500);
        }


        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/