//META{"name":"AccountDetailsPlus","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/AccountDetailsPlus","source":"https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/AccountDetailsPlus/AccountDetailsPlus.plugin.js"}*//

class AccountDetailsPlus {
	getName() { return "AccountDetailsPlus"; }
	getShortName() { return "acp"; }
	getDescription() { return "Lets you view popout, nickname and more from your account panel at the bottom. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.4"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
        this.initialized = false;
        this.defaultSettings = {
            popout: {
                username: true,
                avatar: true
            },
            statusPicker: {
                username: true,
                avatar: true
            },
            nickname: {
                showNickname: true,
                oppositeOnHover: true
            }
        };
        this.settings = this.defaultSettings;
        this.usernameCSS = `.container-iksrDt .nameTag-26T3kW { cursor: pointer; }`;
        this.popoutOpen = false;
    }
	
	load() {}
    unload() {}
    
    saveSettings() { PluginUtilities.saveSettings(this.getShortName(), this.settings); }
    loadSettings() { this.settings = PluginUtilities.loadSettings(this.getShortName(), this.defaultSettings); }
	
	start() {
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
	
	initialize() {		
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
        this.loadSettings();
        
        this.FluxContainer = InternalUtilities.WebpackModules.find(m => m.displayName == "FluxContainer(SubscribeGuildMembersContainer(t))");
        this.currentUser = DiscordModules.UserStore.getCurrentUser();
        this.popoutWrapper = ReactUtilities.getReactProperty(document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small"), "return.return.return.return.stateNode");
        this.originalRender = this.popoutWrapper.props.render;
     
        this.activateShit();

        PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
        this.initialized = true;
	}
	
    stop() {
        this.popoutWrapper.props.render = this.originalRender;
        BdApi.clearCSS(this.getName() + "-css");
        $('*').off('.' + this.getShortName());
        $(document).off('.' + this.getShortName());
        this.saveSettings();
    }

    activateShit() {
        $(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).off('.' + this.getShortName());
        $(DiscordSelectors.AccountDetails.container + " .avatar-small").off('.' + this.getShortName());
        $(document).off('.' + this.getShortName());
        this.usernameCSS = DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag + "{ cursor: pointer; }";
        BdApi.clearCSS(this.getName() + "-css");
        document.querySelector(DiscordSelectors.AccountDetails.container.descend(".username")).textContent = this.currentUser.username;
        
        if (this.settings.nickname.showNickname || this.settings.nickname.oppositeOnHover) {
           $(document).on('mousemove.' + this.getShortName(), (e) => { this.adjustNickname(e); });
        }
        if (this.settings.popout.username) {
            BdApi.injectCSS(this.getName() + "-css", this.usernameCSS);
            $(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on('mousedown.' + this.getShortName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
            $(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on('click.' + this.getShortName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
        }
        if (this.settings.popout.avatar) {
            $(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on('mousedown.' + this.getShortName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
            $(DiscordSelectors.AccountDetails.container + " .avatar-small").on('click.' + this.getShortName(), (e) => { if (!this.popoutOpen) this.showUserPopout(e); });
        }
        if (this.settings.statusPicker.username) {
            $(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on('mousedown.' + this.getShortName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
            $(DiscordSelectors.AccountDetails.container + DiscordSelectors.AccountDetails.nameTag).on('contextmenu.' + this.getShortName(), (e) => {
                if (!this.popoutOpen) this.showStatusPicker(e);
            });
        }
        if (this.settings.statusPicker.avatar) {
            $(DiscordSelectors.AccountDetails.container + " .avatar-small").on('mousedown.' + this.getShortName(), () => { this.popoutOpen = this.popoutWrapper.state.isOpen; });
            $(DiscordSelectors.AccountDetails.container + " .avatar-small").on('contextmenu.' + this.getShortName(), (e) => {
                if (!this.popoutOpen) this.showStatusPicker(e);
            });
        }
    }

    adjustNickname(e) {
        if (!e || !e.target || !(e.target instanceof Element)) return;
        let accountDetails = document.querySelector(DiscordSelectors.AccountDetails.container);
        if (!accountDetails) return;

        let isHovering = accountDetails.contains(e.target);
        let nameElement = accountDetails.querySelector('.username');

        let nick = DiscordModules.GuildMemberStore.getNick(DiscordModules.SelectedGuildStore.getGuildId(), this.currentUser.id);
        nick = nick ? nick : this.currentUser.username;

        if (isHovering && this.settings.nickname.oppositeOnHover) {
            if (this.settings.nickname.showNickname) nameElement.textContent = this.currentUser.username;
            else if (!this.settings.nickname.showNickname) nameElement.textContent = nick;
        }
        else {
            if (this.settings.nickname.showNickname) nameElement.textContent = nick;
            else nameElement.textContent = this.currentUser.username;
        }
    }

    setRender(renderer, options = {}) {
        this.popoutWrapper.props.render = renderer;
        Object.assign(this.popoutWrapper.props, options);
    }

    showStatusPicker(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target = e.currentTarget = e.toElement = e.delegateTarget = document.querySelector(DiscordSelectors.AccountDetails.container + " .avatar-small");
        this.setRender(this.originalRender, {position: "top-left", animationType: "spring"});
        this.popoutWrapper.toggle(e);
    }

    showUserPopout(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target = e.currentTarget = e.toElement = e.delegateTarget = document.querySelector(DiscordSelectors.AccountDetails.container);
        this.setRender((props) => {
            let guild = DiscordModules.SelectedGuildStore.getGuildId();
            let channel = DiscordModules.SelectedChannelStore.getChannelId();
            return DiscordModules.React.createElement(this.FluxContainer, Object.assign({}, props, {
                user: this.currentUser,
                guildId: guild,
                channelId: channel
            }));
        }, {position: "top", animationType: "default"});

        this.popoutWrapper.toggle(e); 
    }
    
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}
	
	generateSettings(panel) {

		new PluginSettings.ControlGroup("Popouts", () => {this.saveSettings(); this.activateShit();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.Checkbox("Avatar", "Opens your popout when clicking your avatar.", this.settings.popout.avatar, (checked) => {this.settings.popout.avatar = checked;}),
			new PluginSettings.Checkbox("Username", "Opens your popout when clicking your username.", this.settings.popout.username, (checked) => {this.settings.popout.username = checked;})
		);

		new PluginSettings.ControlGroup("Status Picker", () => {this.saveSettings(); this.activateShit();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.Checkbox("Avatar", "Opens status picker when right clicking your avatar.", this.settings.statusPicker.avatar, (checked) => {this.settings.statusPicker.avatar = checked;}),
			new PluginSettings.Checkbox("Username", "Opens status picker when right clicking your username.", this.settings.statusPicker.username, (checked) => {this.settings.statusPicker.username = checked;})
		);

		new PluginSettings.ControlGroup("Nickname", () => {this.saveSettings(); this.activateShit();}, {shown: true}).appendTo(panel).append(
            new PluginSettings.PillButton("Name Shown", "Switches between showing username and nickname.", "Username", "Nickname",
                                        this.settings.nickname.showNickname, (checked) => {this.settings.nickname.showNickname = checked;}),
			new PluginSettings.Checkbox("Opposite On Hover", "Shows the opposite on hover. e.g. if you are showing nickname, hovering will show your username.", this.settings.nickname.oppositeOnHover, (checked) => {this.settings.nickname.oppositeOnHover = checked;})
		);
			
		var resetButton = $("<button>");
		resetButton.on("click." + this.getShortName(), () => {
			this.settings = this.defaultSettings;
			this.saveSettings();
			panel.empty();
			this.generateSettings(panel);
		});
		resetButton.text("Reset To Defaults");
		resetButton.css("float", "right");
		resetButton.attr("type","button");

		panel.append(resetButton);
	}

}