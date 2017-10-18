var ColorUtilities = {};
var DOMUtilities = {};
var ReactUtilities = {};
var PluginUtilities = {};
var PluginSettings = {};
var PluginContextMenu = {};
var PluginTooltip = {};
var DiscordPermissions = {};

/* global bdPluginStorage:false, BdApi:false, Symbol:false */

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

PluginUtilities.getCurrentServer = function() {
	var auditLog = document.querySelector('.guild-settings-audit-logs');
	if (auditLog) return ReactUtilities.getReactKey({node: auditLog, key: "guildId"});
	else return ReactUtilities.getReactKey({node: document.querySelector(".channels-wrap") || document.querySelector('.channels-3g2vYe'), key: "guildId", whiteList: {
		"_currentElement":true,
		"_instance":true,
		"_owner":true,
		"props":true,
		"children":true,
		"memoizedProps":true
	}});
};

PluginUtilities.isServer = function() { return PluginUtilities.getCurrentServer() ? true : false; };

PluginUtilities.getCurrentUser = function() {
	return ReactUtilities.getReactKey({node: $('div[class*="accountDetails"]')[0].parentElement, key: "user", whiteList: {
		"_currentElement": true,
		"props": true,
		"children": true,
		"child": true,
		"memoizedProps": true
	}});
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

PluginUtilities.checkForUpdate = function(pluginName, currentVersion) {
	var updateLink = "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/" + pluginName + "/" + pluginName + ".plugin.js";
	var downloadLink = "https://betterdiscord.net/ghdl?url=https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/" + pluginName + "/" + pluginName + ".plugin.js";
	PluginUtilities.checkUpdate(pluginName, currentVersion, updateLink, downloadLink);
	
	if (typeof window.PluginUpdates === "undefined") window.PluginUpdates = {plugins:{}};
	window.PluginUpdates.plugins[updateLink] = {name: pluginName, raw: updateLink, download: downloadLink, version: currentVersion};
	
	if (typeof window.PluginUpdates.interval === "undefined") {
		window.PluginUpdates.interval = setInterval(() => {
			window.PluginUpdates.checkAll();
		}, 7200000);
	}

	if (typeof window.PluginUpdates.checkAll === "undefined") {
		window.PluginUpdates.checkAll = function() {
			for (let key in this.plugins) {
				let plugin = this.plugins[key];
				PluginUtilities.checkUpdate(plugin.name, plugin.raw, plugin.download, plugin.version);
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
														if (node2 && node2.tagName && node2.querySelector(".bd-pfbtn")) {
															var updateButton = document.createElement("button");
															var tooltip = document.createElement("div");
															var tooltipobserver = new MutationObserver(() => {});
															updateButton.className = "bd-pfbtn bd-updatebtn";
															updateButton.innerText = "Check for Updates";
															updateButton.style.left = "220px";
															updateButton.onclick = function () {
																window.PluginUpdates.checkAll();
															};
															updateButton.onmouseover = function () {
																document.querySelector(".tooltips").appendChild(tooltip);
																tooltip.className = "tooltip tooltip-right tooltip-black";
																tooltip.innerText = "Checks for updates of plugins that support this feature. Right-click for a list.";
																tooltip.style.maxWidth = "";
																tooltip.style.left = $(updateButton).offset().left + $(updateButton).outerWidth() + "px";
																tooltip.style.top = $(updateButton).offset().top + ($(updateButton).outerHeight() - $(tooltip).outerHeight()) / 2 + "px";
																tooltipobserver = new MutationObserver((mutations) => {
																	mutations.forEach((mutation) => {
																		var nodes = Array.from(mutation.removedNodes);
																		var directMatch = nodes.indexOf(updateButton) > -1;
																		var parentMatch = nodes.some(parent => parent.contains(updateButton));
																		if (directMatch || parentMatch) {
																			tooltipobserver.disconnect();
																			tooltip.remove();
																		}
																	});
																});
																tooltipobserver.observe(document.body, {subtree: true, childList: true});
															};		
															updateButton.onmouseout = function () {
																tooltipobserver.disconnect();
																tooltip.remove();
															};	
															updateButton.oncontextmenu = function () {
																if (window.PluginUpdates && window.PluginUpdates.plugins) {
																	var list = [];
																	for (var plugin in window.PluginUpdates.plugins) {
																		list.push(window.PluginUpdates.plugins[plugin].name);
																	}
																	tooltip.innerText = list.join(", ");
																	tooltip.style.maxWidth = "400px";
																	tooltip.style.left = $(updateButton).offset().left + $(updateButton).outerWidth() + "px";
																	tooltip.style.top = $(updateButton).offset().top + ($(updateButton).outerHeight() - $(tooltip).outerHeight()) / 2 + "px";
																}
														};
															node2.querySelector(".bd-pfbtn").parentElement.insertBefore(updateButton, node2.querySelector(".bda-slist"));
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
		window.PluginUpdates.observer.observe(document.querySelector(".layers"), {childList:true});
	}
};

PluginUtilities.checkUpdate = function(pluginName, currentVersion, updateLink, downloadLink) {
	$.get(updateLink, (result) => {
		var ver = result.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i);
		if (!ver) return;
		ver = ver.toString().replace(/"/g, "");
		ver = ver.split(".");
		var lver = currentVersion.split(".");
		var hasUpdate = false;
		if (ver[0] > lver[0]) hasUpdate = true;
		else if (ver[0] == lver[0] && ver[1] > lver[1]) hasUpdate = true;
		else if (ver[0] == lver[0] && ver[1] == lver[1] && ver[2] > lver[2]) hasUpdate = true;
		else hasUpdate = false;
		if (hasUpdate) PluginUtilities.showUpdateNotice(pluginName, downloadLink);
		else PluginUtilities.removeUpdateNotice(pluginName);
	});
};

PluginUtilities.showUpdateNotice = function(pluginName, downloadLink) {
	BdApi.clearCSS("pluginNoticeCSS");
	BdApi.injectCSS("pluginNoticeCSS", "#pluginNotice {-webkit-app-region: drag;} #pluginNotice span, #pluginNotice span a {-webkit-app-region: no-drag;color:#fff;} #pluginNotice span a:hover {text-decoration:underline;}");
	let noticeElement = '<div class="notice notice-info" id="pluginNotice"><div class="notice-dismiss" id="pluginNoticeDismiss"></div>The following plugins have updates: &nbsp;<strong id="outdatedPlugins"></strong></div>';
	if (!$('#pluginNotice').length)  {
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
		pluginNoticeElement.html('<a href="' + downloadLink + '" target="_blank" referrer="UpdateNotice">' + pluginName + '</a>');
		if ($('#outdatedPlugins').children('span').length) $('#outdatedPlugins').append("<span class='separator'>, </span>");
		$('#outdatedPlugins').append(pluginNoticeElement);
	}
};

PluginUtilities.removeUpdateNotice = function(pluginName) {
	let notice = $('#' + pluginName + '-notice');
	if (notice.length) {
		if (notice.next('.separator').length) notice.next().remove();
		else if (notice.prev('.separator').length) notice.prev().remove();
		notice.remove();
	}
	if (!$('#outdatedPlugins').children('span').length) $('#pluginNoticeDismiss').click();
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
			if (change.addedNodes.length && change.addedNodes[0] instanceof Element && (change.addedNodes[0].classList.contains("messages-wrapper") || change.addedNodes[0].id === "friends")) plugin.onChannelSwitch();
			if (change.removedNodes.length && change.removedNodes[0] instanceof Element && change.removedNodes[0].id === "friends") plugin.onChannelSwitch();
		});
	});
	switchObserver.observe((document.querySelector('.chat') || document.querySelector('#friends')).parentElement, {childList: true, subtree:true});
	return switchObserver;
};

/*
Options:
scroll: Boolean — Determines if it should be a scroller context menu
*/
PluginContextMenu.Menu = class Menu {
	constructor(scroll = false) {
		this.theme = $('.theme-dark').length ? "theme-dark" : "theme-light";
		this.element = $("<div>").addClass("context-menu").addClass("plugin-context-menu").addClass(this.theme);
		this.scroll = scroll;
		if (scroll) {
			this.element.append($("<div>").addClass("scroller-wrap").addClass(this.theme === "theme-dark" ? "dark" : "light").append($("<div>").addClass("scroller")));
		}
	}
	
	addGroup(contextGroup) {
		if (this.scroll) this.element.find(".scroller").append(contextGroup.getElement());
		else this.element.append(contextGroup.getElement());
		return this;
	}
	
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			if (this.scroll) this.element.find(".scroller").append(contextItems[i].getElement());
			else this.element.append(contextItems[i].getElement());
		}
		return this;
	}
	
	show(x, y) {
		const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const mouseX = x;
		const mouseY = y;
		
		var depth = this.element.parents(".plugin-context-menu").length;
		if (depth == 0) this.element.appendTo('.app');
		this.element.css("top", mouseY).css("left", mouseX);
		
		if (depth > 0) {
			var top = this.element.parents(".plugin-context-menu").last();
			var closest = this.element.parents(".plugin-context-menu").first();
			var negate = closest.hasClass("invertChildX") ? -1 : 1;
			this.element.css("margin-left", negate * 170 + closest.offset().left - top.offset().left);
		}
		
		if (mouseY + this.element.outerHeight() >= maxHeight) {
			this.element.addClass("invertY");
			this.element.css("top", mouseY - this.element.outerHeight());
			if (depth > 0) this.element.css("top", (mouseY + this.element.parent().outerHeight()) - this.element.outerHeight());
		}
		if (this.element.offset().left + this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertX");
			this.element.css("left", mouseX - this.element.outerWidth());
		}
		if (this.element.offset().left + 2 * this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertChildX");
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
		this.element.detach();
		this.element.find(".plugin-context-menu").detach();
		$(document).off(".zctx");
	}
	
	attachTo(menuItem) {
		this.menuItem = menuItem;
		menuItem.on("mouseenter", () => {
			this.element.appendTo(menuItem);
			this.show(this.element.parents(".plugin-context-menu").css("left"), menuItem.offset().top);
		});
		menuItem.on("mouseleave", () => { this.element.detach(); });
	}
};

PluginContextMenu.ItemGroup = class ItemGroup {
	constructor() {
		this.element = $("<div>").addClass("item-group");
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
		this.element = $("<div>").addClass("item");
		this.label = label;
		if (danger) this.element.addClass("danger");
		if (typeof(callback) == 'function') {
			this.element.on("click", callback);
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
		this.element.append($("<div>").addClass("hint").text(hint));
	}
};

PluginContextMenu.ImageItem = class ImageItem extends PluginContextMenu.MenuItem {
	constructor(label, imageSrc, options = {}) {
		super(label, options);
		this.element.addClass("item-image");
		this.element.append($("<div>").addClass("label").text(label));
		this.element.append($("<img>", {src: imageSrc}));
	}
};

PluginContextMenu.SubMenuItem = class SubMenuItem extends PluginContextMenu.MenuItem {
	constructor(label, subMenu, options = {}) {
		// if (!(subMenu instanceof ContextSubMenu)) throw "subMenu must be of ContextSubMenu type.";
		super(label, options);
		this.element.addClass("item-subMenu").text(label);
		this.subMenu = subMenu;
		this.subMenu.attachTo(this.getElement());
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
	return ".plugin-controls input:focus{outline:0}.plugin-controls input[type=range]{-webkit-appearance:none;border:none!important;border-radius:5px;height:5px;cursor:pointer}.plugin-controls input[type=range]::-webkit-slider-runnable-track{background:0 0!important}.plugin-controls input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;background:#f6f6f7;width:10px;height:20px}.plugin-controls input[type=range]::-webkit-slider-thumb:hover{box-shadow:0 2px 10px rgba(0,0,0,.5)}.plugin-controls input[type=range]::-webkit-slider-thumb:active{box-shadow:0 2px 10px rgba(0,0,0,1)}.plugin-setting-label{color:#f6f6f7;font-weight:500}.plugin-setting-input-row{padding-right:5px!important}.plugin-setting-input-container{display:flex;align-items:center;justify-content:center}.plugin-control-group .button-collapse{background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FscXVlXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSItOTUwIDUzMiAxOCAxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtOTUwIDUzMiAxOCAxODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6bm9uZTt9DQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTS05MzIsNTMydjE4aC0xOHYtMThILTkzMnoiLz4NCjxwb2x5bGluZSBjbGFzcz0ic3QxIiBwb2ludHM9Ii05MzYuNiw1MzguOCAtOTQxLDU0My4yIC05NDUuNCw1MzguOCAiLz4NCjwvc3ZnPg0K);height:16px;width:16px;display:inline-block;vertical-align:bottom;transition:transform .3s ease;transform:rotate(0)}.plugin-control-group .button-collapse.collapsed{transition:transform .3s ease;transform:rotate(-90deg)}.plugin-control-group h2{font-size:14px}.plugin-controls .plugin-setting-input-container,.plugin-controls .ui-switch-wrapper{margin-top:5px}.plugin-controls.collapsed{display:none}.plugin-controls{display:block}";
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
			this.controls.append(nodes[i].getElement());
		}
		return this;
	}
	
	appendTo(node) {
		this.group.appendTo(node);
		return this;
	}
};

PluginSettings.SettingField = class SettingField {
	constructor(name, helptext, inputData, callback, disabled = false) {
		this.name = name;
		this.helptext = helptext;
		this.row = $("<div>").addClass("ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item").css("margin-top", 0);
		this.top = $("<div>").addClass("ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap plugin-setting-input-row");
		this.settingLabel = $("<h3>").attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child").text(name);
		
		this.help = $("<div>").addClass("ui-form-text style-description margin-top-4").css("flex", "1 1 auto").text(helptext);
		
		this.top.append(this.settingLabel);
		this.row.append(this.top, this.help);
		
		inputData.disabled = disabled;
		
		this.input = $("<input>", inputData);
		this.getValue = () => {return this.input.val();};
		this.processValue = (value) => {return value;};
		this.input.on("keyup change", () => {
			if (typeof callback != 'undefined') {
				var returnVal = this.getValue();
				callback(returnVal);
			}
		});
	}
	
	setInputElement(node) {
		this.top.append(node);
	}
	
	getElement() { return this.row; }
};

PluginSettings.Textbox = class Textbox extends PluginSettings.SettingField {
	constructor(label, help, value, placeholder, callback, disabled) {
		super(label, help, {type: "text", placeholder: placeholder, value: value}, callback, disabled);
		
		this.setInputElement(this.input);
	}
};

PluginSettings.ColorPicker = class ColorPicker extends PluginSettings.SettingField {
	constructor(label, help, value, callback, disabled) {
		super(label, help, {type: "color", value: value}, callback, disabled);
		this.input.css("margin-left", "10px");
		
		var settingLabel = $('<span class="plugin-setting-label">').text(value);
		
		this.input.on("input", function() {
			settingLabel.text($(this).val());
		});
		
		this.setInputElement(PluginSettings.createInputContainer().append(settingLabel, this.input));
	}
};

PluginSettings.Slider = class Slider extends PluginSettings.SettingField {
	constructor(settingLabel, help, min, max, step, value, callback, disabled) {
		super(settingLabel, help, {type: "range", min: min, max: max, step: step, value: parseFloat(value)}, callback, disabled);
		this.value = parseFloat(value); this.min = min; this.max = max;
		
		this.getValue = () => { return parseFloat(this.input.val()); };
		
		this.accentColor = PluginSettings.getAccentColor();
		this.setBackground();
		this.input.css("margin-left", "10px").css("float", "right");
		
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
	constructor(label, help, isChecked, callback, disabled) {
		super(label, help, {type: "checkbox", checked: isChecked}, callback, disabled);
		this.getValue = () => { return this.input.prop("checked"); };
		this.input.addClass("ui-switch-checkbox");

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
	constructor(label, help, leftLabel, rightLabel, isChecked, callback, disabled) {
		super(label, help, isChecked, callback, disabled);
		
		this.checkboxWrap.css("margin","0 9px");
		
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
	constructor(node, tip) {
		this.node = node;
		this.tip = tip;
		//add to .tooltips
		this.tooltip = $('<div class="tooltip tooltip-black">');
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
	PluginSettings: PluginSettings,
	ContextMenu: PluginContextMenu,
	Tooltip: PluginTooltip,
	DiscordPermissions: DiscordPermissions
};

BdApi.clearCSS("PluginLibrary");
BdApi.injectCSS("PluginLibrary", PluginSettings.getCSS());
jQuery.extend(jQuery.easing, { easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; }});