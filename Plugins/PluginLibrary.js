/** 
 * Simple logger for the lib and plugins.
 * 
 * @version 0.0.2
 */
var Logger = class Logger {

    /**
     * Logs an error using a collapsed error group with stacktrace.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message or error to have logged.
	 * @param {Error} error - Optional error to log with the message.
     */
    static err(module, message, error) {
		if (error) return console.error(`%c[${module}]%c ${message}\n%c`, 'color: #3a71c1; font-weight: 700;', 'color: red; font-weight: 700;', 'color: red;', error);
		else this.log(module, message, "error");
    }

    /**
     * Logs a warning message/
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     */
    static warn(module, message) { this.log(module, message, "warn"); }

    /**
     * Logs an informational message.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     */
    static info(module, message) { this.log(module, message, "info"); }

    /**
     * Logs used for debugging purposes.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     */
    static debug(module, message) { this.log(module, message, "debug"); }
    
    /**
     * Logs strings using different console levels and a module label.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     * @param {Logger.LogTypes} type - Type of log to use in console.
     */
    static log(module, message, type = "log") {
        type = Logger.parseType(type);
        console[type](`%c[${module}]%c`, 'color: #3a71c1; font-weight: 700;', '', message);
    }

    static parseType(type) {
        return this.LogTypes.hasOwnProperty(type) ? this.LogTypes[type] : "log";
    }

};

global.Logger.LogTypes = {
    /** Alias for error */
    err: "error",
    error: "error",
    /** Alias for debug */
    dbg: "debug",
    debug: "debug",
    log: "log",
    warn: "warn",
    info: "info"
};
/* ================== END MODULE ================== */


/**
 * Random set of utilities that didn't fit elsewhere.
 * @namespace
 * @version 0.0.1
 */
var GeneralUtilities = {};

/**
 * Stably sorts arrays since `.sort()` has issues.
 * @param {Array} list - array to sort
 * @param {function} comparator - comparator to sort by
 */
GeneralUtilities.stableSort = function(list, comparator) {
    var length = list.length;
    var entries = Array(length);
    var index;

    // wrap values with initial indices
    for (index = 0; index < length; index++) {
        entries[index] = [index, list[index]];
    }

    // sort with fallback based on initial indices
    entries.sort(function (a, b) {
        var comparison = Number(this(a[1], b[1]));
        return comparison || a[0] - b[0];
    }.bind(comparator));

    // re-map original array to stable sorted values
    for (index = 0; index < length; index++) {
        list[index] = entries[index][1];
    }
};

/**
 * Generates an automatically memoizing version of an object.
 * @param {Object} object - object to memoize
 * @returns {Proxy} the proxy to the object that memoizes properties
 */
GeneralUtilities.memoizeObject = function(object) {
    return new Proxy(object, {
        get: function(obj, mod) {
            if (!obj.hasOwnProperty(mod)) return undefined;
            if (Object.getOwnPropertyDescriptor(obj, mod).get) {
                let value = obj[mod];
                delete obj[mod];
                obj[mod] = value;
            }
            return obj[mod];
        }
    });
};
/* ================== END MODULE ================== */


/**
 * Helpful utilities for dealing with colors.
 * @namespace
 * @version 0.0.2
 */
var ColorUtilities = {};

/**
 * Will get the red green and blue values of any color string.
 * @param {string} color - the color to obtain the red, green and blue values of. Can be in any of these formats: #fff, #ffffff, rgb, rgba
 * @returns {array} - array containing the red, green, and blue values
 */
ColorUtilities.getRGB = function(color) {
	var result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color);
	if (result) return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

	result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)/.exec(color);
	if (result) return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];

	result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color);
	if (result) return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
	
	result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color);
	if (result) return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
};

/**
 * Will get the darken the color by a certain percent
 * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
 * @param {number} percent - percent to darken the color by (0-100)
 * @returns {string} - new color in rgb format
 */
ColorUtilities.darkenColor = function(color, percent) {
	var rgb = ColorUtilities.getRGB(color);
	
	for(var i = 0; i < rgb.length; i++){
		rgb[i] = Math.round(Math.max(0, rgb[i] - rgb[i] * (percent / 100)));
	}
	
	return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

/**
 * Will get the lighten the color by a certain percent
 * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
 * @param {number} percent - percent to lighten the color by (0-100)
 * @returns {string} - new color in rgb format
 */
ColorUtilities.lightenColor = function(color, percent) {
	var rgb = ColorUtilities.getRGB(color);
	
	for(var i = 0; i < rgb.length; i++){
		rgb[i] = Math.round(Math.min(255, rgb[i] + rgb[i] * (percent / 100)));
	}
	
	return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

/**
 * Converts a color to rgba format string
 * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
 * @param {number} alpha - alpha level for the new color
 * @returns {string} - new color in rgb format
 */
ColorUtilities.rgbToAlpha = function(color, alpha) {
	var rgb = ColorUtilities.getRGB(color);		
	return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
};
/* ================== END MODULE ================== */


/**
 * A large list of known and labelled classes in discord.
 * Click the label "Line xxx" below to see the whole list.
 * @namespace
 * @version 0.0.1
 */
var DiscordClassModules = {
	get ContextMenu() {return InternalUtilities.WebpackModules.findByUniqueProperties(['itemToggle']);},
	get Scrollers() {return InternalUtilities.WebpackModules.findByUniqueProperties(['scrollerWrap']);},
	get AccountDetails() {return Object.assign({}, InternalUtilities.WebpackModules.findByUniqueProperties(['nameTag']), InternalUtilities.WebpackModules.findByUniqueProperties(['accountDetails']));},
	get Typing() {return InternalUtilities.WebpackModules.findByUniqueProperties(['typing', 'text']);},
	get UserPopout() {return InternalUtilities.WebpackModules.findByUniqueProperties(['userPopout']);},
	get PopoutRoles() {return InternalUtilities.WebpackModules.findByUniqueProperties(['roleCircle']);},
	get UserModal() {return InternalUtilities.WebpackModules.findByUniqueProperties(['profileBadge']);},
	get Textarea() {return InternalUtilities.WebpackModules.findByUniqueProperties(['channelTextArea']);},
	get Popouts() {return InternalUtilities.WebpackModules.findByUniqueProperties(['popouts']);},
	get Titles() {return InternalUtilities.WebpackModules.findByUniqueProperties(['defaultMarginh5']);},
	get Notices() {return InternalUtilities.WebpackModules.findByUniqueProperties(['noticeInfo']);},
	get Backdrop() {return InternalUtilities.WebpackModules.findByUniqueProperties(['backdrop']);},
	get Modals() {return InternalUtilities.WebpackModules.find(m => m.modal && m.inner && !m.header);},
	get AuditLog() {return InternalUtilities.WebpackModules.findByUniqueProperties(['userHook']);}
};

DiscordClassModules = GeneralUtilities.memoizeObject(DiscordClassModules);

/**
 * Proxy for all the class packages, allows us to safely attempt
 * to retrieve nested things without error. Also wraps the class in
 * {@link DOMUtilities.ClassName} which adds features but can still
 * be used in native function.
 * 
 * @namespace
 * @version 0.0.1
 */
var DiscordClasses = new Proxy(DiscordClassModules, {
	get: function(list, item) {
		if (list[item] === undefined) return new Proxy({}, {get: function() {return "";}});
		return new Proxy(list[item], {
			get: function(obj, prop) {
				if (!obj.hasOwnProperty(prop)) return "";
				return new DOMUtilities.ClassName(obj[prop]);
			}
		});
	}
});

/**
 * Gives us a way to retrieve the internal classes as selectors without
 * needing to concatenate strings or use string templates. Wraps the
 * selector in {@link DOMUtilities.Selector} which adds features but can 
 * still be used in native function.
 * 
 * @namespace
 * @version 0.0.1
 */
var DiscordSelectors = new Proxy(DiscordClassModules, {
	get: function(list, item) {
		if (list[item] === undefined) return new Proxy({}, {get: function() {return "";}});
		return new Proxy(list[item], {
			get: function(obj, prop) {
				if (!obj.hasOwnProperty(prop)) return "";
				return new DOMUtilities.Selector(obj[prop]);
			}
		});
	}
});
/* ================== END MODULE ================== */


/**
 * A large list of known and useful webpack modules internal to Discord.
 * Click the label "Line xxx" below to see the whole list.
 * @namespace
 * @version 0.0.1
 */
var DiscordModules = {
    get React() {return InternalUtilities.WebpackModules.findByUniqueProperties(['createElement', 'cloneElement']);},
    get ReactDOM() {return InternalUtilities.WebpackModules.findByUniqueProperties(['render', 'findDOMNode']);},
    get Events() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byPrototypeFields(['setMaxListeners', 'emit']));},

    /* Guild Info, Stores, and Utilities */
    get GuildStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getGuild']);},
    get SortedGuildStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getSortedGuilds']);},
    get SelectedGuildStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedGuildId']);},
    get GuildSync() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getSyncedGuilds"]);},
    get GuildInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getAcronym"]);},
    get GuildChannelsStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getChannels', 'getDefaultChannel']);},
    get GuildMemberStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getMember']);},
    get MemberCountStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getMemberCounts"]);},
    get GuildEmojiStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getEmojis']);},
    get GuildActions() {return InternalUtilities.WebpackModules.findByUniqueProperties(['markGuildAsRead']);},
    get GuildPermissions() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getGuildPermissions']);},

    /* Channel Store & Actions */
    get ChannelStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getChannels', 'getDMFromUserId']);},
    get SelectedChannelStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedChannelId']);},
    get ChannelActions() {return InternalUtilities.WebpackModules.findByUniqueProperties(["selectChannel"]);},
    get PrivateChannelActions() {return InternalUtilities.WebpackModules.findByUniqueProperties(["openPrivateChannel"]);},
    get ChannelSelector() {return InternalUtilities.WebpackModules.findByUniqueProperties(["selectGuild", "selectChannel"]);},

    /* Current User Info, State and Settings */
    get UserInfoStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getToken"]);},
    get UserSettingsStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(["guildPositions"]);},
    get AccountManager() {return InternalUtilities.WebpackModules.findByUniqueProperties(['register', 'login']);},
    get UserSettingsUpdater() {return InternalUtilities.WebpackModules.findByUniqueProperties(['updateRemoteSettings']);},
    get OnlineWatcher() {return InternalUtilities.WebpackModules.findByUniqueProperties(['isOnline']);},
    get CurrentUserIdle() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getIdleTime']);},
    get RelationshipStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['isBlocked']);},
    get RelationshipManager() {return InternalUtilities.WebpackModules.findByUniqueProperties(['addRelationship']);},
    get MentionStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getMentions"]);},

    /* User Stores and Utils */
    get UserStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getCurrentUser']);},
    get UserStatusStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getStatuses']);},
    get UserTypingStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['isTyping']);},
    get UserActivityStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getActivity']);},
    get UserNameResolver() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getName']);},

    /* Emoji Store and Utils */
    get EmojiInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(['isEmojiDisabled']);},
    get EmojiUtils() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getGuildEmoji']);},
    get EmojiStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getByCategory', 'EMOJI_NAME_RE']);},

    /* Invite Store and Utils */
    get InviteStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getInvites"]);},
    get InviteResolver() {return InternalUtilities.WebpackModules.findByUniqueProperties(['findInvite']);},
    get InviteActions() {return InternalUtilities.WebpackModules.findByUniqueProperties(['acceptInvite']);},

    /* Discord Objects & Utils */
    get DiscordConstants() {return InternalUtilities.WebpackModules.findByUniqueProperties(["Permissions", "ActivityTypes", "StatusTypes"]);},
    get Permissions() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getHighestRole']);},
    get ColorConverter() {return InternalUtilities.WebpackModules.findByUniqueProperties(['hex2int']);},
    get ColorShader() {return InternalUtilities.WebpackModules.findByUniqueProperties(['darken']);},
    get ClassResolver() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getClass"]);},
    get ButtonData() {return InternalUtilities.WebpackModules.findByUniqueProperties(["ButtonSizes"]);},
    get IconNames() {return InternalUtilities.WebpackModules.findByUniqueProperties(["IconNames"]);},
    get NavigationUtils() {return InternalUtilities.WebpackModules.findByUniqueProperties(['transitionTo', 'replaceWith', 'getHistory']);},

    /* Discord Messages */
    get MessageStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getMessages']);},
    get MessageActions() {return InternalUtilities.WebpackModules.findByUniqueProperties(['jumpToMessage', '_sendMessage']);},
    get MessageQueue() {return InternalUtilities.WebpackModules.findByUniqueProperties(['enqueue']);},
    get MessageParser() {return InternalUtilities.WebpackModules.findByUniqueProperties(['createMessage', 'parse', 'unparse']);},

    /* In-Game Overlay */
    get OverlayUserPopoutSettings() {return InternalUtilities.WebpackModules.findByUniqueProperties(['openUserPopout']);},
    get OverlayUserPopoutInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getOpenedUserPopout']);},

    /* Experiments */
    get ExperimentStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getExperimentOverrides']);},
    get ExperimentsManager() {return InternalUtilities.WebpackModules.findByUniqueProperties(['isDeveloper']);},
    get CurrentExperiment() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getExperimentId']);},

    /* Images, Avatars and Utils */
    get ImageResolver() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getUserAvatarURL"]);},
    get ImageUtils() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getSizedImageSrc']);},
    get AvatarDefaults() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getUserAvatarURL", "DEFAULT_AVATARS"]);},

    /* Drag & Drop */
    get DNDActions() {return InternalUtilities.WebpackModules.findByUniqueProperties(["beginDrag"]);},
    get DNDSources() {return InternalUtilities.WebpackModules.findByUniqueProperties(["addTarget"]);},
    get DNDObjects() {return InternalUtilities.WebpackModules.findByUniqueProperties(["DragSource"]);},

    /* Electron & Other Internals with Utils*/
    get ElectronModule() {return InternalUtilities.WebpackModules.findByUniqueProperties(["setBadge"]);},
    get Dispatcher() {return InternalUtilities.WebpackModules.findByUniqueProperties(['dirtyDispatch']);},
    get PathUtils() {return InternalUtilities.WebpackModules.findByUniqueProperties(["hasBasename"]);},
    get NotificationModule() {return InternalUtilities.WebpackModules.findByUniqueProperties(["showNotification"]);},
    get RouterModule() {return InternalUtilities.WebpackModules.findByUniqueProperties(["Router"]);},
    get APIModule() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getAPIBaseURL"]);},
    get AnalyticEvents() {return InternalUtilities.WebpackModules.findByUniqueProperties(["AnalyticEventConfigs"]);},
    get KeyGenerator() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/"binary"/));},
    get Buffers() {return InternalUtilities.WebpackModules.findByUniqueProperties(['Buffer', 'kMaxLength']);},
    get DeviceStore() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getDevices']);},
    get SoftwareInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(["os"]);},
    get CurrentContext() {return InternalUtilities.WebpackModules.findByUniqueProperties(["setTagsContext"]);},

    /* Media Stuff (Audio/Video) */
    get MediaDeviceInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(["Codecs", "SUPPORTED_BROWSERS"]);},
    get MediaInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getOutputVolume"]);},
    get MediaEngineInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(['MediaEngineFeatures']);},
    get VoiceInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(["EchoCancellation"]);},
    get VideoStream() {return InternalUtilities.WebpackModules.findByUniqueProperties(["getVideoStream"]);},
    get SoundModule() {return InternalUtilities.WebpackModules.findByUniqueProperties(["playSound"]);},

    /* Window, DOM, HTML */
    get WindowInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(['isFocused', 'windowSize']);},
    get TagInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(['VALID_TAG_NAMES']);},
    get DOMInfo() {return InternalUtilities.WebpackModules.findByUniqueProperties(['canUseDOM']);},
    get HTMLUtils() {return InternalUtilities.WebpackModules.findByUniqueProperties(['htmlFor', 'sanitizeUrl']);},

    /* Locale/Location and Time */
    get LocaleManager() {return InternalUtilities.WebpackModules.findByUniqueProperties(['setLocale']);},
    get Moment() {return InternalUtilities.WebpackModules.findByUniqueProperties(['parseZone']);},
    get LocationManager() {return InternalUtilities.WebpackModules.findByUniqueProperties(["createLocation"]);},
    get Timestamps() {return InternalUtilities.WebpackModules.findByUniqueProperties(["fromTimestamp"]);},

    /* Strings and Utils */
    get Strings() {return InternalUtilities.WebpackModules.findByUniqueProperties(["Messages"]).Messages;},
    get StringFormats() {return InternalUtilities.WebpackModules.findByUniqueProperties(['a', 'z']);},
    get StringUtils() {return InternalUtilities.WebpackModules.findByUniqueProperties(["toASCII"]);},

    /* URLs and Utils */
    get URLParser() {return InternalUtilities.WebpackModules.findByUniqueProperties(['Url', 'parse']);},
    get ExtraURLs() {return InternalUtilities.WebpackModules.findByUniqueProperties(['getArticleURL']);},

    /* DOM/React Components */
    /* ==================== */
    get UserSettingsWindow() {return InternalUtilities.WebpackModules.findByUniqueProperties(['open', 'updateAccount']);},
    get LayerManager() {return InternalUtilities.WebpackModules.findByUniqueProperties(['popLayer', 'pushLayer']);},
    get Tooltips() {return InternalUtilities.WebpackModules.find(m => m.hide && m.show && !m.search && !m.submit && !m.search && !m.activateRagingDemon && !m.dismiss);},

    /* Modals */
    get ModalStack() {return InternalUtilities.WebpackModules.findByUniqueProperties(['push', 'update', 'pop', 'popWithKey']);},
    get UserProfileModals() {return InternalUtilities.WebpackModules.findByUniqueProperties(['fetchMutualFriends', 'setSection']);},
    get ConfirmModal() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byPrototypeFields(['handleCancel', 'handleSubmit', 'handleMinorConfirm']));},

    /* Popouts */
    get PopoutStack() {return InternalUtilities.WebpackModules.findByUniqueProperties(['open', 'close', 'closeAll']);},
    get PopoutOpener() {return InternalUtilities.WebpackModules.findByUniqueProperties(['openPopout']);},
    get EmojiPicker() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byPrototypeFields(['onHoverEmoji', 'selectEmoji']));},

    /* Context Menus */
    get ContextMenuActions() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/CONTEXT_MENU_CLOSE/, c => c.close));},
    get ContextMenuItemsGroup() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/itemGroup/));},
    get ContextMenuItem() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/\.label\b.*\.hint\b.*\.action\b/));},
    get ContextMenuClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['itemToggle']);},

    /* In-Message Links */
    get ExternalLink() {return InternalUtilities.WebpackModules.find(InternalUtilities.Filters.byCode(/\.trusted\b/));},

    /* Sort Later FML */
    get ScrollerClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['scrollerWrap']);},
    get AccountDetailsClasses() {return Object.assign({}, InternalUtilities.WebpackModules.findByUniqueProperties(['nameTag']), InternalUtilities.WebpackModules.findByUniqueProperties(['accountDetails']));},
    get TypingClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['typing', 'text']);},
    get UserPopoutClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['userPopout']);},
    get UserModalClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['profileBadge']);},
    get TextareaClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['channelTextArea']);},
    get PopoutClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['popouts']);},
    get SettingsMetaClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(['defaultMarginh5']);},
    get NoticeBarClasses() {return InternalUtilities.WebpackModules.findByUniqueProperties(["noticeInfo"]);}
};

DiscordModules = GeneralUtilities.memoizeObject(DiscordModules);
/* ================== END MODULE ================== */


/**
 * Class representing Discord's permissions system.
 * 
 * This will soon be rewritten in a much simpler manner using internals.
 * @deprecated
 */
var DiscordPermissions = class DiscordPermissions {
	constructor(perms) {
		this.perms = perms;
	}

	static hasPermission(perms, perm) {
		return (perms & perm) == perm;
	}

	static get FullPermissions() { return 2146958591; }
	static get DefaultPermissions() { return 104324161; }

	static generateFullPermissions() { return new DiscordPermissions(DiscordPermissions.FullPermissions); }
	static generateDefaultPermissions() { return new DiscordPermissions(DiscordPermissions.DefaultPermissions); }

	/* General Permissions */
	static get Administrator() { return 0x8; }
	static get ViewAuditLog() { return 0x80; }
	static get ManageServer() { return 0x20; }
	static get ManageRoles() { return 0x10000000; }
	static get ManageChannels() { return 0x10; }
	static get KickMembers() { return 0x2; }
	static get BanMembers() { return 0x4; }
	static get CreateInvite() { return 0x1; }
	static get ChangeNickname() { return 0x4000000; }
	static get ManageNicknames() { return 0x8000000; }
	static get ManageEmojis() { return 0x40000000; }
	static get ManageWebhooks() { return 0x20000000; }

	/* Text Permissions */
	static get ReadMessages() { return 0x400; }
	static get SendTTSMessages() { return 0x1000; }
	static get EmbedLinks() { return 0x4000; }
	static get ReadMessageHistory() { return 0x10000; }
	static get UseExternalEmojis() { return 0x40000; }
	static get SendMessages() { return 0x800; }
	static get ManageMessages() { return 0x2000; }
	static get AttachFiles() { return 0x8000; }
	static get MentionEveryone() { return 0x20000; }
	static get AddReactions() { return 0x40; }

	/* Voice Permissions */
	static get ViewChannel() { return 0x400; }
	static get Connect() { return 0x100000; }
	static get MuteMembers() { return 0x400000; }
	static get MoveMembers() { return 0x1000000; }
	static get Speak() { return 0x200000; }
	static get DeafenMembers() { return 0x800000; }
	static get UseVoiceActivity() { return 0x2000000; }

	static get PermissionList() {
		return ["administrator", "viewAuditLog", "manageServer", "manageRoles", "manageChannels", "kickMembers", "banMembers", "createInvite",
				"changeNickname", "manageNicknames", "manageEmojis", "manageWebhooks",
				"readMessages", "sendTTSMessages", "embedLinks", "readMessageHistory", "useExternalEmojis", "sendMessages", "manageMessages",
				"attachFiles", "mentionEveryone", "addReactions",
				"viewChannel", "connect", "muteMembers", "moveMembers", "speak", "deafenMembers", "useVoiceActivity"];
	}

    // eslint-disable-next-line no-undef
	[Symbol.iterator]() { return DiscordPermissions.PermissionList.values(); }

	hasPermission(perm) { return (this.perms & perm) == perm; }
	setPermission(perm, value) {
		if (value) this.allowPermission(perm);
		else this.denyPermission(perm);
	}

	allowPermission(perm) { this.perms = this.perms | perm; }
	denyPermission(perm) { this.perms = this.perms & ~perm; }

	/* General Permissions */
	get administrator() { return this.hasPermission(DiscordPermissions.Administrator); }
	get viewAuditLog() { return this.hasPermission(DiscordPermissions.ViewAuditLog); }
	get manageServer() { return this.hasPermission(DiscordPermissions.ManageServer); }
	get manageRoles() { return this.hasPermission(DiscordPermissions.ManageRoles); }
	get manageChannels() { return this.hasPermission(DiscordPermissions.ManageChannels); }
	get kickMembers() { return this.hasPermission(DiscordPermissions.KickMembers); }
	get banMembers() { return this.hasPermission(DiscordPermissions.BanMembers); }
	get createInvite() { return this.hasPermission(DiscordPermissions.CreateInvite); }
	get changeNickname() { return this.hasPermission(DiscordPermissions.ChangeNickname); }
	get manageNicknames() { return this.hasPermission(DiscordPermissions.ManageNicknames); }
	get manageEmojis() { return this.hasPermission(DiscordPermissions.ManageEmojis); }
	get manageWebhooks() { return this.hasPermission(DiscordPermissions.ManageWebhooks); }

	/* Text Permissions */
	get readMessages() { return this.hasPermission(DiscordPermissions.ReadMessages); }
	get sendTTSMessages() { return this.hasPermission(DiscordPermissions.SendTTSMessages); }
	get embedLinks() { return this.hasPermission(DiscordPermissions.EmbedLinks); }
	get readMessageHistory() { return this.hasPermission(DiscordPermissions.ReadMessageHistory); }
	get useExternalEmojis() { return this.hasPermission(DiscordPermissions.UseExternalEmojis); }
	get sendMessages() { return this.hasPermission(DiscordPermissions.SendMessages); }
	get manageMessages() { return this.hasPermission(DiscordPermissions.ManageMessages); }
	get attachFiles() { return this.hasPermission(DiscordPermissions.AttachFiles); }
	get mentionEveryone() { return this.hasPermission(DiscordPermissions.MentionEveryone); }
	get addReactions() { return this.hasPermission(DiscordPermissions.AddReactions); }

	/* Voice Permissions */
	get viewChannel() { return this.hasPermission(DiscordPermissions.ViewChannel); }
	get connect() { return this.hasPermission(DiscordPermissions.Connect); }
	get muteMembers() { return this.hasPermission(DiscordPermissions.MuteMembers); }
	get moveMembers() { return this.hasPermission(DiscordPermissions.MoveMembers); }
	get speak() { return this.hasPermission(DiscordPermissions.Speak); }
	get deafenMembers() { return this.hasPermission(DiscordPermissions.DeafenMembers); }
	get useVoiceActivity() { return this.hasPermission(DiscordPermissions.UseVoiceActivity); }



	/* General Permissions */
	set administrator(allowed) { return this.setPermission(DiscordPermissions.Administrator, allowed); }
	set viewAuditLog(allowed) { return this.setPermission(DiscordPermissions.ViewAuditLog, allowed); }
	set manageServer(allowed) { return this.setPermission(DiscordPermissions.ManageServer, allowed); }
	set manageRoles(allowed) { return this.setPermission(DiscordPermissions.ManageRoles, allowed); }
	set manageChannels(allowed) { return this.setPermission(DiscordPermissions.ManageChannels, allowed); }
	set kickMembers(allowed) { return this.setPermission(DiscordPermissions.KickMembers, allowed); }
	set banMembers(allowed) { return this.setPermission(DiscordPermissions.BanMembers, allowed); }
	set createInvite(allowed) { return this.setPermission(DiscordPermissions.CreateInvite, allowed); }
	set changeNickname(allowed) { return this.setPermission(DiscordPermissions.ChangeNickname, allowed); }
	set manageNicknames(allowed) { return this.setPermission(DiscordPermissions.ManageNicknames, allowed); }
	set manageEmojis(allowed) { return this.setPermission(DiscordPermissions.ManageEmojis, allowed); }
	set manageWebhooks(allowed) { return this.setPermission(DiscordPermissions.ManageWebhooks, allowed); }

	/* Text Permissions */
	set readMessages(allowed) { return this.setPermission(DiscordPermissions.ReadMessages, allowed); }
	set sendTTSMessages(allowed) { return this.setPermission(DiscordPermissions.SendTTSMessages, allowed); }
	set embedLinks(allowed) { return this.setPermission(DiscordPermissions.EmbedLinks, allowed); }
	set readMessageHistory(allowed) { return this.setPermission(DiscordPermissions.ReadMessageHistory, allowed); }
	set useExternalEmojis(allowed) { return this.setPermission(DiscordPermissions.UseExternalEmojis, allowed); }
	set sendMessages(allowed) { return this.setPermission(DiscordPermissions.SendMessages, allowed); }
	set manageMessages(allowed) { return this.setPermission(DiscordPermissions.ManageMessages, allowed); }
	set attachFiles(allowed) { return this.setPermission(DiscordPermissions.AttachFiles, allowed); }
	set mentionEveryone(allowed) { return this.setPermission(DiscordPermissions.MentionEveryone, allowed); }
	set addReactions(allowed) { return this.setPermission(DiscordPermissions.AddReactions, allowed); }

	/* Voice Permissions */
	set viewChannel(allowed) { return this.setPermission(DiscordPermissions.ViewChannel, allowed); }
	set connect(allowed) { return this.setPermission(DiscordPermissions.Connect, allowed); }
	set muteMembers(allowed) { return this.setPermission(DiscordPermissions.MuteMembers, allowed); }
	set moveMembers(allowed) { return this.setPermission(DiscordPermissions.MoveMembers, allowed); }
	set speak(allowed) { return this.setPermission(DiscordPermissions.Speak, allowed); }
	set deafenMembers(allowed) { return this.setPermission(DiscordPermissions.DeafenMembers, allowed); }
	set useVoiceActivity(allowed) { return this.setPermission(DiscordPermissions.UseVoiceActivity, allowed); }
};

DiscordPermissions.version = "0.0.1";
/* ================== END MODULE ================== */


/**
 * Helpful utilities for dealing with DOM operations.
 * @namespace
 * @version 0.0.1
 */
var DOMUtilities = {};

/**
 * Find which index in children a certain node is. Similar to jQuery's `$.index()`
 * @param {HTMLElement} node - the node to find its index in parent
 * @returns {number} index of the node
 */
DOMUtilities.indexInParent = function(node) {
	var children = node.parentNode.childNodes;
	var num = 0;
	for (var i = 0; i < children.length; i++) {
		if (children[i] == node) return num;
		if (children[i].nodeType == 1) num++;
	}
	return -1;
};

/**
 * Insert after a specific element, similar to jQuery's `element.after(newElement)`
 * @param {HTMLElement} newNode - the node to insert
 * @param {HTMLElement} referenceNode - node to insert after in the tree
 */
DOMUtilities.insertAfter = function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};


/** Representation of a Selector **/
DOMUtilities.Selector = class Selector {
	/**
	 * 
	 * @param {string} classname - class to create selector for
	 */
	constructor(className) {
		this.value = " ." + className.split(" ").join(".");
	}
	
	/**
	 * Returns the raw selector, this is how native function get the value.
	 * @returns {string} raw selector.
	 */
	toString() {
		return this.value;
	}
	
	/**
	 * Returns the raw selector, this is how native function get the value.
	 * @returns {string} raw selector.
	 */
	valueOf() {
		return this.value;
	}
	
	selector(symbol, other) {
		this.value = `${this.toString()} ${symbol} ${other.toString()}`;
		return this;
	}
	
	/**
	 * Adds another selector as a direct child `>` to this one.
	 * @param {string|DOMUtilities.Selector} other - Selector to add as child
	 * @returns {DOMUtilities.Selector} returns self to allow chaining
	 */
	child(other) {
		return this.selector(">", other);
	}
	
	/**
	 * Adds another selector as a adjacent sibling `+` to this one.
	 * @param {string|DOMUtilities.Selector} other - Selector to add as adjacent sibling
	 * @returns {DOMUtilities.Selector} returns self to allow chaining
	 */
	adjacent(other) {
		return this.selector("+", other);
	}
	
	/**
	 * Adds another selector as a general sibling `~` to this one.
	 * @param {string|DOMUtilities.Selector} other - Selector to add as sibling
	 * @returns {DOMUtilities.Selector} returns self to allow chaining
	 */
	sibling(other) {
		return this.selector("~", other);
	}
	
	/**
	 * Adds another selector as a descendent `(space)` to this one.
	 * @param {string|DOMUtilities.Selector} other - Selector to add as descendent
	 * @returns {DOMUtilities.Selector} returns self to allow chaining
	 */
	descend(other) {
		return this.selector(" ", other);
	}

	/**
	 * Adds another selector to this one via `,`.
	 * @param {string|DOMUtilities.Selector} other - Selector to add
	 * @returns {DOMUtilities.Selector} returns self to allow chaining
	 */
	and(other) {
		return this.selector(",", other);
	}
};

/** Representation of a Class Name **/
DOMUtilities.ClassName = class ClassName {
	/**
	 * 
	 * @param {string} name - name of the class to represent
	 */
	constructor(name) {
		this.value = name;
	}
	
	/**
	 * Concatenates new class names to the current one using spaces.
	 * @param {string} classNames - list of class names to add to this class name
	 * @returns {DOMUtilities.ClassName} returns self to allow chaining
	 */
	add(...classNames) {
		for (var i = 0; i < classNames.length; i++) {
			this.value += " " + classNames[i];
		}
		return this;
	}
	
	/**
	 * Returns the raw class name, this is how native function get the value.
	 * @returns {string} raw class name.
	 */
	toString() {
		return this.value;
	}
	
	/**
	 * Returns the raw class name, this is how native function get the value.
	 * @returns {string} raw class name.
	 */
	valueOf() {
		return this.value;
	}
	
	/**
	 * Returns the classname represented as {@link DOMUtilities.Selector}.
	 * @returns {DOMUtilities.Selector} selector representation of this class name.
	 */
	get selector() {
		return new DOMUtilities.Selector(this.value);
	}
};
/* ================== END MODULE ================== */


/**
 * Functions and utilities relating to Discord's internals.
 * Some of the code used in this module is an editing version of
 * the Discord Internals library by samogot {@link https://github.com/samogot/betterdiscord-plugins/}.
 * The documentation for {@link InternalUtilities.monkeyPatch} was 
 * also borrowed from him as it's quite thorough.
 * @namespace
 * @version 0.0.2
 */
var InternalUtilities = {};

/**
 * Function with no arguments and no return value that may be called to revert changes made by {@link monkeyPatch} method, restoring (unpatching) original method.
 * @callback InternalUtilities~cancelPatch
 */

/**
 * This is a shortcut for calling original method using `this` and `arguments` from original call. This function accepts no arguments. This function is defined as `() => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments)`
 * @callback InternalUtilities~originalMethodCall
 * @return {*} The same value, which is returned from original method, also this value would be written into `data.returnValue`
 */

/**
 * A callback that modifies method logic. This callback is called on each call of the original method and is provided all data about original call. Any of the data can be modified if necessary, but do so wisely.
 * @callback InternalUtilities~doPatchCallback
 * @param {PatchData} data Data object with information about current call and original method that you may need in your patching callback.
 * @return {*} Makes sense only when used as `instead` parameter in {@link monkeyPatch}. If something other than `undefined` is returned, the returned value replaces the value of `data.returnValue`. If used as `before` or `after` parameters, return value is ignored.
 */

/**
 * This function monkey-patches a method on an object. The patching callback may be run before, after or instead of target method.
 * Be careful when monkey-patching. Think not only about original functionality of target method and your changes, but also about developers of other plugins, who may also patch this method before or after you. Try to change target method behaviour as little as possible, and avoid changing method signatures.
 * By default, this function logs to the console whenever a method is patched or unpatched in order to aid debugging by you and other developers, but these messages may be suppressed with the `silent` option.
 * Display name of patched method is changed, so you can see if a function has been patched (and how many times) while debugging or in the stack trace. Also, patched methods have property `__monkeyPatched` set to `true`, in case you want to check something programmatically.
 *
 * @param {object} what Object to be patched. You can can also pass class prototypes to patch all class instances. If you are patching prototype of react component you may also need {@link Renderer.rebindMethods}.
 * @param {string} methodName The name of the target message to be patched.
 * @param {object} options Options object. You should provide at least one of `before`, `after` or `instead` parameters. Other parameters are optional.
 * @param {InternalUtilities~doPatchCallback} options.before Callback that will be called before original target method call. You can modify arguments here, so it will be passed to original method. Can be combined with `after`.
 * @param {InternalUtilities~doPatchCallback} options.after Callback that will be called after original target method call. You can modify return value here, so it will be passed to external code which calls target method. Can be combined with `before`.
 * @param {InternalUtilities~doPatchCallback} options.instead Callback that will be called instead of original target method call. You can get access to original method using `originalMethod` parameter if you want to call it, but you do not have to. Can't be combined with `before` and `after`.
 * @param {boolean} [options.once=false] Set to `true` if you want to automatically unpatch method after first call.
 * @param {boolean} [options.silent=false] Set to `true` if you want to suppress log messages about patching and unpatching. Useful to avoid clogging the console in case of frequent conditional patching/unpatching, for example from another monkeyPatch callback.
 * @param {string} [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
 * @param {boolean} [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
 * @return {InternalUtilities~cancelPatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
 */
InternalUtilities.monkeyPatch = (what, methodName, options) => {
	const {before, after, instead, once = false, silent = false, forcePatch = true} = options;
	const displayName = options.displayName || what.displayName || what.name || what.constructor.displayName || what.constructor.name;
	if (!silent) console.log('patch', methodName, 'of', displayName); // eslint-disable-line no-console
	let origMethod = what[methodName];
	if (!origMethod) {
		if (!forcePatch) return console.error('Cannot patch method', methodName, 'of', displayName, 'The method does not exist');
		else what[methodName] = function(){}, origMethod = function(){};
	}
	const cancel = () => {
		if (!silent) console.log('unpatch', methodName, 'of', displayName); // eslint-disable-line no-console
		what[methodName] = origMethod;
	};
	what[methodName] = function() {
		/**
		 * @interface
		 * @name PatchData
		 * @property {object} thisObject Original `this` value in current call of patched method.
		 * @property {Arguments} methodArguments Original `arguments` object in current call of patched method. Please, never change function signatures, as it may cause a lot of problems in future.
		 * @property {InternalUtilities~cancelPatch} cancelPatch Function with no arguments and no return value that may be called to reverse patching of current method. Calling this function prevents running of this callback on further original method calls.
		 * @property {function} originalMethod Reference to the original method that is patched. You can use it if you need some special usage. You should explicitly provide a value for `this` and any method arguments when you call this function.
		 * @property {InternalUtilities~originalMethodCall} callOriginalMethod This is a shortcut for calling original method using `this` and `arguments` from original call.
		 * @property {*} returnValue This is a value returned from original function call. This property is available only in `after` callback or in `instead` callback after calling `callOriginalMethod` function.
		 */
		const data = {
			thisObject: this,
			methodArguments: arguments,
			cancelPatch: cancel,
			originalMethod: origMethod,
			callOriginalMethod: () => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments)
		};
		if (instead) {
			const tempRet = PluginUtilities.suppressErrors(instead, '`instead` callback of ' + what[methodName].displayName)(data);
			if (tempRet !== undefined)
				data.returnValue = tempRet;
		}
		else {
			if (before) PluginUtilities.suppressErrors(before, '`before` callback of ' + what[methodName].displayName)(data);
			data.callOriginalMethod();
			if (after) PluginUtilities.suppressErrors(after, '`after` callback of ' + what[methodName].displayName)(data);
		}
		if (once) cancel();
		return data.returnValue;
	};
	what[methodName].__monkeyPatched = true;
	what[methodName].displayName = 'patched ' + (what[methodName].displayName || methodName);
	what[methodName].unpatch = cancel;
	return cancel;
};

/**
 * Acts as a way to search through all of Discord's webpack modules.
 * @namespace
*/
InternalUtilities.WebpackModules = (() => {
	const req = webpackJsonp([], {
		'__extra_id__': (module, exports, req) => exports.default = req
	}, ['__extra_id__']).default;
	delete req.m['__extra_id__'];
    delete req.c['__extra_id__'];
    
    /**
     * Finds a webpack module by using a filter.
     * @memberOf InternalUtilities.WebpackModules
     * @see {@link InternalUtilities.Filters} for other example filters
     * @param {callable} filter - filter to check the module
     * @param {object} options - object of options for finding
     * @param {boolean} [options.cacheOnly=true] - determines if the search should only be through cached modules
     * @returns {(*|null)} returns either the module or null if not found.
     */
	const find = (filter, options = {}) => {
		const {cacheOnly = true} = options;
		for (let i in req.c) {
			if (req.c.hasOwnProperty(i)) {
				let m = req.c[i].exports;
				if (m && m.__esModule && m.default && filter(m.default)) return m.default;
				if (m && filter(m))	return m;
			}
		}
		if (cacheOnly) {
			console.warn('Cannot find loaded module in cache');
			return null;
		}
		console.warn('Cannot find loaded module in cache. Loading all modules may have unexpected side effects');
		for (let i = 0; i < req.m.length; ++i) {
			try {
				let m = req(i);
				if (m && m.__esModule && m.default && filter(m.default)) return m.default;
				if (m && filter(m))	return m;
			}
			catch (e) {
				console.error(e);
			}
		}
		console.warn('Cannot find module');
		return null;
	};
    
    /**
     * @memberOf InternalUtilities.WebpackModules
     * @param {array} propNames - array of property names
     * @param {object} options - object of options for finding
     * @param {boolean} [options.cacheOnly=true] - determines if the search should only be through cached modules
     * @returns {(*|null)} returns either the module or null if not found.
     */
    const findByUniqueProperties = (propNames, options) => find(module => propNames.every(prop => module[prop] !== undefined), options);

    /**
     * @memberOf InternalUtilities.WebpackModules
     * @param {...string} props - property names of module
     * @returns {(*|null)} returns either the module or null if not found.
     */
    const findByProps = (...props) => findByUniqueProperties(props);
    
    /**
     * @memberOf InternalUtilities.WebpackModules
     * @param {string} displayName - name of module
     * @returns {(*|null)} returns either the module or null if not found.
     */
	const findByDisplayName = (displayName, options) => find(module => module.displayName === displayName, options);
		
	return {find, findByProps, findByUniqueProperties, findByDisplayName};
})();


/**
 * A series of filters for use in combination with {@link InternalUtilities.WebpackModules}.
 * @namespace
*/
InternalUtilities.Filters = {
    /**
     * 
     * @param {array} fields - array of prototype function names
     * @param {callable} [selector=x => x] - additional filter for confirming module
     * @returns {(*|null)} returns either the module or null if not found.
     */
	byPrototypeFields: (fields, selector = x => x) => (module) => {
		const component = selector(module);
		if (!component) return false;
		if (!component.prototype) return false;
		for (const field of fields) {
			if (!component.prototype[field]) return false;
		}
		return true;
    },
    
    /**
     * 
     * @param {regex} search - regex for searching through module code
     * @param {callable} [selector=x => x] - additional filter for confirming module
     * @returns {(*|null)} returns either the module or null if not found.
     */
	byCode: (search, selector = x => x) => (module) => {
		const method = selector(module);
		if (!method) return false;
		return method.toString().search(search) !== -1;
    },
    
    /**
     * 
     * @param {...InternalUtilities.Filters} filters - series of filters to combine
     * @returns {(*|null)} returns either the module or null if not found.
     */
	and: (...filters) => (module) => {
		for (const filter of filters) {
			if (!filter(module)) return false;
		}
		return true;
	}
};

/**
 * Fires after the desired internal function is fired.
 * @param {PatchData} data - the patch data from the internal patch
 * @callback InternalUtilities~listenerCallback
 */

/**
 * Adds a listener to funtions of internal modules. Especially useful for event based
 * actions where the data is less important.
 * @param {*} internalModule - module to patch
 * @param {string} moduleFunction - name of the funtion to listen for
 * @param {InternalUtilities~listenerCallback} callback - function to fire after the original function
 */
InternalUtilities.addInternalListener = function(internalModule, moduleFunction, callback) {
	const moduleName = internalModule.displayName || internalModule.name || internalModule.constructor.displayName || internalModule.constructor.name; // borrowed from Samogot
	if (!internalModule[moduleFunction] || typeof(internalModule[moduleFunction]) !== "function") return console.error(`Module ${moduleName} has no function ${moduleFunction}`);

	if (!internalModule.__internalListeners) internalModule.__internalListeners = {};
	if (!internalModule.__internalListeners[moduleFunction]) internalModule.__internalListeners[moduleFunction] = new Set();
	if (!internalModule.__listenerPatches) internalModule.__listenerPatches = {};

	if (!internalModule.__listenerPatches[moduleFunction]) {
		if (internalModule[moduleFunction].__monkeyPatched) console.warn(`Function ${moduleFunction} of module ${moduleName} has already been patched by someone else.`);
		internalModule.__listenerPatches[moduleFunction] = InternalUtilities.monkeyPatch(internalModule, moduleFunction, {after: (data) => {
			for (let listener of internalModule.__internalListeners[moduleFunction]) listener(data);
		}});
	}

	internalModule.__internalListeners[moduleFunction].add(callback);
};

/**
 * Removes the internal listener
 * @param {*} internalModule - module to unpatch
 * @param {string} moduleFunction - name of the funtion to stop listening to
 * @param {InternalUtilities~listenerCallback} callback - original callback to remove
 */
InternalUtilities.removeInternalListener = function(internalModule, moduleFunction, callback) {
	const moduleName = internalModule.displayName || internalModule.name || internalModule.constructor.displayName || internalModule.constructor.name; // borrowed from Samogot
	if (!internalModule[moduleFunction] || typeof(internalModule[moduleFunction]) !== "function") return console.error(`Module ${moduleName} has no function ${moduleFunction}`);
	if (!internalModule.__internalListeners || !internalModule.__internalListeners[moduleFunction] || !internalModule.__internalListeners[moduleFunction].size) return;
	
	internalModule.__internalListeners[moduleFunction].delete(callback);
	
	if (!internalModule.__internalListeners[moduleFunction].size) {
		internalModule.__listenerPatches[moduleFunction]();
		delete internalModule.__listenerPatches[moduleFunction];
	}
};

/** Discord's Electron web contents. */
InternalUtilities.webContents = require('electron').remote.getCurrentWebContents();

/**
 * Similar to {@link PluginUtilities.onSwitchObserver} but this uses electron
 * web contents and not observers. This can be more efficient on worse systems
 * than the observer based method.
 * @param {callable} callback - basic callback to happen on channel switch
 */
InternalUtilities.addOnSwitchListener = function(callback) {
	InternalUtilities.webContents.on("did-navigate-in-page", callback);
};

/**
 * Removes the listener added by {@link InternalUtilities.addOnSwitchListener}.
 * @param {callable} callback - callback to remove from the listener list
 */
InternalUtilities.removeOnSwitchListener = function(callback) {
	InternalUtilities.webContents.removeListener("did-navigate-in-page", callback);
};
/* ================== END MODULE ================== */


/** 
 * Patcher that can patch other functions allowing you to run code before, after or
 * instead of the original function. Can also alter arguments and return values.
 * 
 * This is a modified version of what we have been working on in BDv2. {@link https://github.com/JsSucks/BetterDiscordApp/blob/master/client/src/modules/patcher.js}
 * 
 * @version 0.0.2
 */
var Patcher = class Patcher {

    static get patches() { return global._patches || (global._patches = []); }

    /**
     * Returns all the patches done by a specific caller
     * @param {string} name - Name of the patch caller
     * @method
     */
    static getPatchesByCaller(name) {
		if (!name) return [];
        const patches = [];
        for (const patch of this.patches) {
			for (const childPatch of patch.children) {
				if (childPatch.caller === name) patches.push(childPatch);
			}
        }
        return patches;
    }

    /**
     * Unpatches all patches passed, or when a string is passed unpatches all
     * patches done by that specific caller.
     * @param {Array|string} patches - Either an array of patches to unpatch or a caller name
     */
    static unpatchAll(patches) {
        if (typeof patches === 'string') patches = this.getPatchesByCaller(patches);

        for (const patch of patches) {
			patch.unpatch();
        }
	}
	
	static resolveModule(module) {
        if (module instanceof Function || (module instanceof Object && !(module instanceof Array))) return module;
        if (typeof module === 'string') return DiscordModules[module];
        if (module instanceof Array) return InternalUtilities.WebpackModules.findByUniqueProperties(module);
        return null;
	}

    static makeOverride(patch) {
        return function () {
            let returnValue = undefined;
            if (!patch.children) return patch.originalFunction.apply(this, arguments);
            for (const superPatch of patch.children.filter(c => c.type === 'before')) {
                try {
                    superPatch.callback(this, arguments);
                }
                catch (err) {
                    Logger.err("Patcher", `Could not fire before callback of ${patch.functionName} for ${superPatch.caller}`, err);
                }
            }

            const insteads = patch.children.filter(c => c.type === 'instead');
            if (!insteads.length) returnValue = patch.originalFunction.apply(this, arguments);
            else {
                for (const insteadPatch of insteads) {
                    try {
						const tempReturn = insteadPatch.callback(this, arguments);
                        if (typeof(tempReturn) !== "undefined") returnValue = tempReturn;
                    }
                    catch (err) {
                        Logger.err("Patcher", `Could not fire instead callback of ${patch.functionName} for ${insteadPatch.caller}`, err);
                    }
                }
            }

            for (const slavePatch of patch.children.filter(c => c.type === 'after')) {
                try {
					const tempReturn = slavePatch.callback(this, arguments, returnValue);
                    if (typeof(tempReturn) !== "undefined") returnValue = tempReturn;
                }
                catch (err) {
                    Logger.err("Patcher", `Could not fire after callback of ${patch.functionName} for ${slavePatch.caller}`, err);
                }
            }
            return returnValue;
        };
    }

    static rePatch(patch) {
        patch.proxyFunction = patch.module[patch.functionName] = this.makeOverride(patch);
    }

    static makePatch(module, functionName, name) {
        const patch = {
			name,
            module,
            functionName,
            originalFunction: module[functionName],
            proxyFunction: null,
            revert: () => { // Calling revert will destroy any patches added to the same module after this
                patch.module[patch.functionName] = patch.originalFunction;
                patch.proxyFunction = null;
                patch.children = [];
            },
            counter: 0,
            children: []
        };
        patch.proxyFunction = module[functionName] = this.makeOverride(patch);
        return this.patches.push(patch), patch;
    }

    /**
     * Function with no arguments and no return value that may be called to revert changes made by {@link Patcher}, restoring (unpatching) original method.
     * @callback Patcher~unpatch
     */

    /**
     * A callback that modifies method logic. This callback is called on each call of the original method and is provided all data about original call. Any of the data can be modified if necessary, but do so wisely.
     * @callback Patcher~patchCallback
     * @param {object} thisObject - `this` in the context of the original function.
     * @param {arguments} arguments - The original arguments of the original function.
     * @param {*} returnValue - The return value of the original function. This is only present for `after` patches.
     * @return {*} Makes sense only when used as `instead` parameter in {@link Patcher.instead}. If something other than `undefined` is returned, the returned value replaces the value of `returnValue`. If used for `before` or `after`, the return value is ignored.
     */

    /**
     * This method patches onto another function, allowing your code to run beforehand.
     * Using this, you are also able to modify the incoming arguments before the original method is run.
     * 
     * @param {string} caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher#unpatchAll}. Use `""` if you don't care.
     * @param {object} moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
     * @param {string} functionName - Name of the method to be patched
     * @param {Patcher~patchCallback} callback - Function to run before the original method
     * @param {object} options - Object used to pass additional options.
     * @param {string} [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param {boolean} [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return {Patcher~unpatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    static before(caller, moduleToPatch, functionName, callback, options = {}) { return this.pushChildPatch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "before"})); }
    
    /**
     * This method patches onto another function, allowing your code to run instead.
     * Using this, you are also able to modify the return value, using the return of your code instead.
     * 
     * @param {string} caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher#unpatchAll}. Use `""` if you don't care.
     * @param {object} moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
     * @param {string} functionName - Name of the method to be patched
     * @param {Patcher~patchCallback} callback - Function to run instead of the original method
     * @param {object} options - Object used to pass additional options.
     * @param {string} [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param {boolean} [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return {Patcher~unpatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    static after(caller, moduleToPatch, functionName, callback, options = {}) { return this.pushChildPatch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "after"})); }
    
    /**
     * This method patches onto another function, allowing your code to run afterwards.
     * Using this, you are also able to modify the return value, using the return of your code instead.
     * 
     * @param {string} caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher#unpatchAll}. Use `""` if you don't care.
     * @param {object} moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
     * @param {string} functionName - Name of the method to be patched
     * @param {Patcher~patchCallback} callback - Function to run after the original method
     * @param {object} options - Object used to pass additional options.
     * @param {string} [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param {boolean} [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return {Patcher~unpatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    static instead(caller, moduleToPatch, functionName, callback, options = {}) { return this.pushChildPatch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "instead"})); }

    /**
     * This method patches onto another function, allowing your code to run before, instead or after the original function.
     * Using this you are able to modify the incoming arguments before the original function is run as well as the return
     * value before the original function actually returns.
     * 
     * @param {string} caller - Name of the caller of the patch function. Using this you can undo all patches with the same name using {@link Patcher#unpatchAll}. Use `""` if you don't care.
     * @param {object} moduleToPatch - Object with the function to be patched. Can also patch an object's prototype.
     * @param {string} functionName - Name of the method to be patched
     * @param {Patcher~patchCallback} callback - Function to run after the original method
     * @param {object} options - Object used to pass additional options.
     * @param {string} [options.type=after] - Determines whether to run the function `before`, `instead`, or `after` the original.
     * @param {string} [options.displayName] You can provide meaningful name for class/object provided in `what` param for logging purposes. By default, this function will try to determine name automatically.
     * @param {boolean} [options.forcePatch=true] Set to `true` to patch even if the function doesnt exist. (Adds noop function in place).
     * @return {Patcher~unpatch} Function with no arguments and no return value that should be called to cancel (unpatch) this patch. You should save and run it when your plugin is stopped.
     */
    static pushChildPatch(caller, moduleToPatch, functionName, callback, options = {}) {
		const {type = "after", forcePatch = true} = options;
		const module = this.resolveModule(moduleToPatch);
		if (!module) return null;
		if (!module[functionName] && forcePatch) module[functionName] = function() {};
		if (!(module[functionName] instanceof Function)) return null;
		
		if (typeof moduleToPatch === 'string') options.displayName = moduleToPatch;
        const displayName = options.displayName || module.displayName || module.name || module.constructor.displayName || module.constructor.name;

		const patchId = `${displayName}.${functionName}`;
        const patch = this.patches.find(p => p.module == module && p.functionName == functionName) || this.makePatch(module, functionName, patchId);
        if (!patch.proxyFunction) this.rePatch(patch);
        const child = {
            caller,
            type,
            id: patch.counter,
            callback,
            unpatch: () => {
                patch.children.splice(patch.children.findIndex(cpatch => cpatch.id === child.id && cpatch.type === type), 1);
                if (patch.children.length <= 0) {
					let patchNum = this.patches.findIndex(p => p.module == module && p.functionName == functionName);
					this.patches[patchNum].revert();
					this.patches.splice(patchNum, 1);
				}
            }
        };
        patch.children.push(child);
        patch.counter++;
        return child.unpatch;
    }

};
/* ================== END MODULE ================== */


/**
 * Self-made context menus that emulate Discord's own context menus.
 * @namespace
 * @version 0.0.7
 */
var PluginContextMenu = {};


/** Main menu class for creating custom context menus. */
PluginContextMenu.Menu = class Menu {
    /**
     * 
     * @param {boolean} [scroll=false] - should this menu be a scrolling menu (usually only used for submenus)
     */
	constructor(scroll = false) {
		this.theme = $('.theme-dark').length ? "theme-dark" : "theme-light";
		this.element = $("<div>").addClass(DiscordModules.ContextMenuClasses.contextMenu).addClass("plugin-context-menu").addClass(this.theme);
		this.scroll = scroll;
		if (scroll) {
			this.scroller = $("<div>").addClass(DiscordModules.ScrollerClasses.scroller).addClass(DiscordModules.ContextMenuClasses.scroller);
			this.element.append($("<div>")
				.addClass(DiscordModules.ScrollerClasses.scrollerWrap)
				.addClass(DiscordModules.ScrollerClasses.scrollerThemed)
				.addClass(DiscordModules.ScrollerClasses.themeGhostHairline).append(
					this.scroller
			));
		}
	}
    
    /**
     * Adds an item group to the menu. The group should already be populated.
     * @param {PluginContextMenu.ItemGroup} contextGroup - group to add to the menu
     * @returns {PluginContextMenu.Menu} returns self for chaining
     */
	addGroup(contextGroup) {
		if (this.scroll) this.scroller.append(contextGroup.getElement());
		else this.element.append(contextGroup.getElement());
		return this;
	}
    
    /**
     * Adds items to the context menu directly. It is recommended to add to a group and use 
     * {@link PluginContextMenu.Menu#addGroup} instead to behave as natively as possible.
     * @param {PluginContextMenu.MenuItem} contextItems - list of items to add to the context menu
     * @returns {PluginContextMenu.Menu} returns self for chaining
     */
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			if (this.scroll) this.scroller.append(contextItems[i].getElement());
			else this.element.append(contextItems[i].getElement());
		}
		return this;
	}
    
    /**
     * Shows the menu at a specific x and y position. This generally comes from the
     * pointer position on a right click event.
     * @param {number} x - x coordinate for the menu to show at
     * @param {number} y - y coordinate for the menu to show at
     */
	show(x, y) {
		const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const mouseX = x;
		const mouseY = y;
		
		let type = this.element.parents(".plugin-context-menu").length > this.element.parents(`.${DiscordModules.ContextMenuClasses.contextMenu}`).length ? ".plugin-context-menu" : `.${DiscordModules.ContextMenuClasses.contextMenu}`;
		var depth = this.element.parents(type).length;
		if (depth == 0) this.element.appendTo('#app-mount');
		this.element.css("top", mouseY).css("left", mouseX);
		
		if (depth > 0) {
			var top = this.element.parents(type).last();
			var closest = this.element.parents(type).first();
			var negate = closest.hasClass(DiscordModules.ContextMenuClasses.invertChildX) ? -1 : 1;
			this.element.css("margin-left", negate * closest.find(`.${DiscordModules.ContextMenuClasses.item}`).outerWidth() + closest.offset().left - top.offset().left);
		}
		
		if (mouseY + this.element.outerHeight() >= maxHeight) {
			this.element.addClass("invertY").addClass(DiscordModules.ContextMenuClasses.invertY);
			this.element.css("top", mouseY - this.element.outerHeight());
			if (depth > 0) this.element.css("top", (mouseY + this.element.parent().outerHeight()) - this.element.outerHeight());
		}
		if (this.element.offset().left + this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertX");
			this.element.css("left", mouseX - this.element.outerWidth());
		}
		if (this.element.offset().left + 2 * this.element.outerWidth() >= maxWidth) {
			this.element.addClass(DiscordModules.ContextMenuClasses.invertChildX);
		}

		if (depth == 0) {
			$(document).on("mousedown.zctx", (e) => {
				if (!this.element.has(e.target).length && !this.element.is(e.target)) {
					this.removeMenu();
				}
			});
			$(document).on("click.zctx", (e) => {
				if (this.element.has(e.target).length) {
					if ($._data($(e.target).closest(`.${DiscordModules.ContextMenuClasses.item}`)[0], 'events').click) {
						this.removeMenu();
					}
				}
			});
			$(document).on("keyup.zctx", (e) => {
				if (e.keyCode === 27) {
					this.removeMenu();
				}
			});
		}
	}
    
    /** Allows you to remove the menu. */
	removeMenu() {
		let type = this.element.parents(".plugin-context-menu").length > this.element.parents(`.${DiscordModules.ContextMenuClasses.contextMenu}`).length ? ".plugin-context-menu" : `.${DiscordModules.ContextMenuClasses.contextMenu}`;
		this.element.detach();
		this.element.find(type).detach();
		$(document).off(".zctx");
	}
    
    /**
     * Used to attach a menu to a menu item. This is how to create a submenu.
     * If using {@link PluginContextMenu.SubMenuItem} then you do not need
     * to call this function as it is done automatically. If you want to attach
     * a submenu to an existing Discord context menu, then you should use this
     * method.
     * @param {(HTMLElement|jQuery)} menuItem - item to attach to
     */
	attachTo(menuItem) {
		this.menuItem = $(menuItem);
		menuItem.on("mouseenter", () => {
			this.element.appendTo(menuItem);
			let type = this.element.parents(".plugin-context-menu").length > this.element.parents(`.${DiscordModules.ContextMenuClasses.contextMenu}`).length ? ".plugin-context-menu" : `.${DiscordModules.ContextMenuClasses.contextMenu}`;
			this.show(this.element.parents(type).css("left"), menuItem.offset().top);
		});
		menuItem.on("mouseleave", () => { this.element.detach(); });
	}
};

/** Class that represents a group of menu items. */
PluginContextMenu.ItemGroup = class ItemGroup {
    /** Creates an item group. */
	constructor() {
		this.element = $("<div>").addClass(DiscordModules.ContextMenuClasses.itemGroup);
	}
    
    /**
     * This is the method of adding menu items to a menu group.
     * @param {PluginContextMenu.MenuItem} contextItems - list of context menu items to add to this group
     * @returns {PluginContextMenu.ItemGroup} returns self for chaining
     */
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			this.element.append(contextItems[i].getElement());
		}
		return this;
	}
    
    /** @returns {HTMLElement} returns the DOM node for the group */
	getElement() { return this.element; }
};

/**
 * Fires when the attached menu item it clicked.
 * @param {MouseEvent} event - the mouse event from clicking the item
 * @callback PluginContextMenu~clickEvent
 */

 /**
 * Fires when the checkbox item changes state.
 * @param {boolean} isChecked - if the checkbox is now checked
 * @callback PluginContextMenu~onChange
 */

/** Base class for all other menu items. */
PluginContextMenu.MenuItem = class MenuItem {
    /**
     * @param {string} label - label to show on the menu item
     * @param {object} options - additional options for the item
     * @param {boolean} [options.danger=false] - should the item show as danger
     * @param {PluginContextMenu~clickEvent} [options.callback] - callback for when it is clicked
     */
	constructor(label, options = {}) {
		var {danger = false, callback} = options;
		this.element = $("<div>").addClass(DiscordModules.ContextMenuClasses.item);
		this.label = label;
		if (danger) this.element.addClass(DiscordModules.ContextMenuClasses.danger);
		if (typeof(callback) == 'function') {
			this.element.on("click", (event) => {
				event.stopPropagation();
				callback(event);
			});
		}
	}
	getElement() { return this.element;}
};

/** 
 * Creates a text menu item that can have a hint.
 * @extends PluginContextMenu.MenuItem
 */
PluginContextMenu.TextItem = class TextItem extends PluginContextMenu.MenuItem {
    /**
     * @param {string} label - label to show on the menu item
     * @param {object} options - additional options for the item
     * @param {string} [options.hint=""] - hint to show on the item (usually used for key combos)
     * @param {boolean} [options.danger=false] - should the item show as danger
     * @param {PluginContextMenu~clickEvent} [options.callback] - callback for when it is clicked
     */
	constructor(label, options = {}) {
		super(label, options);
		var {hint = ""} = options;
		this.element.append($("<span>").text(label));
		this.element.append($("<div>").addClass(DiscordModules.ContextMenuClasses.hint).text(hint));
	}
};

/** 
 * Creates an image menu item that can have an image.
 * @extends PluginContextMenu.MenuItem
 */
PluginContextMenu.ImageItem = class ImageItem extends PluginContextMenu.MenuItem {
    /**
     * @param {string} label - label to show on the menu item
     * @param {string} imageSrc - link to the image to embed
     * @param {object} options - additional options for the item
     * @param {string} [options.hint=""] - hint to show on the item (usually used for key combos)
     * @param {boolean} [options.danger=false] - should the item show as danger
     * @param {PluginContextMenu~clickEvent} [options.callback] - callback for when it is clicked
     */
	constructor(label, imageSrc, options = {}) {
		super(label, options);
		this.element.addClass(DiscordModules.ContextMenuClasses.itemImage);
		this.element.append($("<div>").addClass(DiscordModules.ContextMenuClasses.label).text(label));
		this.element.append($("<img>", {src: imageSrc}));
	}
};

/** 
 * Creates a menu item with an attached submenu.
 * @extends PluginContextMenu.MenuItem
 */
PluginContextMenu.SubMenuItem = class SubMenuItem extends PluginContextMenu.MenuItem {
    /**
     * @param {string} label - label to show on the menu item
     * @param {PluginContextMenu.Menu} subMenu - context menu that should be attached to this item
     * @param {object} options - additional options for the item
     * @param {string} [options.hint=""] - hint to show on the item (usually used for key combos)
     * @param {boolean} [options.danger=false] - should the item show as danger
     * @param {PluginContextMenu~clickEvent} [options.callback] - callback for when it is clicked
     */
	constructor(label, subMenu, options = {}) {
		// if (!(subMenu instanceof ContextSubMenu)) throw "subMenu must be of ContextSubMenu type.";
		super(label, options);
		this.element.addClass(DiscordModules.ContextMenuClasses.itemSubMenu).text(label);
		this.subMenu = subMenu;
		this.subMenu.attachTo(this.getElement());
	}
};

/** 
 * Creates a menu item with a checkbox.
 * @extends PluginContextMenu.MenuItem
 */
PluginContextMenu.ToggleItem = class ToggleItem extends PluginContextMenu.MenuItem {
    /**
     * @param {string} label - label to show on the menu item
     * @param {boolean} checked - should the item start out checked
     * @param {object} options - additional options for the item
     * @param {string} [options.hint=""] - hint to show on the item (usually used for key combos)
     * @param {boolean} [options.danger=false] - should the item show as danger
     * @param {PluginContextMenu~clickEvent} [options.callback] - callback for when it is clicked
     * @param {PluginContextMenu~onChange} [options.onChange] - callback for when the checkbox changes
     */
	constructor(label, checked, options = {}) {
        var {onChange} = options;
		super(label, options);
		this.element.addClass(DiscordModules.ContextMenuClasses.itemToggle);
        this.element.append($("<div>").addClass(DiscordModules.ContextMenuClasses.label).text(label));
        this.checkbox = $("<div>", {class: "checkbox"});
        this.checkbox.append($("<div>", {class: "checkbox-inner"}));
        this.checkbox.append("<span>");
        this.input = $("<input>", {type: "checkbox", checked: checked, value: "on"});
        this.checkbox.find('.checkbox-inner').append(this.input).append("<span>");
        this.element.append(this.checkbox);
        this.element.on('click', (e) => {
            e.stopPropagation();
            this.input.prop("checked", !this.input.prop("checked"));
            if (typeof(onChange) == 'function') onChange(this.input.prop("checked"));
        });
	}
};
/* ================== END MODULE ================== */


/**
 * An object that makes generating settings panel 10x easier.
 * @namespace
 * @version 1.0.5
 */
var PluginSettings = {};

/** Attempts to retreive the accent color of native settings items in rgba format. */
PluginSettings.getAccentColor = function() {
	var bg = $('<div class="ui-switch-item"><div class="ui-switch-wrapper"><input type="checkbox" checked="checked" class="ui-switch-checkbox"><div class="ui-switch checked">');
	bg.appendTo($("#bd-settingspane-container"));
	var bgColor = $(".ui-switch.checked").first().css("background-color");
	var afterColor = window.getComputedStyle(bg.find(".ui-switch.checked")[0], ':after').getPropertyValue('background-color'); // For beardy's theme
	bgColor = afterColor == "rgba(0, 0, 0, 0)" ? bgColor : afterColor;
	bg.remove();
	return bgColor;
};

PluginSettings.getCSS = function() {
	return `/* Plugin Settings CSS */

	.plugin-controls input {
		-webkit-box-flex: 1;
		background-color: transparent;
		border: none;
		color: #fff;
		flex: 1;
		line-height: 52px;
		padding: 0;
		z-index: 1;
		-webkit-box-align: center;
		-webkit-box-direction: normal;
		-webkit-box-orient: horizontal;
		align-items: center;
		border: 1px solid rgba(0,0,0,.2);
		background-color: rgba(0,0,0,0.3);
		border-radius: 3px;
		display: flex;
		flex-direction: row;
		height: 40px;
		padding: 0 16px;
		position: relative;
	}

	.plugin-controls input:focus {
		outline: 0;
	}
	
	.plugin-controls input[type=range] {
		-webkit-appearance: none;
		border: none!important;
		border-radius: 5px;
		height: 5px;
		cursor: pointer;
	}
	
	.plugin-controls input[type=range]::-webkit-slider-runnable-track {
		background: 0 0!important;
	}
	
	.plugin-controls input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
		background: #f6f6f7;
		width: 10px;
		height: 20px;
	}
	
	.plugin-controls input[type=range]::-webkit-slider-thumb:hover {
		box-shadow: 0 2px 10px rgba(0,0,0,.5);
	}
	
	.plugin-controls input[type=range]::-webkit-slider-thumb:active {
		box-shadow: 0 2px 10px rgba(0,0,0,1);
	}
	
	.plugin-setting-label {
		color: #f6f6f7;
		font-weight: 500;
	}
	
	.plugin-setting-input-row {
		padding-right: 5px!important;
	}
	
	.plugin-setting-input-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.plugin-control-group .button-collapse {
		background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FscXVlXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSItOTUwIDUzMiAxOCAxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtOTUwIDUzMiAxOCAxODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6bm9uZTt9DQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTS05MzIsNTMydjE4aC0xOHYtMThILTkzMnoiLz4NCjxwb2x5bGluZSBjbGFzcz0ic3QxIiBwb2ludHM9Ii05MzYuNiw1MzguOCAtOTQxLDU0My4yIC05NDUuNCw1MzguOCAiLz4NCjwvc3ZnPg0K);
		height: 16px;
		width: 16px;
		display: inline-block;
		vertical-align: bottom;
		transition: transform .3s ease;
		transform: rotate(0);
	}
	
	.plugin-control-group .button-collapse.collapsed {
		transition: transform .3s ease;
		transform: rotate(-90deg);
	}
	
	.plugin-control-group h2 {
		font-size: 14px;
	}
	
	.plugin-controls .plugin-setting-input-container,.plugin-controls .ui-switch-wrapper {
		margin-top: 5px;
	}
	
	.plugin-controls.collapsed {
		display: none;
	}
	
	.plugin-controls {
		display: block;
	}
	`;
};

PluginSettings.createInputContainer = function() { return $('<div class="plugin-setting-input-container">');};


/** 
 * Grouping of controls for easier management in settings panels.
 * @version 1.0.1
 */
PluginSettings.ControlGroup = class ControlGroup {
    /**
     * 
     * @constructor
     * @param {string} groupName - title for the group of settings
     * @param {callback} callback - callback called on settings changed
     * @param {object} options - additional options for the group
     * @param {boolean} [options.collapsible=true] - determines if the group should be collapsible
     * @param {boolean} [options.shown=false] - determines if the group should be expanded by default
     */
	constructor(groupName, callback, options = {}) {
		const {collapsible = true, shown = false} = options;
		this.group = $("<div>").addClass("plugin-control-group").css("margin-top", "15px");
		var collapsed = shown || !collapsible ? '' : ' collapsed';
		var label = $('<h2>').html('<span class="button-collapse' + collapsed + '" style=""></span> ' + groupName);
		label.attr("class", `${DiscordModules.SettingsMetaClasses.h5} ${DiscordModules.SettingsMetaClasses.defaultMarginh5}`);
		this.group.append(label);
		this.controls = $('<div class="plugin-controls collapsible' + collapsed + '">');
		this.group.append(this.controls);
		if (collapsible) {
			label.on('click', (e) => {
				let button = $(e.target).find('.button-collapse');
				let wasCollapsed = button.hasClass('collapsed');
				this.group.parent().find('.collapsible:not(.collapsed)').slideUp({duration: 300, easing: "easeInSine", complete: function() { $(this).addClass('collapsed'); }}); // .slideUp({duration: 300, easing: "easeInSine"})
				this.group.parent().find('.button-collapse').addClass('collapsed');
				if (wasCollapsed) {
					this.controls.slideDown({duration: 300, easing: "easeInSine"});
					this.controls.removeClass('collapsed');
					button.removeClass('collapsed');
				}
			});
		}
		
		if (typeof callback != 'undefined') {
			this.controls.on("change", "input", callback);
		}
	}
    
    /** @returns {jQuery} jQuery node for the group. */
	getElement() {return this.group;}
    
    /**
     * 
     * @param {(...HTMLElement|...jQuery)} nodes - list of nodes to add to the group container 
     * @returns {ControlGroup} returns self for chaining
     */
	append(...nodes) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] instanceof jQuery || nodes[i] instanceof Element) this.controls.append(nodes[i]);
			else if (nodes[i] instanceof PluginSettings.SettingField) this.controls.append(nodes[i].getElement());
		}
		return this;
	}
    
    /**
     * 
     * @param {(HTMLElement|jQuery)} node - node to attach the group to.
     * @returns {ControlGroup} returns self for chaining
     */
	appendTo(node) {
		this.group.appendTo(node);
		return this;
	}
};

/**
 * Callback for SettingField for change in input field.
 * @callback PluginSettings~settingsChanged
 * @param {*} value - new value of the input field
 */

/** 
 * Generic representation of a setting field. Very extensible, but best to use a child class when available.
 * @version 1.0.5
 */
PluginSettings.SettingField = class SettingField {
    /**
     * @constructor
     * @param {string} name - title for the setting
     * @param {string} helptext - description/help text to show
     * @param {object} inputData - props to set up the input field
     * @param {PluginSettings~settingsChanged} callback - callback fired when the input field is changed
     */
	constructor(name, helptext, inputData, callback) {
		this.name = name;
		this.helptext = helptext;
		this.row = $("<div>").addClass("ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item").css("margin-top", 0);
		this.top = $("<div>").addClass("ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap plugin-setting-input-row");
		this.settingLabel = $("<h3>").attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child").text(name);
		
		this.help = $("<div>").addClass("ui-form-text style-description margin-top-4").css("flex", "1 1 auto").text(helptext);
		
		this.top.append(this.settingLabel);
		this.inputWrapper = $("<div>", {class: "input-wrapper"});
		this.top.append(this.inputWrapper);
		this.row.append(this.top, this.help);
		
		this.input = $("<input>", inputData);
		this.input.addClass('plugin-input');
		this.getValue = () => {return this.input.val();};
		this.processValue = (value) => {return value;};
		this.input.on("keyup change", () => {
			if (typeof callback != 'undefined') {
				var returnVal = this.getValue();
				callback(returnVal);
			}
		});

		this.setInputElement(this.input);
	}
    
    /**
     * Performing this will prevent the default callbacks from working!
     * @param {(HTMLElement|jQuery)} node - node to override the default input with.
     */
	setInputElement(node) {
		this.inputWrapper.empty();
		this.inputWrapper.append(node);
	}
    
    /** @returns {jQuery} jQuery node for the group. */
	getElement() { return this.row; }
};

/** 
 * Creates a simple textbox settings.
 * @version 1.0.0
 * @extends PluginSettings.SettingField
 */
PluginSettings.Textbox = class Textbox extends PluginSettings.SettingField {
    /**
     * @constructor
     * @param {string} label - title for the setting
     * @param {string} help - description of the setting
     * @param {string} value - default value of the setting
     * @param {string} placeholder - placeholder text for when the textbox is empty
     * @param {PluginSettings~settingsChanged} callback - callback fired on textbox change
     * @param {object} options - additional options for the input field itself
     */
	constructor(label, help, value, placeholder, callback, options = {}) {
		options.type = "text";
		options.placeholder = placeholder;
		options.value = value;
		super(label, help, options, callback);
		this.input.addClass('plugin-input-text');
	}
};

/** 
 * Creates a color picker using chromium's built in color picker
 * as a base. Input and output using hex strings.
 * @version 1.0.0
 * @extends PluginSettings.SettingField
 */
PluginSettings.ColorPicker = class ColorPicker extends PluginSettings.SettingField {
    /**
     * @constructor
     * @param {string} label - title for the setting
     * @param {string} help - description of the setting
     * @param {string} value - default value of the setting in hex format
     * @param {PluginSettings~settingsChanged} callback - callback fired on color change
     * @param {object} options - additional options for the input field itself
     */
	constructor(label, help, value, callback, options = {}) {
		options.type = "color";
		options.value = value;
		super(label, help, options, callback);
		this.input.css("margin-left", "10px");
		this.input.addClass('plugin-input-color');
		
		var settingLabel = $('<span class="plugin-setting-label">').text(value);
		
		this.input.on("input", function() {
			settingLabel.text($(this).val());
		});
		
		this.setInputElement(PluginSettings.createInputContainer().append(settingLabel, this.input));
	}
};

/** 
 * Creates a slider where the user can select a single number from a predefined range.
 * @version 1.0.0
 * @extends PluginSettings.SettingField
 */
PluginSettings.Slider = class Slider extends PluginSettings.SettingField {
    /**
     * @constructor
     * @param {string} settingLabel - title for the setting
     * @param {string} help - description of the setting
     * @param {number} min - minimum value allowed
     * @param {number} max - maximum value allowed
     * @param {number} step - granularity between values
     * @param {number} value - default value of the setting
     * @param {PluginSettings~settingsChanged} callback - callback fired on slider release
     * @param {object} options - additional options for the input field itself
     */
	constructor(settingLabel, help, min, max, step, value, callback, options = {}) {
		options.type = "range";
		options.min = min;
		options.max = max;
		options.step = step;
		options.value = parseFloat(value);
		super(settingLabel, help, options, callback);
		this.value = parseFloat(value); this.min = min; this.max = max;
		
		this.getValue = () => { return parseFloat(this.input.val()); };
		
		this.accentColor = PluginSettings.getAccentColor();
		this.setBackground();
		this.input.css("margin-left", "10px").css("float", "right");
		this.input.addClass('plugin-input-range');
		
		this.labelUnit = "";
		this.label = $('<span class="plugin-setting-label">').text(this.value + this.labelUnit);
		
		this.input.on("input", () => {
			this.value = parseFloat(this.input.val());
			this.label.text(this.value + this.labelUnit);
			this.setBackground();
		});
		
		this.setInputElement(PluginSettings.createInputContainer().append(this.label,this.input));
	}
	
	getPercent() { return ((this.value - this.min) / this.max) * 100; }

	setBackground() {
		var percent = this.getPercent();
		this.input.css('background', 'linear-gradient(to right, ' + this.accentColor + ', ' + this.accentColor + ' ' + percent + '%, #72767d ' + percent + '%)');
	}

    /**
     * Adds a unit to the value label
     * @param {string} unit - unit to add to the label (e.g. "%")
     */
	setLabelUnit(unit) {this.labelUnit = unit; this.label.text(this.value + this.labelUnit); return this;}
};

/** 
 * Creates a checkbox in the style of a standard Discord switch.
 * @version 1.0.0
 * @extends PluginSettings.SettingField
 */
PluginSettings.Checkbox = class Checkbox extends PluginSettings.SettingField {
    /**
     * @constructor
     * @param {string} label - title for the setting
     * @param {string} help - description of the setting
     * @param {boolean} isChecked - determines if the checkbox is checked by default
     * @param {PluginSettings~settingsChanged} callback - callback fired on change
     * @param {object} options - additional options for the input field itself
     */
	constructor(label, help, isChecked, callback, options = {}) {
		options.type = "checkbox";
		options.checked = isChecked;
		super(label, help, options, callback);
		this.getValue = () => { return this.input.prop("checked"); };
		this.input.addClass("ui-switch-checkbox");
		this.input.addClass('plugin-input-checkbox');

		this.input.on("change", function() {
			if ($(this).prop("checked")) switchDiv.addClass("checked");
			else switchDiv.removeClass("checked");
		});
		
		this.checkboxWrap = $('<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">');
		this.checkboxWrap.append(this.input);
		var switchDiv = $('<div class="ui-switch">');
		if (isChecked) switchDiv.addClass("checked");
		this.checkboxWrap.append(switchDiv);
		this.checkboxWrap.css("right", "0px");

		this.setInputElement(this.checkboxWrap);
	}
};

/** 
 * Creates a PillButton where the left and right side have their own label.
 * It is important to note that the checked property here follows the same
 * standard as a normal Discord switch. That is to say if the value is true
 * then right side was selected, if the value is false then the left side 
 * was selected.
 * @version 1.0.1
 * @extends PluginSettings.Checkbox
 */
PluginSettings.PillButton = class PillButton extends PluginSettings.Checkbox {
    /**
     * @constructor
     * @param {string} label - title for the setting
     * @param {string} help - description of the setting
     * @param {string} leftLabel - label for the option on the left
     * @param {string} rightLabel - label for the option on the right
     * @param {boolean} isRightSelected - determines if the right side is selected. (true = right side, false = left side)
     * @param {PluginSettings~settingsChanged} callback - callback fired on switch change (true = right side, false = left side)
     * @param {object} options - additional options for the input field itself
     */
	constructor(label, help, leftLabel, rightLabel, isRightSelected, callback, options = {}) {
		super(label, help, isRightSelected, callback, options);
		
		this.checkboxWrap.css("margin","0 9px");
		this.input.addClass('plugin-input-pill');
		
		var labelLeft = $('<span class="plugin-setting-label left">');
		labelLeft.text(leftLabel);
		var labelRight = $('<span class="plugin-setting-label right">');
		labelRight.text(rightLabel);
		
		var accent = PluginSettings.getAccentColor();
		
		if (isRightSelected) labelRight.css("color", accent);
		else labelLeft.css("color", accent);
		
		this.checkboxWrap.find('input').on("click", function() {
			var checked = $(this).prop("checked");
			if (checked) {
				labelRight.css("color", accent);
				labelLeft.css("color", "");
			}
			else {
				labelLeft.css("color", accent);
				labelRight.css("color", "");
			}
		});
		
		this.setInputElement(PluginSettings.createInputContainer().append(labelLeft, this.checkboxWrap.detach(), labelRight));
	}
};
/* ================== END MODULE ================== */


/** 
 * Tooltips that automatically show and hide themselves on mouseenter and mouseleave events.
 * Will also remove themselves if the node to watch is removed from DOM through
 * a MutationObserver.
 * @namespace
 * @version 0.1.1
 */
var PluginTooltip = {};

// example usage `new PluginTooltip.Tooltip($('#test-element), "Hello World", {side: "top"});`

/** 
 * Custom tooltip, not using internals. 
 * @version 0.1.0
 */
PluginTooltip.Tooltip = class PluginTooltip {
	/**
	 * 
	 * @constructor
	 * @param {(HTMLElement|jQuery)} node - DOM node to monitor and show the tooltip on
	 * @param {string} tip - string to show in the tooltip
	 * @param {object} options - additional options for the tooltip
	 * @param {string} [options.style=black] - correlates to the discord styling
	 * @param {string} [options.side=top] - can be any of top, right, bottom, left
	 * @param {boolean} [options.preventFlip=false] - prevents moving the tooltip to the opposite side if it is too big or goes offscreen
	 */
	constructor(node, tip, options = {}) {
		const {style = "black", side = "top", preventFlip = false} = options;
		this.node = node;
		this.tip = tip;
		this.side = side;
		this.preventFlip = preventFlip;
		this.tooltip = $(`<div class="tooltip tooltip-${style}">`);
		this.tooltip.text(tip);

		node.on('mouseenter.tooltip', () => {
            this.show();
			
			var observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					var nodes = Array.from(mutation.removedNodes);
					var directMatch = nodes.indexOf(node[0]) > -1;
					var parentMatch = nodes.some(parent => parent.contains(node[0]));
					if (directMatch || parentMatch) {
						this.tooltip.detach();
						observer.disconnect();
					}
				});
			});

			observer.observe(document.body, {subtree: true, childList: true});
		});

		node.on('mouseleave.tooltip', () => {
			this.tooltip.detach();
		});
	}

    /** Boolean representing if the tooltip will fit on screen above the element */
    get canShowAbove() { return this.node.offset().top - this.tooltip.outerHeight() >= 0; }
    /** Boolean representing if the tooltip will fit on screen below the element */
    get canShowBelow() { return this.node.offset().top + this.node.outerHeight() + this.tooltip.outerHeight() <= window.ZeresLibrary.Screen.height; }
    /** Boolean representing if the tooltip will fit on screen to the left of the element */
    get canShowLeft() { return this.node.offset().left - this.tooltip.outerWidth() >= 0; }
    /** Boolean representing if the tooltip will fit on screen to the right of the element */
	get canShowRight() { return this.node.offset().left + this.node.outerWidth() + this.tooltip.outerWidth() <= window.ZeresLibrary.Screen.width; }

    /** Hides the tooltip. Automatically called on mouseleave. */
	hide() {
		this.tooltip.hide();
	}

    /** Shows the tooltip. Automatically called on mouseenter. Will attempt to flip if position was wrong. */
	show() {
		this.tooltip.show();
		this.tooltip.removeClass("tooltip-bottom");
		this.tooltip.removeClass("tooltip-top");
		this.tooltip.removeClass("tooltip-left");
		this.tooltip.removeClass("tooltip-right");
		this.tooltip.appendTo('.tooltips');

		if (this.side == "top") {
			if (this.canShowAbove || (!this.canShowAbove && this.preventFlip)) this.showAbove();
			else this.showBelow();
		}

		if (this.side == "bottom") {
			if (this.canShowBelow || (!this.canShowBelow && this.preventFlip)) this.showBelow();
			else this.showAbove();
		}

		if (this.side == "left") {
			if (this.canShowLeft || (!this.canShowLeft && this.preventFlip)) this.showLeft();
			else this.showRight();
		}

		if (this.side == "right") {
			if (this.canShowRight || (!this.canShowRight && this.preventFlip)) this.showRight();
			else this.showLeft();
		}
	}

    /** Force showing the tooltip above the node. */
	showAbove() {
		this.tooltip.addClass("tooltip-top");
		this.tooltip.css("top", this.node.offset().top - this.tooltip.outerHeight());
		this.centerHorizontally();
	}

    /** Force showing the tooltip below the node. */
	showBelow() {
		this.tooltip.addClass("tooltip-bottom");
		this.tooltip.css("top", this.node.offset().top + this.node.outerHeight());
		this.centerHorizontally();
	}

    /** Force showing the tooltip to the left of the node. */
	showLeft() {
		this.tooltip.addClass("tooltip-left");
		this.tooltip.css("left", this.node.offset().left - this.tooltip.outerWidth());
		this.centerVertically();
	}

    /** Force showing the tooltip to the right of the node. */
	showRight() {
		this.tooltip.addClass("tooltip-right");
		this.tooltip.css("left", this.node.offset().left + this.node.outerWidth());
		this.centerVertically();
	}

	centerHorizontally() {
		var nodecenter = this.node.offset().left + (this.node.outerWidth() / 2);
		this.tooltip.css("left", nodecenter - (this.tooltip.outerWidth() / 2));
	}

	centerVertically() {
		var nodecenter = this.node.offset().top + (this.node.outerHeight() / 2);
		this.tooltip.css("top", nodecenter - (this.tooltip.outerHeight() / 2));
	}
};


/** 
 * Tooltips done using Discord's internals.
 * @version 0.0.1
 */
PluginTooltip.Native = class NativeTooltip {
	/**
	 * 
	 * @constructor
	 * @param {(HTMLElement|jQuery)} node - DOM node to monitor and show the tooltip on
	 * @param {string} tip - string to show in the tooltip
	 * @param {object} options - additional options for the tooltip
	 * @param {string} [options.style=black] - correlates to the discord styling
	 * @param {string} [options.side=top] - can be any of top, right, bottom, left
	 * @param {boolean} [options.preventFlip=false] - prevents moving the tooltip to the opposite side if it is too big or goes offscreen
	 */
	constructor(node, text, options = {}) {
		if (!(node instanceof jQuery) && !(node instanceof Element)) return undefined;
		this.node = node instanceof jQuery ? node[0] : node;
		const {style = "black", side = "top"} = options;
		this.label = text;
		this.style = style;
		this.side = side;
		this.id = DiscordModules.KeyGenerator();

		this.node.addEventListener('mouseenter', () => {
			this.show();

			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					const nodes = Array.from(mutation.removedNodes);
					const directMatch = nodes.indexOf(this.node) > -1;
					const parentMatch = nodes.some(parent => parent.contains(this.node));
					if (directMatch || parentMatch) {
						this.hide();
						observer.disconnect();
					}
				});
			});

			observer.observe(document.body, {subtree: true, childList: true});
		});

		this.node.addEventListener('mouseleave', () => {
			this.hide();
		});
	}

    /** Hides the tooltip. Automatically called on mouseleave. */
	hide() {
		DiscordModules.Tooltips.hide(this.id);
    }
    
    /** Shows the tooltip. Automatically called on mouseenter. */
	show() {
		const {left, top, width, height} = this.node.getBoundingClientRect();
		DiscordModules.Tooltips.show(this.id, {
			position: this.side,
			text: this.label,
			color: this.style,
			targetWidth: width,
			targetHeight: height,
			x: left,
			y: top
		});
	}
};
/* ================== END MODULE ================== */


/**
 * Functions that check for and update existing plugins.
 * @namespace
 * @version 0.0.3
 */
var PluginUpdateUtilities = {};

/**
 * Creates the update button found in the plugins page of BetterDiscord
 * settings. Returned button will already have listeners to create the tooltip.
 * @returns {HTMLElement} check for update button
 */
PluginUpdateUtilities.createUpdateButton = function() {
	var updateButton = document.createElement("button");
	updateButton.className = "bd-pfbtn bd-updatebtn";
	updateButton.innerText = "Check for Updates";
	updateButton.style.left = "220px";
	updateButton.onclick = function () {
		window.PluginUpdates.checkAll();
	};
	let tooltip = new PluginTooltip.Tooltip($(updateButton), "Checks for updates of plugins that support this feature. Right-click for a list.");
	updateButton.oncontextmenu = function () {
		if (window.PluginUpdates && window.PluginUpdates.plugins) {
			var list = [];
			for (var plugin in window.PluginUpdates.plugins) {
				list.push(window.PluginUpdates.plugins[plugin].name);
			}
			tooltip.tooltip.detach();
			tooltip.tooltip.text(list.join(", "));
			tooltip.show();
			updateButton.onmouseout = function() { tooltip.tooltip.text(tooltip.tip); };
		}
	};
	return updateButton;
};

PluginUpdateUtilities.getCSS = function () {
	return "#pluginNotice {-webkit-app-region: drag;border-radius:0;} #outdatedPlugins {font-weight:700;} #outdatedPlugins>span {-webkit-app-region: no-drag;color:#fff;cursor:pointer;} #outdatedPlugins>span:hover {text-decoration:underline;}";
};

/**
 * Will check for updates and automatically show or remove the update notice
 * bar based on the internal result. Better not to call this directly and to
 * instead use {@link PluginUtilities.checkForUpdate}.
 * @param {string} pluginName - name of the plugin to check
 * @param {string} updateLink - link to the raw text version of the plugin
 */
PluginUpdateUtilities.checkUpdate = function(pluginName, updateLink) {
	let request = require("request");
	request(updateLink, (error, response, result) => {
		if (error) return;
		var remoteVersion = result.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i);
		if (!remoteVersion) return;
		remoteVersion = remoteVersion.toString().replace(/['"]/g, "");
		var ver = remoteVersion.split(".").map((e) => {return parseInt(e);});
		var lver = window.PluginUpdates.plugins[updateLink].version.split(".").map((e) => {return parseInt(e);});
		var hasUpdate = false;
		if (ver[0] > lver[0]) hasUpdate = true;
		else if (ver[0] == lver[0] && ver[1] > lver[1]) hasUpdate = true;
		else if (ver[0] == lver[0] && ver[1] == lver[1] && ver[2] > lver[2]) hasUpdate = true;
		else hasUpdate = false;
		if (hasUpdate) PluginUpdateUtilities.showUpdateNotice(pluginName, updateLink);
		else PluginUpdateUtilities.removeUpdateNotice(pluginName);
	});
};

/**
 * Will show the update notice top bar seen in Discord. Better not to call
 * this directly and to instead use {@link PluginUtilities.checkForUpdate}.
 * @param {string} pluginName - name of the plugin
 * @param {string} updateLink - link to the raw text version of the plugin
 */
PluginUpdateUtilities.showUpdateNotice = function(pluginName, updateLink) {
	if (!$('#pluginNotice').length)  {
		let noticeElement = `<div class="${DiscordModules.NoticeBarClasses.notice} ${DiscordModules.NoticeBarClasses.noticeInfo}" id="pluginNotice"><div class="${DiscordModules.NoticeBarClasses.dismiss}" id="pluginNoticeDismiss"></div><span class="notice-message">The following plugins have updates:</span>&nbsp;&nbsp;<strong id="outdatedPlugins"></strong></div>`;
		// $('.app .guilds-wrapper + div > div:first > div:first').append(noticeElement);
		$('.app.flex-vertical').children().first().before(noticeElement);
        $('.win-buttons').addClass("win-buttons-notice");
		$('#pluginNoticeDismiss').on('click', () => {
			$('.win-buttons').animate({top: 0}, 400, "swing", () => { $('.win-buttons').css("top","").removeClass("win-buttons-notice"); });
			$('#pluginNotice').slideUp({complete: () => { $('#pluginNotice').remove(); }});
		});
	}
	let pluginNoticeID = pluginName + '-notice';
	if (!$('#' + pluginNoticeID).length) {
		let pluginNoticeElement = $('<span id="' + pluginNoticeID + '">');
        pluginNoticeElement.text(pluginName);
        pluginNoticeElement.on('click', () => {
            PluginUpdateUtilities.downloadPlugin(pluginName, updateLink);
        });
		if ($('#outdatedPlugins').children('span').length) $('#outdatedPlugins').append("<span class='separator'>, </span>");
		$('#outdatedPlugins').append(pluginNoticeElement);
	}
};

/**
 * Will download the latest version and replace the the old plugin version.
 * Will also update the button in the update bar depending on if the user
 * is using RestartNoMore plugin by square {@link https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/restartNoMore.plugin.js}
 * @param {string} pluginName - name of the plugin to download
 * @param {string} updateLink - link to the raw text version of the plugin
 */
PluginUpdateUtilities.downloadPlugin = function(pluginName, updateLink) {
    let request = require("request");
    let fileSystem = require("fs");
    let path = require("path");
    request(updateLink, (error, response, body) => {
        if (error) return console.warn("Unable to get update for " + pluginName);
        let remoteVersion = body.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i);
        remoteVersion = remoteVersion.toString().replace(/['"]/g, "");
        let filename = updateLink.split('/');
        filename = filename[filename.length - 1];
        var file = path.join(PluginUtilities.getPluginsFolder(), filename);
        fileSystem.writeFileSync(file, body);
		PluginUtilities.showToast(`${pluginName} ${window.PluginUpdates.plugins[updateLink].version} has been replaced by ${pluginName} ${remoteVersion}`);
		let oldRNM = window.bdplugins["Restart-No-More"] && window.pluginCookie["Restart-No-More"];
		let newRNM = window.bdplugins["Restart No More"] && window.pluginCookie["Restart No More"];
        if (!(oldRNM || newRNM)) {
            if (!window.PluginUpdates.downloaded) {
                window.PluginUpdates.downloaded = [];
                let button = $(`<button class="btn btn-reload ${DiscordModules.NoticeBarClasses.btn} ${DiscordModules.NoticeBarClasses.button}">Reload</button>`);
                button.on('click', (e) => {
                    e.preventDefault();
                    window.location.reload(false);
                });
                var tooltip = document.createElement("div");
                tooltip.className = "tooltip tooltip-bottom tooltip-black";
                tooltip.style.maxWidth = "400px";
                button.on('mouseenter', () => {
                    document.querySelector(".tooltips").appendChild(tooltip);
                    tooltip.innerText = window.PluginUpdates.downloaded.join(", ");
                    tooltip.style.left = button.offset().left + (button.outerWidth() / 2) - ($(tooltip).outerWidth() / 2) + "px";
                    tooltip.style.top = button.offset().top + button.outerHeight() + "px";
                });
    
                button.on('mouseleave', () => {
                    tooltip.remove();
                });
    
                button.appendTo($('#pluginNotice'));
            }
            window.PluginUpdates.plugins[updateLink].version = remoteVersion;
            window.PluginUpdates.downloaded.push(pluginName);
            PluginUpdateUtilities.removeUpdateNotice(pluginName);
        }
    });
};

/**
 * Will remove the plugin from the update notice top bar seen in Discord.
 * Better not to call this directly and to instead use {@link PluginUtilities.checkForUpdate}.
 * @param {string} pluginName - name of the plugin
 */
PluginUpdateUtilities.removeUpdateNotice = function(pluginName) {
	let notice = $('#' + pluginName + '-notice');
	if (notice.length) {
		if (notice.next('.separator').length) notice.next().remove();
		else if (notice.prev('.separator').length) notice.prev().remove();
		notice.remove();
    }

	if (!$('#outdatedPlugins').children('span').length && !$('#pluginNotice .btn-reload').length) {
        $('#pluginNoticeDismiss').click();
    } 
    else if (!$('#outdatedPlugins').children('span').length && $('#pluginNotice .btn-reload').length) {
        $('#pluginNotice .notice-message').text("To finish updating you need to reload.");
    }
};
/* ================== END MODULE ================== */


/**
 * A series of useful functions for BetterDiscord plugins.
 * @namespace
 * @version 0.2.3
 */
var PluginUtilities = {};

/** 
 * Additional reference to {@link InternalUtilities.WebpackModules}
 * @deprecated to be removed by end of April 2018
 */
PluginUtilities.WebpackModules = InternalUtilities.WebpackModules;

/**
 * Wraps the method in a `try..catch` block.
 * @param {callable} method - method to wrap
 * @param {string} description - description of method
 * @returns {callable} wrapped version of method
 */
PluginUtilities.suppressErrors = (method, description) => (...params) => {
	try { return method(...params);	}
	catch (e) { console.error('Error occurred in ' + description, e); }
};

PluginUtilities.parseOnSwitchURL = function(url) {
	let urlSplit = url.split("/");
	let type = urlSplit[3];
	let server = urlSplit[4];
	let channel = urlSplit[5];
	return {type, server, channel};
};

/** 
 * Gets the server the user is currently in.
 * @returns {object} returns Discord's internal object representing the server
*/
PluginUtilities.getCurrentServer = function() {
	return DiscordModules.GuildStore.getGuild(DiscordModules.SelectedGuildStore.getGuildId());
};

/** @returns if the user is in a server */
PluginUtilities.isServer = function() { return PluginUtilities.getCurrentServer() !== null; };

/** 
 * Gets the current user.
 * @returns {object} returns Discord's internal object representing the user
*/
PluginUtilities.getCurrentUser = function() {
	return DiscordModules.UserStore.getCurrentUser();
};

/** 
 * Gets the list of members in the current server.
 * @returns {array} returns an array of Discord's internal object representing the members.
*/
PluginUtilities.getAllUsers = function() {
	return DiscordModules.GuildMemberStore.getMembers(this.getCurrentServer().id);
};

/** 
 * Loads data through BetterDiscord's API.
 * @param {string} name - name for the file (usually plugin name)
 * @param {string} key - which key the data is saved under
 * @param {object} defaultData - default data to populate the object with
 * @returns {object} the combined saved and default data
*/
PluginUtilities.loadData = function(name, key, defaultData) {
	try { return $.extend(true, defaultData ? defaultData : {}, bdPluginStorage.get(name, key)); }
	catch (err) { console.warn(name, "unable to load data:", err); }
};

/** 
 * Saves data through BetterDiscord's API.
 * @param {string} name - name for the file (usually plugin name)
 * @param {string} key - which key the data should be saved under
 * @param {object} data - data to save
*/
PluginUtilities.saveData = function(name, key, data) {
	try { bdPluginStorage.set(name, key, data); }
	catch (err) { console.warn(name, "unable to save data:", err); }
};

/** 
 * Loads settings through BetterDiscord's API.
 * @param {string} name - name for the file (usually plugin name)
 * @param {object} defaultData - default data to populate the object with
 * @returns {object} the combined saved and default settings
*/
PluginUtilities.loadSettings = function(name, defaultSettings) {
	return PluginUtilities.loadData(name, "settings", defaultSettings);
};

/** 
 * Saves settings through BetterDiscord's API.
 * @param {string} name - name for the file (usually plugin name)
 * @param {object} data - settings to save
*/
PluginUtilities.saveSettings = function(name, data) {
	PluginUtilities.saveData(name, "settings", data);
};

/**
 * Checks for updates for the specified plugin at the specified link. The final
 * parameter should link to the raw text of the plugin and will compare semantic
 * versions.
 * @param {string} pluginName - name of the plugin
 * @param {string} currentVersion - current version (semantic versioning only)
 * @param {string} updateURL - url to check for update
 */
PluginUtilities.checkForUpdate = function(pluginName, currentVersion, updateURL) {
	let updateLink = "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/" + pluginName + "/" + pluginName + ".plugin.js";
	if (updateURL) updateLink = updateURL;
	
	if (typeof window.PluginUpdates === "undefined") window.PluginUpdates = {plugins:{}};
	window.PluginUpdates.plugins[updateLink] = {name: pluginName, raw: updateLink, version: currentVersion};

	PluginUpdateUtilities.checkUpdate(pluginName, updateLink);
	
	if (typeof window.PluginUpdates.interval === "undefined") {
		window.PluginUpdates.interval = setInterval(() => {
			window.PluginUpdates.checkAll();
		}, 7200000);
	}

	if (typeof window.PluginUpdates.checkAll === "undefined") {
		window.PluginUpdates.checkAll = function() {
			for (let key in this.plugins) {
				let plugin = this.plugins[key];
				PluginUpdateUtilities.checkUpdate(plugin.name, plugin.raw);
			}
		};
	}

	if (typeof window.PluginUpdates.observer === "undefined") {		
		window.PluginUpdates.observer = new MutationObserver((changes) => {
			changes.forEach(
				(change) => {
					if (change.addedNodes) {
						change.addedNodes.forEach((node) => {
							if (node && node.tagName && node.getAttribute("layer-id") == "user-settings") {
								var settingsObserver = new MutationObserver((changes2) => {
									changes2.forEach(
										(change2) => {
											if (change2.addedNodes) {
												change2.addedNodes.forEach((node2) => {
													if (!document.querySelector(".bd-updatebtn")) {
														if (node2 && node2.tagName && node2.querySelector(".bd-pfbtn") && node2.querySelector("h2") && node2.querySelector("h2").innerText.toLowerCase() === "plugins") {

															node2.querySelector(".bd-pfbtn").parentElement.insertBefore(PluginUpdateUtilities.createUpdateButton(), node2.querySelector(".bd-pfbtn").nextSibling);
														}
													}
												});
											}
										}
									);
								});
								settingsObserver.observe(node, {childList:true, subtree:true});
							}
						});
					}
				}
			);
		});
		window.PluginUpdates.observer.observe(document.querySelector(".layers-3iHuyZ, .layers-20RVFW"), {childList:true});
	}
	
	var bdbutton = document.querySelector(".bd-pfbtn");
	if (bdbutton && bdbutton.parentElement.querySelector("h2") && bdbutton.parentElement.querySelector("h2").innerText.toLowerCase() === "plugins" && !bdbutton.parentElement.querySelector(".bd-pfbtn.bd-updatebtn")) {
		bdbutton.parentElement.insertBefore(PluginUpdateUtilities.createUpdateButton(), bdbutton.nextSibling);
	}
};

PluginUtilities.getToastCSS = function() {
	return `/* Toast CSS */
	
	.toasts {
		position: fixed;
		display: flex;
		top: 0;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		pointer-events: none;
		z-index: 4000;
	}
	
	@keyframes toast-up {
		from {
			transform: translateY(0);
			opacity: 0;
		}
	}
	
	.toast {
		animation: toast-up 300ms ease;
		transform: translateY(-10px);
		background: #36393F;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);
		font-weight: 500;
		color: #fff;
		user-select: text;
		font-size: 14px;
		opacity: 1;
		margin-top: 10px;
	}
	
	@keyframes toast-down {
		to {
			transform: translateY(0px);
			opacity: 0;
		}
	}
	
	.toast.closing {
		animation: toast-down 200ms ease;
		animation-fill-mode: forwards;
		opacity: 1;
		transform: translateY(-10px);
	}
	
	
	.toast.icon {
		padding-left: 30px;
		background-size: 20px 20px;
		background-repeat: no-repeat;
		background-position: 6px 50%;
	}
	
	.toast.toast-info {
		background-color: #4a90e2;
	}
	
	.toast.toast-info.icon {
		background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=);
	}
	
	.toast.toast-success {
		background-color: #43b581;
	}
	
	.toast.toast-success.icon {
		background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=);
	}
	.toast.toast-danger, .toast.toast-error {
		background-color: #f04747;
	}
	
	.toast.toast-danger.icon,
	.toast.toast-error.icon {
		background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTEyIDJDNi40NyAyIDIgNi40NyAyIDEyczQuNDcgMTAgMTAgMTAgMTAtNC40NyAxMC0xMFMxNy41MyAyIDEyIDJ6bTUgMTMuNTlMMTUuNTkgMTcgMTIgMTMuNDEgOC40MSAxNyA3IDE1LjU5IDEwLjU5IDEyIDcgOC40MSA4LjQxIDcgMTIgMTAuNTkgMTUuNTkgNyAxNyA4LjQxIDEzLjQxIDEyIDE3IDE1LjU5eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
	}
	
	.toast.toast-warning,
	.toast.toast-warn {
		background-color: #FFA600;
		color: white;
	}
	
	.toast.toast-warning.icon,
	.toast.toast-warn.icon {
		background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMSAyMWgyMkwxMiAyIDEgMjF6bTEyLTNoLTJ2LTJoMnYyem0wLTRoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==);
	}
		`;
};

/**
 * This shows a toast similar to android towards the bottom of the screen.
 * 
 * @param {string} content The string to show in the toast.
 * @param {object} options Options object. Optional parameter.
 * @param {string} options.type Changes the type of the toast stylistically and semantically. Choices: "", "info", "success", "danger"/"error", "warning"/"warn". Default: ""
 * @param {boolean} options.icon Determines whether the icon should show corresponding to the type. A toast without type will always have no icon. Default: true
 * @param {number} options.timeout Adjusts the time (in ms) the toast should be shown for before disappearing automatically. Default: 3000
 */

/**
 * Shows a simple toast, similar to Android, centered over 
 * the textarea if it exists, and center screen otherwise.
 * Vertically it shows towards the bottom like in Android.
 * @param {string} content - The string to show in the toast.
 * @param {object} options - additional options for the toast
 * @param {string} [options.type=""] - Changes the type of the toast stylistically and semantically. Choices: "", "info", "success", "danger"/"error", "warning"/"warn".
 * @param {boolean} [options.icon=true] - Determines whether the icon should show corresponding to the type. A toast without type will always have no icon.
 * @param {number} [options.timeout=3000] - Adjusts the time (in ms) the toast should be shown for before disappearing automatically.
 */
PluginUtilities.showToast = function(content, options = {}) {
    if (!document.querySelector('.toasts')) {
		let container = document.querySelector('.channels-3g2vYe + div, .channels-Ie2l6A + div');
		let memberlist = container.querySelector('.membersWrap-2h-GB4');
		let form = container ? container.querySelector('form') : null;
		let left = container ? container.getBoundingClientRect().left : 310;
		let right = memberlist ? memberlist.getBoundingClientRect().left : 0;
		let width = right ? right - container.getBoundingClientRect().left : container.offsetWidth;
		let bottom = form ? form.offsetHeight : 80;
        let toastWrapper = document.createElement("div");
        toastWrapper.classList.add("toasts");
        toastWrapper.style.setProperty("left", left + "px");
        toastWrapper.style.setProperty("width", width + "px");
        toastWrapper.style.setProperty("bottom", bottom + "px");
        document.querySelector('.app').appendChild(toastWrapper);
    }
    const {type = "", icon = true, timeout = 3000} = options;
    let toastElem = document.createElement("div");
    toastElem.classList.add("toast");
	if (type) toastElem.classList.add("toast-" + type);
	if (type && icon) toastElem.classList.add("icon");
    toastElem.innerText = content;
    document.querySelector('.toasts').appendChild(toastElem);
    setTimeout(() => {
        toastElem.classList.add('closing');
        setTimeout(() => {
            toastElem.remove();
            if (!document.querySelectorAll('.toasts .toast').length) document.querySelector('.toasts').remove();
        }, 300);
    }, timeout);
};


/**
 * Get the full path to the plugins folder.
 * @returns {string} full path to the plugins folder
 */
PluginUtilities.getPluginsFolder = function() {
    let process = require("process");
    let path = require("path");
    switch (process.platform) {
        case "win32":
        return path.resolve(process.env.appdata, "BetterDiscord/plugins/");
        case "darwin":
        return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/plugins/");
        default:
        return path.resolve(process.env.HOME, ".config/", "BetterDiscord/plugins/");
    }
};

/**
 * Get the full path to the themes folder.
 * @returns {string} full path to the themes folder
 */
PluginUtilities.getThemesFolder = function() {
    let process = require("process");
    let path = require("path");
    switch (process.platform) {
        case "win32":
        return path.resolve(process.env.appdata, "BetterDiscord/themes/");
        case "darwin":
        return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/themes/");
        default:
        return path.resolve(process.env.HOME, ".config/", "BetterDiscord/themes/");
    }
};

/**
 * Format strings with placeholders (`${placeholder}`) into full strings.
 * Quick example: `PluginUtilities.formatString("Hello, ${user}", {user: "Zerebos"})`
 * would return "Hello, Zerebos".
 * @param {string} string - string to format
 * @param {object} values - object literal of placeholders to replacements
 * @returns {string} the properly formatted string
 */
PluginUtilities.formatString = function(string, values) {
	for (let val in values) {
		string = string.replace(new RegExp(`\\$\\{${val}\\}`, 'g'), values[val]);
	}
	return string;
};

/**
 * Creates a MutationObserver observing for the Discord channel switch.
 * @param {object} plugin - the plugin with a `onChannelSwitch()` function
 * @returns {MutationObserver} the observer observing for channel switch
 */
PluginUtilities.createSwitchObserver = function(plugin) {
	let switchObserver = new MutationObserver((changes) => {
		changes.forEach((change) => {
			if (change.addedNodes.length && change.addedNodes[0] instanceof Element && (change.addedNodes[0].classList.contains("messages-wrapper") || change.addedNodes[0].classList.contains("activityFeed-HeiGwL") || change.addedNodes[0].id === "friends")) plugin.onChannelSwitch();
			if (change.removedNodes.length && change.removedNodes[0] instanceof Element && (change.removedNodes[0].classList.contains("activityFeed-HeiGwL") || change.removedNodes[0].id === "friends")) plugin.onChannelSwitch();
		});
	});
	switchObserver.observe(document.querySelector('.app'), {childList: true, subtree:true});
	return switchObserver;
};

/**
 * Creates a MutationObserver observing for the Discord channel switch.
 * @param {callable} onSwitch - function to call on channel switch
 * @returns {MutationObserver} the observer observing for channel switch
 */
PluginUtilities.onSwitchObserver = function(onSwitch) {
	if (typeof onSwitch === "undefined") return null;
	let switchObserver = new MutationObserver((changes) => {
		changes.forEach((change) => {
			if (change.addedNodes.length && change.addedNodes[0] instanceof Element && (change.addedNodes[0].classList.contains("messages-wrapper") || change.addedNodes[0].classList.contains("activityFeed-HeiGwL") || change.addedNodes[0].id === "friends")) onSwitch();
			if (change.removedNodes.length && change.removedNodes[0] instanceof Element && (change.removedNodes[0].classList.contains("activityFeed-HeiGwL") || change.removedNodes[0].id === "friends")) onSwitch();
		});
	});
	switchObserver.observe(document.querySelector('.app'), {childList: true, subtree:true});
	return switchObserver;
};
/* ================== END MODULE ================== */


/**
 * Helpful utilities for dealing with getting react information from DOM objects.
 * @namespace
 * @version 0.0.4
 */
var ReactUtilities = {};

/**
 * Grabs the react internal instance of a specific node.
 * @param {(HTMLElement|jQuery)} node - node to obtain react instance of
 * @return {object} the internal react instance
 */
ReactUtilities.getReactInstance = function(node) {
	if (!(node instanceof jQuery) && !(node instanceof Element)) return undefined;
	var domNode = node instanceof jQuery ? node[0] : node;
	return domNode[Object.keys(domNode).find((key) => key.startsWith("__reactInternalInstance"))];
};

/**
 * Grabs a value from the react internal instance. Allows you to grab
 * long depth values safely without accessing no longer valid properties.
 * @param {(HTMLElement|jQuery)} node - node to obtain react instance of
 * @param {string} path - path to the requested value
 * @return {(*|undefined)} the value requested or undefined if not found.
 */
ReactUtilities.getReactProperty = function(node, path) {
	var value = path.split(/\s?\.\s?/).reduce(function(obj, prop) {
		return obj && obj[prop];
	}, ReactUtilities.getReactInstance(node));
	return value;
};

/**
 * Grabs a value from the react internal instance. Allows you to grab
 * long depth values safely without accessing no longer valid properties.
 * @param {(HTMLElement|jQuery)} node - node to obtain react instance of
 * @param {object} options - options for the search
 * @param {array} [options.include] - list of items to include from the search
 * @param {array} [options.exclude=["Popout", "Tooltip", "Scroller", "BackgroundFlash"]] - list of items to exclude from the search
 * @return {(*|null)} the owner instance or undefined if not found.
 */
ReactUtilities.getOwnerInstance = function(node, {include, exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
	if (node === undefined)
		return undefined;
	const excluding = include === undefined;
	const filter = excluding ? exclude : include;
	function getDisplayName(owner) {
		const type = owner.type;
		return type.displayName || type.name || null;
	}
	function classFilter(owner) {
		const name = getDisplayName(owner);
		return (name !== null && !!(filter.includes(name) ^ excluding));
	}
	
	for (let curr = ReactUtilities.getReactInstance(node).return; !_.isNil(curr); curr = curr.return) {
		if (_.isNil(curr))
			continue;
		let owner = curr.stateNode;
		if (!_.isNil(owner) && !(owner instanceof HTMLElement) && classFilter(curr))
			return owner;
	}
	
	return null;
};
/* ================== END MODULE ================== */



/** 
 * The main object housing the modules making up this library.
 * @version 0.5.6
 */
window["ZeresLibrary"] = {
	ColorUtilities: ColorUtilities,
	DOMUtilities: DOMUtilities,
	ReactUtilities: ReactUtilities,
	PluginUtilities: PluginUtilities,
	PluginUpdateUtilities: PluginUpdateUtilities,
	PluginSettings: PluginSettings,
	ContextMenu: PluginContextMenu,
	Tooltip: PluginTooltip,
	DiscordPermissions: DiscordPermissions,
	InternalUtilities: InternalUtilities,
	DiscordModules: DiscordModules,
	DiscordClassModules: DiscordClassModules,
	DiscordClasses: DiscordClasses,
	DiscordSelectors: DiscordSelectors,
	GeneralUtilities: GeneralUtilities,
	Patcher: Patcher,
	Logger: Logger,
	Screen: {
		get width() { return Math.max(document.documentElement.clientWidth, window.innerWidth || 0); },
		get height() { return Math.max(document.documentElement.clientHeight, window.innerHeight || 0); }
	},
	creationTime: Date.now(),
	get isOutdated() { return Date.now() - this.creationTime > 600000; },
	version: "0.5.6"
};

window.ZL = window.ZeresLibrary;

BdApi.clearCSS("PluginLibraryCSS");
BdApi.injectCSS("PluginLibraryCSS", PluginSettings.getCSS() + PluginUtilities.getToastCSS() + PluginUpdateUtilities.getCSS());

jQuery.extend(jQuery.easing, { easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; }});

Patcher.unpatchAll("ZeresLibrary");
Patcher.before("ZeresLibrary", jQuery.fn, "find", (thisObject, args) => {
	if (args.length && args[0] instanceof DOMUtilities.Selector) args[0] = args[0].toString();
});
