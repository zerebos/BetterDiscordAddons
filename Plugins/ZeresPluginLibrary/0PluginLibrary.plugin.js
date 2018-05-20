//META{"name":"ZeresPluginLibrary","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ZeresPluginLibrary","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ZeresPluginLibrary/0PluginLibrary.plugin.js"}*//
var ZeresPluginLibrary =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./plugins/0PluginLibrary sync recursive ^\\.\\/.*$":
/*!**********************************************!*\
  !*** ./plugins/0PluginLibrary sync ^\.\/.*$ ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./": "./plugins/0PluginLibrary/index.js",
	"./config.json": "./plugins/0PluginLibrary/config.json",
	"./index": "./plugins/0PluginLibrary/index.js",
	"./index.js": "./plugins/0PluginLibrary/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./plugins/0PluginLibrary sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./plugins/0PluginLibrary/config.json":
/*!********************************************!*\
  !*** ./plugins/0PluginLibrary/config.json ***!
  \********************************************/
/*! exports provided: info, main, default */
/***/ (function(module) {

module.exports = {"info":{"name":"ZeresPluginLibrary","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"1.0.0","description":"Gives other plugins utility functions and the ability to emulate v2.","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ZeresPluginLibrary","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ZeresPluginLibrary/0PluginLibrary.plugin.js"},"main":"index.js"};

/***/ }),

/***/ "./plugins/0PluginLibrary/index.js":
/*!*****************************************!*\
  !*** ./plugins/0PluginLibrary/index.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ui */ "./src/ui/ui.js");
// import {ColorConverter, DOMTools, ReactTools, PluginUtilities, PluginUpdates, Logger, Structs,
// 	DiscordModules, DiscordClasses, DiscordSelectors, Utilities, Patcher, DiscordAPI, WebpackModules, Filters} from "modules";




const Library = {};
Library.ContextMenu = ui__WEBPACK_IMPORTED_MODULE_1__["ContextMenu"];
Library.Tooltip = ui__WEBPACK_IMPORTED_MODULE_1__["Tooltip"];
Library.PluginSettings = ui__WEBPACK_IMPORTED_MODULE_1__["PluginSettings"];
for (const mod in modules__WEBPACK_IMPORTED_MODULE_0__) Library[mod] = modules__WEBPACK_IMPORTED_MODULE_0__[mod];

window.Library = Library;

const {PluginUpdates, Patcher, Structs, PluginUtilities, Logger} = Library;

/* harmony default export */ __webpack_exports__["default"] = ((BasePlugin) => {
    return class ZeresPluginLibrary extends BasePlugin {
        load() {
            BdApi.clearCSS("PluginLibraryCSS");
            BdApi.injectCSS("PluginLibraryCSS", ui__WEBPACK_IMPORTED_MODULE_1__["PluginSettings"].CSS + PluginUtilities.getToastCSS() + PluginUpdates.CSS);

            jQuery.extend(jQuery.easing, { easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; }});


            const SelectorConverter = (thisObject, args) => {
                if (args.length && args[0] instanceof Structs.Selector) args[0] = args[0].toString();
            };

            Patcher.unpatchAll("ZeresLibrary");
            Patcher.before("ZeresLibrary", jQuery.fn, "find", SelectorConverter);
            Patcher.before("ZeresLibrary", jQuery.fn, "parents", SelectorConverter);
            Patcher.before("ZeresLibrary", jQuery.fn, "closest", SelectorConverter);

            Patcher.before("ZeresLibrary", global, "$", SelectorConverter);
            jQuery.extend(true, global.$, jQuery);
        }

        static buildPlugin(config) {
            const name = config.info.name;
            const BoundAPI = {
                Logger: {
                    log: (message) => Logger.log(name, message),
                    error: (message, error) => Logger.err(name, message, error),
                    err: (message, error) => Logger.err(name, message, error),
                    warn: (message) => Logger.warn(name, message),
                    info: (message) => Logger.info(name, message),
                    debug: (message) => Logger.debug(name, message)
                },
                Patcher: {
                    getPatchesByCaller: () => {return Patcher.getPatchesByCaller(name);},
                    unpatchAll: () => {return Patcher.unpatchAll(name);},
                    before: (moduleToPatch, functionName, callback, options = {}) => {return Patcher.before(name, moduleToPatch, functionName, callback, options);},
                    instead: (moduleToPatch, functionName, callback, options = {}) => {return Patcher.instead(name, moduleToPatch, functionName, callback, options);},
                    after: (moduleToPatch, functionName, callback, options = {}) => {return Patcher.after(name, moduleToPatch, functionName, callback, options);}
                }
            };
            const BoundLib = Object.assign({}, Library);
            BoundLib.Logger = BoundAPI.Logger;
            BoundLib.Patcher = BoundAPI.Patcher;
            return [Library.Structs.Plugin(config), BoundLib];		
        }
    };
});

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");

const {Plugin} = modules__WEBPACK_IMPORTED_MODULE_0__["Structs"];

const config = __webpack_require__(/*! ../plugins/0PluginLibrary/config.json */ "./plugins/0PluginLibrary/config.json");
const pluginModule = __webpack_require__("./plugins/0PluginLibrary sync recursive ^\\.\\/.*$")("./" + config.main).default;

const name = config.info.name;
const BoundAPI = {
	Logger: {
		log: (message) => Logger.log(name, message),
		error: (message, error) => Logger.err(name, message, error),
		err: (message, error) => Logger.err(name, message, error),
		warn: (message) => Logger.warn(name, message),
		info: (message) => Logger.info(name, message),
		debug: (message) => Logger.debug(name, message)
	},
	Patcher: {
		getPatchesByCaller: () => {return Patcher.getPatchesByCaller(name);},
		unpatchAll: () => {return Patcher.unpatchAll(name);},
		before: (moduleToPatch, functionName, callback, options = {}) => {return Patcher.before(name, moduleToPatch, functionName, callback, options);},
		instead: (moduleToPatch, functionName, callback, options = {}) => {return Patcher.instead(name, moduleToPatch, functionName, callback, options);},
		after: (moduleToPatch, functionName, callback, options = {}) => {return Patcher.after(name, moduleToPatch, functionName, callback, options);}
	}
};

for (const mod in modules__WEBPACK_IMPORTED_MODULE_0__) BoundAPI[mod] = modules__WEBPACK_IMPORTED_MODULE_0__[mod];

/* harmony default export */ __webpack_exports__["default"] = (pluginModule(Plugin(config), BoundAPI));

/***/ }),

/***/ "./src/modules/colorconverter.js":
/*!***************************************!*\
  !*** ./src/modules/colorconverter.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ColorConverter; });
/**
 * Helpful utilities for dealing with colors.
 * @module ColorConverter
 * @version 0.0.2
 */

class ColorConverter {

	/**
	 * Will get the red green and blue values of any color string.
	 * @param {string} color - the color to obtain the red, green and blue values of. Can be in any of these formats: #fff, #ffffff, rgb, rgba
	 * @returns {array} - array containing the red, green, and blue values
	 */
	static getRGB(color) {
		var result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color);
		if (result) return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*,\s*([0-9]+(?:\.[0-9]+)?)%\s*\)/.exec(color);
		if (result) return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];

		result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color);
		if (result) return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
		
		result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color);
		if (result) return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
	}

	/**
	 * Will get the darken the color by a certain percent
	 * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
	 * @param {number} percent - percent to darken the color by (0-100)
	 * @returns {string} - new color in rgb format
	 */
	static darkenColor(color, percent) {
		var rgb = this.getRGB(color);
		
		for(var i = 0; i < rgb.length; i++){
			rgb[i] = Math.round(Math.max(0, rgb[i] - rgb[i] * (percent / 100)));
		}
		
		return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	}

	/**
	 * Will get the lighten the color by a certain percent
	 * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
	 * @param {number} percent - percent to lighten the color by (0-100)
	 * @returns {string} - new color in rgb format
	 */
	static lightenColor(color, percent) {
		var rgb = this.getRGB(color);
		
		for(var i = 0; i < rgb.length; i++){
			rgb[i] = Math.round(Math.min(255, rgb[i] + rgb[i] * (percent / 100)));
		}
		
		return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	}

	/**
	 * Converts a color to rgba format string
	 * @param {string} color - Can be in any of these formats: #fff, #ffffff, rgb, rgba
	 * @param {number} alpha - alpha level for the new color
	 * @returns {string} - new color in rgb format
	 */
	static rgbToAlpha(color, alpha) {
		var rgb = this.getRGB(color);		
		return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
	}

}

/***/ }),

/***/ "./src/modules/discordapi.js":
/*!***********************************!*\
  !*** ./src/modules/discordapi.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DiscordAPI; });
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony import */ var _discordmodules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./discordmodules */ "./src/modules/discordmodules.js");
/**
 * BetterDiscord Discord API
 * Copyright (c) 2018-present JsSucks
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/JsSucks/BetterDiscordApp/blob/master/LICENSE
*/




class DiscordAPI {

    static get User() { return structs__WEBPACK_IMPORTED_MODULE_0__["User"]; }
    static get Channel() { return structs__WEBPACK_IMPORTED_MODULE_0__["Channel"]; }
    static get Guild() { return structs__WEBPACK_IMPORTED_MODULE_0__["Guild"]; }
    static get Message() { return structs__WEBPACK_IMPORTED_MODULE_0__["Message"]; }

    /**
     * A list of loaded guilds.
     */
    static get guilds() {
        const guilds = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].GuildStore.getGuilds();
        return structs__WEBPACK_IMPORTED_MODULE_0__["List"].from(Object.values(guilds), g => structs__WEBPACK_IMPORTED_MODULE_0__["Guild"].from(g));
    }

    /**
     * A list of loaded channels.
     */
    static get channels() {
        const channels = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].ChannelStore.getChannels();
        return structs__WEBPACK_IMPORTED_MODULE_0__["List"].from(Object.values(channels), c => structs__WEBPACK_IMPORTED_MODULE_0__["Channel"].from(c));
    }

    /**
     * A list of loaded users.
     */
    static get users() {
        const users = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].UserStore.getUsers();
        return structs__WEBPACK_IMPORTED_MODULE_0__["List"].from(Object.values(users), u => structs__WEBPACK_IMPORTED_MODULE_0__["User"].from(u));
    }

    /**
     * An object mapping guild IDs to their member counts.
     */
    static get memberCounts() {
        return _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].MemberCountStore.getMemberCounts();
    }

    /**
     * A list of guilds in the order they appear in the server list.
     */
    static get sortedGuilds() {
        const guilds = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].SortedGuildStore.getSortedGuilds();
        return structs__WEBPACK_IMPORTED_MODULE_0__["List"].from(guilds, g => structs__WEBPACK_IMPORTED_MODULE_0__["Guild"].from(g));
    }

    /**
     * An array of guild IDs in the order they appear in the server list.
     */
    static get guildPositions() {
        return _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].SortedGuildStore.guildPositions;
    }

    /**
     * The currently selected guild.
     */
    static get currentGuild() {
        const guild = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].GuildStore.getGuild(_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].SelectedGuildStore.getGuildId());
        if (guild) return structs__WEBPACK_IMPORTED_MODULE_0__["Guild"].from(guild);
    }

    /**
     * The currently selected channel.
     */
    static get currentChannel() {
        const channel = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].ChannelStore.getChannel(_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].SelectedChannelStore.getChannelId());
        if (channel) return structs__WEBPACK_IMPORTED_MODULE_0__["Channel"].from(channel);
    }

    /**
     * The current user.
     */
    static get currentUser() {
        const user = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].UserStore.getCurrentUser();
        if (user) return structs__WEBPACK_IMPORTED_MODULE_0__["User"].from(user);
    }

    /**
     * A list of the current user's friends.
     */
    static get friends() {
        const friends = _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].RelationshipStore.getFriendIDs();
        return structs__WEBPACK_IMPORTED_MODULE_0__["List"].from(friends, id => structs__WEBPACK_IMPORTED_MODULE_0__["User"].fromId(id));
    }

    static get UserSettings() {
        return structs__WEBPACK_IMPORTED_MODULE_0__["UserSettings"];
    }

}

/***/ }),

/***/ "./src/modules/discordclassmodules.js":
/*!********************************************!*\
  !*** ./src/modules/discordclassmodules.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ "./src/modules/utilities.js");
/* harmony import */ var _webpackmodules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./webpackmodules */ "./src/modules/webpackmodules.js");



/**
 * A large list of known and labelled classes in discord.
 * Click the filename below to see the whole list.
 * @module DiscordClassModules
 * @version 0.0.1
 */
/* harmony default export */ __webpack_exports__["default"] = (_utilities__WEBPACK_IMPORTED_MODULE_0__["default"].memoizeObject({
	get ContextMenu() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("itemToggle");},
	get Scrollers() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("scrollerWrap");},
	get AccountDetails() {return Object.assign({}, _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("nameTag"), _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("accountDetails"));},
	get Typing() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("typing", "text");},
	get UserPopout() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("userPopout");},
	get PopoutRoles() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("roleCircle");},
	get UserModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("profileBadge");},
	get Textarea() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("channelTextArea");},
	get Popouts() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("popouts");},
	get Titles() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("defaultMarginh5");},
	get Notices() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("noticeInfo");},
	get Backdrop() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("backdrop");},
	get Modals() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getModule(m => m.modal && m.inner && !m.header);},
	get AuditLog() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("userHook");}
}));



/***/ }),

/***/ "./src/modules/discordmodules.js":
/*!***************************************!*\
  !*** ./src/modules/discordmodules.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ "./src/modules/utilities.js");
/* harmony import */ var _webpackmodules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./webpackmodules */ "./src/modules/webpackmodules.js");
/**
 * A large list of known and useful webpack modules internal to Discord.
 * Click the filename below to see the whole list.
 * @module DiscordModules
 * @version 0.0.1
 */



/* harmony default export */ __webpack_exports__["default"] = (_utilities__WEBPACK_IMPORTED_MODULE_0__["default"].memoizeObject({
    get React() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("createElement", "cloneElement");},
    get ReactDOM() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("render", "findDOMNode");},
    get Events() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByPrototypes("setMaxListeners", "emit");},

    /* Guild Info, Stores, and Utilities */
    get GuildStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getGuild");},
    get SortedGuildStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getSortedGuilds");},
    get SelectedGuildStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getLastSelectedGuildId");},
    get GuildSync() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getSyncedGuilds");},
    get GuildInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getAcronym");},
    get GuildChannelsStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getChannels", "getDefaultChannel");},
    get GuildMemberStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getMember");},
    get MemberCountStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getMemberCounts");},
    get GuildEmojiStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getEmojis");},
    get GuildActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("markGuildAsRead");},
    get GuildPermissions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getGuildPermissions");},

    /* Channel Store & Actions */
    get ChannelStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getChannels", "getDMFromUserId");},
    get SelectedChannelStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getLastSelectedChannelId");},
    get ChannelActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("selectChannel");},
    get PrivateChannelActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("openPrivateChannel");},
    get ChannelSelector() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("selectGuild", "selectChannel");},

    /* Current User Info, State and Settings */
    get UserInfoStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getToken");},
    get UserSettingsStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("guildPositions");},
    get AccountManager() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("register", "login");},
    get UserSettingsUpdater() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("updateRemoteSettings");},
    get OnlineWatcher() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("isOnline");},
    get CurrentUserIdle() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getIdleTime");},
    get RelationshipStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("isBlocked");},
    get RelationshipManager() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("addRelationship");},
    get MentionStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getMentions");},

    /* User Stores and Utils */
    get UserStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getCurrentUser");},
    get UserStatusStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getStatuses");},
    get UserTypingStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("isTyping");},
    get UserActivityStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getActivity");},
    get UserNameResolver() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getName");},
    get UserNoteStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["getNote"]);},
    get UserNoteActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["updateNote"]);},

    /* Emoji Store and Utils */
    get EmojiInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("isEmojiDisabled");},
    get EmojiUtils() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getGuildEmoji");},
    get EmojiStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getByCategory", "EMOJI_NAME_RE");},

    /* Invite Store and Utils */
    get InviteStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getInvites");},
    get InviteResolver() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("findInvite");},
    get InviteActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("acceptInvite");},

    /* Discord Objects & Utils */
    get DiscordConstants() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("Permissions", "ActivityTypes", "StatusTypes");},
    get Permissions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getHighestRole");},
    get ColorConverter() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("hex2int");},
    get ColorShader() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("darken");},
    get ClassResolver() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getClass");},
    get ButtonData() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("ButtonSizes");},
    get IconNames() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("IconNames");},
    get NavigationUtils() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("transitionTo", "replaceWith", "getHistory");},

    /* Discord Messages */
    get MessageStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getMessages");},
    get MessageActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("jumpToMessage", "_sendMessage");},
    get MessageQueue() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("enqueue");},
    get MessageParser() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("createMessage", "parse", "unparse");},

    /* In-Game Overlay */
    get OverlayUserPopoutSettings() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("openUserPopout");},
    get OverlayUserPopoutInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getOpenedUserPopout");},

    /* Experiments */
    get ExperimentStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getExperimentOverrides");},
    get ExperimentsManager() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("isDeveloper");},
    get CurrentExperiment() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getExperimentId");},

    /* Images, Avatars and Utils */
    get ImageResolver() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getUserAvatarURL");},
    get ImageUtils() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getSizedImageSrc");},
    get AvatarDefaults() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getUserAvatarURL", "DEFAULT_AVATARS");},

    /* Drag & Drop */
    get DNDActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("beginDrag");},
    get DNDSources() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("addTarget");},
    get DNDObjects() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("DragSource");},

    /* Electron & Other Internals with Utils*/
    get ElectronModule() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("setBadge");},
    get Dispatcher() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("dirtyDispatch");},
    get PathUtils() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("hasBasename");},
    get NotificationModule() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("showNotification");},
    get RouterModule() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("Router");},
    get APIModule() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getAPIBaseURL");},
    get AnalyticEvents() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("AnalyticEventConfigs");},
    get KeyGenerator() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByRegex(/"binary"/);},
    get Buffers() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("Buffer", "kMaxLength");},
    get DeviceStore() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getDevices");},
    get SoftwareInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("os");},
    get CurrentContext() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("setTagsContext");},

    /* Media Stuff (Audio/Video) */
    get MediaDeviceInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("Codecs", "SUPPORTED_BROWSERS");},
    get MediaInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getOutputVolume");},
    get MediaEngineInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("MediaEngineFeatures");},
    get VoiceInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("EchoCancellation");},
    get VideoStream() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getVideoStream");},
    get SoundModule() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("playSound");},

    /* Window, DOM, HTML */
    get WindowInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("isFocused", "windowSize");},
    get TagInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("VALID_TAG_NAMES");},
    get DOMInfo() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("canUseDOM");},

    /* Locale/Location and Time */
    get LocaleManager() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("setLocale");},
    get Moment() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("parseZone");},
    get LocationManager() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("createLocation");},
    get Timestamps() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("fromTimestamp");},

    /* Strings and Utils */
    get Strings() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("Messages").Messages;},
    get StringFormats() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("a", "z");},
    get StringUtils() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("toASCII");},

    /* URLs and Utils */
    get URLParser() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("Url", "parse");},
    get ExtraURLs() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("getArticleURL");},

    /* Text Processing */
    get hljs() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["highlight", "highlightBlock"]);},
    get SimpleMarkdown() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["parseBlock", "parseInline", "defaultOutput"]);},

    /* DOM/React Components */
    /* ==================== */
    get LayerManager() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("popLayer", "pushLayer");},
    get Tooltips() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].find(m => m.hide && m.show && !m.search && !m.submit && !m.search && !m.activateRagingDemon && !m.dismiss);},
    get UserSettingsWindow() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "updateAccount"]);},
    get ChannelSettingsWindow() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "updateChannel"]);},
    get GuildSettingsWindow() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "updateGuild"]);},

    /* Modals */
    get ModalStack() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("push", "update", "pop", "popWithKey");},
    get UserProfileModals() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("fetchMutualFriends", "setSection");},
    get ConfirmModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByPrototypes("handleCancel", "handleSubmit", "handleMinorConfirm");},
    get UserProfileModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["fetchMutualFriends", "setSection"]);},
    get ChangeNicknameModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "changeNickname"]);},
    get CreateChannelModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "createChannel"]);},
    get PruneMembersModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "prune"]);},
    get NotificationSettingsModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "updateNotificationSettings"]);},
    get PrivacySettingsModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByRegex(/PRIVACY_SETTINGS_MODAL_OPEN/, m => m.open);},
    get CreateInviteModal() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps(["open", "createInvite"]);},

    /* Popouts */
    get PopoutStack() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("open", "close", "closeAll");},
    get PopoutOpener() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByProps("openPopout");},
    get EmojiPicker() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByPrototypes("onHoverEmoji", "selectEmoji");},

    /* Context Menus */
    get ContextMenuActions() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByRegex(/CONTEXT_MENU_CLOSE/, c => c.close);},
    get ContextMenuItemsGroup() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByRegex(/itemGroup/);},
    get ContextMenuItem() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByRegex(/\.label\b.*\.hint\b.*\.action\b/);},

    /* In-Message Links */
    get ExternalLink() {return _webpackmodules__WEBPACK_IMPORTED_MODULE_1__["default"].getByRegex(/\.trusted\b/);},
}));



/***/ }),

/***/ "./src/modules/domtools.js":
/*!*********************************!*\
  !*** ./src/modules/domtools.js ***!
  \*********************************/
/*! exports provided: default, DiscordClasses, DiscordSelectors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DOMTools; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscordClasses", function() { return DiscordClasses; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiscordSelectors", function() { return DiscordSelectors; });
/* harmony import */ var _discordclassmodules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./discordclassmodules */ "./src/modules/discordclassmodules.js");
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/**
 * Helpful utilities for dealing with DOM operations.
 * @module DOMTools
 * @version 0.0.1
 */



 
class DOMTools {
	/**
	 * Find which index in children a certain node is. Similar to jQuery's `$.index()`
	 * @param {HTMLElement} node - the node to find its index in parent
	 * @returns {number} index of the node
	 */
	static indexInParent(node) {
		var children = node.parentNode.childNodes;
		var num = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i] == node) return num;
			if (children[i].nodeType == 1) num++;
		}
		return -1;
	}

	/**
	 * Insert after a specific element, similar to jQuery's `element.after(newElement)`
	 * @param {HTMLElement} newNode - the node to insert
	 * @param {HTMLElement} referenceNode - node to insert after in the tree
	 */
	static insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
}

/**
 * Proxy for all the class packages, allows us to safely attempt
 * to retrieve nested things without error. Also wraps the class in
 * {@link module:DOMTools.ClassName} which adds features but can still
 * be used in native function.
 * 
 * @version 0.0.1
 */
const DiscordClasses = new Proxy(_discordclassmodules__WEBPACK_IMPORTED_MODULE_0__["default"], {
	get: function(list, item) {
		if (list[item] === undefined) return new Proxy({}, {get: function() {return "";}});
		return new Proxy(list[item], {
			get: function(obj, prop) {
				if (!obj.hasOwnProperty(prop)) return "";
				return new structs__WEBPACK_IMPORTED_MODULE_1__["ClassName"](obj[prop]);
			}
		});
	}
});

/**
 * Gives us a way to retrieve the internal classes as selectors without
 * needing to concatenate strings or use string templates. Wraps the
 * selector in {@link module:DOMTools.Selector} which adds features but can 
 * still be used in native function.
 * 
 * @version 0.0.1
 */
const DiscordSelectors = new Proxy(_discordclassmodules__WEBPACK_IMPORTED_MODULE_0__["default"], {
	get: function(list, item) {
		if (list[item] === undefined) return new Proxy({}, {get: function() {return "";}});
		return new Proxy(list[item], {
			get: function(obj, prop) {
				if (!obj.hasOwnProperty(prop)) return "";
				return new structs__WEBPACK_IMPORTED_MODULE_1__["Selector"](obj[prop]);
			}
		});
	}
});

/***/ }),

/***/ "./src/modules/logger.js":
/*!*******************************!*\
  !*** ./src/modules/logger.js ***!
  \*******************************/
/*! exports provided: LogTypes, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogTypes", function() { return LogTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Logger; });
/** 
 * Simple logger for the lib and plugins.
 * 
 * @module Logger
 * @version 0.0.2
 */

/* eslint-disable no-console */

const LogTypes = {
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

class Logger {

    /**
     * Logs an error using a collapsed error group with stacktrace.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message or error to have logged.
	 * @param {Error} error - Optional error to log with the message.
     */
    static err(module, message, error) {
		if (error) return console.error(`%c[${module}]%c ${message}\n\n%c`, "color: #3a71c1; font-weight: 700;", "color: red; font-weight: 700;", "color: red;", error);
		else Logger.log(module, message, "error");
    }

    /**
     * Logs a warning message/
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     */
    static warn(module, message) { Logger.log(module, message, "warn"); }

    /**
     * Logs an informational message.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     */
    static info(module, message) { Logger.log(module, message, "info"); }

    /**
     * Logs used for debugging purposes.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     */
    static debug(module, message) { Logger.log(module, message, "debug"); }
    
    /**
     * Logs strings using different console levels and a module label.
     * 
     * @param {string} module - Name of the calling module.
     * @param {string} message - Message to have logged.
     * @param {Logger.LogTypes} type - Type of log to use in console.
     */
    static log(module, message, type = "log") {
        type = Logger.parseType(type);
        console[type](`%c[${module}]%c`, "color: #3a71c1; font-weight: 700;", "", message);
    }

    static parseType(type) {
        return LogTypes.hasOwnProperty(type) ? LogTypes[type] : "log";
    }

}

/***/ }),

/***/ "./src/modules/modules.js":
/*!********************************!*\
  !*** ./src/modules/modules.js ***!
  \********************************/
/*! exports provided: ColorConverter, DOMTools, DiscordClasses, DiscordSelectors, Utilities, ReactTools, DiscordAPI, WebpackModules, Filters, Logger, Patcher, PluginUpdates, PluginUtilities, DiscordClassModules, DiscordModules, Structs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _colorconverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorconverter */ "./src/modules/colorconverter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ColorConverter", function() { return _colorconverter__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _domtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domtools */ "./src/modules/domtools.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DOMTools", function() { return _domtools__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscordClasses", function() { return _domtools__WEBPACK_IMPORTED_MODULE_1__["DiscordClasses"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscordSelectors", function() { return _domtools__WEBPACK_IMPORTED_MODULE_1__["DiscordSelectors"]; });

/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities */ "./src/modules/utilities.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Utilities", function() { return _utilities__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _reacttools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reacttools */ "./src/modules/reacttools.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ReactTools", function() { return _reacttools__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _discordapi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./discordapi */ "./src/modules/discordapi.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscordAPI", function() { return _discordapi__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _webpackmodules__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./webpackmodules */ "./src/modules/webpackmodules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebpackModules", function() { return _webpackmodules__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Filters", function() { return _webpackmodules__WEBPACK_IMPORTED_MODULE_5__["Filters"]; });

/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./logger */ "./src/modules/logger.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return _logger__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _patcher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./patcher */ "./src/modules/patcher.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Patcher", function() { return _patcher__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _pluginupdates__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pluginupdates */ "./src/modules/pluginupdates.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PluginUpdates", function() { return _pluginupdates__WEBPACK_IMPORTED_MODULE_8__["default"]; });

/* harmony import */ var _pluginutilities__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pluginutilities */ "./src/modules/pluginutilities.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PluginUtilities", function() { return _pluginutilities__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony import */ var _discordclassmodules__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./discordclassmodules */ "./src/modules/discordclassmodules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscordClassModules", function() { return _discordclassmodules__WEBPACK_IMPORTED_MODULE_10__["default"]; });

/* harmony import */ var _discordmodules__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./discordmodules */ "./src/modules/discordmodules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DiscordModules", function() { return _discordmodules__WEBPACK_IMPORTED_MODULE_11__["default"]; });

/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Structs", function() { return structs__WEBPACK_IMPORTED_MODULE_12__; });



















/***/ }),

/***/ "./src/modules/patcher.js":
/*!********************************!*\
  !*** ./src/modules/patcher.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Patcher; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/modules/logger.js");
/* harmony import */ var _discordmodules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./discordmodules */ "./src/modules/discordmodules.js");
/* harmony import */ var _webpackmodules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./webpackmodules */ "./src/modules/webpackmodules.js");
/** 
 * Patcher that can patch other functions allowing you to run code before, after or
 * instead of the original function. Can also alter arguments and return values.
 * 
 * This is a modified version of what we have been working on in BDv2. {@link https://github.com/JsSucks/BetterDiscordApp/blob/master/client/src/modules/patcher.js}
 * 
 * @module Patcher
 * @version 0.0.2
 */




 
class Patcher {

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
        if (typeof patches === "string") patches = this.getPatchesByCaller(patches);

        for (const patch of patches) {
			patch.unpatch();
        }
	}
	
	static resolveModule(module) {
        if (module instanceof Function || (module instanceof Object && !(module instanceof Array))) return module;
        if (typeof module === "string") return _discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"][module];
        if (module instanceof Array) return _webpackmodules__WEBPACK_IMPORTED_MODULE_2__["default"].findByUniqueProperties(module);
        return null;
	}

    static makeOverride(patch) {
        return function () {
            let returnValue = undefined;
            if (!patch.children) return patch.originalFunction.apply(this, arguments);
            for (const superPatch of patch.children.filter(c => c.type === "before")) {
                try {
                    superPatch.callback(this, arguments);
                }
                catch (err) {
                    _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err("Patcher", `Could not fire before callback of ${patch.functionName} for ${superPatch.caller}`, err);
                }
            }

            const insteads = patch.children.filter(c => c.type === "instead");
            if (!insteads.length) returnValue = patch.originalFunction.apply(this, arguments, patch.originalFunction);
            else {
                for (const insteadPatch of insteads) {
                    try {
						const tempReturn = insteadPatch.callback(this, arguments);
                        if (typeof(tempReturn) !== "undefined") returnValue = tempReturn;
                    }
                    catch (err) {
                        _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err("Patcher", `Could not fire instead callback of ${patch.functionName} for ${insteadPatch.caller}`, err);
                    }
                }
            }

            for (const slavePatch of patch.children.filter(c => c.type === "after")) {
                try {
					const tempReturn = slavePatch.callback(this, arguments, returnValue);
                    if (typeof(tempReturn) !== "undefined") returnValue = tempReturn;
                }
                catch (err) {
                    _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err("Patcher", `Could not fire after callback of ${patch.functionName} for ${slavePatch.caller}`, err);
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
     * 
     * The third argument for the callback will be `undefined` for `before` patches. `originalFunction` for `instead` patches and `returnValue` for `after` patches.
     * 
     * @callback Patcher~patchCallback
     * @param {object} thisObject - `this` in the context of the original function.
     * @param {arguments} arguments - The original arguments of the original function.
     * @param {function} originalFunction - The original function from the module. This the third argument for `instead` patches.
     * @param {*} returnValue - The return value of the original function. This the third argument for `after` patches.
     * @return {*} Makes sense only when using an `instead` or `after` patch. If something other than `undefined` is returned, the returned value replaces the value of `returnValue`. If used for `before` the return value is ignored.
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
		
		if (typeof moduleToPatch === "string") options.displayName = moduleToPatch;
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

}

/***/ }),

/***/ "./src/modules/pluginupdates.js":
/*!**************************************!*\
  !*** ./src/modules/pluginupdates.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PluginUpdates; });
/* harmony import */ var _pluginutilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pluginutilities */ "./src/modules/pluginutilities.js");
/* harmony import */ var _discordmodules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./discordmodules */ "./src/modules/discordmodules.js");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger */ "./src/modules/logger.js");
/**
 * Functions that check for and update existing plugins.
 * @module PluginUpdateUtilities
 * @version 0.0.3
 */






class PluginUpdates {
	/**
	 * Creates the update button found in the plugins page of BetterDiscord
	 * settings. Returned button will already have listeners to create the tooltip.
	 * @returns {HTMLElement} check for update button
	 */
	static createUpdateButton() {
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
	}

	static get CSS() {
		return __webpack_require__(/*! ../styles/updates.css */ "./src/styles/updates.css");
	}

	/**
	 * Will check for updates and automatically show or remove the update notice
	 * bar based on the internal result. Better not to call this directly and to
	 * instead use {@link PluginUtilities.checkForUpdate}.
	 * @param {string} pluginName - name of the plugin to check
	 * @param {string} updateLink - link to the raw text version of the plugin
	 */
	static checkUpdate(pluginName, updateLink) {
		let request = __webpack_require__(/*! request */ "request");
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
			if (hasUpdate) this.showUpdateNotice(pluginName, updateLink);
			else this.removeUpdateNotice(pluginName);
		});
	}

	/**
	 * Will show the update notice top bar seen in Discord. Better not to call
	 * this directly and to instead use {@link PluginUtilities.checkForUpdate}.
	 * @param {string} pluginName - name of the plugin
	 * @param {string} updateLink - link to the raw text version of the plugin
	 */
	static showUpdateNotice(pluginName, updateLink) {
		if (!$("#pluginNotice").length)  {
			let noticeElement = `<div class="${_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].NoticeBarClasses.notice} ${_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].NoticeBarClasses.noticeInfo}" id="pluginNotice"><div class="${_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].NoticeBarClasses.dismiss}" id="pluginNoticeDismiss"></div><span class="notice-message">The following plugins have updates:</span>&nbsp;&nbsp;<strong id="outdatedPlugins"></strong></div>`;
			// $('.app .guilds-wrapper + div > div:first > div:first').append(noticeElement);
			$(".app.flex-vertical").children().first().before(noticeElement);
			$(".win-buttons").addClass("win-buttons-notice");
			$("#pluginNoticeDismiss").on("click", () => {
				$(".win-buttons").animate({top: 0}, 400, "swing", () => { $(".win-buttons").css("top","").removeClass("win-buttons-notice"); });
				$("#pluginNotice").slideUp({complete: () => { $("#pluginNotice").remove(); }});
			});
		}
		let pluginNoticeID = pluginName + "-notice";
		if (!$("#" + pluginNoticeID).length) {
			let pluginNoticeElement = $("<span id=\"" + pluginNoticeID + "\">");
			pluginNoticeElement.text(pluginName);
			pluginNoticeElement.on("click", () => {
				this.downloadPlugin(pluginName, updateLink);
			});
			if ($("#outdatedPlugins").children("span").length) $("#outdatedPlugins").append("<span class='separator'>, </span>");
			$("#outdatedPlugins").append(pluginNoticeElement);
		}
	}

	/**
	 * Will download the latest version and replace the the old plugin version.
	 * Will also update the button in the update bar depending on if the user
	 * is using RestartNoMore plugin by square {@link https://github.com/Inve1951/BetterDiscordStuff/blob/master/plugins/restartNoMore.plugin.js}
	 * @param {string} pluginName - name of the plugin to download
	 * @param {string} updateLink - link to the raw text version of the plugin
	 */
	static downloadPlugin(pluginName, updateLink) {
		let request = __webpack_require__(/*! request */ "request");
		let fileSystem = __webpack_require__(/*! fs */ "fs");
		let path = __webpack_require__(/*! path */ "path");
		request(updateLink, (error, response, body) => {
			if (error) return _logger__WEBPACK_IMPORTED_MODULE_2__["default"].warn("PluginUpdates", "Unable to get update for " + pluginName);
			let remoteVersion = body.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i);
			remoteVersion = remoteVersion.toString().replace(/['"]/g, "");
			let filename = updateLink.split("/");
			filename = filename[filename.length - 1];
			var file = path.join(_pluginutilities__WEBPACK_IMPORTED_MODULE_0__["default"].getPluginsFolder(), filename);
			fileSystem.writeFileSync(file, body);
			_pluginutilities__WEBPACK_IMPORTED_MODULE_0__["default"].showToast(`${pluginName} ${window.PluginUpdates.plugins[updateLink].version} has been replaced by ${pluginName} ${remoteVersion}`);
			let oldRNM = window.bdplugins["Restart-No-More"] && window.pluginCookie["Restart-No-More"];
			let newRNM = window.bdplugins["Restart No More"] && window.pluginCookie["Restart No More"];
			if (!(oldRNM || newRNM)) {
				if (!window.PluginUpdates.downloaded) {
					window.PluginUpdates.downloaded = [];
					let button = $(`<button class="btn btn-reload ${_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].NoticeBarClasses.btn} ${_discordmodules__WEBPACK_IMPORTED_MODULE_1__["default"].NoticeBarClasses.button}">Reload</button>`);
					button.on("click", (e) => {
						e.preventDefault();
						window.location.reload(false);
					});
					var tooltip = document.createElement("div");
					tooltip.className = "tooltip tooltip-bottom tooltip-black";
					tooltip.style.maxWidth = "400px";
					button.on("mouseenter", () => {
						document.querySelector(".tooltips").appendChild(tooltip);
						tooltip.innerText = window.PluginUpdates.downloaded.join(", ");
						tooltip.style.left = button.offset().left + (button.outerWidth() / 2) - ($(tooltip).outerWidth() / 2) + "px";
						tooltip.style.top = button.offset().top + button.outerHeight() + "px";
					});
		
					button.on("mouseleave", () => {
						tooltip.remove();
					});
		
					button.appendTo($("#pluginNotice"));
				}
				window.PluginUpdates.plugins[updateLink].version = remoteVersion;
				window.PluginUpdates.downloaded.push(pluginName);
				this.removeUpdateNotice(pluginName);
			}
		});
	}

	/**
	 * Will remove the plugin from the update notice top bar seen in Discord.
	 * Better not to call this directly and to instead use {@link PluginUtilities.checkForUpdate}.
	 * @param {string} pluginName - name of the plugin
	 */
	static removeUpdateNotice(pluginName) {
		let notice = $("#" + pluginName + "-notice");
		if (notice.length) {
			if (notice.next(".separator").length) notice.next().remove();
			else if (notice.prev(".separator").length) notice.prev().remove();
			notice.remove();
		}

		if (!$("#outdatedPlugins").children("span").length && !$("#pluginNotice .btn-reload").length) {
			$("#pluginNoticeDismiss").click();
		} 
		else if (!$("#outdatedPlugins").children("span").length && $("#pluginNotice .btn-reload").length) {
			$("#pluginNotice .notice-message").text("To finish updating you need to reload.");
		}
	}
}

/***/ }),

/***/ "./src/modules/pluginutilities.js":
/*!****************************************!*\
  !*** ./src/modules/pluginutilities.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PluginUtilities; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/modules/logger.js");
/* harmony import */ var _pluginupdates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pluginupdates */ "./src/modules/pluginupdates.js");
/* harmony import */ var _discordmodules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./discordmodules */ "./src/modules/discordmodules.js");




/**
 * A series of useful functions for BetterDiscord plugins.
 * @module PluginUtilities
 * @version 0.2.3
 */


 class PluginUtilities {
	/** 
	 * Gets the server the user is currently in.
	 * @returns {object} returns Discord's internal object representing the server
	*/
	static getCurrentServer() {
		return _discordmodules__WEBPACK_IMPORTED_MODULE_2__["default"].GuildStore.getGuild(_discordmodules__WEBPACK_IMPORTED_MODULE_2__["default"].SelectedGuildStore.getGuildId());
	}

	/** @returns if the user is in a server */
	static isServer() { return this.getCurrentServer() !== null; }

	/** 
	 * Gets the current user.
	 * @returns {object} returns Discord's internal object representing the user
	*/
	static getCurrentUser() {
		return _discordmodules__WEBPACK_IMPORTED_MODULE_2__["default"].UserStore.getCurrentUser();
	}

	/** 
	 * Gets the list of members in the current server.
	 * @returns {array} returns an array of Discord's internal object representing the members.
	*/
	static getAllUsers() {
		return _discordmodules__WEBPACK_IMPORTED_MODULE_2__["default"].GuildMemberStore.getMembers(this.getCurrentServer().id);
	}

	/** 
	 * Loads data through BetterDiscord's API.
	 * @param {string} name - name for the file (usually plugin name)
	 * @param {string} key - which key the data is saved under
	 * @param {object} defaultData - default data to populate the object with
	 * @returns {object} the combined saved and default data
	*/
	static loadData(name, key, defaultData) {
		try { return $.extend(true, defaultData ? defaultData : {}, bdPluginStorage.get(name, key)); }
		catch (err) { _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err(name, "Unable to load data: ", err); }
	}

	/** 
	 * Saves data through BetterDiscord's API.
	 * @param {string} name - name for the file (usually plugin name)
	 * @param {string} key - which key the data should be saved under
	 * @param {object} data - data to save
	*/
	static saveData(name, key, data) {
		try { bdPluginStorage.set(name, key, data); }
		catch (err) { _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err(name, "Unable to save data: ", err); }
	}

	/** 
	 * Loads settings through BetterDiscord's API.
	 * @param {string} name - name for the file (usually plugin name)
	 * @param {object} defaultData - default data to populate the object with
	 * @returns {object} the combined saved and default settings
	*/
	static loadSettings(name, defaultSettings) {
		return this.loadData(name, "settings", defaultSettings);
	}

	/** 
	 * Saves settings through BetterDiscord's API.
	 * @param {string} name - name for the file (usually plugin name)
	 * @param {object} data - settings to save
	*/
	static saveSettings(name, data) {
		this.saveData(name, "settings", data);
	}

	/**
	 * Checks for updates for the specified plugin at the specified link. The final
	 * parameter should link to the raw text of the plugin and will compare semantic
	 * versions.
	 * @param {string} pluginName - name of the plugin
	 * @param {string} currentVersion - current version (semantic versioning only)
	 * @param {string} updateURL - url to check for update
	 */
	static checkForUpdate(pluginName, currentVersion, updateURL) {
		let updateLink = "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/" + pluginName + "/" + pluginName + ".plugin.js";
		if (updateURL) updateLink = updateURL;
		
		if (typeof window.PluginUpdates === "undefined") window.PluginUpdates = {plugins:{}};
		window.PluginUpdates.plugins[updateLink] = {name: pluginName, raw: updateLink, version: currentVersion};

		_pluginupdates__WEBPACK_IMPORTED_MODULE_1__["default"].checkUpdate(pluginName, updateLink);
		
		if (typeof window.PluginUpdates.interval === "undefined") {
			window.PluginUpdates.interval = setInterval(() => {
				window.PluginUpdates.checkAll();
			}, 7200000);
		}

		if (typeof window.PluginUpdates.checkAll === "undefined") {
			window.PluginUpdates.checkAll = function() {
				for (let key in this.plugins) {
					let plugin = this.plugins[key];
					_pluginupdates__WEBPACK_IMPORTED_MODULE_1__["default"].checkUpdate(plugin.name, plugin.raw);
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

																node2.querySelector(".bd-pfbtn").parentElement.insertBefore(_pluginupdates__WEBPACK_IMPORTED_MODULE_1__["default"].createUpdateButton(), node2.querySelector(".bd-pfbtn").nextSibling);
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
			bdbutton.parentElement.insertBefore(_pluginupdates__WEBPACK_IMPORTED_MODULE_1__["default"].createUpdateButton(), bdbutton.nextSibling);
		}
	}

	static getToastCSS() {
		return __webpack_require__(/*! ../styles/toasts.css */ "./src/styles/toasts.css");
	}

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
	static showToast(content, options = {}) {
		if (!document.querySelector(".toasts")) {
			let container = document.querySelector(".channels-3g2vYe + div, .channels-Ie2l6A + div");
			let memberlist = container.querySelector(".membersWrap-2h-GB4");
			let form = container ? container.querySelector("form") : null;
			let left = container ? container.getBoundingClientRect().left : 310;
			let right = memberlist ? memberlist.getBoundingClientRect().left : 0;
			let width = right ? right - container.getBoundingClientRect().left : container.offsetWidth;
			let bottom = form ? form.offsetHeight : 80;
			let toastWrapper = document.createElement("div");
			toastWrapper.classList.add("toasts");
			toastWrapper.style.setProperty("left", left + "px");
			toastWrapper.style.setProperty("width", width + "px");
			toastWrapper.style.setProperty("bottom", bottom + "px");
			document.querySelector(".app").appendChild(toastWrapper);
		}
		const {type = "", icon = true, timeout = 3000} = options;
		let toastElem = document.createElement("div");
		toastElem.classList.add("toast");
		if (type) toastElem.classList.add("toast-" + type);
		if (type && icon) toastElem.classList.add("icon");
		toastElem.innerText = content;
		document.querySelector(".toasts").appendChild(toastElem);
		setTimeout(() => {
			toastElem.classList.add("closing");
			setTimeout(() => {
				toastElem.remove();
				if (!document.querySelectorAll(".toasts .toast").length) document.querySelector(".toasts").remove();
			}, 300);
		}, timeout);
	}


	/**
	 * Get the full path to the plugins folder.
	 * @returns {string} full path to the plugins folder
	 */
	static getPluginsFolder() {
		let process = __webpack_require__(/*! process */ "process");
		let path = __webpack_require__(/*! path */ "path");
		switch (process.platform) {
			case "win32":
			return path.resolve(process.env.appdata, "BetterDiscord/plugins/");
			case "darwin":
			return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/plugins/");
			default:
			return path.resolve(process.env.HOME, ".config/", "BetterDiscord/plugins/");
		}
	}

	/**
	 * Get the full path to the themes folder.
	 * @returns {string} full path to the themes folder
	 */
	static getThemesFolder() {
		let process = __webpack_require__(/*! process */ "process");
		let path = __webpack_require__(/*! path */ "path");
		switch (process.platform) {
			case "win32":
			return path.resolve(process.env.appdata, "BetterDiscord/themes/");
			case "darwin":
			return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/themes/");
			default:
			return path.resolve(process.env.HOME, ".config/", "BetterDiscord/themes/");
		}
	}

	/**
	 * Similar to {@link PluginUtilities.onSwitchObserver} but this uses electron
	 * web contents and not observers. This can be more efficient on worse systems
	 * than the observer based method.
	 * @param {callable} callback - basic callback to happen on channel switch
	 */
	static addOnSwitchListener(callback) {
		__webpack_require__(/*! electron */ "electron").remote.getCurrentWebContents().on("did-navigate-in-page", callback);
	}

	/**
	 * Removes the listener added by {@link InternalUtilities.addOnSwitchListener}.
	 * @param {callable} callback - callback to remove from the listener list
	 */
	static removeOnSwitchListener(callback) {
		__webpack_require__(/*! electron */ "electron").remote.getCurrentWebContents().removeListener("did-navigate-in-page", callback);
	}
}




/***/ }),

/***/ "./src/modules/reacttools.js":
/*!***********************************!*\
  !*** ./src/modules/reacttools.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ReactTools; });
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ "./src/modules/utilities.js");
/**
 * Helpful utilities for dealing with getting react information from DOM objects.
 * @module ReactTools
 * @version 0.0.4
 */



class ReactTools {

	/**
	 * Grabs the react internal instance of a specific node.
	 * @param {(HTMLElement|jQuery)} node - node to obtain react instance of
	 * @return {object} the internal react instance
	 */
	static getReactInstance(node) {
		if (!(node instanceof jQuery) && !(node instanceof Element)) return undefined;
		var domNode = node instanceof jQuery ? node[0] : node;
		return domNode[Object.keys(domNode).find((key) => key.startsWith("__reactInternalInstance"))];
	}

	/**
	 * Grabs a value from the react internal instance. Allows you to grab
	 * long depth values safely without accessing no longer valid properties.
	 * @param {(HTMLElement|jQuery)} node - node to obtain react instance of
	 * @param {string} path - path to the requested value
	 * @return {(*|undefined)} the value requested or undefined if not found.
	 */
	static getReactProperty(node, path) {
		var value = path.split(/\s?\.\s?/).reduce(function(obj, prop) {
			return obj && obj[prop];
		}, this.getReactInstance(node));
		return value;
	}

	/**
	 * Grabs a value from the react internal instance. Allows you to grab
	 * long depth values safely without accessing no longer valid properties.
	 * @param {(HTMLElement|jQuery)} node - node to obtain react instance of
	 * @param {object} options - options for the search
	 * @param {array} [options.include] - list of items to include from the search
	 * @param {array} [options.exclude=["Popout", "Tooltip", "Scroller", "BackgroundFlash"]] - list of items to exclude from the search
	 * @return {(*|null)} the owner instance or undefined if not found.
	 */
	static getOwnerInstance(node, {include, exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
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
		
		for (let curr = this.getReactInstance(node).return; !_utilities__WEBPACK_IMPORTED_MODULE_0__["default"].isNil(curr); curr = curr.return) {
			if (_utilities__WEBPACK_IMPORTED_MODULE_0__["default"].isNil(curr))
				continue;
			let owner = curr.stateNode;
			if (!_utilities__WEBPACK_IMPORTED_MODULE_0__["default"].isNil(owner) && !(owner instanceof HTMLElement) && classFilter(curr))
				return owner;
		}
		
		return null;
	}

}

/***/ }),

/***/ "./src/modules/utilities.js":
/*!**********************************!*\
  !*** ./src/modules/utilities.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Utilities; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "./src/modules/logger.js");
/**
 * Random set of utilities that didn't fit elsewhere.
 * @module Utilities
 * @version 0.0.1
 */



const fs = __webpack_require__(/*! fs */ "fs");

class Utilities {

    /**
     * Stably sorts arrays since `.sort()` has issues.
     * @param {Array} list - array to sort
     * @param {function} comparator - comparator to sort by
     */
    static stableSort(list, comparator) {
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
    }

    /**
     * Generates an automatically memoizing version of an object.
     * @param {Object} object - object to memoize
     * @returns {Proxy} the proxy to the object that memoizes properties
     */
    static memoizeObject(object) {
        const proxy = new Proxy(object, {
            get: function(obj, mod) {
                if (!obj.hasOwnProperty(mod)) return undefined;
                if (Object.getOwnPropertyDescriptor(obj, mod).get) {
                    let value = obj[mod];
                    delete obj[mod];
                    obj[mod] = value;
                }
                return obj[mod];
            },
            set: function(obj, mod, value) {
                if (obj.hasOwnProperty(mod)) return _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err("MemoizedObject", "Trying to overwrite existing property");
                obj[mod] = value;
                return obj[mod];
            }
        });

        Object.defineProperty(proxy, "hasOwnProperty", {value: function(prop) {
            return this[prop] !== undefined;
        }});

        return proxy;
    }

    /**
     * Wraps the method in a `try..catch` block.
     * @param {callable} method - method to wrap
     * @param {string} description - description of method
     * @returns {callable} wrapped version of method
     */
    static suppressErrors(method, description) {
        return (...params) => {
            try { return method(...params);	}
            catch (e) { _logger__WEBPACK_IMPORTED_MODULE_0__["default"].err("Suppression", "Error occurred in " + description, e); }
        };
    }

    /**
     * This only exists because Samo relied on lodash being there... fuck lodash.
     * @param {*} anything - whatever you want
     */
    static isNil(anything) {
        return anything == null;
    }

    /**
     * Format strings with placeholders (`${placeholder}`) into full strings.
     * Quick example: `PluginUtilities.formatString("Hello, ${user}", {user: "Zerebos"})`
     * would return "Hello, Zerebos".
     * @param {string} string - string to format
     * @param {object} values - object literal of placeholders to replacements
     * @returns {string} the properly formatted string
     */
    static formatString(string, values) {
        for (let val in values) {
            string = string.replace(new RegExp(`\\$\\{${val}\\}`, "g"), values[val]);
        }
        return string;
    }

    /* Code below comes from our work on BDv2:
     * https://github.com/JsSucks/BetterDiscordApp/blob/master/common/modules/utils.js
     */

    /**
     * Clones an object and all it's properties.
     * @param {Any} value The value to clone
     * @return {Any} The cloned value
     */
    static deepclone(value) {
        if (typeof value === "object") {
            if (value instanceof Array) return value.map(i => this.deepclone(i));

            const clone = Object.assign({}, value);

            for (let key in clone) {
                clone[key] = this.deepclone(clone[key]);
            }

            return clone;
        }

        return value;
    }

    /**
     * Freezes an object and all it's properties.
     * @param {Any} object The object to freeze
     * @param {Function} exclude A function to filter object that shouldn't be frozen
     */
    static deepfreeze(object, exclude) {
        if (exclude && exclude(object)) return;

        if (typeof object === "object" && object !== null) {
            const properties = Object.getOwnPropertyNames(object);

            for (let property of properties) {
                this.deepfreeze(object[property], exclude);
            }

            Object.freeze(object);
        }

        return object;
    }

    /**
     * Removes an item from an array. This differs from Array.prototype.filter as it mutates the original array instead of creating a new one.
     * @param {Array} array The array to filter
     * @param {Any} item The item to remove from the array
     * @return {Array}
     */
    static removeFromArray(array, item) {
        let index;
        while ((index = array.indexOf(item)) > -1)
            array.splice(index, 1);
        return array;
    }

    /**
     * Checks if a file exists and is a file.
     * @param {String} path The file's path
     * @return {Promise}
     */
    static async fileExists(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) return reject({
                    message: `No such file or directory: ${err.path}`,
                    err
                });

                if (!stats.isFile()) return reject({
                    message: `Not a file: ${path}`,
                    stats
                });

                resolve();
            });
        });
    }

    /**
     * Returns the contents of a file.
     * @param {String} path The file's path
     * @return {Promise}
     */
    static async readFile(path) {
        try {
            await this.fileExists(path);
        } catch (err) {
            throw err;
        }

        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf-8", (err, data) => {
                if (err) return reject({
                    message: `Could not read file: ${path}`,
                    err
                });

                resolve(data);
            });
        });
    }

}

/***/ }),

/***/ "./src/modules/webpackmodules.js":
/*!***************************************!*\
  !*** ./src/modules/webpackmodules.js ***!
  \***************************************/
/*! exports provided: Filters, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Filters", function() { return Filters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WebpackModules; });
/* harmony import */ var _discordmodules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./discordmodules */ "./src/modules/discordmodules.js");


class Filters {
    static byProperties(props, selector = m => m) {
        return module => {
            const component = selector(module);
            if (!component) return false;
            return props.every(property => component[property] !== undefined);
        };
    }

    static byPrototypeFields(fields, selector = m => m) {
        return module => {
            const component = selector(module);
            if (!component) return false;
            if (!component.prototype) return false;
            return fields.every(field => component.prototype[field] !== undefined);
        };
    }

    static byCode(search, selector = m => m) {
        return module => {
            const method = selector(module);
            if (!method) return false;
            return method.toString().search(search) !== -1;
        };
    }

    static byDisplayName(name) {
        return module => {
            return module && module.displayName === name;
        };
    }

    static combine(...filters) {
        return module => {
            return filters.every(filter => filter(module));
        };
    }
}

class WebpackModules {

    static find(filter, first = true) {return this.getModule(filter, first);}
    static findByUniqueProperties(props, first = true) {return first ? this.getByProps(...props) : this.getAllByProps(...props);}
    static findByDisplayName(name) {return this.getByDisplayName(name);}

    /**
     * Finds a module using a filter function.
     * @param {Function} filter A function to use to filter modules
     * @param {Boolean} first Whether to return only the first matching module
     * @return {Any}
     */
    static getModule(filter, first = true) {
        const modules = this.getAllModules();
        const rm = [];
        for (let index in modules) {
            if (!modules.hasOwnProperty(index)) continue;
            const module = modules[index];
            const { exports } = module;
            let foundModule = null;

            if (!exports) continue;
            if (exports.__esModule && exports.default && filter(exports.default)) foundModule = exports.default;
            if (filter(exports)) foundModule = exports;
            if (!foundModule) continue;
            if (first) return foundModule;
            rm.push(foundModule);
        }
        return first || rm.length == 0 ? undefined : rm;
    }

    /**
     * Finds a module by its name.
     * @param {String} name The name of the module
     * @param {Function} fallback A function to use to filter modules if not finding a known module
     * @return {Any}
     */
    static getModuleByName(name, fallback) {
        if (_discordmodules__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProperty(name)) return _discordmodules__WEBPACK_IMPORTED_MODULE_0__["default"][name];
        if (!fallback) return undefined;
        const module = this.getModule(fallback, true);
        return module ? _discordmodules__WEBPACK_IMPORTED_MODULE_0__["default"][name] = module : undefined;
    }

    /**
     * Finds a module by its display name.
     * @param {String} name The display name of the module
     * @return {Any}
     */
    static getByDisplayName(name) {
        return this.getModule(Filters.byDisplayName(name), true);
    }

    /**
     * Finds a module using its code.
     * @param {RegEx} regex A regular expression to use to filter modules
     * @param {Boolean} first Whether to return the only the first matching module
     * @return {Any}
     */
    static getByRegex(regex, first = true) {
        return this.getModule(Filters.byCode(regex), first);
    }

    /**
     * Finds a single module using properties on its prototype.
     * @param {...string} prototypes Properties to use to filter modules
     * @return {Any}
     */
    static getByPrototypes(...prototypes) {
        return this.getModule(Filters.byPrototypeFields(prototypes), true);
    }

    /**
     * Finds all modules with a set of properties of its prototype.
     * @param {...string} prototypes Properties to use to filter modules
     * @return {Any}
     */
    static getAllByPrototypes(...prototypes) {
        return this.getModule(Filters.byPrototypeFields(prototypes), false);
    }

    /**
     * Finds a single module using its own properties.
     * @param {...string} props Properties to use to filter modules
     * @return {Any}
     */
    static getByProps(...props) {
        return this.getModule(Filters.byProperties(props), true);
    }

    /**
     * Finds all modules with a set of properties.
     * @param {...string} props Properties to use to filter modules
     * @return {Any}
     */
    static getAllByProps(...props) {
        return this.getModule(Filters.byProperties(props), false);
    }

    /**
     * Discord's __webpack_require__ function.
     */
    static get require() {
        if (this._require) return this._require;
        const id = "zl-webpackmodules";
        const __webpack_require__ = window["webpackJsonp"]([], {
            [id]: (module, exports, __webpack_require__) => exports.default = __webpack_require__
        }, [id]).default;
        delete __webpack_require__.m[id];
        delete __webpack_require__.c[id];
        return this._require = __webpack_require__;
    }

    /**
     * Returns all loaded modules.
     * @return {Array}
     */
    static getAllModules() {
        return this.require.c;
    }

}

/***/ }),

/***/ "./src/structs/discord/channel.js":
/*!****************************************!*\
  !*** ./src/structs/discord/channel.js ***!
  \****************************************/
/*! exports provided: Channel, PermissionOverwrite, RolePermissionOverwrite, MemberPermissionOverwrite, GuildChannel, GuildTextChannel, GuildVoiceChannel, ChannelCategory, PrivateChannel, DirectMessageChannel, GroupChannel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return Channel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermissionOverwrite", function() { return PermissionOverwrite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RolePermissionOverwrite", function() { return RolePermissionOverwrite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MemberPermissionOverwrite", function() { return MemberPermissionOverwrite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuildChannel", function() { return GuildChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuildTextChannel", function() { return GuildTextChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuildVoiceChannel", function() { return GuildVoiceChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelCategory", function() { return ChannelCategory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrivateChannel", function() { return PrivateChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DirectMessageChannel", function() { return DirectMessageChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupChannel", function() { return GroupChannel; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony import */ var _guild__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./guild */ "./src/structs/discord/guild.js");
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./message */ "./src/structs/discord/message.js");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user */ "./src/structs/discord/user.js");
/**
 * BetterDiscord Channel Struct
 * Copyright (c) 2018-present JsSucks
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/JsSucks/BetterDiscordApp/blob/master/LICENSE
*/







const cache = new WeakMap();

class Channel {

    constructor(data) {
        if (cache.has(data)) return cache.get(data);
        cache.set(data, this);

        this.discordObject = data;
    }

    static from(channel) {
        switch (channel.type) {
            default: return new Channel(channel);
            case 0: return new GuildTextChannel(channel);
            case 1: return new DirectMessageChannel(channel);
            case 2: return new GuildVoiceChannel(channel);
            case 3: return new GroupChannel(channel);
            case 4: return new ChannelCategory(channel);
        }
    }

    static fromId(id) {
        const channel = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].ChannelStore.getChannel(id);
        if (channel) return Channel.from(channel);
    }

    static get GuildChannel() { return GuildChannel; }
    static get GuildTextChannel() { return GuildTextChannel; }
    static get GuildVoiceChannel() { return GuildVoiceChannel; }
    static get ChannelCategory() { return ChannelCategory; }
    static get PrivateChannel() { return PrivateChannel; }
    static get DirectMessageChannel() { return DirectMessageChannel; }
    static get GroupChannel() { return GroupChannel; }

    get id() { return this.discordObject.id; }
    get applicationId() { return this.discordObject.application_id; }
    get type() { return this.discordObject.type; }
    get name() { return this.discordObject.name; }

    /**
     * Send a message in this channel.
     * @param {String} content The new message's content
     * @param {Boolean} parse Whether to parse the message or send it as it is
     * @return {Promise => Message}
     */
    async sendMessage(content, parse = false) {
        if (this.assertPermissions) this.assertPermissions("SEND_MESSAGES", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.VIEW_CHANNEL | modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.SEND_MESSAGES);

        this.select();

        if (parse) content = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageParser.parse(this.discordObject, content);
        else content = {content};

        const response = await modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions._sendMessage(this.id, content);
        return _message__WEBPACK_IMPORTED_MODULE_3__["Message"].from(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageStore.getMessage(this.id, response.body.id));
    }

    /**
     * Send a bot message in this channel that only the current user can see.
     * @param {String} content The new message's content
     * @return {Message}
     */
    sendBotMessage(content) {
        this.select();
        const message = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageParser.createBotMessage(this.id, content);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions.receiveMessage(this.id, message);
        return _message__WEBPACK_IMPORTED_MODULE_3__["Message"].from(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageStore.getMessage(this.id, message.id));
    }

    /**
     * A list of messages in this channel.
     */
    get messages() {
        const messages = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageStore.getMessages(this.id).toArray();
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(messages, m => _message__WEBPACK_IMPORTED_MODULE_3__["Message"].from(m));
    }

    /**
     * Jumps to the latest message in this channel.
     */
    jumpToPresent() {
        if (this.assertPermissions) this.assertPermissions("VIEW_CHANNEL", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.VIEW_CHANNEL);
        if (this.hasMoreAfter) modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions.jumpToPresent(this.id, modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.MAX_MESSAGES_PER_CHANNEL);
        else this.messages[this.messages.length - 1].jumpTo(false);
    }

    get hasMoreAfter() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageStore.getMessages(this.id).hasMoreAfter;
    }

    /**
     * Sends an invite in this channel.
     * @param {String} code The invite code
     * @return {Promise => Messaage}
     */
    async sendInvite(code) {
        if (this.assertPermissions) this.assertPermissions("SEND_MESSAGES", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.VIEW_CHANNEL | modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.SEND_MESSAGES);
        const response = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions.sendInvite(this.id, code);
        return _message__WEBPACK_IMPORTED_MODULE_3__["Message"].from(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageStore.getMessage(this.id, response.body.id));
    }

    /**
     * Opens this channel in the UI.
     */
    select() {
        if (this.assertPermissions) this.assertPermissions("VIEW_CHANNEL", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.VIEW_CHANNEL);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].NavigationUtils.transitionToGuild(this.guildId ? this.guildId : modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.ME, this.id);
    }

    /**
     * Whether this channel is currently selected.
     */
    get isSelected() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentChannel === this;
    }

    /**
     * Updates this channel.
     * @return {Promise}
     */
    async updateChannel(body) {
        if (this.assertPermissions) this.assertPermissions("MANAGE_CHANNELS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_CHANNELS);
        await modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.patch({
            url: `${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.CHANNELS}/${this.id}`,
            body
        });
        this.discordObject = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].ChannelStore.getChannel(this.id);
        cache.set(this.discordObject, this);
    }

}

class PermissionOverwrite {
    constructor(data, channel_id) {
        this.discordObject = data;
        this.channelId = channel_id;
    }

    static from(data, channel_id) {
        switch (data.type) {
            default: return new PermissionOverwrite(data, channel_id);
            case "role": return new RolePermissionOverwrite(data, channel_id);
            case "member": return new MemberPermissionOverwrite(data, channel_id);
        }
    }

    static get RolePermissionOverwrite() { return RolePermissionOverwrite; }
    static get MemberPermissionOverwrite() { return MemberPermissionOverwrite; }

    get type() { return this.discordObject.type; }
    get allow() { return this.discordObject.allow; }
    get deny() { return this.discordObject.deny; }

    get channel() {
        return Channel.fromId(this.channelId);
    }

    get guild() {
        if (this.channel) return this.channel.guild;
    }
}

class RolePermissionOverwrite extends PermissionOverwrite {
    get roleId() { return this.discordObject.id; }

    get role() {
        if (this.guild) return this.guild.roles.find(r => r.id === this.roleId);
    }
}

class MemberPermissionOverwrite extends PermissionOverwrite {
    get memberId() { return this.discordObject.id; }

    get member() {
        return _user__WEBPACK_IMPORTED_MODULE_4__["GuildMember"].fromId(this.memberId);
    }
}

class GuildChannel extends Channel {
    static get PermissionOverwrite() { return PermissionOverwrite; }

    get guildId() { return this.discordObject.guild_id; }
    get parentId() { return this.discordObject.parent_id; } // Channel category
    get position() { return this.discordObject.position; }
    get nicks() { return this.discordObject.nicks; }

    checkPermissions(perms) {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PermissionUtils.can(perms, modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser, this.discordObject);
    }

    assertPermissions(name, perms) {
        if (!this.checkPermissions(perms)) throw new structs__WEBPACK_IMPORTED_MODULE_1__["InsufficientPermissions"](name);
    }

    get category() {
        return Channel.fromId(this.parentId);
    }

    /**
     * The current user's permissions on this channel.
     */
    get permissions() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildPermissions.getChannelPermissions(this.id);
    }

    get permissionOverwrites() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(Object.values(this.discordObject.permissionOverwrites), p => PermissionOverwrite.from(p, this.id));
    }

    get guild() {
        return _guild__WEBPACK_IMPORTED_MODULE_2__["Guild"].fromId(this.guildId);
    }

    /**
     * Whether this channel is the guild's default channel.
     */
    get isDefaultChannel() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildChannelsStore.getDefaultChannel(this.guildId).id === this.id;
    }

    /**
     * Opens this channel's settings window.
     * @param {String} section The section to open (see DiscordConstants.ChannelSettingsSections)
     */
    openSettings(section = "OVERVIEW") {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].ChannelSettingsWindow.setSection(section);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].ChannelSettingsWindow.open(this.id);
    }

    /**
     * Updates this channel's name.
     * @param {String} name The channel's new name
     * @return {Promise}
     */
    updateName(name) {
        return this.updateChannel({name});
    }

    /**
     * Changes the channel's position.
     * @param {Number} position The channel's new position
     * @return {Promise}
     */
    changeSortLocation(position = 0) {
        if (position instanceof GuildChannel) position = position.position;
        return this.updateChannel({position});
    }

    /**
     * Updates this channel's permission overwrites.
     * @param {Array} permissionOverwrites An array of permission overwrites
     * @return {Promise}
     */
    updatePermissionOverwrites(permission_overwrites) {
        return this.updateChannel({permission_overwrites});
    }

    /**
     * Updates this channel's category.
     * @param {ChannelCategory} category The new channel category
     * @return {Promise}
     */
    updateCategory(category) {
        return this.updateChannel({parent_id: category.id || category});
    }
}

// Type 0 - GUILD_TEXT
class GuildTextChannel extends GuildChannel {
    get type() { return "GUILD_TEXT"; }
    get topic() { return this.discordObject.topic; }
    get nsfw() { return this.discordObject.nsfw; }

    /**
     * Updates this channel's topic.
     * @param {String} topc The new channel topic
     * @return {Promise}
     */
    updateTopic(topic) {
        return this.updateChannel({topic});
    }

    /**
     * Updates this channel's NSFW flag.
     * @param {Boolean} nsfw Whether the channel should be marked as NSFW
     * @return {Promise}
     */
    setNsfw(nsfw = true) {
        return this.updateChannel({nsfw});
    }

    setNotNsfw() {
        return this.setNswf(false);
    }
}

// Type 2 - GUILD_VOICE
class GuildVoiceChannel extends GuildChannel {
    get type() { return "GUILD_VOICE"; }
    get userLimit() { return this.discordObject.userLimit; }
    get bitrate() { return this.discordObject.bitrate; }

    sendMessage() { throw new Error("Cannot send messages in a voice channel."); }
    get messages() { return new structs__WEBPACK_IMPORTED_MODULE_1__["List"](); }
    jumpToPresent() { throw new Error("Cannot select a voice channel."); }
    get hasMoreAfter() { return false; }
    sendInvite() { throw new Error("Cannot invite someone to a voice channel."); }
    select() { throw new Error("Cannot select a voice channel."); }

    /**
     * Updates this channel's bitrate.
     * @param {Number} bitrate The new bitrate
     * @return {Promise}
     */
    updateBitrate(bitrate) {
        return this.updateChannel({bitrate});
    }

    /**
     * Updates this channel's user limit.
     * @param {Number} userLimit The new user limit
     * @return {Promise}
     */
    updateUserLimit(user_limit) {
        return this.updateChannel({user_limit});
    }
}

// Type 4 - GUILD_CATEGORY
class ChannelCategory extends GuildChannel {
    get type() { return "GUILD_CATEGORY"; }
    get parentId() { return undefined; }
    get category() { return undefined; }

    sendMessage() { throw new Error("Cannot send messages in a channel category."); }
    get messages() { return new structs__WEBPACK_IMPORTED_MODULE_1__["List"](); }
    jumpToPresent() { throw new Error("Cannot select a channel category."); }
    get hasMoreAfter() { return false; }
    sendInvite() { throw new Error("Cannot invite someone to a channel category."); }
    select() { throw new Error("Cannot select a channel category."); }
    updateCategory() { throw new Error("Cannot set a channel category on another channel category."); }

    /**
     * A list of channels in this category.
     */
    get channels() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.guild.channels, c => c.parentId === this.id);
    }

    /**
     * Opens the create channel modal for this guild.
     * @param {Number} type The type of channel to create - either 0 (text), 2 (voice) or 4 (category)
     * @param {GuildChannel} clone A channel to clone permissions of
     */
    openCreateChannelModal(type, category, clone) {
        this.guild.openCreateChannelModal(type, this.id, this, clone);
    }

    /**
     * Creates a channel in this category.
     * @param {Number} type The type of channel to create - either 0 (text) or 2 (voice)
     * @param {String} name A name for the new channel
     * @param {Array} permission_overwrites An array of PermissionOverwrite-like objects - leave to use the permissions of the category
     * @return {Promise => GuildChannel}
     */
    createChannel(type, name, permission_overwrites) {
        return this.guild.createChannel(type, name, this, permission_overwrites);
    }
}

class PrivateChannel extends Channel {
    get userLimit() { return this.discordObject.userLimit; }
    get bitrate() { return this.discordObject.bitrate; }
}

// Type 1 - DM
class DirectMessageChannel extends PrivateChannel {
    get type() { return "DM"; }
    get recipientId() { return this.discordObject.recipients[0]; }

    /**
     * The other user of this direct message channel.
     */
    get recipient() {
        return _user__WEBPACK_IMPORTED_MODULE_4__["User"].fromId(this.recipientId);
    }
}

// Type 3 - GROUP_DM
class GroupChannel extends PrivateChannel {
    get ownerId() { return this.discordObject.ownerId; }
    get type() { return "GROUP_DM"; }
    get name() { return this.discordObject.name; }
    get icon() { return this.discordObject.icon; }

    /**
     * A list of the other members of this group direct message channel.
     */
    get members() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.discordObject.recipients, id => _user__WEBPACK_IMPORTED_MODULE_4__["User"].fromId(id));
    }

    /**
     * The owner of this group direct message channel. This is usually the person who created it.
     */
    get owner() {
        return _user__WEBPACK_IMPORTED_MODULE_4__["User"].fromId(this.ownerId);
    }

    /**
     * Updates this channel's name.
     * @param {String} name The channel's new name
     * @return {Promise}
     */
    updateName(name) {
        return this.updateChannel({name});
    }
}


/***/ }),

/***/ "./src/structs/discord/guild.js":
/*!**************************************!*\
  !*** ./src/structs/discord/guild.js ***!
  \**************************************/
/*! exports provided: Role, Emoji, Guild */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Role", function() { return Role; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Emoji", function() { return Emoji; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Guild", function() { return Guild; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony import */ var _channel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./channel */ "./src/structs/discord/channel.js");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user */ "./src/structs/discord/user.js");
/**
 * BetterDiscord Guild Struct
 * Copyright (c) 2018-present JsSucks
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/JsSucks/BetterDiscordApp/blob/master/LICENSE
*/






const roles = new WeakMap();

class Role {
    constructor(data, guild_id) {
        if (roles.has(data)) return roles.get(data);
        roles.set(data, this);

        this.discordObject = data;
        this.guildId = guild_id;
    }

    get id() { return this.discordObject.id; }
    get name() { return this.discordObject.name; }
    get position() { return this.discordObject.position; }
    get originalPosition() { return this.discordObject.originalPosition; }
    get permissions() { return this.discordObject.permissions; }
    get managed() { return this.discordObject.managed; }
    get mentionable() { return this.discordObject.mentionable; }
    get hoist() { return this.discordObject.hoist; }
    get colour() { return this.discordObject.color; }
    get colourString() { return this.discordObject.colorString; }

    get guild() {
        return Guild.fromId(this.guildId);
    }

    get members() {
        return this.guild.members.filter(m => m.roles.includes(this));
    }
}

const emojis = new WeakMap();

class Emoji {
    constructor(data) {
        if (emojis.has(data)) return emojis.get(data);
        emojis.set(data, this);

        this.discordObject = data;
    }

    get id() { return this.discordObject.id; }
    get guildId() { return this.discordObject.guild_id; }
    get name() { return this.discordObject.name; }
    get managed() { return this.discordObject.managed; }
    get animated() { return this.discordObject.animated; }
    get allNamesString() { return this.discordObject.allNamesString; }
    get requireColons() { return this.discordObject.require_colons; }
    get url() { return this.discordObject.url; }
    get roles() { return this.discordObject.roles; }

    get guild() {
        return Guild.fromId(this.guildId);
    }
}

const guilds = new WeakMap();

class Guild {

    constructor(data) {
        if (guilds.has(data)) return guilds.get(data);
        guilds.set(data, this);

        this.discordObject = data;
    }

    static from(data) {
        return new Guild(data);
    }

    static fromId(id) {
        const guild = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildStore.getGuild(id);
        if (guild) return Guild.from(guild);
    }

    static get Role() { return Role; }
    static get Emoji() { return Emoji; }

    get id() { return this.discordObject.id; }
    get ownerId() { return this.discordObject.ownerId; }
    get applicationId() { return this.discordObject.application_id; }
    get systemChannelId() { return this.discordObject.systemChannelId; }
    get name() { return this.discordObject.name; }
    get acronym() { return this.discordObject.acronym; }
    get icon() { return this.discordObject.icon; }
    get joinedAt() { return this.discordObject.joinedAt; }
    get verificationLevel() { return this.discordObject.verificationLevel; }
    get mfaLevel() { return this.discordObject.mfaLevel; }
    get large() { return this.discordObject.large; }
    get lazy() { return this.discordObject.lazy; }
    get voiceRegion() { return this.discordObject.region; }
    get afkChannelId() { return this.discordObject.afkChannelId; }
    get afkTimeout() { return this.discordObject.afkTimeout; }
    get explicitContentFilter() { return this.discordObject.explicitContentFilter; }
    get defaultMessageNotifications() { return this.discordObject.defaultMessageNotifications; }
    get splash() { return this.discordObject.splash; }
    get features() { return this.discordObject.features; }

    get owner() {
        return this.members.find(m => m.userId === this.ownerId);
    }

    get roles() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(Object.values(this.discordObject.roles), r => new Role(r, this.id))
            .sort((r1, r2) => r1.position === r2.position ? 0 : r1.position > r2.position ? 1 : -1);
    }

    get channels() {
        const channels = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildChannelsStore.getChannels(this.id);
        const returnChannels = new structs__WEBPACK_IMPORTED_MODULE_1__["List"]();
        for (const category in channels) {
            if (channels.hasOwnProperty(category)) {
                if (!Array.isArray(channels[category])) continue;
                const channelList = channels[category];
                for (const channel of channelList) {
                    // For some reason Discord adds a new category with the ID "null" and name "Uncategorized"
                    if (channel.channel.id === "null") continue;
                    returnChannels.push(_channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].from(channel.channel));
                }
            }
        }
        return returnChannels;
    }

    /**
     * Channels that don't have a parent. (Channel categories and any text/voice channel not in one.)
     */
    get mainChannels() {
        return this.channels.filter(c => !c.parentId);
    }

    /**
     * The guild's default channel. (Usually the first in the list.)
     */
    get defaultChannel() {
        return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].from(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildChannelsStore.getDefaultChannel(this.id));
    }

    /**
     * The guild's AFK channel.
     */
    get afkChannel() {
        if (this.afkChannelId) return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].fromId(this.afkChannelId);
    }

    /**
     * The channel system messages are sent to.
     */
    get systemChannel() {
        if (this.systemChannelId) return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].fromId(this.systemChannelId);
    }

    /**
     * A list of GuildMember objects.
     */
    get members() {
        const members = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildMemberStore.getMembers(this.id);
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(members, m => new _user__WEBPACK_IMPORTED_MODULE_3__["GuildMember"](m, this.id));
    }

    /**
     * The current user as a GuildMember of this guild.
     */
    get currentUser() {
        return this.members.find(m => m.user === modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser);
    }

    /**
     * The total number of members in the guild.
     */
    get memberCount() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MemberCountStore.getMemberCount(this.id);
    }

    /**
     * An array of the guild's custom emojis.
     */
    get emojis() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].EmojiUtils.getGuildEmoji(this.id), e => new Emoji(e, this.id));
    }

    checkPermissions(perms) {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PermissionUtils.can(perms, modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser, this.discordObject);
    }

    assertPermissions(name, perms) {
        if (!this.checkPermissions(perms)) throw new structs__WEBPACK_IMPORTED_MODULE_1__["InsufficientPermissions"](name);
    }

    /**
     * The current user's permissions on this guild.
     */
    get permissions() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildPermissions.getGuildPermissions(this.id);
    }

    getMember(id) {
        const member = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildMemberStore.getMember(this.id, id);
        if (member) return new _user__WEBPACK_IMPORTED_MODULE_3__["GuildMember"](member, this.id);
    }

    isMember(id) {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildMemberStore.isMember(this.id, id);
    }

    /**
     * Whether the user has not restricted direct messages from members of this guild.
     */
    get allowPrivateMessages() {
        return !modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].UserSettings.restrictedGuildIds.includes(this.id);
    }

    /**
     * Marks all messages in the guild as read.
     */
    markAsRead() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.markGuildAsRead(this.id);
    }

    /**
     * Selects the guild in the UI.
     */
    select() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.selectGuild(this.id);
    }

    /**
     * Whether this guild is currently selected.
     */
    get isSelected() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentGuild === this;
    }

    /**
     * Opens this guild's settings window.
     * @param {String} section The section to open (see DiscordConstants.GuildSettingsSections)
     */
    openSettings(section = "OVERVIEW") {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildSettingsWindow.setSection(section);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildSettingsWindow.open(this.id);
    }

    /**
     * Kicks members who don't have any roles and haven't been seen in the number of days passed.
     * @param {Number} days
     */
    pruneMembers(days) {
        this.assertPermissions("KICK_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.KICK_MEMBERS);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PruneMembersModal.prune(this.id, days);
    }

    openPruneMumbersModal() {
        this.assertPermissions("KICK_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.KICK_MEMBERS);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PruneMembersModal.open(this.id);
    }

    /**
     * Opens the create channel modal for this guild.
     * @param {Number} type The type of channel to create - either 0 (text), 2 (voice) or 4 (category)
     * @param {ChannelCategory} category The category to create the channel in
     * @param {GuildChannel} clone A channel to clone permissions, topic, bitrate and user limit of
     */
    openCreateChannelModal(type, category, clone) {
        this.assertPermissions("MANAGE_CHANNELS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_CHANNELS);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].CreateChannelModal.open(type, this.id, category ? category.id : undefined, clone ? clone.id : undefined);
    }

    /**
     * Creates a channel in this guild.
     * @param {Number} type The type of channel to create - either 0 (text), 2 (voice) or 4 (category)
     * @param {String} name A name for the new channel
     * @param {ChannelCategory} category The category to create the channel in
     * @param {Array} permission_overwrites An array of PermissionOverwrite-like objects - leave to use the permissions of the category
     * @return {Promise => GuildChannel}
     */
    async createChannel(type, name, category, permission_overwrites) {
        this.assertPermissions("MANAGE_CHANNELS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_CHANNELS);
        const response = await modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.post({
            url: modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.GUILD_CHANNELS(this.id),
            body: {
                type, name,
                parent_id: category ? category.id : undefined,
                permission_overwrites: permission_overwrites ? permission_overwrites.map(p => ({
                    type: p.type,
                    id: (p.type === "user" ? p.userId : p.roleId) || p.id,
                    allow: p.allow,
                    deny: p.deny
                })) : undefined
            }
        });

        return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].fromId(response.body.id);
    }

    openNotificationSettingsModal() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].NotificationSettingsModal.open(this.id);
    }

    openPrivacySettingsModal() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PrivacySettingsModal.open(this.id);
    }

    nsfwAgree() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.nsfwAgree(this.id);
    }

    nsfwDisagree() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.nsfwDisagree(this.id);
    }

    /**
     * Changes the guild's position in the list.
     * @param {Number} index The new position
     */
    changeSortLocation(index) {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.move(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].guildPositions.indexOf(this.id), index);
    }

    /**
     * Updates this guild.
     * @return {Promise}
     */
    async updateGuild(body) {
        this.assertPermissions("MANAGE_GUILD", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_GUILD);
        await modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildSettingsWindow.saveGuild(this.id, body);
        this.discordObject = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildStore.getGuild(this.id);
        guilds.set(this.discordObject, this);
    }

    /**
     * Updates this guild's name.
     * @param {String} name The new name
     * @return {Promise}
     */
    updateName(name) {
        return this.updateGuild({ name });
    }

    /**
     * Updates this guild's voice region.
     * @param {String} region The ID of the new voice region (obtainable via the API - see https://discordapp.com/developers/docs/resources/voice#list-voice-regions)
     * @return {Promise}
     */
    updateVoiceRegion(region) {
        return this.updateGuild({ region });
    }

    /**
     * Updates this guild's verification level.
     * @param {Number} verificationLevel The new verification level (see https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level)
     * @return {Promise}
     */
    updateVerificationLevel(verification_level) {
        return this.updateGuild({ verification_level });
    }

    /**
     * Updates this guild's default message notification level.
     * @param {Number} defaultMessageNotifications The new default notification level (0: all messages, 1: only mentions)
     * @return {Promise}
     */
    updateDefaultMessageNotifications(default_message_notifications) {
        return this.updateGuild({ default_message_notifications });
    }

    /**
     * Updates this guild's explicit content filter level.
     * @param {Number} explicitContentFilter The new explicit content filter level (0: disabled, 1: members without roles, 2: everyone)
     * @return {Promise}
     */
    updateExplicitContentFilter(explicit_content_filter) {
        return this.updateGuild({ explicit_content_filter });
    }

    /**
     * Updates this guild's AFK channel.
     * @param {GuildVoiceChannel} afkChannel The new AFK channel
     * @return {Promise}
     */
    updateAfkChannel(afk_channel) {
        return this.updateGuild({ afk_channel_id: afk_channel.id || afk_channel });
    }

    /**
     * Updates this guild's AFK timeout.
     * @param {Number} afkTimeout The new AFK timeout
     * @return {Promise}
     */
    updateAfkTimeout(afk_timeout) {
        return this.updateGuild({ afk_timeout });
    }

    /**
     * Updates this guild's icon.
     * @param {Buffer|String} icon A buffer/base 64 encoded 128x128 JPEG image
     * @return {Promise}
     */
    updateIcon(icon) {
        return this.updateGuild({ icon: typeof icon === "string" ? icon : icon.toString("base64") });
    }

    /**
     * Updates this guild's icon using a local file.
     * TODO
     * @param {String} icon_path The path to the new icon
     * @return {Promise}
     */
    async updateIconFromFile(icon_path) {
        const buffer = await modules__WEBPACK_IMPORTED_MODULE_0__["Utilities"].readFileBuffer(icon_path);
        return this.updateIcon(buffer);
    }

    /**
     * Updates this guild's owner. (Should plugins really ever need to do this?)
     * @param {User|GuildMember} owner The user/guild member to transfer ownership to
     * @return {Promise}
     */
    updateOwner(owner) {
        return this.updateGuild({ owner_id: owner.user ? owner.user.id : owner.id || owner });
    }

    /**
     * Updates this guild's splash image.
     * (I don't know what this is actually used for. The API documentation says it's VIP-only.)
     * @param {Buffer|String} icon A buffer/base 64 encoded 128x128 JPEG image
     * @return {Promise}
     */
    updateSplash(splash) {
        return this.updateGuild({ splash: typeof splash === "string" ? splash : splash.toString("base64") });
    }

    /**
     * Updates this guild's splash image using a local file.
     * TODO
     * @param {String} splash_path The path to the new splash
     * @return {Promise}
     */
    async updateSplashFromFile(splash_path) {
        const buffer = await modules__WEBPACK_IMPORTED_MODULE_0__["Utilities"].readFileBuffer(splash_path);
        return this.updateSplash(buffer);
    }

    /**
     * Updates this guild's system channel.
     * @param {GuildTextChannel} systemChannel The new system channel
     * @return {Promise}
     */
    updateSystemChannel(system_channel) {
        return this.updateGuild({ system_channel_id: system_channel.id || system_channel });
    }

}


/***/ }),

/***/ "./src/structs/discord/message.js":
/*!****************************************!*\
  !*** ./src/structs/discord/message.js ***!
  \****************************************/
/*! exports provided: Reaction, Embed, Message, DefaultMessage, RecipientAddMessage, RecipientRemoveMessage, CallMessage, GroupChannelNameChangeMessage, GroupChannelIconChangeMessage, MessagePinnedMessage, GuildMemberJoinMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Reaction", function() { return Reaction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Embed", function() { return Embed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Message", function() { return Message; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultMessage", function() { return DefaultMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipientAddMessage", function() { return RecipientAddMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecipientRemoveMessage", function() { return RecipientRemoveMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallMessage", function() { return CallMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupChannelNameChangeMessage", function() { return GroupChannelNameChangeMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupChannelIconChangeMessage", function() { return GroupChannelIconChangeMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessagePinnedMessage", function() { return MessagePinnedMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuildMemberJoinMessage", function() { return GuildMemberJoinMessage; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony import */ var _channel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./channel */ "./src/structs/discord/channel.js");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user */ "./src/structs/discord/user.js");
/**
 * BetterDiscord Message Struct
 * Copyright (c) 2018-present JsSucks
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/JsSucks/BetterDiscordApp/blob/master/LICENSE
*/






const reactions = new WeakMap();

class Reaction {
    constructor(data, message_id, channel_id) {
        if (reactions.has(data)) return reactions.get(data);
        reactions.set(data, this);

        this.discordObject = data;
        this.messageId = message_id;
        this.channelId = channel_id;
    }

    get emoji() {
        const id = this.discordObject.emoji.id;
        if (!id || !this.guild) return this.discordObject.emoji;
        return this.guild.emojis.find(e => e.id === id);
    }

    get count() { return this.discordObject.count; }
    get me() { return this.discordObject.me; }

    get channel() {
        return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].fromId(this.channel_id);
    }

    get message() {
        if (this.channel) return this.channel.messages.find(m => m.id === this.messageId);
    }

    get guild() {
        if (this.channel) return this.channel.guild;
    }
}

const embeds = new WeakMap();

class Embed {
    constructor(data, message_id, channel_id) {
        if (embeds.has(data)) return embeds.get(data);
        embeds.set(data, this);

        this.discordObject = data;
        this.messageId = message_id;
        this.channelId = channel_id;
    }

    get title() { return this.discordObject.title; }
    get type() { return this.discordObject.type; }
    get description() { return this.discordObject.description; }
    get url() { return this.discordObject.url; }
    get timestamp() { return this.discordObject.timestamp; }
    get colour() { return this.discordObject.color; }
    get footer() { return this.discordObject.footer; }
    get image() { return this.discordObject.image; }
    get thumbnail() { return this.discordObject.thumbnail; }
    get video() { return this.discordObject.video; }
    get provider() { return this.discordObject.provider; }
    get author() { return this.discordObject.author; }
    get fields() { return this.discordObject.fields; }

    get channel() {
        return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].fromId(this.channelId);
    }

    get message() {
        if (this.channel) return this.channel.messages.find(m => m.id === this.messageId);
    }

    get guild() {
        if (this.channel) return this.channel.guild;
    }
}

const messages = new WeakMap();

class Message {

    constructor(data) {
        if (messages.has(data)) return messages.get(data);
        messages.set(data, this);

        this.discordObject = data;
    }

    static from(data) {
        switch (data.type) {
            default: return new Message(data);
            case 0: return new DefaultMessage(data);
            case 1: return new RecipientAddMessage(data);
            case 2: return new RecipientRemoveMessage(data);
            case 3: return new CallMessage(data);
            case 4: return new GroupChannelNameChangeMessage(data);
            case 5: return new GroupChannelIconChangeMessage(data);
            case 6: return new MessagePinnedMessage(data);
            case 7: return new GuildMemberJoinMessage(data);
        }
    }

    static get DefaultMessage() { return DefaultMessage; }
    static get RecipientAddMessage() { return RecipientAddMessage; }
    static get RecipientRemoveMessage() { return RecipientRemoveMessage; }
    static get CallMessage() { return CallMessage; }
    static get GroupChannelNameChangeMessage() { return GroupChannelNameChangeMessage; }
    static get GroupChannelIconChangeMessage() { return GroupChannelIconChangeMessage; }
    static get MessagePinnedMessage() { return MessagePinnedMessage; }
    static get GuildMemberJoinMessage() { return GuildMemberJoinMessage; }

    static get Reaction() { return Reaction; }
    static get Embed() { return Embed; }

    get id() { return this.discordObject.id; }
    get channelId() { return this.discordObject.channel_id; }
    get nonce() { return this.discordObject.nonce; }
    get type() { return this.discordObject.type; }
    get timestamp() { return this.discordObject.timestamp; }
    get state() { return this.discordObject.state; }
    get nick() { return this.discordObject.nick; }
    get colourString() { return this.discordObject.colorString; }

    get author() {
        if (this.discordObject.author && !this.webhookId) return _user__WEBPACK_IMPORTED_MODULE_3__["User"].from(this.discordObject.author);
    }

    get channel() {
        return _channel__WEBPACK_IMPORTED_MODULE_2__["Channel"].fromId(this.channelId);
    }

    get guild() {
        if (this.channel) return this.channel.guild;
    }

    /**
     * Deletes the message.
     * @return {Promise}
     */
    delete() {
        if (!this.isDeletable) throw new Error(`Message type ${this.type} is not deletable.`);
        if (this.author !== modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser) {
            if (this.channel.assertPermissions) this.channel.assertPermissions("MANAGE_MESSAGES", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_MESSAGES);
            else if (!this.channel.owner === modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser) throw new structs__WEBPACK_IMPORTED_MODULE_1__["InsufficientPermissions"]("MANAGE_MESSAGES");
        }

        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.delete(`${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.MESSAGES(this.channelId)}/${this.id}`);
    }

    get isDeletable() {
        return this.type === "DEFAULT" || this.type === "CHANNEL_PINNED_MESSAGE" || this.type === "GUILD_MEMBER_JOIN";
    }

    /**
     * Jumps to the message.
     */
    jumpTo(flash = true) {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions.jumpToMessage(this.channelId, this.id, flash);
    }

}

class DefaultMessage extends Message {
    get webhookId() { return this.discordObject.webhookId; }
    get type() { return "DEFAULT"; }
    get content() { return this.discordObject.content; }
    get contentParsed() { return this.discordObject.contentParsed; }
    get inviteCodes() { return this.discordObject.invites; }
    get attachments() { return this.discordObject.attachments; }
    get mentionIds() { return this.discordObject.mentions; }
    get mentionRoleIds() { return this.discordObject.mentionRoles; }
    get mentionEveryone() { return this.discordObject.mentionEveryone; }
    get editedTimestamp() { return this.discordObject.editedTimestamp; }
    get tts() { return this.discordObject.tts; }
    get mentioned() { return this.discordObject.mentioned; }
    get bot() { return this.discordObject.bot; }
    get blocked() { return this.discordObject.blocked; }
    get pinned() { return this.discordObject.pinned; }
    get activity() { return this.discordObject.activity; }
    get application() { return this.discordObject.application; }

    get webhook() {
        if (this.webhookId) return this.discordObject.author;
    }

    get mentions() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.mentionIds, id => _user__WEBPACK_IMPORTED_MODULE_3__["User"].fromId(id));
    }

    get mention_roles() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.mentionRoleIds, id => this.guild.roles.find(r => r.id === id));
    }

    get embeds() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.discordObject.embeds, r => new Embed(r, this.id, this.channelId));
    }

    get reactions() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.discordObject.reactions, r => new Reaction(r, this.id, this.channelId));
    }

    get edited() {
        return !!this.editedTimestamp;
    }

    /**
     * Programmatically update the message's content.
     * @param {String} content The message's new content
     * @param {Boolean} parse Whether to parse the message or update it as it is
     * @return {Promise}
     */
    async edit(content, parse = false) {
        if (this.author !== modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser) throw new Error("Cannot edit messages sent by other users.");
        if (parse) content = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageParser.parse(this.discordObject, content);
        else content = {content};

        const response = await modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.patch({
            url: `${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.MESSAGES(this.channelId)}/${this.id}`,
            body: content
        });

        this.discordObject = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageStore.getMessage(this.id, response.body.id);
        messages.set(this.discordObject, this);
    }

    /**
     * Start the edit mode of the UI.
     * @param {String} content A string to show in the message text area - if empty the message's current content will be used
     */
    startEdit(content) {
        if (this.author !== modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser) throw new Error("Cannot edit messages sent by other users.");
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions.startEditMessage(this.channelId, this.id, content || this.content);
    }

    /**
     * Exit the edit mode of the UI.
     */
    endEdit() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].MessageActions.endEditMessage();
    }
}

class RecipientAddMessage extends Message {
    get type() { return "RECIPIENT_ADD"; }
    get addedUserId() { return this.discordObject.mentions[0]; }

    get addedUser() {
        return _user__WEBPACK_IMPORTED_MODULE_3__["User"].fromId(this.addedUserId);
    }
}

class RecipientRemoveMessage extends Message {
    get type() { return "RECIPIENT_REMOVE"; }
    get removedUserId() { return this.discordObject.mentions[0]; }

    get removedUser() {
        return _user__WEBPACK_IMPORTED_MODULE_3__["User"].fromId(this.removedUserId);
    }

    get userLeft() {
        return this.author === this.removedUser;
    }
}

class CallMessage extends Message {
    get type() { return "CALL"; }
    get mentionIds() { return this.discordObject.mentions; }
    get call() { return this.discordObject.call; }

    get endedTimestamp() { return this.call.endedTimestamp; }

    get mentions() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.mentionIds, id => _user__WEBPACK_IMPORTED_MODULE_3__["User"].fromId(id));
    }

    get participants() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.call.participants, id => _user__WEBPACK_IMPORTED_MODULE_3__["User"].fromId(id));
    }
}

class GroupChannelNameChangeMessage extends Message {
    get type() { return "CHANNEL_NAME_CHANGE"; }
    get newName() { return this.discordObject.content; }
}

class GroupChannelIconChangeMessage extends Message {
    get type() { return "CHANNEL_ICON_CHANGE"; }
}

class MessagePinnedMessage extends Message {
    get type() { return "CHANNEL_PINNED_MESSAGE"; }
}

class GuildMemberJoinMessage extends Message {
    get type() { return "GUILD_MEMBER_JOIN"; }
}


/***/ }),

/***/ "./src/structs/discord/user.js":
/*!*************************************!*\
  !*** ./src/structs/discord/user.js ***!
  \*************************************/
/*! exports provided: User, GuildMember */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuildMember", function() { return GuildMember; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony import */ var _guild__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./guild */ "./src/structs/discord/guild.js");
/* harmony import */ var _channel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./channel */ "./src/structs/discord/channel.js");
/**
 * BetterDiscord User Struct
 * Copyright (c) 2018-present JsSucks
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/JsSucks/BetterDiscordApp/blob/master/LICENSE
*/






const users = new WeakMap();

class User {

    constructor(data) {
        if (users.has(data)) return users.get(data);
        users.set(data, this);

        this.discordObject = data;
    }

    static from(data) {
        return new User(data);
    }

    static fromId(id) {
        const user = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserStore.getUser(id);
        if (user) return User.from(user);
    }

    get id() { return this.discordObject.id; }
    get username() { return this.discordObject.username; }
    get usernameLowerCase() { return this.discordObject.usernameLowerCase; }
    get discriminator() { return this.discordObject.discriminator; }
    get avatar() { return this.discordObject.avatar; }
    get email() { return undefined; }
    get phone() { return undefined; }
    get flags() { return this.discordObject.flags; }
    get isBot() { return this.discordObject.bot; }
    get premium() { return this.discordObject.premium; }
    get verified() { return this.discordObject.verified; }
    get mfaEnabled() { return this.discordObject.mfaEnabled; }
    get mobile() { return this.discordObject.mobile; }

    get tag() { return this.discordObject.tag; }
    get avatarUrl() { return this.discordObject.avatarURL; }
    get createdAt() { return this.discordObject.createdAt; }

    get isClamied() { return this.discordObject.isClaimed(); }
    get isLocalBot() { return this.discordObject.isLocalBot(); }
    get isPhoneVerified() { return this.discordObject.isPhoneVerified(); }

    get guilds() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].guilds.filter(g => g.members.find(m => m.user === this));
    }

    get status() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserStatusStore.getStatus(this.id);
    }

    get activity() {
        // type can be either 0 (normal/rich presence game), 1 (streaming) or 2 (listening to Spotify)
        // (3 appears as watching but is undocumented)
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserStatusStore.getActivity(this.id);
    }

    get note() {
        const note = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserNoteStore.getNote(this.id);
        if (note) return note;
    }

    /**
     * Updates the note for this user.
     * @param {String} note The new note
     * @return {Promise}
     */
    updateNote(note) {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.put({
            url: `${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.NOTES}/${this.id}`,
            body: { note }
        });
    }

    get privateChannel() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].channels.find(c => c.type === "DM" && c.recipientId === this.id);
    }

    async ensurePrivateChannel() {
        if (modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser === this)
            throw new Error("Cannot create a direct message channel to the current user.");
        return _channel__WEBPACK_IMPORTED_MODULE_3__["Channel"].fromId(await modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PrivateChannelActions.ensurePrivateChannel(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser.id, this.id));
    }

    async sendMessage(content, parse = true) {
        const channel = await this.ensurePrivateChannel();
        return channel.sendMessage(content, parse);
    }

    get isFriend() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].RelationshipStore.isFriend(this.id);
    }

    get isBlocked() {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].RelationshipStore.isBlocked(this.id);
    }

    addFriend() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].RelationshipManager.addRelationship(this.id, {location: "Context Menu"});
    }

    removeFriend() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].RelationshipManager.removeRelationship(this.id, {location: "Context Menu"});
    }

    block() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].RelationshipManager.addRelationship(this.id, {location: "Context Menu"}, modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.RelationshipTypes.BLOCKED);
    }

    unblock() {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].RelationshipManager.removeRelationship(this.id, {location: "Context Menu"});
    }

    /**
     * Opens the profile modal for this user.
     * @param {String} section The section to open (see DiscordConstants.UserProfileSections)
     */
    openUserProfileModal(section = "USER_INFO") {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserProfileModal.open(this.id);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserProfileModal.setSection(section);
    }

}

const guild_members = new WeakMap();

class GuildMember {
    constructor(data, guild_id) {
        if (guild_members.has(data)) return guild_members.get(data);
        guild_members.set(data, this);

        this.discordObject = data;
        this.guildId = guild_id;
    }

    get userId() { return this.discordObject.userId; }
    get nickname() { return this.discordObject.nick; }
    get colourString() { return this.discordObject.colorString; }
    get hoistRoleId() { return this.discordObject.hoistRoleId; }
    get roleIds() { return this.discordObject.roles; }

    get user() {
        return User.fromId(this.userId);
    }

    get name() {
        return this.nickname || this.user.username;
    }

    get guild() {
        return _guild__WEBPACK_IMPORTED_MODULE_2__["Guild"].fromId(this.guildId);
    }

    get roles() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.roleIds, id => this.guild.roles.find(r => r.id === id))
            .sort((r1, r2) => r1.position === r2.position ? 0 : r1.position > r2.position ? 1 : -1);
    }

    get hoistRole() {
        return this.guild.roles.find(r => r.id === this.hoistRoleId);
    }

    checkPermissions(perms) {
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].PermissionUtils.can(perms, modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser.discordObject, this.guild.discordObject);
    }

    assertPermissions(name, perms) {
        if (!this.checkPermissions(perms)) throw new structs__WEBPACK_IMPORTED_MODULE_1__["InsufficientPermissions"](name);
    }

    /**
     * Opens the modal to change this user's nickname.
     */
    openChangeNicknameModal() {
        if (modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser === this.user)
            this.assertPermissions("CHANGE_NICKNAME", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.CHANGE_NICKNAME);
        else this.assertPermissions("MANAGE_NICKNAMES", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_NICKNAMES);

        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].ChangeNicknameModal.open(this.guildId, this.userId);
    }

    /**
     * Changes the user's nickname on this guild.
     * @param {String} nickname The user's new nickname
     * @return {Promise}
     */
    changeNickname(nick) {
        if (modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser === this.user)
            this.assertPermissions("CHANGE_NICKNAME", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.CHANGE_NICKNAME);
        else this.assertPermissions("MANAGE_NICKNAMES", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MANAGE_NICKNAMES);

        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.patch({
            url: `${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.GUILD_MEMBERS(this.guild_id)}/${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordAPI"].currentUser === this.user ? "@me/nick" : this.userId}`,
            body: { nick }
        });
    }

    /**
     * Kicks this user from the guild.
     * @param {String} reason A reason to attach to the audit log entry
     * @return {Promise}
     */
    kick(reason = "") {
        this.assertPermissions("KICK_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.KICK_MEMBERS);
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.kickUser(this.guildId, this.userId, reason);
    }

    /**
     * Bans this user from the guild.
     * @param {Number} daysToDelete The number of days of the user's recent message history to delete
     * @param {String} reason A reason to attach to the audit log entry
     * @return {Promise}
     */
    ban(daysToDelete = 1, reason = "") {
        this.assertPermissions("BAN_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.BAN_MEMBERS);
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.banUser(this.guildId, this.userId, daysToDelete, reason);
    }

    /**
     * Removes the ban for this user.
     * @return {Promise}
     */
    unban() {
        this.assertPermissions("BAN_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.BAN_MEMBERS);
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.unbanUser(this.guildId, this.userId);
    }

    /**
     * Moves this user to another voice channel.
     * @param {GuildVoiceChannel} channel The channel to move this user to
     */
    move(channel) {
        this.assertPermissions("MOVE_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MOVE_MEMBERS);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.setChannel(this.guildId, this.userId, channel.id);
    }

    /**
     * Mutes this user for everyone in the guild.
     */
    mute(active = true) {
        this.assertPermissions("MUTE_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.MUTE_MEMBERS);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.setServerMute(this.guildId, this.userId, active);
    }

    /**
     * Unmutes this user.
     */
    unmute() {
        this.mute(false);
    }

    /**
     * Deafens this user.
     */
    deafen(active = true) {
        this.assertPermissions("DEAFEN_MEMBERS", modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordPermissions.DEAFEN_MEMBERS);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].GuildActions.setServerDeaf(this.guildId, this.userId, active);
    }

    /**
     * Undeafens this user.
     */
    undeafen() {
        this.deafen(false);
    }

    /**
     * Gives this user a role.
     * @param {Role} role The role to add
     * @return {Promise}
     */
    addRole(...roles) {
        const newRoles = this.roleIds.concat([]);
        let changed = false;
        for (let role of roles) {
            if (newRoles.includes(role.id || role)) continue;
            newRoles.push(role.id || role);
            changed = true;
        }
        if (!changed) return;
        return this.updateRoles(newRoles);
    }

    /**
     * Removes a role from this user.
     * @param {Role} role The role to remove
     * @return {Promise}
     */
    removeRole(...roles) {
        const newRoles = this.roleIds.concat([]);
        let changed = false;
        for (let role of roles) {
            if (!newRoles.includes(role.id || role)) continue;
            modules__WEBPACK_IMPORTED_MODULE_0__["Utilities"].removeFromArray(newRoles, role.id || role);
            changed = true;
        }
        if (!changed) return;
        return this.updateRoles(newRoles);
    }

    /**
     * Updates this user's roles.
     * @param {Array} roles An array of Role objects or role IDs
     * @return {Promise}
     */
    updateRoles(roles) {
        roles = roles.map(r => r.id || r);
        return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].APIModule.patch({
            url: `${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].DiscordConstants.Endpoints.GUILD_MEMBERS(this.guildId)}/${this.userId}`,
            body: { roles }
        });
    }
}


/***/ }),

/***/ "./src/structs/discord/usersettings.js":
/*!*********************************************!*\
  !*** ./src/structs/discord/usersettings.js ***!
  \*********************************************/
/*! exports provided: UserSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserSettings", function() { return UserSettings; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var structs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! structs */ "./src/structs/structs.js");
/* harmony import */ var _guild__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./guild */ "./src/structs/discord/guild.js");
/**
 * BetterDiscord Channel Struct
 * Copyright (c) 2018-present JsSucks
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/JsSucks/BetterDiscordApp/blob/master/LICENSE
*/





class UserSettings {
    /**
     * Opens Discord's settings UI.
     */
    static open(section = "ACCOUNT") {
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsWindow.setSection(section);
        modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsWindow.open();
    }

    /**
     * The user's current status. Either "online", "idle", "dnd" or "invisible".
     */
    static get status() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.status; }

    /**
     * The user's selected explicit content filter level.
     * 0 == off, 1 == everyone except friends, 2 == everyone
     * Configurable in the privacy and safety panel.
     */
    static get explicitContentFilter() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.explicitContentFilter; }

    /**
     * Whether to disallow direct messages from server members by default.
     */
    static get defaultGuildsRestricted() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.defaultGuildsRestricted; }

    /**
     * An array of guilds to disallow direct messages from their members.
     * This is bypassed if the member is has another mutual guild with this disabled, or the member is friends with the current user.
     * Configurable in each server's privacy settings.
     */
    static get restrictedGuildIds() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.restrictedGuilds; }

    static get restrictedGuilds() {
        return structs__WEBPACK_IMPORTED_MODULE_1__["List"].from(this.restrictedGuildIds, id => _guild__WEBPACK_IMPORTED_MODULE_2__["Guild"].fromId(id) || id);
    }

    /**
     * An array of flags specifying who should be allowed to add the current user as a friend.
     * If everyone is checked, this will only have one item, "all". Otherwise it has either "mutual_friends", "mutual_guilds", both or neither.
     * Configurable in the privacy and safety panel.
     */
    static get friendSourceFlags() { return Object.keys(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.friendSourceFlags); }
    static get friendSourceEveryone() { return this.friend_source_flags.include("all"); }
    static get friendSourceMutual_friends() { return this.friend_source_flags.include("all") || this.friend_source_flags.include("mutual_friends"); }
    static get friendSourceMutual_guilds() { return this.friend_source_flags.include("all") || this.friend_source_flags.include("mutual_guilds"); }
    static get friendSourceAnyone() { return this.friend_source_flags.length > 0; }

    /**
     * Whether to automatically add accounts from other platforms running on the user's computer.
     * Configurable in the connections panel.
     */
    static get detectPlatformAccounts() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.detectPlatformAccounts; }

    /**
     * The number of seconds Discord will wait for activity before sending mobile push notifications.
     * Configurable in the notifications panel.
     */
    static get afkTimeout() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.afkTimeout; }

    /**
     * Whether to display the currently running game as a status message.
     * Configurable in the games panel.
     */
    static get showCurrentGame() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.showCurrentGame; }

    /**
     * Whether to show images uploaded directly to Discord.
     * Configurable in the text and images panel.
     */
    static get inlineAttachmentMedia() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.inlineAttachmentMedia; }

    /**
     * Whether to show images linked in Discord.
     * Configurable in the text and images panel.
     */
    static get inlineEmbedMedia() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.inlineEmbedMedia; }

    /**
     * Whether to automatically play GIFs when the Discord window is active without having to hover the mouse over the image.
     * Configurable in the text and images panel.
     */
    static get autoplayGifs() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.gifAutoPlay; }

    /**
     * Whether to show content from HTTP[s] links as embeds.
     * Configurable in the text and images panel.
     */
    static get showEmbeds() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.renderEmbeds; }

    /**
     * Whether to show a message's reactions.
     * Configurable in the text and images panel.
     */
    static get showReactions() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.renderReactions; }

    /**
     * Whether to play animated emoji.
     * Configurable in the text and images panel.
     */
    static get animateEmoji() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.animateEmoji; }

    /**
     * Whether to convert ASCII emoticons to emoji.
     * Configurable in the text and images panel.
     */
    static get convertEmoticons() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.convertEmoticons; }

    /**
     * Whether to allow playing text-to-speech messages.
     * Configurable in the text and images panel.
     */
    static get allowTts() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.enableTTSCommand; }

    /**
     * The user's selected theme. Either "dark" or "light".
     * Configurable in the appearance panel.
     */
    static get theme() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.theme; }

    /**
     * Whether the user has enabled compact mode.
     * `true` if compact mode is enabled, `false` if cozy mode is enabled.
     * Configurable in the appearance panel.
     */
    static get displayCompact() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.messageDisplayCompact; }

    /**
     * Whether the user has enabled developer mode.
     * Currently only adds a "Copy ID" option to the context menu on users, guilds and channels.
     * Configurable in the appearance panel.
     */
    static get developerMode() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.developerMode; }

    /**
     * The user's selected language code.
     * Configurable in the language panel.
     */
    static get locale() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.locale; }

    /**
     * The user's timezone offset in hours.
     * This is not configurable.
     */
    static get timezoneOffset() { return modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].UserSettingsStore.timezoneOffset; }
}

/***/ }),

/***/ "./src/structs/dom/classname.js":
/*!**************************************!*\
  !*** ./src/structs/dom/classname.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _selector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selector */ "./src/structs/dom/selector.js");


/** 
 * Representation of a Class Name
 * @memberof module:DOMTools
 **/
class ClassName {
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
	 * @returns {ClassName} returns self to allow chaining
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
	 * Returns the classname represented as {@link Selector}.
	 * @returns {Selector} selector representation of this class name.
	 */
	get selector() {
		return new _selector__WEBPACK_IMPORTED_MODULE_0__["default"](this.value);
	}
}

/* harmony default export */ __webpack_exports__["default"] = (ClassName);

/***/ }),

/***/ "./src/structs/dom/selector.js":
/*!*************************************!*\
  !*** ./src/structs/dom/selector.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** 
 * Representation of a Selector
 * @memberof module:DOMTools
 **/
class Selector {
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
	 * @param {string|DOMTools.Selector} other - Selector to add as child
	 * @returns {DOMTools.Selector} returns self to allow chaining
	 */
	child(other) {
		return this.selector(">", other);
	}
	
	/**
	 * Adds another selector as a adjacent sibling `+` to this one.
	 * @param {string|DOMTools.Selector} other - Selector to add as adjacent sibling
	 * @returns {DOMTools.Selector} returns self to allow chaining
	 */
	adjacent(other) {
		return this.selector("+", other);
	}
	
	/**
	 * Adds another selector as a general sibling `~` to this one.
	 * @param {string|DOMTools.Selector} other - Selector to add as sibling
	 * @returns {DOMTools.Selector} returns self to allow chaining
	 */
	sibling(other) {
		return this.selector("~", other);
	}
	
	/**
	 * Adds another selector as a descendent `(space)` to this one.
	 * @param {string|DOMTools.Selector} other - Selector to add as descendent
	 * @returns {DOMTools.Selector} returns self to allow chaining
	 */
	descend(other) {
		return this.selector(" ", other);
	}

	/**
	 * Adds another selector to this one via `,`.
	 * @param {string|DOMTools.Selector} other - Selector to add
	 * @returns {DOMTools.Selector} returns self to allow chaining
	 */
	and(other) {
		return this.selector(",", other);
	}
}

/* harmony default export */ __webpack_exports__["default"] = (Selector);

/***/ }),

/***/ "./src/structs/errors/permissionserror.js":
/*!************************************************!*\
  !*** ./src/structs/errors/permissionserror.js ***!
  \************************************************/
/*! exports provided: default, InsufficientPermissions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InsufficientPermissions", function() { return InsufficientPermissions; });
class PermissionsError extends Error {
    constructor(message) {
        super(message);
        this.name = "PermissionsError";
    }
}

class InsufficientPermissions extends PermissionsError {
    constructor(message) {
        super(`Missing Permission — ${message}`);
        this.name = "InsufficientPermissions";
    }
}

/* harmony default export */ __webpack_exports__["default"] = (PermissionsError);


/***/ }),

/***/ "./src/structs/list.js":
/*!*****************************!*\
  !*** ./src/structs/list.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @memberof module:DiscordAPI
 */

class List extends Array {

    constructor() {
        super(...arguments);
    }

    get(...filters) {
        return this.find(item => {
            for (let filter of filters) {
                for (let key in filter) {
                    if (filter.hasOwnProperty(key)) {
                        if (item[key] !== filter[key]) return false;
                    }
                }
            }
            return true;
        });
    }
}

/* harmony default export */ __webpack_exports__["default"] = (List);

/***/ }),

/***/ "./src/structs/plugin.js":
/*!*******************************!*\
  !*** ./src/structs/plugin.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_pluginutilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/pluginutilities */ "./src/modules/pluginutilities.js");


/* harmony default export */ __webpack_exports__["default"] = (function(config) {
    return class Plugin {
        constructor() {
            this._config = config;
            this._enabled = false;
        }
        getName() { return this._config.info.name.replace(" ", ""); }
        getDescription() { return this._config.info.description; }
        getVersion() { return this._config.info.version; }
        getAuthor() { return this._config.info.authors.map(a => a.name).join(", "); }
        load() {}
        start() {
            _modules_pluginutilities__WEBPACK_IMPORTED_MODULE_0__["default"].checkForUpdate(this.getName(), this.getVersion(), this._config.info.github_raw);
            this._enabled = true;
            if (typeof(this.onStart) == "function") this.onStart();
        }
        stop() {
            this._enabled = false;
            if (typeof(this.onStop) == "function") this.onStop();
        }

        get isEnabled() {return this._enabled;}
    };
});

/***/ }),

/***/ "./src/structs/screen.js":
/*!*******************************!*\
  !*** ./src/structs/screen.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Representation of the screen such as width and height.
 */
class Screen {
    static get width() { return Math.max(document.documentElement.clientWidth, window.innerWidth || 0); }
    static get height() { return Math.max(document.documentElement.clientHeight, window.innerHeight || 0); }
}

/* harmony default export */ __webpack_exports__["default"] = (Screen);

/***/ }),

/***/ "./src/structs/structs.js":
/*!********************************!*\
  !*** ./src/structs/structs.js ***!
  \********************************/
/*! exports provided: List, Screen, Selector, ClassName, InsufficientPermissions, Plugin, User, GuildMember, Role, Emoji, Guild, Channel, PermissionOverwrite, RolePermissionOverwrite, MemberPermissionOverwrite, GuildChannel, GuildTextChannel, GuildVoiceChannel, ChannelCategory, PrivateChannel, DirectMessageChannel, GroupChannel, Reaction, Embed, Message, DefaultMessage, RecipientAddMessage, RecipientRemoveMessage, CallMessage, GroupChannelNameChangeMessage, GroupChannelIconChangeMessage, MessagePinnedMessage, GuildMemberJoinMessage, UserSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list */ "./src/structs/list.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "List", function() { return _list__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _screen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./screen */ "./src/structs/screen.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Screen", function() { return _screen__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _dom_selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom/selector */ "./src/structs/dom/selector.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Selector", function() { return _dom_selector__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _dom_classname__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/classname */ "./src/structs/dom/classname.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClassName", function() { return _dom_classname__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _errors_permissionserror__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./errors/permissionserror */ "./src/structs/errors/permissionserror.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InsufficientPermissions", function() { return _errors_permissionserror__WEBPACK_IMPORTED_MODULE_4__["InsufficientPermissions"]; });

/* harmony import */ var _discord_user__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./discord/user */ "./src/structs/discord/user.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "User", function() { return _discord_user__WEBPACK_IMPORTED_MODULE_5__["User"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GuildMember", function() { return _discord_user__WEBPACK_IMPORTED_MODULE_5__["GuildMember"]; });

/* harmony import */ var _discord_guild__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./discord/guild */ "./src/structs/discord/guild.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Role", function() { return _discord_guild__WEBPACK_IMPORTED_MODULE_6__["Role"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Emoji", function() { return _discord_guild__WEBPACK_IMPORTED_MODULE_6__["Emoji"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Guild", function() { return _discord_guild__WEBPACK_IMPORTED_MODULE_6__["Guild"]; });

/* harmony import */ var _discord_channel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./discord/channel */ "./src/structs/discord/channel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["Channel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PermissionOverwrite", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["PermissionOverwrite"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RolePermissionOverwrite", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["RolePermissionOverwrite"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MemberPermissionOverwrite", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["MemberPermissionOverwrite"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GuildChannel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["GuildChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GuildTextChannel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["GuildTextChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GuildVoiceChannel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["GuildVoiceChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ChannelCategory", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["ChannelCategory"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PrivateChannel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["PrivateChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DirectMessageChannel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["DirectMessageChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GroupChannel", function() { return _discord_channel__WEBPACK_IMPORTED_MODULE_7__["GroupChannel"]; });

/* harmony import */ var _discord_message__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./discord/message */ "./src/structs/discord/message.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Reaction", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["Reaction"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Embed", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["Embed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Message", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["Message"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DefaultMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["DefaultMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RecipientAddMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["RecipientAddMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RecipientRemoveMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["RecipientRemoveMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["CallMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GroupChannelNameChangeMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["GroupChannelNameChangeMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GroupChannelIconChangeMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["GroupChannelIconChangeMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MessagePinnedMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["MessagePinnedMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GuildMemberJoinMessage", function() { return _discord_message__WEBPACK_IMPORTED_MODULE_8__["GuildMemberJoinMessage"]; });

/* harmony import */ var _discord_usersettings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./discord/usersettings */ "./src/structs/discord/usersettings.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UserSettings", function() { return _discord_usersettings__WEBPACK_IMPORTED_MODULE_9__["UserSettings"]; });

/* harmony import */ var _plugin__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./plugin */ "./src/structs/plugin.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Plugin", function() { return _plugin__WEBPACK_IMPORTED_MODULE_10__["default"]; });


















/***/ }),

/***/ "./src/styles/settings.css":
/*!*********************************!*\
  !*** ./src/styles/settings.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".plugin-controls input {\r\n    -webkit-box-flex: 1;\r\n    background-color: transparent;\r\n    border: none;\r\n    color: #fff;\r\n    flex: 1;\r\n    line-height: 52px;\r\n    padding: 0;\r\n    z-index: 1;\r\n    -webkit-box-align: center;\r\n    -webkit-box-direction: normal;\r\n    -webkit-box-orient: horizontal;\r\n    align-items: center;\r\n    border: 1px solid rgba(0,0,0,.2);\r\n    background-color: rgba(0,0,0,0.3);\r\n    border-radius: 3px;\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 40px;\r\n    padding: 0 16px;\r\n    position: relative;\r\n}\r\n\r\n.plugin-controls input:focus {\r\n    outline: 0;\r\n}\r\n\r\n.plugin-controls input[type=range] {\r\n    -webkit-appearance: none;\r\n    border: none!important;\r\n    border-radius: 5px;\r\n    height: 5px;\r\n    cursor: pointer;\r\n    padding: 0;\r\n}\r\n\r\n.plugin-controls input[type=range]::-webkit-slider-runnable-track {\r\n    background: 0 0!important;\r\n}\r\n\r\n.plugin-controls input[type=range]::-webkit-slider-thumb {\r\n    -webkit-appearance: none;\r\n    background: #f6f6f7;\r\n    width: 10px;\r\n    height: 20px;\r\n}\r\n\r\n.plugin-controls input[type=range]::-webkit-slider-thumb:hover {\r\n    box-shadow: 0 2px 10px rgba(0,0,0,.5);\r\n}\r\n\r\n.plugin-controls input[type=range]::-webkit-slider-thumb:active {\r\n    box-shadow: 0 2px 10px rgba(0,0,0,1);\r\n}\r\n\r\n.plugin-setting-label {\r\n    color: #f6f6f7;\r\n    font-weight: 500;\r\n}\r\n\r\n.plugin-setting-input-row {\r\n    padding-right: 5px!important;\r\n}\r\n\r\n.plugin-setting-input-container {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.plugin-control-group .button-collapse {\r\n    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FscXVlXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSItOTUwIDUzMiAxOCAxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtOTUwIDUzMiAxOCAxODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6bm9uZTt9DQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTS05MzIsNTMydjE4aC0xOHYtMThILTkzMnoiLz4NCjxwb2x5bGluZSBjbGFzcz0ic3QxIiBwb2ludHM9Ii05MzYuNiw1MzguOCAtOTQxLDU0My4yIC05NDUuNCw1MzguOCAiLz4NCjwvc3ZnPg0K);\r\n    height: 16px;\r\n    width: 16px;\r\n    display: inline-block;\r\n    vertical-align: bottom;\r\n    transition: transform .3s ease;\r\n    transform: rotate(0);\r\n}\r\n\r\n.plugin-control-group .button-collapse.collapsed {\r\n    transition: transform .3s ease;\r\n    transform: rotate(-90deg);\r\n}\r\n\r\n.plugin-control-group h2 {\r\n    font-size: 14px;\r\n}\r\n\r\n.plugin-controls .plugin-setting-input-container,.plugin-controls .ui-switch-wrapper {\r\n    margin-top: 5px;\r\n}\r\n\r\n.plugin-controls.collapsed {\r\n    display: none;\r\n}\r\n\r\n.plugin-controls {\r\n    display: block;\r\n}"

/***/ }),

/***/ "./src/styles/toasts.css":
/*!*******************************!*\
  !*** ./src/styles/toasts.css ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".toasts {\r\n    position: fixed;\r\n    display: flex;\r\n    top: 0;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: flex-end;\r\n    pointer-events: none;\r\n    z-index: 4000;\r\n}\r\n\r\n@keyframes toast-up {\r\n    from {\r\n        transform: translateY(0);\r\n        opacity: 0;\r\n    }\r\n}\r\n\r\n.toast {\r\n    animation: toast-up 300ms ease;\r\n    transform: translateY(-10px);\r\n    background: #36393F;\r\n    padding: 10px;\r\n    border-radius: 5px;\r\n    box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);\r\n    font-weight: 500;\r\n    color: #fff;\r\n    user-select: text;\r\n    font-size: 14px;\r\n    opacity: 1;\r\n    margin-top: 10px;\r\n}\r\n\r\n@keyframes toast-down {\r\n    to {\r\n        transform: translateY(0px);\r\n        opacity: 0;\r\n    }\r\n}\r\n\r\n.toast.closing {\r\n    animation: toast-down 200ms ease;\r\n    animation-fill-mode: forwards;\r\n    opacity: 1;\r\n    transform: translateY(-10px);\r\n}\r\n\r\n\r\n.toast.icon {\r\n    padding-left: 30px;\r\n    background-size: 20px 20px;\r\n    background-repeat: no-repeat;\r\n    background-position: 6px 50%;\r\n}\r\n\r\n.toast.toast-info {\r\n    background-color: #4a90e2;\r\n}\r\n\r\n.toast.toast-info.icon {\r\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=);\r\n}\r\n\r\n.toast.toast-success {\r\n    background-color: #43b581;\r\n}\r\n\r\n.toast.toast-success.icon {\r\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=);\r\n}\r\n.toast.toast-danger, .toast.toast-error {\r\n    background-color: #f04747;\r\n}\r\n\r\n.toast.toast-danger.icon,\r\n.toast.toast-error.icon {\r\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTEyIDJDNi40NyAyIDIgNi40NyAyIDEyczQuNDcgMTAgMTAgMTAgMTAtNC40NyAxMC0xMFMxNy41MyAyIDEyIDJ6bTUgMTMuNTlMMTUuNTkgMTcgMTIgMTMuNDEgOC40MSAxNyA3IDE1LjU5IDEwLjU5IDEyIDcgOC40MSA4LjQxIDcgMTIgMTAuNTkgMTUuNTkgNyAxNyA4LjQxIDEzLjQxIDEyIDE3IDE1LjU5eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);\r\n}\r\n\r\n.toast.toast-warning,\r\n.toast.toast-warn {\r\n    background-color: #FFA600;\r\n    color: white;\r\n}\r\n\r\n.toast.toast-warning.icon,\r\n.toast.toast-warn.icon {\r\n    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMSAyMWgyMkwxMiAyIDEgMjF6bTEyLTNoLTJ2LTJoMnYyem0wLTRoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==);\r\n}"

/***/ }),

/***/ "./src/styles/updates.css":
/*!********************************!*\
  !*** ./src/styles/updates.css ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#pluginNotice {\r\n    -webkit-app-region: drag;\r\n    border-radius: 0;\r\n}\r\n\r\n#outdatedPlugins {\r\n    font-weight: 700;\r\n}\r\n\r\n#outdatedPlugins>span {\r\n    -webkit-app-region: no-drag;\r\n    color: #fff;\r\n    cursor: pointer;\r\n}\r\n\r\n#outdatedPlugins>span:hover {\r\n    text-decoration: underline;\r\n}"

/***/ }),

/***/ "./src/ui/contextmenu.js":
/*!*******************************!*\
  !*** ./src/ui/contextmenu.js ***!
  \*******************************/
/*! exports provided: Menu, ItemGroup, MenuItem, TextItem, ImageItem, SubMenuItem, ToggleItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Menu", function() { return Menu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ItemGroup", function() { return ItemGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuItem", function() { return MenuItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextItem", function() { return TextItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageItem", function() { return ImageItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubMenuItem", function() { return SubMenuItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToggleItem", function() { return ToggleItem; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/**
 * Self-made context menus that emulate Discord's own context menus.
 * @module PluginContextMenu
 * @version 0.0.7
 */




/** Main menu class for creating custom context menus. */
class Menu {
    /**
     * 
     * @param {boolean} [scroll=false] - should this menu be a scrolling menu (usually only used for submenus)
     */
	constructor(scroll = false) {
		this.theme = $(".theme-dark").length ? "theme-dark" : "theme-light";
		this.element = $("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.contextMenu).addClass("plugin-context-menu").addClass(this.theme);
		this.scroll = scroll;
		if (scroll) {
			this.scroller = $("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ScrollerClasses.scroller).addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.scroller);
			this.element.append($("<div>")
				.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ScrollerClasses.scrollerWrap)
				.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ScrollerClasses.scrollerThemed)
				.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ScrollerClasses.themeGhostHairline).append(
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
		
		let type = this.element.parents(".plugin-context-menu").length > this.element.parents(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.contextMenu).length ? ".plugin-context-menu" : modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.contextMenu;
		var depth = this.element.parents(type).length;
		if (depth == 0) this.element.appendTo("#app-mount");
		this.element.css("top", mouseY).css("left", mouseX);
		
		if (depth > 0) {
			var top = this.element.parents(type).last();
			var closest = this.element.parents(type).first();
			var negate = closest.hasClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.invertChildX) ? -1 : 1;
			this.element.css("margin-left", negate * closest.find(`.${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.item}`).outerWidth() + closest.offset().left - top.offset().left);
		}
		
		if (mouseY + this.element.outerHeight() >= maxHeight) {
			this.element.addClass("invertY").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.invertY);
			this.element.css("top", mouseY - this.element.outerHeight());
			if (depth > 0) this.element.css("top", (mouseY + this.element.parent().outerHeight()) - this.element.outerHeight());
		}
		if (this.element.offset().left + this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertX");
			this.element.css("left", mouseX - this.element.outerWidth());
		}
		if (this.element.offset().left + 2 * this.element.outerWidth() >= maxWidth) {
			this.element.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.invertChildX);
		}

		if (depth == 0) {
			$(document).on("mousedown.zctx", (e) => {
				if (!this.element.has(e.target).length && !this.element.is(e.target)) {
					this.removeMenu();
				}
			});
			$(document).on("click.zctx", (e) => {
				if (this.element.has(e.target).length) {
					if ($._data($(e.target).closest(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.item)[0], "events").click) {
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
		let type = this.element.parents(".plugin-context-menu").length > this.element.parents(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.contextMenu).length ? ".plugin-context-menu" : modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.contextMenu;
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
			let type = this.element.parents(".plugin-context-menu").length > this.element.parents(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.contextMenu).length ? ".plugin-context-menu" : modules__WEBPACK_IMPORTED_MODULE_0__["DiscordSelectors"].ContextMenuClasses.contextMenu;
			this.show(this.element.parents(type).css("left"), menuItem.offset().top);
		});
		menuItem.on("mouseleave", () => { this.element.detach(); });
	}
}

/** Class that represents a group of menu items. */
class ItemGroup {
    /** Creates an item group. */
	constructor() {
		this.element = $("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.itemGroup);
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
}

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
class MenuItem {
    /**
     * @param {string} label - label to show on the menu item
     * @param {object} options - additional options for the item
     * @param {boolean} [options.danger=false] - should the item show as danger
     * @param {PluginContextMenu~clickEvent} [options.callback] - callback for when it is clicked
     */
	constructor(label, options = {}) {
		var {danger = false, callback} = options;
		this.element = $("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.item);
		this.label = label;
		if (danger) this.element.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.danger);
		if (typeof(callback) == "function") {
			this.element.on("click", (event) => {
				event.stopPropagation();
				callback(event);
			});
		}
	}
	getElement() { return this.element;}
}

/** 
 * Creates a text menu item that can have a hint.
 * @extends MenuItem
 */
class TextItem extends MenuItem {
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
		this.element.append($("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.hint).text(hint));
	}
}

/** 
 * Creates an image menu item that can have an image.
 * @extends MenuItem
 */
class ImageItem extends MenuItem {
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
		this.element.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.itemImage);
		this.element.append($("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.label).text(label));
		this.element.append($("<img>", {src: imageSrc}));
	}
}

/** 
 * Creates a menu item with an attached submenu.
 * @extends .MenuItem
 */
class SubMenuItem extends MenuItem {
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
		this.element.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.itemSubMenu).text(label);
		this.subMenu = subMenu;
		this.subMenu.attachTo(this.getElement());
	}
}

/** 
 * Creates a menu item with a checkbox.
 * @extends MenuItem
 */
class ToggleItem extends MenuItem {
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
		this.element.addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.itemToggle);
        this.element.append($("<div>").addClass(modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].ContextMenuClasses.label).text(label));
        this.checkbox = $("<div>", {class: "checkbox"});
        this.checkbox.append($("<div>", {class: "checkbox-inner"}));
        this.checkbox.append("<span>");
        this.input = $("<input>", {type: "checkbox", checked: checked, value: "on"});
        this.checkbox.find(".checkbox-inner").append(this.input).append("<span>");
        this.element.append(this.checkbox);
        this.element.on("click", (e) => {
            e.stopPropagation();
            this.input.prop("checked", !this.input.prop("checked"));
            if (typeof(onChange) == "function") onChange(this.input.prop("checked"));
        });
	}
}

/***/ }),

/***/ "./src/ui/settings/index.js":
/*!**********************************!*\
  !*** ./src/ui/settings/index.js ***!
  \**********************************/
/*! exports provided: CSS, SettingField, SettingGroup, Textbox, ColorPicker, Slider, Switch, Pill, getAccentColor, createInputContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CSS", function() { return CSS; });
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settingfield */ "./src/ui/settings/settingfield.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAccentColor", function() { return _settingfield__WEBPACK_IMPORTED_MODULE_0__["getAccentColor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createInputContainer", function() { return _settingfield__WEBPACK_IMPORTED_MODULE_0__["createInputContainer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingField", function() { return _settingfield__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _settinggroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settinggroup */ "./src/ui/settings/settinggroup.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SettingGroup", function() { return _settinggroup__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _types_textbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types/textbox */ "./src/ui/settings/types/textbox.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Textbox", function() { return _types_textbox__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _types_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types/color */ "./src/ui/settings/types/color.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ColorPicker", function() { return _types_color__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _types_slider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types/slider */ "./src/ui/settings/types/slider.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Slider", function() { return _types_slider__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _types_switch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types/switch */ "./src/ui/settings/types/switch.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Switch", function() { return _types_switch__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _types_pill__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./types/pill */ "./src/ui/settings/types/pill.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Pill", function() { return _types_pill__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/**
 * An object that makes generating settings panel 10x easier.
 * @module PluginSettings
 * @version 1.0.5
 */

/**
 * Callback for SettingField for change in input field.
 * @callback PluginSettings~settingsChanged
 * @param {*} value - new value of the input field
 */

const CSS = __webpack_require__(/*! ../../styles/settings.css */ "./src/styles/settings.css");










/***/ }),

/***/ "./src/ui/settings/settingfield.js":
/*!*****************************************!*\
  !*** ./src/ui/settings/settingfield.js ***!
  \*****************************************/
/*! exports provided: default, getAccentColor, createInputContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAccentColor", function() { return getAccentColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createInputContainer", function() { return createInputContainer; });
/** 
 * Generic representation of a setting field. Very extensible, but best to use a child class when available.
 * @memberof module:PluginSettings
 * @version 1.0.5
 */
class SettingField {
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
		this.input.addClass("plugin-input");
		this.getValue = () => {return this.input.val();};
		this.processValue = (value) => {return value;};
		this.input.on("keyup change", () => {
			if (typeof callback != "undefined") {
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
}

/* harmony default export */ __webpack_exports__["default"] = (SettingField);




/** Attempts to retreive the accent color of native settings items in rgba format. */
function getAccentColor() {
	var bg = $("<div class=\"ui-switch-item\"><div class=\"ui-switch-wrapper\"><input type=\"checkbox\" checked=\"checked\" class=\"ui-switch-checkbox\"><div class=\"ui-switch checked\">");
	bg.appendTo($("#bd-settingspane-container"));
	var bgColor = $(".ui-switch.checked").first().css("background-color");
	var afterColor = window.getComputedStyle(bg.find(".ui-switch.checked")[0], ":after").getPropertyValue("background-color"); // For beardy's theme
	bgColor = afterColor == "rgba(0, 0, 0, 0)" ? bgColor : afterColor;
	bg.remove();
	return bgColor;
}

function createInputContainer(...children) {
	return $("<div class=\"plugin-setting-input-container\">").append(...children);
}

/***/ }),

/***/ "./src/ui/settings/settinggroup.js":
/*!*****************************************!*\
  !*** ./src/ui/settings/settinggroup.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settingfield */ "./src/ui/settings/settingfield.js");



/** 
 * Grouping of controls for easier management in settings panels.
 * @memberof module:PluginSettings
 * @version 1.0.1
 */
class SettingGroup {
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
		var collapsed = shown || !collapsible ? "" : " collapsed";
		var label = $("<h2>").html(`<span class="button-collapse${collapsed}" style=""></span> ${groupName}`);
		label.attr("class", `${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].SettingsMetaClasses.h5} ${modules__WEBPACK_IMPORTED_MODULE_0__["DiscordClasses"].SettingsMetaClasses.defaultMarginh5}`);
		this.group.append(label);
		this.controls = $(`<div class="plugin-controls collapsible${collapsed}">`);
		this.group.append(this.controls);
		if (collapsible) {
			label.on("click", (e) => {
				let button = $(e.target).find(".button-collapse");
				let wasCollapsed = button.hasClass("collapsed");
				this.group.parent().find(".collapsible:not(.collapsed)").slideUp({duration: 300, easing: "easeInSine", complete: function() { $(this).addClass("collapsed"); }}); // .slideUp({duration: 300, easing: "easeInSine"})
				this.group.parent().find(".button-collapse").addClass("collapsed");
				if (wasCollapsed) {
					this.controls.slideDown({duration: 300, easing: "easeInSine"});
					this.controls.removeClass("collapsed");
					button.removeClass("collapsed");
				}
			});
		}
		
		if (typeof callback != "undefined") {
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
			else if (nodes[i] instanceof _settingfield__WEBPACK_IMPORTED_MODULE_1__["default"]) this.controls.append(nodes[i].getElement());
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
}

/* harmony default export */ __webpack_exports__["default"] = (SettingGroup);

/***/ }),

/***/ "./src/ui/settings/types/color.js":
/*!****************************************!*\
  !*** ./src/ui/settings/types/color.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settingfield */ "./src/ui/settings/settingfield.js");


/** 
 * Creates a color picker using chromium's built in color picker
 * as a base. Input and output using hex strings.
 * @memberof module:PluginSettings
 * @version 1.0.0
 * @extends SettingField
 */
class ColorPicker extends _settingfield__WEBPACK_IMPORTED_MODULE_0__["default"] {
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
		this.input.addClass("plugin-input-color");
		
		var settingLabel = $("<span class=\"plugin-setting-label\">").text(value);
		
		this.input.on("input", function() {
			settingLabel.text($(this).val());
		});
		
		this.setInputElement(Object(_settingfield__WEBPACK_IMPORTED_MODULE_0__["createInputContainer"])(settingLabel, this.input));
	}
}

/* harmony default export */ __webpack_exports__["default"] = (ColorPicker);

/***/ }),

/***/ "./src/ui/settings/types/pill.js":
/*!***************************************!*\
  !*** ./src/ui/settings/types/pill.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settingfield */ "./src/ui/settings/settingfield.js");
/* harmony import */ var _switch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./switch */ "./src/ui/settings/types/switch.js");



/** 
 * Creates a PillButton where the left and right side have their own label.
 * It is important to note that the checked property here follows the same
 * standard as a normal Discord switch. That is to say if the value is true
 * then right side was selected, if the value is false then the left side 
 * was selected.
 * @memberof module:PluginSettings
 * @version 1.0.1
 * @extends Switch
 */
class Pill extends _switch__WEBPACK_IMPORTED_MODULE_1__["default"] {
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
		this.input.addClass("plugin-input-pill");
		
		var labelLeft = $(`<span class="plugin-setting-label left">`);
		labelLeft.text(leftLabel);
		var labelRight = $(`<span class="plugin-setting-label right">`);
		labelRight.text(rightLabel);
		
		var accent = Object(_settingfield__WEBPACK_IMPORTED_MODULE_0__["getAccentColor"])();
		
		if (isRightSelected) labelRight.css("color", accent);
		else labelLeft.css("color", accent);
		
		this.checkboxWrap.find("input").on("click", function() {
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
		
		this.setInputElement(Object(_settingfield__WEBPACK_IMPORTED_MODULE_0__["createInputContainer"])(labelLeft, this.checkboxWrap.detach(), labelRight));
	}
}

/* harmony default export */ __webpack_exports__["default"] = (Pill);

/***/ }),

/***/ "./src/ui/settings/types/slider.js":
/*!*****************************************!*\
  !*** ./src/ui/settings/types/slider.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settingfield */ "./src/ui/settings/settingfield.js");


/** 
 * Creates a slider where the user can select a single number from a predefined range.
 * @memberof module:PluginSettings
 * @version 1.0.0
 * @extends SettingField
 */
class Slider extends _settingfield__WEBPACK_IMPORTED_MODULE_0__["default"] {
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
		
		this.accentColor = Object(_settingfield__WEBPACK_IMPORTED_MODULE_0__["getAccentColor"])();
		this.setBackground();
		this.input.css("margin-left", "10px").css("float", "right");
		this.input.addClass("plugin-input-range");
		
		this.labelUnit = "";
		this.label = $(`<span class="plugin-setting-label">`).text(this.value + this.labelUnit);
		
		this.input.on("input", () => {
			this.value = parseFloat(this.input.val());
			this.label.text(this.value + this.labelUnit);
			this.setBackground();
		});
		
		this.setInputElement(Object(_settingfield__WEBPACK_IMPORTED_MODULE_0__["createInputContainer"])(this.label, this.input));
	}
	
	getPercent() { return ((this.value - this.min) / this.max) * 100; }

	setBackground() {
		var percent = this.getPercent();
		this.input.css("background", "linear-gradient(to right, " + this.accentColor + ", " + this.accentColor + " " + percent + "%, #72767d " + percent + "%)");
	}

    /**
     * Adds a unit to the value label
     * @param {string} unit - unit to add to the label (e.g. "%")
     */
	setLabelUnit(unit) {this.labelUnit = unit; this.label.text(this.value + this.labelUnit); return this;}
}

/* harmony default export */ __webpack_exports__["default"] = (Slider);

/***/ }),

/***/ "./src/ui/settings/types/switch.js":
/*!*****************************************!*\
  !*** ./src/ui/settings/types/switch.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settingfield */ "./src/ui/settings/settingfield.js");


/** 
 * Creates a checkbox in the style of a standard Discord switch.
 * @memberof module:PluginSettings
 * @version 1.0.0
 * @extends SettingField
 */
class Switch extends _settingfield__WEBPACK_IMPORTED_MODULE_0__["default"] {
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
		this.input.addClass("plugin-input-checkbox");

		this.input.on("change", function() {
			if ($(this).prop("checked")) switchDiv.addClass("checked");
			else switchDiv.removeClass("checked");
		});
		
		this.checkboxWrap = $(`<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">`);
		this.checkboxWrap.append(this.input);
		var switchDiv = $(`<div class="ui-switch">`);
		if (isChecked) switchDiv.addClass("checked");
		this.checkboxWrap.append(switchDiv);
		this.checkboxWrap.css("right", "0px");

		this.setInputElement(this.checkboxWrap);
	}
}

/* harmony default export */ __webpack_exports__["default"] = (Switch);

/***/ }),

/***/ "./src/ui/settings/types/textbox.js":
/*!******************************************!*\
  !*** ./src/ui/settings/types/textbox.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settingfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settingfield */ "./src/ui/settings/settingfield.js");


/** 
 * Creates a simple textbox settings.
 * @memberof module:PluginSettings
 * @version 1.0.0
 * @extends SettingField
 */
class Textbox extends _settingfield__WEBPACK_IMPORTED_MODULE_0__["default"] {
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
}

/* harmony default export */ __webpack_exports__["default"] = (Textbox);

/***/ }),

/***/ "./src/ui/tooltips.js":
/*!****************************!*\
  !*** ./src/ui/tooltips.js ***!
  \****************************/
/*! exports provided: PluginTooltip, NativeTooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PluginTooltip", function() { return PluginTooltip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NativeTooltip", function() { return NativeTooltip; });
/* harmony import */ var modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! modules */ "./src/modules/modules.js");


/** 
 * Tooltips that automatically show and hide themselves on mouseenter and mouseleave events.
 * Will also remove themselves if the node to watch is removed from DOM through
 * a MutationObserver.
 * 
 * @module PluginTooltip
 * @version 0.1.1
 */


// example usage `new PluginTooltip.Tooltip($('#test-element), "Hello World", {side: "top"});`

/** 
 * Custom tooltip, not using internals.
 * @class 
 * @version 0.1.0
 */
class PluginTooltip {
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
		if (!(node instanceof jQuery) && !(node instanceof Element)) return undefined;
		this.node = node instanceof jQuery ? node : $(node);
		const {style = "black", side = "top", preventFlip = false} = options;
		this.tip = tip;
		this.side = side;
		this.preventFlip = preventFlip;
		this.tooltip = $(`<div class="tooltip tooltip-${style}">`);
		this.tooltip.text(tip);

		node.on("mouseenter.tooltip", () => {
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

		node.on("mouseleave.tooltip", () => {
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
		this.tooltip.appendTo(".tooltips");

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
}


/** 
 * Tooltips done using Discord's internals.
 * @version 0.0.1
 */
class NativeTooltip {
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
		this.id = modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].KeyGenerator();

		this.node.addEventListener("mouseenter", () => {
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

		this.node.addEventListener("mouseleave", () => {
			this.hide();
		});
	}

    /** Hides the tooltip. Automatically called on mouseleave. */
	hide() {
		modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].Tooltips.hide(this.id);
    }
    
    /** Shows the tooltip. Automatically called on mouseenter. */
	show() {
		const {left, top, width, height} = this.node.getBoundingClientRect();
		modules__WEBPACK_IMPORTED_MODULE_0__["DiscordModules"].Tooltips.show(this.id, {
			position: this.side,
			text: this.label,
			color: this.style,
			targetWidth: width,
			targetHeight: height,
			x: left,
			y: top
		});
	}
}

/***/ }),

/***/ "./src/ui/ui.js":
/*!**********************!*\
  !*** ./src/ui/ui.js ***!
  \**********************/
/*! exports provided: PluginSettings, ContextMenu, Tooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/ui/settings/index.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "PluginSettings", function() { return _settings__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _contextmenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextmenu */ "./src/ui/contextmenu.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "ContextMenu", function() { return _contextmenu__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var _tooltips__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tooltips */ "./src/ui/tooltips.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Tooltip", function() { return _tooltips__WEBPACK_IMPORTED_MODULE_2__; });






/***/ }),

/***/ "electron":
/*!*********************************************!*\
  !*** external "window.require('electron')" ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = window.require('electron');

/***/ }),

/***/ "fs":
/*!***************************************!*\
  !*** external "window.require('fs')" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = window.require('fs');

/***/ }),

/***/ "path":
/*!*****************************************!*\
  !*** external "window.require('path')" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = window.require('path');

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("process");

/***/ }),

/***/ "request":
/*!********************************************!*\
  !*** external "window.require('request')" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = window.require('request');

/***/ })

/******/ })["default"];