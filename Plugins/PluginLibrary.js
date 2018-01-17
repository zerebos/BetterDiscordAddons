var ColorUtilities = {version: "0.0.2"};
var DOMUtilities = {version: "0.0.1"};
var ReactUtilities = {version: "0.0.4"};
var PluginUtilities = {version: "0.2.3"};
var PluginUpdateUtilities = {version: "0.0.3"};
var PluginSettings = {version: "1.0.5"};
var PluginContextMenu = {version: "0.0.6"};
var PluginTooltip = {version: "0.0.3"};
var DiscordPermissions = {version: "0.0.1"};
var InternalUtilities = {version: "0.0.2"};

/* global Set:false, bdPluginStorage:false, BdApi:false, Symbol:false, webpackJsonp:false, _:false */

DiscordPermissions = class DiscordPermissions {
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

ColorUtilities.darkenColor = function(color, percent) {
	var rgb = ColorUtilities.getRGB(color);
	
	for(var i = 0; i < rgb.length; i++){
		rgb[i] = Math.round(Math.max(0, rgb[i] - rgb[i] * (percent / 100)));
	}
	
	return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

ColorUtilities.lightenColor = function(color, percent) {
	var rgb = ColorUtilities.getRGB(color);
	
	for(var i = 0; i < rgb.length; i++){
		rgb[i] = Math.round(Math.min(255, rgb[i] + rgb[i] * (percent / 100)));
	}
	
	return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
};

ColorUtilities.rgbToAlpha = function(color, alpha) {
	var rgb = ColorUtilities.getRGB(color);		
	return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
};

DOMUtilities.indexInParent = function(node) {
	var children = node.parentNode.childNodes;
	var num = 0;
	for (var i = 0; i < children.length; i++) {
		if (children[i] == node) return num;
		if (children[i].nodeType == 1) num++;
	}
	return -1;
};

ReactUtilities.getReactInstance = function(node) {
	if (!(node instanceof jQuery) && !(node instanceof Element)) return undefined;
	var domNode = node instanceof jQuery ? node[0] : node;
	return domNode[Object.keys(domNode).find((key) => key.startsWith("__reactInternalInstance"))];
};

ReactUtilities.getReactProperty = function(node, path) {
	var value = path.split(/\s?\.\s?/).reduce(function(obj, prop) {
		return obj && obj[prop];
	}, ReactUtilities.getReactInstance(node));
	return value;
};

// This is a slightly modified version of DevilBro's https://github.com/mwittrien/BetterDiscordAddons
// CURRENTLY UNUSED
ReactUtilities.getReactKey = function(config) {
	if (config === undefined) return null;
	if (config.node === undefined || config.key === undefined) return null;
	
	var inst = ReactUtilities.getReactInstance(config.node);
	if (!inst) return null;
	
	
	var maxDepth = config.depth === undefined ? 15 : config.depth;
		
	var keyWhiteList = typeof config.whiteList === "object" ? config.whiteList : {
		"_currentElement":true,
		"_renderedChildren":true,
		"_instance":true,
		"_owner":true,
		"props":true,
		"state":true,
		"stateNode":true,
		"refs":true,
		"updater":true,
		"children":true,
		"type":true,
		"memoizedProps":true,
		"memoizedState":true,
		"child":true,
		"firstEffect":true
	};
	
	var keyBlackList = typeof config.blackList === "object" ? config.blackList : {};
	
	

	var searchKeyInReact = (ele, depth) => {
		if (!ele || ReactUtilities.getReactInstance(ele) || depth > maxDepth) return null;
		var keys = Object.getOwnPropertyNames(ele);
		var result = null;
		for (var i = 0; result === null && i < keys.length; i++) {
			var key = keys[i];
			var value = ele[keys[i]];
			
			if (config.key === key && (config.value === undefined || config.value === value)) {
				result = config.returnParent ? ele : value;
			}
			else if ((typeof value === "object" || typeof value === "function") && ((keyWhiteList[key] && !keyBlackList[key]) || key[0] == "." || !isNaN(key[0]))) {
				result = searchKeyInReact(value, depth++);
			}
		}
		return result;
	};

	return searchKeyInReact(inst, 0);
};


/* The following functions come from Samogot's library https://github.com/samogot/betterdiscord-plugins */
ReactUtilities.getOwnerInstance = function(e, {include, exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
	if (e === undefined)
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
	
	for (let curr = ReactUtilities.getReactInstance(e).return; !_.isNil(curr); curr = curr.return) {
		if (_.isNil(curr))
			continue;
		let owner = curr.stateNode;
		if (!_.isNil(owner) && !(owner instanceof HTMLElement) && classFilter(curr))
			return owner;
	}
	
	return null;
};

PluginUtilities.suppressErrors = (method, desiption) => (...params) => {
	try { return method(...params);	}
	catch (e) { console.error('Error occurred in ' + desiption, e); }
};


InternalUtilities.monkeyPatch = (what, methodName, options) => {
	const {before, after, instead, once = false, silent = false} = options;
	const displayName = options.displayName || what.displayName || what.name || what.constructor.displayName || what.constructor.name;
	if (!silent) console.log('patch', methodName, 'of', displayName); // eslint-disable-line no-console
	const origMethod = what[methodName];
	const cancel = () => {
		if (!silent) console.log('unpatch', methodName, 'of', displayName); // eslint-disable-line no-console
		what[methodName] = origMethod;
	};
	what[methodName] = function() {
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
	return cancel;
};


InternalUtilities.WebpackModules = (() => {
	const req = webpackJsonp([], {
		'__extra_id__': (module, exports, req) => exports.default = req
	}, ['__extra_id__']).default;
	delete req.m['__extra_id__'];
	delete req.c['__extra_id__'];
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
	
	const findByUniqueProperties = (propNames, options) => find(module => propNames.every(prop => module[prop] !== undefined), options);
	const findByDisplayName = (displayName, options) => find(module => module.displayName === displayName, options);
		
	return {find, findByUniqueProperties, findByDisplayName};
})();

PluginUtilities.WebpackModules = InternalUtilities.WebpackModules; // Backwards compatibility

InternalUtilities.Filters = {
	byPrototypeFields: (fields, selector = x => x) => (module) => {
		const component = selector(module);
		if (!component) return false;
		if (!component.prototype) return false;
		for (const field of fields) {
			if (!component.prototype[field]) return false;
		}
		return true;
	},
	byCode: (search, selector = x => x) => (module) => {
		const method = selector(module);
		if (!method) return false;
		return method.toString().search(search) !== -1;
	},
	and: (...filters) => (module) => {
		for (const filter of filters) {
			if (!filter(module)) return false;
		}
		return true;
	}
};
/* The previous functions come from Samogot's library https://github.com/samogot/betterdiscord-plugins */

InternalUtilities.addInternalListener = function(internalModule, moduleFunction, callback) {
	const moduleName = internalModule.displayName || internalModule.name || internalModule.constructor.displayName || internalModule.constructor.name; // borrowed from Samogot
	if (!internalModule[moduleFunction] || typeof(internalModule[moduleFunction]) !== "function") return console.error(`Module ${moduleName} has no function ${moduleFunction}`);

	if (!internalModule.__internalListeners) internalModule.__internalListeners = {};
	if (!internalModule.__internalListeners[moduleFunction]) internalModule.__internalListeners[moduleFunction] = new Set();
	if (!internalModule.__listenerPatches) internalModule.__listenerPatches = {};

	if (!internalModule.__listenerPatches[moduleFunction]) {
		if (internalModule[moduleFunction].__monkeyPatched) console.warn(`Function ${moduleFunction} of module ${moduleName} has already been patched by someone else.`);
		internalModule.__listenerPatches[moduleFunction] = InternalUtilities.monkeyPatch(internalModule, moduleFunction, {after: () => {
			for (let listener of internalModule.__internalListeners[moduleFunction]) listener();
		}});
	}

	internalModule.__internalListeners[moduleFunction].add(callback);
};

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

InternalUtilities.webContents = require('electron').remote.getCurrentWebContents();

InternalUtilities.addOnSwitchListener = function(callback) {
	/*InternalUtilities.webContents.on("did-navigate-in-page", (event, url, isMainWindow) => {
		let urlSplit = url.split("/");
		let type = urlSplit[3];
		let server = urlSplit[4];
		let channel = urlSplit[5];
		callback(type, server, channel);
	});*/
	InternalUtilities.webContents.on("did-navigate-in-page", callback)
};

InternalUtilities.removeOnSwitchListener = function(callback) {
	InternalUtilities.webContents.removeListener("did-navigate-in-page", callback);
};

PluginUtilities.parseOnSwitchURL = function(url) {
	let urlSplit = url.split("/");
	let type = urlSplit[3];
	let server = urlSplit[4];
	let channel = urlSplit[5];
	return {type, server, channel};
}

PluginUtilities.getCurrentServer = function() {
	var auditLog = document.querySelector('.guild-settings-audit-logs');
    if (auditLog) return ReactUtilities.getReactKey({node: auditLog, key: "guildId"});
    if (document.querySelector(".activityFeed-HeiGwL") || document.querySelector('#friends')) return null;
    let title = document.querySelector('.title-qAcLxz');
    if (document.querySelector('.private-channels')) return ReactUtilities.getReactProperty(title, "child.memoizedProps.1.props.channel.id");
    else return ReactUtilities.getReactProperty(title, "child.memoizedProps.1.props.guild.id");
};

PluginUtilities.isServer = function() { return PluginUtilities.getCurrentServer() ? true : false; };

PluginUtilities.getCurrentUser = function() {
	return ReactUtilities.getReactProperty(document.querySelector('.accountDetails-15i-_e'), "return.memoizedProps.user");
};

PluginUtilities.getAllUsers = function() {
	if (!document.querySelector('.channel-members') || document.querySelector('.private-channels')) return [];
	let groups = ReactUtilities.getReactKey({node: document.querySelector('.channel-members').parentElement.parentElement.parentElement.parentElement, key: "memberGroups", whiteList: {
		"child": true,
		"sibling": true,
		"memoizedState": true
	}});
	var users = [];
	for (let g = 0; g < groups.length; g++) {
		for (let u = 0; u < groups[g].users.length; u++) {
			users.push(groups[g].users[u]);
		}
	}
	return users;
};

PluginUtilities.loadData = function(name, key, defaultData) {
	try { return $.extend(true, defaultData ? defaultData : {}, bdPluginStorage.get(name, key)); }
	catch (err) { console.warn(name, "unable to load data:", err); }
};

PluginUtilities.saveData = function(name, key, data) {
	try { bdPluginStorage.set(name, key, data); }
	catch (err) { console.warn(name, "unable to save data:", err); }
};

PluginUtilities.loadSettings = function(name, defaultSettings) {
	return PluginUtilities.loadData(name, "settings", defaultSettings);
};

PluginUtilities.saveSettings = function(name, data) {
	PluginUtilities.saveData(name, "settings", data);
};

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
		window.PluginUpdates.observer.observe(document.querySelector(".layers, .layers-20RVFW"), {childList:true});
	}
	
	var bdbutton = document.querySelector(".bd-pfbtn");
	if (bdbutton && bdbutton.parentElement.querySelector("h2") && bdbutton.parentElement.querySelector("h2").innerText.toLowerCase() === "plugins" && !bdbutton.parentElement.querySelector(".bd-pfbtn.bd-updatebtn")) {
		bdbutton.parentElement.insertBefore(PluginUpdateUtilities.createUpdateButton(), bdbutton.nextSibling);
	}
};

PluginUpdateUtilities.createUpdateButton = function() {
	var updateButton = document.createElement("button");
	updateButton.className = "bd-pfbtn bd-updatebtn";
	updateButton.innerText = "Check for Updates";
	updateButton.style.left = "220px";
	updateButton.onclick = function () {
		window.PluginUpdates.checkAll();
	};
	let tooltip = new PluginTooltip.Tooltip($(updateButton), "Checks for updates of plugins that support this feature. Right-click for a list.")
	updateButton.oncontextmenu = function () {
		if (window.PluginUpdates && window.PluginUpdates.plugins) {
			var list = [];
			for (var plugin in window.PluginUpdates.plugins) {
				list.push(window.PluginUpdates.plugins[plugin].name);
			}
			tooltip.tooltip.detach();
			tooltip.tooltip.text(list.join(", "));
			tooltip.show();
			updateButton.onmouseout = function() { tooltip.tooltip.text(tooltip.tip); }
		}
	};
	return updateButton;
};

PluginUpdateUtilities.getCSS = function () {
	return "#pluginNotice {-webkit-app-region: drag;border-radius:0;} #outdatedPlugins {font-weight:700;} #outdatedPlugins>span {-webkit-app-region: no-drag;color:#fff;cursor:pointer;} #outdatedPlugins>span:hover {text-decoration:underline;}";
};

PluginUpdateUtilities.checkUpdate = function(pluginName, updateLink) {
	let request = require("request");
	request(updateLink, (error, response, result) => {
		if (error) return;
		var remoteVersion = result.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i);
		if (!remoteVersion) return;
		remoteVersion = remoteVersion.toString().replace(/['"]/g, "");
		var ver = remoteVersion.split(".");
		var lver = window.PluginUpdates.plugins[updateLink].version.split(".");
		var hasUpdate = false;
		if (ver[0] > lver[0]) hasUpdate = true;
		else if (ver[0] == lver[0] && ver[1] > lver[1]) hasUpdate = true;
		else if (ver[0] == lver[0] && ver[1] == lver[1] && ver[2] > lver[2]) hasUpdate = true;
		else hasUpdate = false;
		if (hasUpdate) PluginUpdateUtilities.showUpdateNotice(pluginName, updateLink);
		else PluginUpdateUtilities.removeUpdateNotice(pluginName);
	});
};

PluginUpdateUtilities.showUpdateNotice = function(pluginName, updateLink) {
	if (!$('#pluginNotice').length)  {
		let noticeElement = '<div class="notice notice-info notice-3I4-y_ noticeInfo-3v29SJ size14-1wjlWP weightMedium-13x9Y8 height36-13sPn7" id="pluginNotice"><div class="notice-dismiss dismiss-1QjyJW" id="pluginNoticeDismiss"></div><span class="notice-message">The following plugins have updates:</span>&nbsp;&nbsp;<strong id="outdatedPlugins"></strong></div>';
		$('".app .guilds-wrapper + div > div:first > div:first"').append(noticeElement);
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
                let button = $('<button class="btn btn-reload button-2TvR03 size14-1wjlWP weightMedium-13x9Y8">Reload</button>');
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

PluginUtilities.showToast = function(content, options = {}) {
    if (!document.querySelector('.toasts')) {
		let container = document.querySelector('.channels-3g2vYe + div');
		let memberlist = container.querySelector('.channel-members-wrap');
		let form = container ? container.querySelector('form') : null;
		let left = container ? container.getBoundingClientRect().left : 310;
		let right = memberlist ? memberlist.getBoundingClientRect().left : 0;
		let width = right ? right - container.getBoundingClientRect().left : container.offsetWidth;
		let bottom = form ? form.offsetHeight : 80;
        let toastWrapper = document.createElement("div");
        toastWrapper.classList.add("toasts");
        toastWrapper.style.setProperty("left", container.getBoundingClientRect().left + "px");
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


// Plugins/Themes folder resolver from Square
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

PluginUtilities.formatString = function(string, values) {
	for (let val in values) {
		string = string.replace(new RegExp(`\\$\\{${val}\\}`, 'g'), values[val]);
	}
	return string;
};

// Based on Mirco's version
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

/*
Options:
scroll: Boolean — Determines if it should be a scroller context menu
*/
PluginContextMenu.Menu = class Menu {
	constructor(scroll = false) {
		this.theme = $('.theme-dark').length ? "theme-dark" : "theme-light";
		this.element = $("<div>").addClass("contextMenu-uoJTbz").addClass("plugin-context-menu").addClass(this.theme);
		this.scroll = scroll;
		if (scroll) {
			this.element.append($("<div>").addClass("scrollerWrap-2uBjct").addClass("scrollerThemed-19vinI").addClass("themeGhostHairline-2H8SiW").append(
				$("<div>").addClass("scroller-fzNley").addClass("scroller-TeDoLQ")
			));
		}
	}
	
	addGroup(contextGroup) {
		if (this.scroll) this.element.find(".scroller-fzNley").append(contextGroup.getElement());
		else this.element.append(contextGroup.getElement());
		return this;
	}
	
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			if (this.scroll) this.element.find(".scroller-fzNley").append(contextItems[i].getElement());
			else this.element.append(contextItems[i].getElement());
		}
		return this;
	}
	
	show(x, y) {
		const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const mouseX = x;
		const mouseY = y;
		
		let type = this.element.parents(".plugin-context-menu").length > this.element.parents(".contextMenu-uoJTbz").length ? ".plugin-context-menu" : ".contextMenu-uoJTbz";
		var depth = this.element.parents(type).length;
		if (depth == 0) this.element.appendTo('.app');
		this.element.css("top", mouseY).css("left", mouseX);
		
		if (depth > 0) {
			var top = this.element.parents(type).last();
			var closest = this.element.parents(type).first();
			var negate = closest.hasClass("invertChildX-LNv3Ce") ? -1 : 1;
			this.element.css("margin-left", negate * 170 + closest.offset().left - top.offset().left);
		}
		
		if (mouseY + this.element.outerHeight() >= maxHeight) {
			this.element.addClass("invertY").addClass("undefined");
			this.element.css("top", mouseY - this.element.outerHeight());
			if (depth > 0) this.element.css("top", (mouseY + this.element.parent().outerHeight()) - this.element.outerHeight());
		}
		if (this.element.offset().left + this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertX");
			this.element.css("left", mouseX - this.element.outerWidth());
		}
		if (this.element.offset().left + 2 * this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertChildX-LNv3Ce");
		}

		if (depth == 0) {
			$(document).on("mousedown.zctx", (e) => {
				if (!this.element.has(e.target).length && !this.element.is(e.target)) {
					this.removeMenu();
				}
			});
			$(document).on("click.zctx", (e) => {
				if (this.element.has(e.target).length) {
					if ($._data($(e.target).closest(".item")[0], 'events').click) {
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
	
	removeMenu() {
		let type = this.element.parents(".plugin-context-menu").length > this.element.parents(".contextMenu-uoJTbz").length ? ".plugin-context-menu" : ".contextMenu-uoJTbz";
		this.element.detach();
		this.element.find(type).detach();
		$(document).off(".zctx");
	}
	
	attachTo(menuItem) {
		this.menuItem = menuItem;
		menuItem.on("mouseenter", () => {
			this.element.appendTo(menuItem);
			let type = this.element.parents(".plugin-context-menu").length > this.element.parents(".contextMenu-uoJTbz").length ? ".plugin-context-menu" : ".contextMenu-uoJTbz";
			this.show(this.element.parents(type).css("left"), menuItem.offset().top);
		});
		menuItem.on("mouseleave", () => { this.element.detach(); });
	}
};

PluginContextMenu.ItemGroup = class ItemGroup {
	constructor() {
		this.element = $("<div>").addClass("itemGroup-oViAgA");
	}
	
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			this.element.append(contextItems[i].getElement());
		}
		return this;
	}
	
	getElement() { return this.element; }
};

/*
Options:
danger: Boolean — Adds the danger class (for things like delete)
callback: Function — Function to call back on click
*/
PluginContextMenu.MenuItem = class MenuItem {
	constructor(label, options = {}) {
		var {danger = false, callback} = options;
		this.element = $("<div>").addClass("item-1XYaYf");
		this.label = label;
		if (danger) this.element.addClass("danger-1oUOCl");
		if (typeof(callback) == 'function') {
			this.element.on("click", (event) => {
				event.stopPropagation();
				callback(event);
			});
		}
	}
	getElement() { return this.element;}
};

/*
Additional Options:
hint: String — Usually used for key combos
*/
PluginContextMenu.TextItem = class TextItem extends PluginContextMenu.MenuItem {
	constructor(label, options = {}) {
		super(label, options);
		var {hint = ""} = options;
		this.element.append($("<span>").text(label));
		this.element.append($("<div>").addClass("hint-3TJykr").text(hint));
	}
};

PluginContextMenu.ImageItem = class ImageItem extends PluginContextMenu.MenuItem {
	constructor(label, imageSrc, options = {}) {
		super(label, options);
		this.element.addClass("itemImage-24yxbi");
		this.element.append($("<div>").addClass("label-2CGfN3").text(label));
		this.element.append($("<img>", {src: imageSrc}));
	}
};

PluginContextMenu.SubMenuItem = class SubMenuItem extends PluginContextMenu.MenuItem {
	constructor(label, subMenu, options = {}) {
		// if (!(subMenu instanceof ContextSubMenu)) throw "subMenu must be of ContextSubMenu type.";
		super(label, options);
		this.element.addClass("itemSubMenu-3ZgIw-").text(label);
		this.subMenu = subMenu;
		this.subMenu.attachTo(this.getElement());
	}
};

PluginContextMenu.ToggleItem = class ToggleItem extends PluginContextMenu.MenuItem {
	constructor(label, checked, options = {}) {
        var {onChange} = options;
		super(label, options);
		this.element.addClass("itemToggle-e7vkml");
        this.element.append($("<div>").addClass("label-2CGfN3").text(label));
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

PluginSettings.ControlGroup = class ControlGroup {
	constructor(groupName, callback, options = {}) {
		const {collapsible = true, shown = false} = options;
		this.group = $("<div>").addClass("plugin-control-group").css("margin-top", "15px");
		var collapsed = shown || !collapsible ? '' : ' collapsed';
		var label = $('<h2>').html('<span class="button-collapse' + collapsed + '" style=""></span> ' + groupName);
		label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
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
	
	getElement() {return this.group;}
	
	append(...nodes) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] instanceof jQuery || nodes[i] instanceof Element) this.controls.append(nodes[i]);
			else if (nodes[i] instanceof PluginSettings.SettingField) this.controls.append(nodes[i].getElement());
		}
		return this;
	}
	
	appendTo(node) {
		this.group.appendTo(node);
		return this;
	}
};

PluginSettings.SettingField = class SettingField {
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
	
	setInputElement(node) {
		this.inputWrapper.empty();
		this.inputWrapper.append(node);
	}
	
	getElement() { return this.row; }
};

PluginSettings.Textbox = class Textbox extends PluginSettings.SettingField {
	constructor(label, help, value, placeholder, callback, options = {}) {
		options.type = "text";
		options.placeholder = placeholder;
		options.value = value;
		super(label, help, options, callback);
		this.input.addClass('plugin-input-text');
	}
};

PluginSettings.ColorPicker = class ColorPicker extends PluginSettings.SettingField {
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

PluginSettings.Slider = class Slider extends PluginSettings.SettingField {
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

	setLabelUnit(unit) {this.labelUnit = unit; this.label.text(this.value + this.labelUnit); return this;}
};

PluginSettings.Checkbox = class Checkbox extends PluginSettings.SettingField {
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

// True is right side
PluginSettings.PillButton = class PillButton extends PluginSettings.Checkbox {
	constructor(label, help, leftLabel, rightLabel, isChecked, callback, options = {}) {
		super(label, help, isChecked, callback, options);
		
		this.checkboxWrap.css("margin","0 9px");
		this.input.addClass('plugin-input-pill');
		
		var labelLeft = $('<span class="plugin-setting-label left">');
		labelLeft.text(leftLabel);
		var labelRight = $('<span class="plugin-setting-label right">');
		labelRight.text(rightLabel);
		
		var accent = PluginSettings.getAccentColor();
		
		if (isChecked) labelRight.css("color", accent);
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

PluginTooltip.Tooltip = class Tooltip {
	constructor(node, tip, style = "black") {
		this.node = node;
		this.tip = tip;
		//add to .tooltips
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

	show() {
		this.tooltip.removeClass("tooltip-bottom");
		this.tooltip.removeClass("tooltip-top");
		this.tooltip.appendTo('.tooltips');
		if (this.node.offset().top - this.tooltip.outerHeight() <= 0) {
			this.tooltip.addClass("tooltip-bottom");
			this.tooltip.css("top", this.node.offset().top + this.node.outerHeight());
		}
		else {
			this.tooltip.addClass("tooltip-top");
			this.tooltip.css("top", this.node.offset().top - this.tooltip.outerHeight());
		}
		var nodecenter = this.node.offset().left + (this.node.outerWidth() / 2);
		this.tooltip.css("left", nodecenter - (this.tooltip.outerWidth() / 2));
	}
};

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
	version: "0.5.5"
};

BdApi.clearCSS("PluginLibraryCSS");
//BdApi.clearCSS("ToastCSS");
//BdApi.clearCSS("UpdateNotice");
BdApi.injectCSS("PluginLibraryCSS", PluginSettings.getCSS() + PluginUtilities.getToastCSS() + PluginUpdateUtilities.getCSS());
//BdApi.injectCSS("ToastCSS", PluginUtilities.getToastCSS());
//BdApi.injectCSS("UpdateNotice", PluginUpdateUtilities.getCSS());
jQuery.extend(jQuery.easing, { easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; }});
