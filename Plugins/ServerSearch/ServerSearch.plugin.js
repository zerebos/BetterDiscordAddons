/**
 * @name ServerSearch
 * @version 0.1.9
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSearch
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSearch/ServerSearch.plugin.js
 * @updateUrl https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSearch/ServerSearch.plugin.js
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
    const config = {info:{name:"ServerSearch",authors:[{name:"Zerebos",discord_id:"249746236008169473",github_username:"rauenzi",twitter_username:"ZackRauen"}],version:"0.1.9",description:"Adds a button to search your servers. Search in place or in popout.",github:"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSearch",github_raw:"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ServerSearch/ServerSearch.plugin.js"},changelog:[{title:"Bugs Squashed",type:"fixed",items:["Button should appear once more.","Popout should render next to button instead of off-screen."]}],main:"index.js"};

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
    const {DiscordSelectors, PluginUtilities, ColorConverter, WebpackModules, DiscordModules, DOMTools, Tooltip, Utilities, Patcher} = Api;

    const SortedGuildStore = DiscordModules.SortedGuildStore;
    const ImageResolver = DiscordModules.ImageResolver;
    const SelectedChannelStore = DiscordModules.SelectedChannelStore;
    const NavUtils = DiscordModules.NavigationUtils;
    const GuildInfo = DiscordModules.GuildInfo;
    const PrivateChannelActions = DiscordModules.PrivateChannelActions;
    const Animations = WebpackModules.getByProps("spring");

    const animateDOM = DOMTools.animate ? DOMTools.animate.bind(DOMTools) : ({timing = _ => _, update, duration}) => {
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

    return class ServerSearch extends Plugin {
        constructor() {
            super();
    
            this.css = `#server-search {
	margin-bottom: 10px;
}

#server-search .icon-wrap {
	background: transparent;
}

.popout-server-search,
.popout-server-search-small {
	margin-top: 0;
	z-index: 1005;
}

.popout-server-search-small {
	padding: 10px;
	background:#2f3136;
	box-shadow: 0 0px 15px rgba(0,0,0,0.6);
	border-radius: 4px;
}

.no-image {
	font-size: 12px;
	justify-content: center;
	align-items: center;
	display: flex;
}

.popout-server-search .avatar-b5OQ1N::before {
	display: none;
}

.popout-server-search .avatar-b5OQ1N {
	background-color: rgb(47, 49, 54);
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-size: contain;
}

.search-results {
	overflow: hidden scroll;
	padding-right: 0px;
	max-height: 400px;
}`;
            this.guildHtml = `<div class="listItem-3SmSlK" id="server-search">
    <div class="pill-2RsI5Q wrapper-z5ab_q">
        <span class="item-2LIpTv" style="opacity: 0; height: 8px; transform: none;"></span>
    </div>
    <div class="listItemWrapper-3d87LP">
        <div class="wrapper-28eC3z">
            <svg width="48" height="48" viewBox="0 0 48 48" class="svg-2zuE5p" overflow="visible">
                <defs>
                    <path
                        d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
                        id="356e45aa-8bf2-498c-aadc-611da499e0ec-blob_mask"></path>
                </defs>
                <mask id="356e45aa-8bf2-498c-aadc-611da499e0ec" fill="black" x="0" y="0" width="48" height="48">
                    <use href="#356e45aa-8bf2-498c-aadc-611da499e0ec-blob_mask" fill="white"></use>
                </mask>
                <foreignObject mask="url(#356e45aa-8bf2-498c-aadc-611da499e0ec)" x="0" y="0" width="48" height="48">
                    <div class="circleIconButton-1VxDrg icon-wrap">
                        <svg name="Search" width="24" height="24" viewBox="0 0 18 18" class="circleIcon-3489FI">
                            <g fill="none" fill-rule="evenodd">
                                <path fill="white" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path>
                            </g>
                        </svg>
                    </div>
                </foreignObject>
            </svg>
        </div>
    </div>
</div>`;
            this.separatorHtml = `<div class="listItem-3SmSlK"><div class="guildSeparator-a4uisj server-search-separator"></div></div>`;
            this.largePopoutHtml = `<div class="layer-2aCOJ3" style="margin-top: 0;">
<div class="animatorBottom-L63-7D translate-PeW1wK didRender-2SiRlm popout-server-search">
    <div class="container-2O1UgZ">
        <div class="container-2oNtJn medium-2NClDM">
            <div class="inner-2pOSmK"><input class="input-2m5SfJ" placeholder="Search Servers - {{count}}" value="">
                <div tabindex="0" class="iconLayout-3Bjizv medium-2NClDM" role="button">
                    <div class="iconContainer-6pgShY">
                        <svg name="Search" class="icon-3CDcPB visible-CwPfRb" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="list-3cyRKU none-2-_0dP scrollerBase-_bVAAt search-results" dir="ltr" style="overflow: hidden scroll; padding-right: 0px; max-height: 400px;">
                
            </div>
        </div>
    </div>
</div>
</div>`;
            this.popoutItemHtml = `<div class="item-1BCeuB search-result">
    <div class="itemCheckbox-2G8-Td">
        <div class="avatar-1XUb0A wrapper-1VLyxH" role="img" aria-hidden="false" style="width: 32px; height: 32px;">
            <svg width="40" height="32" viewBox="0 0 40 32" class="mask-1FEkla svg-2azL_l" aria-hidden="true">
                <foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-default)">
                        <div class="avatarStack-3vfSFa">
                            <div class="avatar-b5OQ1N image-33JSyf small-5Os1Bb" style="background-image: url(&quot;{{image_url}}&quot;);"></div>
                        </div>
                </foreignObject>
            </svg>
        </div>
    </div>
    <div class="itemLabel-27pirQ">
        <span class="username">{{name}}</span>
    </div>
</div>`;
        }

        async onStart() {
            PluginUtilities.addStyle(this.getName(), this.css);
            const GuildList = WebpackModules.find(m => m.type && m.type.displayName == "NavigableGuilds");
            this.guildPatch = Patcher.after(GuildList, "type", () => {this.addSearchButton();});
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.addSearchButton();
        }
        
        onStop() {
            Patcher.unpatchAll();
            const button = document.querySelector("#server-search");
            if (button) button.remove();
            const separator = document.querySelector(".server-search-separator");
            if (separator) separator.parentElement.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addSearchButton() {
            if (document.querySelector("#server-search")) return;
            const guildElement = DOMTools.createElement(this.guildHtml);
            const guildElementInner = guildElement.querySelector(".wrapper-28eC3z");
            const separator = document.querySelector(".listItem-3SmSlK .guildSeparator-a4uisj");
            separator.parentElement.parentElement.insertBefore(DOMTools.createElement(this.separatorHtml), separator.parentElement);
            separator.parentElement.parentElement.insertBefore(guildElement, separator.parentElement);
    
            
            const gray = "#2F3136";
            const purple = "#7289da";
            const purpleRGB = ColorConverter.getRGB(purple);
            const grayRGB = ColorConverter.getRGB(gray);
            const backgroundColor = new Animations.Value(0);
            backgroundColor.interpolate({
                inputRange: [0, 1],
                outputRange: [purple, gray]
            });
    
            backgroundColor.addListener((value) => {
                const getVal = (i) => {
                    return Math.round((purpleRGB[i] - grayRGB[i]) * value.value + grayRGB[i]);
                };
                guildElementInner.style.backgroundColor = `rgb(${getVal(0)}, ${getVal(1)}, ${getVal(2)})`;
            });
    
            const borderRadius = new Animations.Value(0);
            borderRadius.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 25]
            });
    
            borderRadius.addListener((value) => {
                // (end - start) * value + start
                guildElementInner.style.borderRadius = ((15 - 25) * value.value + 25) + "px";
            });

            guildElementInner.style.backgroundColor = gray;
            guildElementInner.style.borderRadius = "25px";
    
            const animate = (v) => {
                Animations.parallel([
                    Animations.timing(backgroundColor, {toValue: v, duration: 200}),
                    Animations.spring(borderRadius, {toValue: v, friction: 3})
                ]).start();
            };
    
            guildElement.addEventListener("mouseenter", () => {animate(1);});
    
            guildElement.addEventListener("mouseleave", () => {
                if (!guildElement.classList.contains("selected")) animate(0);
            });
    
            Tooltip.create(guildElement, "Server Search", {side: "right"});
    
            guildElement.addEventListener("click", (e) => {
                if (guildElement.classList.contains("selected")) return;
                e.stopPropagation();
                guildElement.classList.add("selected");
    
                this.showLargePopout(guildElement, {onClose: () => {
                    guildElement.classList.remove("selected");
                    animate(0);
                }});
            });
        }

        showPopout(popout, relativeTarget, id, options = {}) {
            const {onClose} = options;
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
                animateDOM({
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
                animateDOM({
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
                if (!target.classList.contains(id) && !target.closest(`.${id}`)) {
                    popout.remove();
                    document.removeEventListener("click", this.listener);
                    delete this.listener;
                    if (onClose) onClose();
                }
            };
            setTimeout(() => document.addEventListener("click", this.listener), 500);
        }
    
        showLargePopout(target, options = {}) {
            const {onClose} = options;
    
            const guilds = SortedGuildStore.getFlattenedGuilds().slice(0);
            const popout = DOMTools.createElement(Utilities.formatString(this.largePopoutHtml, {count: guilds.length}));
    
            const searchInput = popout.querySelector("input");
            searchInput.addEventListener("keyup", () => {
                const search = searchInput.value.toLowerCase();
                const items = popout.querySelectorAll(".search-result");
                for (let i = 0, len = items.length; i < len; i++) {
                    const item = items[i];
                    const username = item.querySelector(".username").textContent.toLowerCase();
                    if (!username.includes(search)) item.style.display = "none";
                    else item.style.display = "";
                }
            });
    
            const scroller = popout.querySelector(".search-results");
            for (const guild of guilds) {
                const image = ImageResolver.getGuildIconURL(guild);
                const elem = DOMTools.createElement(Utilities.formatString(this.popoutItemHtml, {name: guild.name, image_url: image}));
                if (!image) {
                    const imageElement = elem.querySelector(".image-33JSyf");
                    imageElement.textContent = GuildInfo.getAcronym(guild.name);
                    imageElement.classList.add("no-image");
                }
                elem.addEventListener("mousedown", () => {
                    const lastSelectedChannel = SelectedChannelStore.getChannelId(guild.id);
                    PrivateChannelActions.preload(guild.id, lastSelectedChannel);
                });
                elem.addEventListener("click", () => {
                    const lastSelectedChannel = SelectedChannelStore.getChannelId(guild.id);
                    NavUtils.transitionToGuild(guild.id, lastSelectedChannel);
                });
                scroller.append(elem);
            }
    
            this.showPopout(popout, target, "popout-server-search", {onClose: onClose});
            searchInput.focus();
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/