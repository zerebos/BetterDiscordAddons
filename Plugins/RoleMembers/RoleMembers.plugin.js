/**
 * @name RoleMembers
 * @version 0.1.15
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js
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

module.exports = (() => {
    const config = {info:{name:"RoleMembers",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.15",description:"Allows you to see the members of each role on a server.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/RoleMembers",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"},changelog:[{title:"Fully Fixed",type:"fixed",items:["Context menu item shows and works again.","Popout is whole instead of transparent."]}],main:"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, Utilities, WebpackModules, Patcher, DCM, DOMTools, Toasts} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
    // const WrapperClasses = WebpackModules.getByProps("wrapperHover");
    const animate = DOMTools.animate ? DOMTools.animate.bind(DOMTools) : ({timing = _ => _, update, duration}) => {
        // https://javascript.info/js-animation
        const start = performance.now();

        requestAnimationFrame(function renderFrame(time) {
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // calculate the current animation state
            const progress = timing(timeFraction);

            update(progress); // draw it

            if (timeFraction < 1) {
            requestAnimationFrame(renderFrame);
            }

        });
    };

    const popoutHTML = `<div class="layer-2aCOJ3" style="z-index: 100">
<div class="animatorBottom-L63-7D translate-PeW1wK didRender-2SiRlm popout-role-members" style="margin-top: 0;">
    <div class="container-2O1UgZ role-members-popout">
        <div class="container-2oNtJn medium-2NClDM">
            <div class="inner-2pOSmK"><input class="input-2m5SfJ" placeholder="Search Members — {{memberCount}}" value="">
                <div tabindex="0" class="iconLayout-3Bjizv medium-2NClDM" role="button">
                    <div class="iconContainer-6pgShY">
                        <svg name="Search" class="icon-3CDcPB visible-CwPfRb" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="list-3cyRKU none-2-_0dP scrollerBase-_bVAAt role-members" dir="ltr" style="overflow: hidden scroll; padding-right: 0px; max-height: 400px;">
                
            </div>
        </div>
    </div>
</div>
</div>`;
    const itemHTML = `<div class="item-1BCeuB role-member">
    <div class="itemCheckbox-2G8-Td">
        <div class="avatar-1XUb0A wrapper-1VLyxH" role="img" aria-hidden="false" style="width: 32px; height: 32px;">
            <svg width="40" height="32" viewBox="0 0 40 32" class="mask-1FEkla svg-2azL_l" aria-hidden="true">
                <foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-default)">
                        <div class="avatarStack-3vfSFa">
                            <img src="{{avatar_url}}" alt=" " class="avatar-b5OQ1N" aria-hidden="true">
                        </div>
                </foreignObject>
            </svg>
        </div>
    </div>
    <div class="itemLabel-27pirQ">
        <span class="username">{{username}}</span><span class="discriminator-2jnrqC">{{discriminator}}</span>
    </div>
</div>`;

    return class RoleMembers extends Plugin {

        onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            this.patchRoleMention(); // <@&367344340231782410>
            this.patchGuildContextMenu(this.promises.state);
        }

        onStop() {
            this.promises.cancel();
            if (this.listener) this.listener({target: {classList: {contains: () => {}}, closest: () => {}}});
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll();
        }

        patchRoleMention() {
            const Pill = WebpackModules.getModule(m => m?.default.displayName === "RoleMention");
            Patcher.after(Pill, "default", (_, [props], component) => {
                if (!component || !component.props || !component.props.className) return;
                if (!component.props.className.toLowerCase().includes("mention")) return;
                component.props.className += ` mention interactive`;
                component.props.onClick = (e) => {
                    const roles = GuildStore.getGuild(props.guildId).roles;
                    const name = component.props.children[0].slice(1);
                    let role = filter(roles, r => r.name == name);
                    if (!role) return;
                    role = role[Object.keys(role)[0]];
                    this.showRolePopout(e.nativeEvent.target, props.guildId, role.id);
                };
            });
        }

        async patchGuildContextMenu(promiseState) {
            const GuildContextMenu = await DCM.getDiscordMenu("GuildContextMenu");
            if (promiseState.cancelled) return;
            Patcher.after(GuildContextMenu, "default", (_, args, retVal) => {
                const props = args[0];
                const guildId = props.guild.id;
                const roles = props.guild.roles;
                const roleItems = [];

                for (const roleId in roles) {
                    const role = roles[roleId];
                    const item = DCM.buildMenuItem({
                        id: roleId,
                        label: role.name,
                        style: {color: role.colorString ? role.colorString : ""},
                        closeOnClick: false,
                        action: (e) => {
                            if (e.ctrlKey) {
                                try {
                                    DiscordNative.clipboard.copy(role.id);
                                    Toasts.success("Copied Role ID to clipboard!");
                                }
                                catch {
                                    Toasts.success("Could not copy Role ID to clipboard");
                                }
                            }
                            else {
                                this.showRolePopout(e.target.closest(DiscordSelectors.ContextMenu.item), guildId, role.id);
                            }
                        }
                    });
                    roleItems.push(item);
                }
                const original = retVal.props.children[0].props.children;
                const newOne = DCM.buildMenuItem({type: "submenu", label: "Role Members", children: roleItems});
                if (Array.isArray(original)) original.splice(1, 0, newOne);
                else retVal.props.children[0].props.children = [original, newOne];
            });
        }

        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

            const popout = DOMTools.createElement(Utilities.formatString(popoutHTML, {memberCount: members.length}));
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
                const elem = DOMTools.createElement(Utilities.formatString(itemHTML, {username: user.username, discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
                elem.addEventListener("click", () => {
                    setTimeout(() => Popouts.showUserPopout(elem, user, {guild: guildId}), 1);
                });
                scroller.append(elem);
            }

            this.showPopout(popout, target);
            searchInput.focus();
        }

        showPopout(popout, relativeTarget) {
            if (this.listener) this.listener({target: {classList: {contains: () => {}}, closest: () => {}}}); // Close any previous popouts
            
            document.querySelector(`#app-mount > ${DiscordSelectors.TooltipLayers.layerContainer}`).append(popout);

            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            const offset = relativeTarget.getBoundingClientRect();
            if (offset.right + popout.offsetHeight >= maxWidth) {
                // popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
                popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
                // popout.animate({left: Math.round(offset.left - popout.offsetWidth - 10)}, 100);
                const original = Math.round(offset.left - popout.offsetWidth - 20);
                const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
                animate({
                    duration: 100,
                    update: function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                    }
                });
            }
            else {
                // popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
                popout.style.left = (offset.right + 10) + "px";
                // popout.animate({left: offset.right}, 100);
                const original = offset.right + 10;
                const endPoint = offset.right;
                animate({
                    duration: 100,
                    update: function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                    }
                });
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

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/