//META{"name":"BetterFormattingRedux"}*//

/* global $ */
/* global bdPluginStorage */
/* global BdApi */
var BetterFormattingRedux = (function() {

class BFRedux {
	getName() { return "BetterFormattingRedux" }
	getShortName() { return "BFRedux" }
	getDescription() { return "Enables different types of formatting in standard Discord chat. Support Server: bit.ly/ZeresServer" }
	getVersion() { return "2.2.0" }
	getAuthor() { return "Zerebos" }

	constructor() {
		this.isOpen = false
		this.hasUpdate = false
		this.jquiLoaded = false
		this.remoteVersion = ""
		this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
		this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
		this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
		this.upsideDownList = " ¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
		this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
		this.leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";

		this.toolbarString = `<div id="bfredux" class='bf-toolbar'><div class='bf-arrow'></div></div>`;
		
		this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```"}

		this.defaultSettings = {toolbar: {bold: true, italic: true, underline: true, strikethrough: true, code: true, codeblock: true, superscript: true, smallcaps: true, fullwidth: true, upsidedown: true, varied: true, leet: false},
								toolbarOrder: ["bold", "italic", "underline", "strikethrough", "code", "codeblock", "superscript", "smallcaps", "fullwidth", "upsidedown", "varied", "leet"],
								formats: {superscript: true, smallcaps: true, fullwidth: true, upsidedown: true, varied: true, leet: false},
								wrappers: {superscript: "^^", smallcaps: "%%", fullwidth: "##", upsidedown: "&&", varied: "||", leet: "++"},
								formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
								plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true},
								style: {rightSide: true, opacity: 1, fontSize: "85%"}}
		this.settings = {toolbar: {bold: true, italic: true, underline: true, strikethrough: true, code: true, codeblock: true, superscript: true, smallcaps: true, fullwidth: true, upsidedown: true, varied: true, leet: false},
						toolbarOrder: ["bold", "italic", "underline", "strikethrough", "code", "codeblock", "superscript", "smallcaps", "fullwidth", "upsidedown", "varied", "leet"],
						formats: {superscript: true, smallcaps: true, fullwidth: true, upsidedown: true, varied: true, leet: false},
						wrappers: {superscript: "^^", smallcaps: "%%", fullwidth: "##", upsidedown: "&&", varied: "||", leet: "++"},
						formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
						plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true},
						style: {rightSide: true, opacity: 1, fontSize: "85%"}}
						
		this.customWrappers = Object.keys(this.settings.wrappers)
		
		
		this.toolbarData = {
			bold: {type: "native-format", displayName: "<b>Bold</b>"},
			italic: {type: "native-format", displayName: "<i>Italic</i>"},
			underline: {type: "native-format", displayName: "<u>Underline</u>"},
			strikethrough: {type: "native-format", displayName: "<s>Strikethrough</s>"},
			code: {type: "native-format", displayName: "<span style='font-family:monospace;'>Code</span>"},
			codeblock: {type: "native-format", displayName: "<span style='font-family:monospace;text-decoration: underline overline;'>|CodeBlock|</span>"},
			superscript: {type: "bfr-format", displayName: "ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ"},
			smallcaps: {type: "bfr-format",	displayName: "SᴍᴀʟʟCᴀᴘs"},
			fullwidth: {type: "bfr-format", displayName: "Ｆｕｌｌｗｉｄｔｈ"},
			upsidedown: {type: "bfr-format", displayName: "uʍopǝpᴉsd∩"},
			varied: {type: "bfr-format", displayName: "VaRiEd CaPs"},
			leet: {type: "bfr-format", displayName: "1337"}
		}
		
		
		// CSS is a modified form of the CSS used in
		// Beard's Material Design Theme for BetterDiscord
		// Make sure to check it out!
		// http://www.beard-design.com/discord-material-theme
		this.mainCSS =  `/* CSS STUFF */
		
.bf-toolbar {
    user-select: none;
    white-space: nowrap;
    font-size:85%;
    display:flex;
    position: absolute;
    color: rgba(255, 255, 255, .5);
    width:auto!important;
    right:0;
    bottom:auto;
    border-radius:3px;
    margin:0!important;
    height:27px!important;
    top:0px;
    transform:translate(0,-100%);
    opacity:1;
    display:block!important;
    overflow: hidden!important;
    pointer-events: none;
    padding:10px 30px 15px 5px;
    margin-right:5px!important;
}

.bf-toolbar.bf-visible,
.bf-toolbar.bf-hover:hover{
    pointer-events: initial;
}

.bf-toolbar:before {
    content:"";
    display: block;
    width:100%;
    height:calc(100% - 15px);
    position: absolute;
    z-index: -1;
    background:#424549;
    pointer-events: initial;
    left:0px;
    top:5px;
    border-radius:3px;
    transform:translate(0,55px);
    transition:all 200ms ease;
}

.bf-toolbar.bf-visible:before,
.bf-toolbar.bf-hover:hover:before {
    transform:translate(0,0px);
    transition:all 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format {
    display: inline;
    padding: 7px 5px;
    cursor: pointer;
    display : inline-flex;
    align-items : center;
    transform:translate(0,55px);
    transition:all 50ms,transform 200ms ease;
    position:relative;
    pointer-events: initial;
    border-radius:2px;
}

.bf-toolbar .format:hover{
    background:rgba(255,255,255,.1);
    color:rgba(255,255,255,.9);
}

.bf-toolbar .format:active{
    background:rgba(0,0,0,.1)!important;
    transition:all 0ms,transform 200ms ease;
}

.bf-toolbar.bf-visible .format,
.bf-toolbar.bf-hover:hover .format{
    transform:translate(0,0);
    transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .format.disabled {
	display: none;
}

.bf-toolbar .format.ghost {
	color: transparent;
	background: rgba(0,0,0,.1);
}

.bf-toolbar .bf-arrow {
    content:"";
    display:block;
    background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
    height:30px;
    width:30px;
    right:5px;
    position: absolute;
    pointer-events: initial;
    bottom:0;
    background-repeat: no-repeat;
    background-position: 50%;
    transition:all 200ms ease;
    opacity: .3;
    cursor:pointer;
}
.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
    transform:translate(0,-14px)rotate(-90deg);
    transition:all 200ms cubic-bezier(0,0,0,1);
    opacity: .9;
}

.message-group .bf-toolbar{
    padding: 10px 5px 15px 5px;
    animation:slide-up 300ms cubic-bezier(0,0,0,1), opacity 300ms ease
}
.upload-modal .bf-toolbar {
    padding: 10px 5px 15px 5px;
    top:5px;
    left:50%;
    right:auto;
    transform:translate(-50%,-100%);
}
.upload-modal .bf-toolbar .format:hover{
    background:rgba(255,255,255,.1);
}
.upload-modal .bf-toolbar .format:active{
    background:rgba(0,0,0,.1);
}
.upload-modal .bf-toolbar .format,
.upload-modal .bf-toolbar:before,
.message-group .bf-toolbar .format,
.message-group .bf-toolbar:before{
    transform:translate(0,0);
}
.upload-modal .bf-toolbar .bf-arrow,
.message-group .bf-toolbar .bf-arrow{
    display: none;
}

.bf-toolbar.bf-left {
	left: 0!important;
	right: auto!important;
	margin-right: 0!important;
	margin-left: 5px!important;
	padding: 10px 10px 15px 30px!important;
}

.bf-toolbar.bf-left .bf-arrow {
	left: 5px!important;
	right: auto!important;
}

.bf-toolbar.bf-left.bf-hover:hover .bf-arrow,.bf-toolbar.bf-left.bf-visible .bf-arrow {
	-webkit-transform: translate(0,-14px) rotate(90deg)!important;
	-ms-transform: translate(0,-14px) rotate(90deg)!important;
	transform: translate(0,-14px) rotate(90deg)!important;
}
.bf-languages {
	display: block;
	position: fixed !important;
	transform: scale(1,0);
	transform-origin: 100% 100%!important;
	background: #424549;
	border-radius: 3px;
	color: rgba(255,255,255,.5);
	padding: 3px;
}
.bf-languages.bf-visible {
	height: auto;
	transition: 200ms cubic-bezier(.2,0,0,1);
	transform: scale(1,1);
	transform-origin: 100% 100%!important;
}

.bf-languages div {
	display: block;
	cursor: pointer;
	padding: 5px 7px;
	border-radius: 2px;
}

.bf-languages div:hover {
    background: rgba(255,255,255,.1);
    color: rgba(255,255,255,.9);
}
`
	}

	loadSettings() {
		try { $.extend(true, this.settings, this.defaultSettings, bdPluginStorage.get(this.getShortName(), "settings")); }
		catch (err) { console.warn(this.getShortName(), "unable to load settings:", err); }
	}

	saveSettings() {
		try { bdPluginStorage.set(this.getShortName(), "settings", this.settings) }
		catch (err) { console.warn(this.getShortName(), "unable to save settings:", err) }
	}
	
	escape(s) {
		return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	
	checkForUpdate() {
		const githubRaw = "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/"+this.getName()+"/"+this.getName()+".plugin.js"
		$.get(githubRaw, (result) => {
			var ver = result.match(/"[0-9]+\.[0-9]+\.[0-9]+"/i);
			if (!ver) return;
			ver = ver.toString().replace(/"/g, "")
			this.remoteVersion = ver;
			ver = ver.split(".")
			var lver = this.getVersion().split(".")
			if (ver[0] > lver[0]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1] > lver[1]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1]==lver[1] && ver[2] > lver[2]) this.hasUpdate = true;
			else this.hasUpdate = false;
			if (this.hasUpdate) {
				this.showUpdateNotice()
			}
		});
	}

	showUpdateNotice() {
		const updateLink = "https://betterdiscord.net/ghdl?url=https://github.com/rauenzi/BetterDiscordAddons/blob/master/Plugins/"+this.getName()+"/"+this.getName()+".plugin.js"
		BdApi.clearCSS("pluginNoticeCSS")
		BdApi.injectCSS("pluginNoticeCSS", "#pluginNotice span, #pluginNotice span a {-webkit-app-region: no-drag;color:#fff;} #pluginNotice span a:hover {text-decoration:underline;}")
		let noticeElement = '<div class="notice notice-info" id="pluginNotice"><div class="notice-dismiss" id="pluginNoticeDismiss"></div>The following plugins have updates: &nbsp;<strong id="outdatedPlugins"></strong></div>'
		if (!$('#pluginNotice').length)  {
			$('.app.flex-vertical').children().first().before(noticeElement);
			$('.win-buttons').addClass("win-buttons-notice")
			$('#pluginNoticeDismiss').on('click', () => {
				$('.win-buttons').animate({top: 0}, 400, "swing", () => {$('.win-buttons').css("top","").removeClass("win-buttons-notice")});
				$('#pluginNotice').slideUp({complete: () => {$('#pluginNotice').remove()}});
			})
		}
		let pluginNoticeID = this.getName()+'-notice'
		let pluginNoticeElement = $('<span id="'+pluginNoticeID+'">')
		pluginNoticeElement.html('<a href="'+updateLink+'" target="_blank">'+this.getName()+'</a>')
		if (!$('#'+pluginNoticeID).length) {
			if ($('#outdatedPlugins').children('span').length) pluginNoticeElement.html(', ' + pluginNoticeElement.html());
			$('#outdatedPlugins').append(pluginNoticeElement)
		}
	}
	
	load() {this.checkForUpdate();}
	unload() {};
	
	start() {
		this.checkForUpdate();
		this.loadSettings();
		BdApi.injectCSS(this.getShortName()+"-style", this.mainCSS);
		BdApi.injectCSS(this.getShortName()+"-settings", SettingField.getCSS(this.getName()));
		this.jqui = document.createElement("script");
		this.jqui.setAttribute("src", "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js");
		this.jqui.setAttribute("integrity", "sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=")
		this.jqui.setAttribute("crossorigin", "anonymous")
		this.jqui.async = false;
		document.head.appendChild(this.jqui);
		this.jqui.addEventListener("load", () => {this.jquiLoaded = true; this.setupToolbar()})
	}
	
	stop() {
		$("*").off("."+this.getShortName());
		$(".bf-toolbar").remove();
		this.jqui.remove()
		BdApi.clearCSS(this.getShortName()+"-style");
		BdApi.clearCSS(this.getShortName()+"-settings");
	}
	
	onSwitch() {};
	
	observer(e) {
		if (!e.addedNodes.length) return;

		var $elem = $(e.addedNodes[0]);
		
		if ($elem.find(".channelTextArea-1HTP3C").length || $elem.closest(".channelTextArea-1HTP3C").length && this.jquiLoaded) {
			var $textarea = $elem.find("textarea");
			this.addToolbar($textarea);
		}
	}
	
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		this.generateSettings(panel)
		return panel[0];
	}

	updateStyle() {
		this.updateSide()
		this.updateOpacity()
		this.updateFontSize()
	}
	
	updateSide() {
		if (this.settings.style.rightSide) { $(".bf-toolbar").removeClass("bf-left") }
		else { $(".bf-toolbar").addClass("bf-left") }
	}
	
	updateOpacity() {
		$(".bf-toolbar").css("opacity", this.settings.style.opacity)
	}

	updateFontSize() {
		$(".bf-toolbar").css("font-size", this.settings.style.fontSize)
	}
	
	openClose() {
		this.isOpen = !this.isOpen;
		$(".bf-toolbar").toggleClass('bf-visible');
	}
	
	doFormat(text, wrapper, offset) {

		// If this is not a wrapper, return original
		if (text.substring(offset, offset+wrapper.length) != wrapper) return text;
		
		var returnText = text, len = text.length
		var begin = text.indexOf(wrapper, offset);
		
		if (text[begin-1] == "\\") return text; // If the wrapper is escaped, remove the backslash and return the text
		
		var end = text.indexOf(wrapper, begin + wrapper.length);
		if (end != -1) end += wrapper.length-1;
		
		// Making it to this point means that we have found a full wrapper
		// This block performs inner chaining
		if (this.settings.plugin.chainFormats) {
			for (var w=0; w<this.customWrappers.length; w++) {
				var newText = this.doFormat(returnText, this.settings.wrappers[this.customWrappers[w]], begin+wrapper.length);
				if (returnText != newText) {
					returnText = newText;
					end = end - this.settings.wrappers[this.customWrappers[w]].length*2
				}
			}
		}
		
		returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
			var letterNum = 0;
			var previousLetter = "";
			middle = middle.replace(/./g, letter => {
				var index = this.replaceList.indexOf(letter);
				letterNum += 1;
				if (wrapper == this.settings.wrappers.fullwidth) {
					if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
					else return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
				}
				else if (wrapper == this.settings.wrappers.superscript) {return index != -1 ? this.superscriptList[index] : letter;}
				else if (wrapper == this.settings.wrappers.smallcaps) {return index != -1 ? this.smallCapsList[index] : letter;}
				else if (wrapper == this.settings.wrappers.upsidedown) {return index != -1 ? this.upsideDownList[index] : letter;}
				else if (wrapper == this.settings.wrappers.leet) {return index != -1 ? this.leetList[index] : letter;}
				else if (wrapper == this.settings.wrappers.varied) {
					var compare = this.settings.formatting.startCaps ? 1 : 0;
					if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
					return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
				}
				else {return letter;}
				previousLetter = letter;
			})
			if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
			else return before + middle + after;
		});
		
		return returnText;
	}
	
	format(e) {
		if (e.shiftKey || e.which != 13) return;
		var textarea = $(e.currentTarget);
		var text = textarea.val();
		for (var i = 0; i < text.length; i++) {
			if (text[i] == "`") {
				var next = text.indexOf("`", i + 1);
				if (next != -1)
					i = next;
			}
			else if (text[i] == "@") {
				var match = /@.*#[0-9]*/.exec(text.substring(i))
				if(match && match.index == 0) i += match[0].length - 1;
			}
			else {
				for (var w=0; w<this.customWrappers.length; w++) {
					if (!this.settings.formats[this.customWrappers[w]]) continue;
					var newText = this.doFormat(text, this.settings.wrappers[this.customWrappers[w]], i);
					if (text != newText) {
						text = newText;
						i = i - this.settings.wrappers[this.customWrappers[w]].length*2
					}
				}
			}
		}
		textarea.val(text);
		textarea[0].dispatchEvent(new Event('input', { bubbles: true }))
		if (this.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass('bf-visible');
	}
	
	wrapSelection(textarea, wrapper, language) {
		var text = textarea.value;
		var start = textarea.selectionStart;
		var len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
		var lang = language ? language : "";
		var newline = wrapper === "```" ? "\n" : "";
		text = wrapper + lang + newline + text.substring(textarea.selectionStart, textarea.selectionEnd) + newline + wrapper;
		textarea.focus();
		document.execCommand("insertText", false, text);
		textarea.selectionEnd = (textarea.selectionStart = start + wrapper.length + lang.length + newline.length) + len;
	}
	
	getContextMenu(textarea) {
		var allLanguages = {
			C: {cpp: "C++", csharp: "C#", coffeescript: "CoffeeScript", css: "CSS"},
			H: {html: "HTML/XML"},
			J: {java: "Java", js: "JavaScript", json: "JSON"},
			M: {markdown: "Markdown"},
			P: {perl: "Perl", php: "PHP", py: "Python"},
			R: {ruby: "Ruby"},
			S: {sql: "SQL"},
			V: {vbnet: "VB.NET", vhdl: "VHDL"}
		}
		var items = []
		for (var letter in allLanguages) {
			var subItems = []
			for (var language in allLanguages[letter]) {
				((language) => {
					subItems.push(new ContextMenuItemText(allLanguages[letter][language], {callback: () => {this.wrapSelection(textarea[0], "```", language)}}))
				})(language)
			}
			items.push(new ContextMenuItemSubMenu(letter, new ContextMenu(true).addItems(...subItems)))
		}
		return new ContextMenu().addItems(...items);
	}
	
	buildToolbar(textarea) {
		var toolbar = $(this.toolbarString)
		for (var i=0; i<this.settings.toolbarOrder.length;i++) {
			var button = $("<div>")
			button.addClass("format")
			button.addClass(this.toolbarData[this.settings.toolbarOrder[i]].type)
			if (!this.settings.toolbar[this.settings.toolbarOrder[i]]) button.addClass("disabled");
			if (this.settings.toolbarOrder[i] === "codeblock") {
				var contextMenu = this.getContextMenu(textarea)
				button.on("contextmenu", (e) => {
					contextMenu.show(e.clientX, e.clientY)
				})
			}
			button.attr("data-name", this.settings.toolbarOrder[i])
			button.html(this.toolbarData[this.settings.toolbarOrder[i]].displayName)
			toolbar.append(button)
		}
		module.exports.create(toolbar[0], {
			draggable: ".format", // css-selector of elements, which can be sorted
			ghostClass: "ghost",
			onUpdate: (evt) => {
				var buttons = toolbar.children(".format")
				var order = []
				for (var i=0; i<buttons.length; i++) {
					order.push($(buttons[i]).data("name"))
				}
				this.settings.toolbarOrder = order;
				this.saveSettings()
			}
		});
		return toolbar
	}
	
	setupToolbar() {
		$(".bf-toolbar").remove();
		$(".channelTextArea-1HTP3C textarea").each((index, elem) => {
			this.addToolbar($(elem));
		});
	}
	
	addToolbar(textarea) {
		var toolbarElement = this.buildToolbar(textarea)
		if (this.settings.plugin.hoverOpen == true) toolbarElement.addClass("bf-hover");
		if (this.isOpen) toolbarElement.addClass("bf-visible");
		
		textarea.on("keypress."+this.getShortName(), (e) => {this.format(e)})
			.parent().after(toolbarElement)
			.siblings(".bf-toolbar")
			.on("click."+this.getShortName(), "div", (e) => {
				var button = $(e.currentTarget);
				if (button.hasClass("bf-arrow")) {
					if (!this.settings.plugin.hoverOpen) this.openClose();
				}
				else {
					var wrapper = "";
					if (button.hasClass("native-format")) wrapper = this.discordWrappers[button.data("name")];
					else wrapper = this.settings.wrappers[button.data("name")];
					this.wrapSelection(textarea[0], wrapper);	
				}
			})
		this.updateStyle()
	}
	
	generateSettings(panel) {
		
		new ControlGroup("Toolbar Buttons", () => {this.saveSettings(); this.setupToolbar()}).appendTo(panel).append(
			new CheckboxSetting("Bold", "", this.settings.toolbar.bold, (checked) => {this.settings.formats.bold = checked}),
			new CheckboxSetting("Italic", "", this.settings.toolbar.italic, (checked) => {this.settings.toolbar.italic = checked}),
			new CheckboxSetting("Underline", "", this.settings.toolbar.underline, (checked) => {this.settings.toolbar.underline = checked}),
			new CheckboxSetting("Strikethrough", "", this.settings.toolbar.strikethrough, (checked) => {this.settings.toolbar.strikethrough = checked}),
			new CheckboxSetting("Code", "", this.settings.toolbar.code, (checked) => {this.settings.toolbar.code = checked}),
			new CheckboxSetting("CodeBlock", "", this.settings.toolbar.codeblock, (checked) => {this.settings.toolbar.codeblock = checked}),
			new CheckboxSetting("Smallcaps", "", this.settings.toolbar.smallcaps, (checked) => {this.settings.toolbar.smallcaps = checked}),
			new CheckboxSetting("Full Width", "", this.settings.toolbar.fullwidth, (checked) => {this.settings.toolbar.fullwidth = checked}),
			new CheckboxSetting("Upsidedown", "", this.settings.toolbar.upsidedown, (checked) => {this.settings.toolbar.upsidedown = checked}),
			new CheckboxSetting("Varied Caps", "", this.settings.toolbar.varied, (checked) => {this.settings.toolbar.varied = checked}),
			new CheckboxSetting("Leet (1337)", "", this.settings.toolbar.leet, (checked) => {this.settings.toolbar.leet = checked})
		)
		
		new ControlGroup("Active Formats", () => {this.saveSettings()}).appendTo(panel).append(
			new CheckboxSetting("Superscript", "", this.settings.formats.superscript, (checked) => {this.settings.formats.superscript = checked}),
			new CheckboxSetting("Smallcaps", "", this.settings.formats.smallcaps, (checked) => {this.settings.formats.smallcaps = checked}),
			new CheckboxSetting("Full Width", "", this.settings.formats.fullwidth, (checked) => {this.settings.formats.fullwidth = checked}),
			new CheckboxSetting("Upsidedown", "", this.settings.formats.upsidedown, (checked) => {this.settings.formats.upsidedown = checked}),
			new CheckboxSetting("Varied Caps", "", this.settings.formats.varied, (checked) => {this.settings.formats.varied = checked}),
			new CheckboxSetting("Leet (1337)", "", this.settings.formats.leet, (checked) => {this.settings.formats.leet = checked})
		)
		
		new ControlGroup("Wrapper Options", () => {this.saveSettings()}).appendTo(panel).append(
			new TextSetting("Superscript", "The wrapper for superscripted text.", this.settings.wrappers.superscript, this.defaultSettings.wrappers.superscript,
							(text) => {this.settings.wrappers.superscript = text != "" ? text : this.defaultSettings.wrappers.superscript}),
			new TextSetting("Smallcaps", "The wrapper to make Smallcaps.", this.settings.wrappers.smallcaps, this.defaultSettings.wrappers.smallcaps,
							(text) => {this.settings.wrappers.smallcaps = text != "" ? text : this.defaultSettings.wrappers.smallcaps}),
			new TextSetting("Full Width", "The wrapper for E X P A N D E D  T E X T.", this.settings.wrappers.fullwidth, this.defaultSettings.wrappers.fullwidth,
							(text) => {this.settings.wrappers.fullwidth = text != "" ? text : this.defaultSettings.wrappers.fullwidth}),
			new TextSetting("Upsidedown", "The wrapper to flip the text upsidedown.", this.settings.wrappers.upsidedown, this.defaultSettings.wrappers.upsidedown,
							(text) => {this.settings.wrappers.upsidedown = text != "" ? text : this.defaultSettings.wrappers.upsidedown}),
			new TextSetting("Varied Caps", "The wrapper to VaRy the capitalization.", this.settings.wrappers.varied, this.defaultSettings.wrappers.varied,
							(text) => {this.settings.wrappers.varied = text != "" ? text : this.defaultSettings.wrappers.varied}),
			new TextSetting("LeetSpeak", "The wrapper to talk in 13375p34k.", this.settings.wrappers.leet, this.defaultSettings.wrappers.leet,
							(text) => {this.settings.wrappers.leet = text != "" ? text : this.defaultSettings.wrappers.leet})
		)
		
		new ControlGroup("Formatting Options", () => {this.saveSettings()}).appendTo(panel).append(
			new PillSetting("Fullwidth Style", "Which style of fullwidth formatting should be used.", "T H I S", "ｔｈｉｓ",
								this.settings.formatting.fullWidthMap, (checked) => {this.settings.formatting.fullWidthMap = checked}), 
			new CheckboxSetting("Reorder Upsidedown Text", "Having this enabled reorders the upside down text to make it in-order.",
								this.settings.formatting.reorderUpsidedown, (checked) => {this.settings.formatting.reorderUpsidedown = checked}),
			new CheckboxSetting("Start VaRiEd Caps With Capital", "Enabling this starts a varied text string with a capital.",
								this.settings.formatting.startCaps, (checked) => {this.settings.formatting.startCaps = checked})
		)
		
		new ControlGroup("Plugin Options", () => {this.saveSettings()}).appendTo(panel).append(
			new CheckboxSetting("Open On Hover", "Enabling this makes you able to open the menu just by hovering the arrow instead of clicking it.", this.settings.plugin.hoverOpen,
				(checked) => {
					 this.settings.plugin.hoverOpen = checked;
					 if (checked) {
						$(".bf-toolbar").removeClass('bf-visible')
						$(".bf-toolbar").addClass('bf-hover')
					 }
					 else {
						 $(".bf-toolbar").removeClass('bf-hover')
					 }
				}
			),
			new CheckboxSetting("Close On Send", "This option will close the toolbar when the message is sent when \"Open On Hover\" is disabled.",
								this.settings.plugin.closeOnSend, (checked) => {this.settings.plugin.closeOnSend = checked;}),
			new PillSetting("Format Chaining", "Swaps priority of wrappers between inner first and outer first. Check the GitHub for more info.", "Inner", "Outer",
								this.settings.plugin.chainFormats, (checked) => {this.settings.plugin.chainFormats = checked;})
		)
		
		new ControlGroup("Style Options", () => {this.saveSettings()}).appendTo(panel).append(
			new PillSetting("Toolbar Location", "This option enables swapping toolbar from right side to left side.", "Left", "Right",
							this.settings.style.rightSide, (checked) => {this.settings.style.rightSide = checked; this.updateSide();}),
			new SliderSetting("Opacity", "This allows the toolbar to be partially seethrough.", 0, 1, 0.01, this.settings.style.opacity, (val) => {this.settings.style.opacity = val; this.updateOpacity();}),
			new SliderSetting("Font Size", "Adjust the font size between 0 and 100%.", 0, 100, 1, this.settings.style.fontSize, (val) => {this.settings.style.fontSize = val+"%"; this.updateFontSize();}).setLabelUnit("%")
		)
			
		var bfr = this;
		var resetButton = $("<button>");
		resetButton.on("click", function() {
			bfr.settings = bfr.defaultSettings;
			bfr.saveSettings();
			bfr.setupToolbar();
			panel.empty()
			bfr.generateSettings(panel)
		});
		resetButton.text("Reset To Defaults");
		resetButton.css("float", "right");
		resetButton.attr("type","button")

		panel.append(resetButton);
	}
}

/*
Options:
scroll: Boolean — Determines if it should be a scroller context menu
*/
class ContextMenu {
	constructor(scroll = false) {
		this.theme = $('#app-mount > div > div > .theme-dark').length ? "theme-dark" : "theme-light";
		this.element = $("<div>").addClass("context-menu").addClass("zere-context-menu").addClass(this.theme)
		this.scroll = scroll;
		if (scroll) {
			this.element.append($("<div>").addClass("scroller-wrap").addClass(this.theme === "theme-dark" ? "dark" : "light").append($("<div>").addClass("scroller")))
		}
	}
	
	addGroup(contextGroup) {
		if (this.scroll) this.element.find(".scroller").append(contextGroup.getElement());
		else this.element.append(contextGroup.getElement())
		return this;
	}
	
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			if (this.scroll) this.element.find(".scroller").append(contextItems[i].getElement());
			else this.element.append(contextItems[i].getElement());
		}
		return this
	}
	
	show(x, y) {
		const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const mouseX = x;
		const mouseY = y;
		
		var depth = this.element.parents(".zere-context-menu").length
		if (depth == 0) this.element.insertBefore('#app-mount > div > div > span');
		this.element.css("top", mouseY).css("left", mouseX)
		
		if (depth > 0) {
			var top = this.element.parents(".zere-context-menu").last();
			var closest = this.element.parents(".zere-context-menu").first();
			var negate = closest.hasClass("invertChildX") ? -1 : 1
			this.element.css("margin-left", negate*170 + closest.offset().left - top.offset().left);
		}
		
		if (mouseY + this.element.outerHeight() >= maxHeight) {
			this.element.addClass("invertY");
			this.element.css("top", mouseY-this.element.outerHeight())
			if (depth > 0) this.element.css("top", (mouseY+this.element.parent().outerHeight())-this.element.outerHeight());
		}
		if (this.element.offset().left + this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertX");
			this.element.css("left", mouseX-this.element.outerWidth())
		}
		if (this.element.offset().left + 2*this.element.outerWidth() >= maxWidth) {
			this.element.addClass("invertChildX");
		}

		if (depth == 0) {
			$(document).on("mousedown.zctx", (e) => {
				if (!this.element.has(e.target).length && !this.element.is(e.target)) {
					this.removeMenu()
				}
			})
			$(document).on("click.zctx", (e) => {
				if (this.element.has(e.target).length) {
					if ($._data($(e.target).closest(".item")[0], 'events').click) {
						this.removeMenu()
					}
				}
			})
			$(document).on("keyup.zctx", (e) => {
				if (e.keyCode === 27) {
					this.removeMenu()
				}
			})
		}
	}
	
	removeMenu() {
		this.element.detach()
		$(document).off(".zctx")
	}
	
	attachTo(menuItem) {
		this.menuItem = menuItem;
		menuItem.on("mouseenter", ()=>{
			this.element.appendTo(menuItem)
			this.show(this.element.parents(".zere-context-menu").css("left"), menuItem.offset().top)
		})
		menuItem.on("mouseleave", ()=>{this.element.detach()})
	}
}

class ContextMenuGroup {
	constructor() {
		this.element = $("<div>").addClass("item-group")
	}
	
	addItems(...contextItems) {
		for (var i = 0; i < contextItems.length; i++) {
			this.element.append(contextItems[i].getElement())
		}
		return this
	}
	
	getElement() {return this.element}
}

/*
Options:
danger: Boolean — Adds the danger class (for things like delete)
callback: Function — Function to call back on click
*/
class ContextMenuItem {
	constructor(label, options = {}) {
		var {danger = false, callback} = options
		this.element = $("<div>").addClass("item")
		this.label = label
		if (danger) this.element.addClass("danger");
		if (typeof(callback) == 'function') {
			this.element.on("click", callback)
		}
	}
	getElement() {return this.element}
}

/*
Additional Options:
hint: String — Usually used for key combos
*/
class ContextMenuItemText extends ContextMenuItem {
	constructor(label, options = {}) {
		super(label, options)
		var {hint = ""} = options
		this.element.append($("<span>").text(label))
		this.element.append($("<div>").addClass("hint").text(hint));
	}
}

class ContextMenuItemImage extends ContextMenuItem {
	constructor(label, imageSrc, options = {}) {
		super(label, options)
		this.element.addClass("item-image")
		this.element.append($("<div>").addClass("label").text(label))
		this.element.append($("<img>", {src: imageSrc}));
	}
}

class ContextMenuItemSubMenu extends ContextMenuItem {
	constructor(label, subMenu, options= {}) {
		// if (!(subMenu instanceof ContextSubMenu)) throw "subMenu must be of ContextSubMenu type.";
		super(label, options)
		this.element.addClass("item-subMenu").text(label)
		this.subMenu = subMenu
		this.subMenu.attachTo(this.getElement())
	}
}

class ControlGroup {
	constructor(groupName, callback, options = {}) {
		const {collapsible = true, shown = false} = options
		this.group = $("<div>").addClass("plugin-control-group").css("margin-top", "15px");
		var collapsed = shown || !collapsible ? '' : ' collapsed'
		var label = $('<h2>').html('<span class="button-collapse'+collapsed+'" style=""></span> '+groupName);
		label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
		this.group.append(label);
		this.controls = $('<div class="plugin-controls collapsible'+collapsed+'">')
		this.group.append(this.controls)
		if (collapsible) {
			label.on('click', (e) => {
				let button = $(e.target).find('.button-collapse')
				let wasCollapsed = button.hasClass('collapsed')
				this.group.parent().find('.collapsible:not(.collapsed)').slideUp({duration: 300, easing: "easeInSine", complete: function() {$(this).addClass('collapsed')}}); // .slideUp({duration: 300, easing: "easeInSine"})
				this.group.parent().find('.button-collapse').addClass('collapsed');
				if (wasCollapsed) {
					this.controls.slideDown({duration: 300, easing: "easeInSine"});
					this.controls.removeClass('collapsed')
					button.removeClass('collapsed')
				}
			})
		}
		
		if (typeof callback != 'undefined') {
			this.controls.on("change", "input", callback)
		}
	}
	
	getElement() {return this.group;}
	
	append(...nodes) {
		for (var i = 0; i < nodes.length; i++) {
			this.controls.append(nodes[i].getElement())
		}
		return this
	}
	
	appendTo(node) {
		this.group.appendTo(node)
		return this
	}
}

class SettingField {
	constructor(name, helptext, inputData, callback, disabled = false) {
		this.name = name;
		this.helptext = helptext;
		this.row = $("<div>").addClass("ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item").css("margin-top", 0);
		this.top = $("<div>").addClass("ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap plugin-setting-input-row")
		this.settingLabel = $("<h3>").attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child").text(name);
		
		this.help = $("<div>").addClass("ui-form-text style-description margin-top-4").css("flex", "1 1 auto").text(helptext);
		
		this.top.append(this.settingLabel);
		this.row.append(this.top, this.help);
		
		inputData.disabled = disabled
		
		this.input = $("<input>", inputData)
		this.getValue = () => {return this.input.val();}
		this.processValue = (value) => {return value;}
		this.input.on("keyup change", () => {
			if (typeof callback != 'undefined') {
				var returnVal = this.getValue()
				callback(returnVal)
			}
		})
	}
	
	setInputElement(node) {
		this.top.append(node)
	}
	
	getElement() {return this.row}
	
	static getAccentColor() {
		var bg = $('<div class="ui-switch-item"><div class="ui-switch-wrapper"><input type="checkbox" checked="checked" class="ui-switch-checkbox"><div class="ui-switch checked">')
		bg.appendTo($("#bd-settingspane-container"))
		var bgColor = $(".ui-switch.checked").first().css("background-color")
		var afterColor = window.getComputedStyle(bg.find(".ui-switch.checked")[0], ':after').getPropertyValue('background-color'); // For beardy's theme
		bgColor = afterColor == "rgba(0, 0, 0, 0)" ? bgColor : afterColor
		bg.remove();
		return bgColor
	}
	
	static getCSS(appName) {
		return `/* Settings CSS */
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
	background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FscXVlXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSItOTUwIDUzMiAxOCAxOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtOTUwIDUzMiAxOCAxODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6bm9uZTt9DQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTS05MzIsNTMydjE4aC0xOHYtMThILTkzMnoiLz4NCjxwb2x5bGluZSBjbGFzcz0ic3QxIiBwb2ludHM9Ii05MzYuNiw1MzguOCAtOTQxLDU0My4yIC05NDUuNCw1MzguOCAiLz4NCjwvc3ZnPg0K);
	height: 16px;
	width: 16px;
	display: inline-block;
	vertical-align: bottom;
	transition: transform 300ms ease;
	transform: rotate(0deg);
}

.plugin-control-group .button-collapse.collapsed {
	transition: transform 300ms ease;
	transform: rotate(-90deg);
}

.plugin-control-group h2 {
	font-size: 14px;
}

.plugin-controls .ui-switch-wrapper, .plugin-controls .plugin-setting-input-container {
	margin-top: 5px;
}

.plugin-controls.collapsed {
	display: none;
}

.plugin-controls {
	display: block;
}
		`;
	}
	
	static inputContainer() { return $('<div class="plugin-setting-input-container">');}
}

class TextSetting extends SettingField {
	constructor(label, help, value, placeholder, callback, disabled) {
		super(label, help, {type: "text", placeholder: placeholder, value: value}, callback, disabled);
		
		this.setInputElement(this.input);
	}
}

class ColorSetting extends SettingField {
	constructor(label, help, value, callback, disabled) {
		super(label, help, {type: "color", value: value}, callback, disabled);
		this.input.css("margin-left", "10px")
		
		var label = $('<span class="plugin-setting-label">').text(value)
		
		this.input.on("input", function() {
			label.text($(this).val())
		})
		
		this.setInputElement(SettingField.inputContainer().append(label, this.input));
	}
}

class SliderSetting extends SettingField {
	constructor(settingLabel, help, min, max, step, value, callback, disabled) {
		super(settingLabel, help, {type: "range", min: min, max: max, step: step, value: parseFloat(value)}, callback, disabled);
		this.value = parseFloat(value); this.min = min; this.max = max;
		
		this.getValue = () => {return parseFloat(this.input.val());}
		
		this.accentColor = SettingField.getAccentColor()
		this.setBackground()
		this.input.css("margin-left", "10px").css("float", "right")
		
		this.labelUnit = ""
		this.label = $('<span class="plugin-setting-label">').text(this.value + this.labelUnit)
		
		this.input.on("input", () => {
			this.value = parseFloat(this.input.val())
			this.label.text(this.value + this.labelUnit)
			this.setBackground()
		})
		
		this.setInputElement(SettingField.inputContainer().append(this.label,this.input));
	}
	
	getPercent() {return ((this.value-this.min)/this.max)*100;}
	setBackground() {var percent = this.getPercent(); this.input.css('background', 'linear-gradient(to right, '+this.accentColor+', '+this.accentColor+' '+percent+'%, #72767d '+percent+'%)')}
	setLabelUnit(unit) {this.labelUnit = unit; this.label.text(this.value + this.labelUnit); return this;}
}

class CheckboxSetting extends SettingField {
	constructor(label, help, isChecked, callback, disabled) {
		super(label, help, {type: "checkbox", checked: isChecked}, callback, disabled);
		this.getValue = () => {return this.input.prop("checked")}
		this.input.addClass("ui-switch-checkbox");

		this.input.on("change", function() {
			if ($(this).prop("checked")) switchDiv.addClass("checked");
			else switchDiv.removeClass("checked");
		})
		
		this.checkboxWrap = $('<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">');
		this.checkboxWrap.append(this.input);
		var switchDiv = $('<div class="ui-switch">');
		if (isChecked) switchDiv.addClass("checked");
		this.checkboxWrap.append(switchDiv);
		this.checkboxWrap.css("right", "0px")

		this.setInputElement(this.checkboxWrap);
	}
}

// True is right side
class PillSetting extends CheckboxSetting {
	constructor(label, help, leftLabel, rightLabel, isChecked, callback, disabled) {
		super(label, help, isChecked, callback, disabled);
		
		this.checkboxWrap.css("margin","0 9px")
		
		var labelLeft = $('<span class="plugin-setting-label left">')
		labelLeft.text(leftLabel)
		var labelRight = $('<span class="plugin-setting-label right">')
		labelRight.text(rightLabel)
		
		var accent = SettingField.getAccentColor()
		
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
		})
		
		this.setInputElement(SettingField.inputContainer().append(labelLeft, this.checkboxWrap.detach(), labelRight));
	}
}

return BFRedux;
})();