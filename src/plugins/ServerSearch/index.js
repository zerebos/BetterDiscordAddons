module.exports = (Plugin, Api) => {
    const {DiscordSelectors, PluginUtilities, ColorConverter, WebpackModules, DiscordModules, DOMTools, Tooltip, Utilities, DiscordClasses, Patcher} = Api;

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
    
            this.css = require("styles.css");
            this.guildHtml = require("guild.html");
            this.separatorHtml = require("separator.html");
            this.largePopoutHtml = require("popout_large.html");
            this.popoutItemHtml = require("popout_item.html");
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
            const guildElementInner = guildElement.querySelector(".wrapper-25eVIn");
            const separator = document.querySelector(".listItem-GuPuDH .guildSeparator-33mFX6");
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
            document.querySelector(DiscordSelectors.Popouts.popouts).append(popout);
            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            const offset = relativeTarget.getBoundingClientRect();
            if (offset.right + popout.offsetHeight >= maxWidth) {
                popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
                popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
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
                popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
                popout.style.left = (offset.right + 10) + "px";
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

            const listener = document.addEventListener("click", (e) => {
                const target = e.target;
                if (!target.classList.contains(id) && !target.closest(`.${id}`)) {
                    popout.remove();
                    document.removeEventListener("click", listener);
                    if (onClose) onClose();
                }
            });
        }
    
        showLargePopout(target, options = {}) {
            const {onClose} = options;
    
            const guilds = SortedGuildStore.getFlattenedGuilds().slice(0);
            const popout = DOMTools.createElement(Utilities.formatString(this.largePopoutHtml, {className: DiscordClasses.Popouts.popout.add(DiscordClasses.Popouts.noArrow), count: guilds.length}));
    
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