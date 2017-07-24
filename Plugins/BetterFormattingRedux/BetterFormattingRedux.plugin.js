//META{"name":"BetterFormattingRedux"}*//

var BetterFormattingRedux = (function() {

var appName = "Better Formatting Redux";
var appAuthor = "Zerebos";
var appVersion = "1.1.5";

var appDescription = "Enables different formatting in standard Discord chat. Support Server: bit.ly/ZeresServer";

var appNameShort = "BFRedux"; // Used for namespacing, settings, and logging


class ControlGroup {
	constructor(groupName, callback) {
		var group = $("<div>").addClass("control-group");

		var label = $("<h2>").text(groupName);
		label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
		label.css("margin-top", "30px")
		group.append(label);
		
		if (typeof callback != 'undefined') {
			group.on("change."+appNameShort, "input", callback)
		}

		return group;
	}
}

class SettingField {
	constructor(name, helptext) {
		this.name = name;
		this.helptext = helptext;
		this.row = $("<div>");
		this.row.attr("class", "ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item");
		this.row.css("margin-top", 0);
		this.top = $("<div>");
		this.top.attr("class", "ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap")
		this.label = $("<h3>");
		this.label.attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child");
		this.label.text(name);
		
		this.help = $("<div>");
		this.help.attr("class", "ui-form-text style-description margin-top-4");
		this.help.css("flex", "1 1 auto");
		this.help.text(helptext);
		
		this.top.append(this.label);
		this.row.append(this.top);
		this.row.append(this.help);
	}
}

class TextSetting extends SettingField {
	constructor(label, help, value, placeholder, callback) {
		super(label, help);
		var input = $("<input>", {
			type: "text",
			placeholder: placeholder,
			value: value
		});

		input.on("keyup."+appNameShort+" change."+appNameShort, function() {
			if (typeof callback != 'undefined') {
				callback($(this).val())
			}
		})
		
		this.top.append(input);
		return this.row;
	}
}

class CheckboxSetting extends SettingField {
	constructor(label, help, isChecked, callback, disabled) {
		super(label, help);
		var isDisabled = false
		if (typeof disabled != 'undefined') isDisabled = disabled;
		var input = $("<input>", {
			type: "checkbox",
			checked: isChecked,
			disabled: isDisabled
		});
		input.attr("class", "ui-switch-checkbox");

		input.on("click."+appNameShort, function() {
			var checked = $(this).prop("checked");
			if (checked) {
				switchDiv.addClass("checked");
			}
			else {
				switchDiv.removeClass("checked");
			}
			
			if (typeof callback != 'undefined') {
				callback(checked)
			}
		})
		
		var checkboxWrap = $('<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">');
		checkboxWrap.append(input);
		var switchDiv = $('<div class="ui-switch">');
		if (isChecked) switchDiv.addClass("checked");
		checkboxWrap.append(switchDiv);
		
		this.top.append(checkboxWrap);
		return this.row;
	}
}

var newStyleNames = ["superscript", "smallcaps", "fullwidth", "upsidedown", "varied"];

class BFRedux {
	constructor() {
		this.hasUpdate = false
		this.remoteVersion = ""
		this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
		this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
		this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
		this.upsideDownList = " ¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
		this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";

		this.toolbarString = "<div class='bf-toolbar'><div class='bf-arrow'></div><div name='bold'><b>Bold</b></div><div name='italic'><i>Italic</i></div><div name='underline'><u>Underline</u></div><div name='strikethrough'><s>Strikethrough</s></div><div style='font-family:monospace;' name='code'>Code</div><div name='superscript'>ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ</div><div name='smallcaps'>SᴍᴀʟʟCᴀᴘs</div><div name='fullwidth'>Ｆｕｌｌｗｉｄｔｈ</div><div name='upsidedown'>uʍopǝpᴉsd∩</div><div name='varied'>VaRiEd CaPs</div></div></div>";

		this.defaultSettings = {wrappers: {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"},
													formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
													plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true, rightSide: true}}
		this.settings = {wrappers: {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"},
													formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
													plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true, rightSide: true}}
		
		this.leftCSS = '.bf-toolbar{right:auto!important;left:0!important;margin-left:5px!important;margin-right:0!important;padding:10px 10px 15px 30px!important}.bf-toolbar .bf-arrow{right:auto!important;left:5px!important}.bf-toolbar.bf-hover:hover .bf-arrow,.bf-toolbar.bf-visible .bf-arrow{-webkit-transform:translate(0,-14px) rotate(90deg)!important;-ms-transform:translate(0,-14px) rotate(90deg)!important;transform:translate(0,-14px) rotate(90deg)!important}'

		this.rightCSS = '.bf-toolbar{right:0!important;left:auto!important;margin-left:0!important;margin-right:5px!important;padding:10px 30px 15px 10px!important}.bf-toolbar .bf-arrow{right:5px!important;left:auto!important}.bf-toolbar.bf-hover:hover .bf-arrow,.bf-toolbar.bf-visible .bf-arrow{-webkit-transform:translate(0,-14px) rotate(-90deg)!important;-ms-transform:translate(0,-14px) rotate(-90deg)!important;transform:translate(0,-14px) rotate(-90deg)!important}'
		
		
		// CSS is a modified form of the CSS used in
		// Beard's Material Design Theme for BetterDiscrod
		// Make sure to check it out!
		// http://www.beard-design.com/discord-material-theme
		this.mainCSS = '.bf-toolbar{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;font-size:85%;position:absolute;color:rgba(255,255,255,.5);width:auto;bottom:auto;border-radius:0;margin:0;height:27px;top:0;-webkit-transform:translate(0,-100%);-ms-transform:translate(0,-100%);transform:translate(0,-100%);opacity:1;display:block;overflow:hidden;pointer-events:none}.message-group .bf-toolbar .bf-arrow,.upload-modal .bf-toolbar .bf-arrow,.upload-modal .bf-toolbar:before{display:none}.message-group .bf-toolbar{padding:10px 30px 15px 10px}.message-group .bf-toolbar div:not(.bf-arrow),.message-group .bf-toolbar:before{-webkit-animation:bf-slide-up .3s cubic-bezier(.4,0,0,1);animation:bf-slide-up .3s cubic-bezier(.4,0,0,1)}@keyframes bf-slide-up{from{transform:translate(0,55px);opacity:0}}.upload-modal .bf-toolbar{position:relative;transform:none;padding:0;margin-left:0;margin-right:0;border-radius:2px}.message-group .bf-toolbar div:not(.bf-arrow),.message-group .bf-toolbar:before,.upload-modal .bf-toolbar div:not(.bf-arrow),.upload-modal .bf-toolbar:before{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.bf-toolbar.bf-hover:hover,.bf-toolbar.bf-visible{pointer-events:initial}.bf-toolbar div:not(.bf-arrow){padding:7px 5px;cursor:pointer;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-transform:translate(0,55px);-ms-transform:translate(0,55px);transform:translate(0,55px);-webkit-transition:all 50ms,-webkit-transform .2s ease;-o-transition:all 50ms,transform .2s ease;transition:all 50ms,transform .2s ease;transition:all 50ms,transform .2s ease,-webkit-transform .2s ease;position:relative;pointer-events:initial;border-radius:2px}.bf-toolbar .bf-arrow,.bf-toolbar:before{content:"";display:block;position:absolute;pointer-events:initial}.bf-toolbar div:not(.bf-arrow):hover{background:rgba(255,255,255,.1);color:rgba(255,255,255,.9)}.bf-toolbar div:not(.bf-arrow):active{background:rgba(0,0,0,.1);-webkit-transition:all 0s,-webkit-transform .2s ease;-o-transition:all 0s,transform .2s ease;transition:all 0s,transform .2s ease;transition:all 0s,transform .2s ease,-webkit-transform .2s ease}.bf-toolbar.bf-hover:hover div:not(.bf-arrow),.bf-toolbar.bf-visible div:not(.bf-arrow){-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);-webkit-transition:all 50ms,-webkit-transform .2s cubic-bezier(0,0,0,1);-o-transition:all 50ms,transform .2s cubic-bezier(0,0,0,1);transition:all 50ms,transform .2s cubic-bezier(0,0,0,1);transition:all 50ms,transform .2s cubic-bezier(0,0,0,1),-webkit-transform .2s cubic-bezier(0,0,0,1)}.bf-toolbar:before{width:100%;height:calc(100% - 15px);z-index:-1;background:#424549;left:0;top:5px;border-radius:3px;-webkit-transform:translate(0,55px);-ms-transform:translate(0,55px);transform:translate(0,55px);-webkit-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease}.bf-toolbar.bf-hover:hover:before,.bf-toolbar.bf-visible:before{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);-webkit-transition:all .2s cubic-bezier(0,0,0,1);-o-transition:all .2s cubic-bezier(0,0,0,1);transition:all .2s cubic-bezier(0,0,0,1)}.bf-toolbar .bf-arrow{background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+) 50% no-repeat;height:30px;width:30px;bottom:0;-webkit-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease;opacity:.3;cursor:pointer}.bf-toolbar.bf-hover:hover .bf-arrow,.bf-toolbar.bf-visible .bf-arrow{-webkit-transition:all .2s cubic-bezier(0,0,0,1);-o-transition:all .2s cubic-bezier(0,0,0,1);transition:all .2s cubic-bezier(0,0,0,1);opacity:.9}'
	}
	getName() { return appName }

	getDescription() { return appDescription }

	getVersion() { return appVersion }

	getAuthor() { return appAuthor }
	
	loadSettings() {
		try {
			for (var settingType in this.settings) {
				this.settings[settingType] = $.extend({}, this.settings[settingType], bdPluginStorage.get(appNameShort, settingType));
			}
		} catch (err) {
			console.warn(appNameShort, "unable to load settings:", err);
		}
	}

	saveSettings() {
		try {
			for (var settingType in this.settings) {
				bdPluginStorage.set(appNameShort, settingType, this.settings[settingType]);
			}
		} catch (err) {
			console.warn(appNameShort, "unable to save settings:", err);
		}
	}
	
	escape(s) {
		return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	
	load() {
		$.get("https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js", function(result){
			var ver = result.match(/"[0-9]+\.[0-9]+\.[0-9]+"/i);
			ver = ver.toString().replace(/"/g, "")
			this.remoteVersion = ver;
			if (ver != appVersion) this.hasUpdate = true;
		});
	}
	unload() {};
	
	start() {
		this.loadSettings();
		$(".channelTextArea-1HTP3C textarea").each((index, elem) => {
			this.addToolbar($(elem));
		});
		BdApi.injectCSS("bf-style", this.mainCSS);
		this.changeSide()
	}
	
	stop() {
		$(document).add("*").off(appNameShort);
		$(".bf-toolbar").remove();
		BdApi.clearCSS("bf-style");
		BdApi.clearCSS("bf-style-side")
	}
	
	onSwitch() {};
	
	observer(e) {
		if (!e.addedNodes.length) return;

		var $elem = $(e.addedNodes[0]);
		
		if ($elem.find(".channelTextArea-1HTP3C").length || $elem.closest(".channelTextArea-1HTP3C").length) {
			var $textarea = $elem.find("textarea");
			this.addToolbar($textarea);
		}
	}
	
	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		this.generateSettings(panel)
		return panel[0];
	}
	
	changeSide() {
		BdApi.injectCSS("bf-style-side", this.settings.plugin.rightSide ? this.rightCSS : this.leftCSS)
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
			for (var w=0; w<newStyleNames.length; w++) {
				var newText = this.doFormat(returnText, this.settings.wrappers[newStyleNames[w]], begin+wrapper.length);
				if (returnText != newText) {
					returnText = newText;
					end = end - this.settings.wrappers[newStyleNames[w]].length*2
				}
			}
		}
		
		returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
			var letterNum = 0;
			var previousLetter = "";
			middle = middle.replace(/./g, letter => {
				var index = this.replaceList.indexOf(letter);
				letterNum += 1;
				switch (wrapper) {
					case this.settings.wrappers.fullwidth:
						if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
						else return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
					case this.settings.wrappers.superscript:
						return index != -1 ? this.superscriptList[index] : letter
					case this.settings.wrappers.smallcaps:
						return index != -1 ? this.smallCapsList[index] : letter;
					case this.settings.wrappers.upsidedown:
						return index != -1 ? this.upsideDownList[index] : letter;
					case this.settings.wrappers.varied:
						var compare = this.settings.formatting.startCaps ? 1 : 0;
						if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
						return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
					default:
						return letter;
				}
				previousLetter = letter;
			})
			if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
			else return before + middle + after;
		});
		//begin = text.indexOf(wrapper, end + wrapper.length);
		return returnText;
	}
	
	format(e) {
		if (e.shiftKey || e.which != 13) return;
		var textarea = $(e.currentTarget);
		var text = textarea.val();
		var bfr = BdApi.getPlugin(appName);
		for (var i = 0; i < text.length; i++) {
			var len = text.length;
			switch (text[i]) {
				case "`":
					next = text.indexOf("`", i + 1);
					if (next != -1)
						i = next;
					break;
				case "@":
					var match = /@.*#[0-9]*/.exec(text.substring(i))
					if(match && match.index == 0)
						i += match[0].length - 1;
					break;
				default:
					for (var w=0; w<newStyleNames.length; w++) {
						var newText = bfr.doFormat(text, bfr.settings.wrappers[newStyleNames[w]], i);
						if (text != newText) {
							text = newText;
							i = i - bfr.settings.wrappers[newStyleNames[w]].length*2
						}
					}
			}
		}
		textarea.val(text);
		textarea[0].dispatchEvent(new Event('input', { bubbles: true }))
		if (bfr.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass('bf-visible');
	}
	
	wrapSelection(textarea, wrapper) {
		var text = textarea.value;
		var start = textarea.selectionStart;
		var len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;

		text = wrapper + text.substring(textarea.selectionStart, textarea.selectionEnd) + wrapper;

		textarea.focus();

		setTimeout(() => {
			document.execCommand("insertText", false, text);
			textarea.selectionEnd = (textarea.selectionStart = start + wrapper.length) + len;
		}, 1);
	}
	
	addToolbar(textarea) {
		var hoverInterval;
		var toolbarElement = $(this.toolbarString)
		if (this.settings.plugin.hoverOpen == true) {
			toolbarElement.addClass("bf-hover")
		}
		textarea
			.on("keypress."+appNameShort, this.format)
			.parent().after(toolbarElement)
			.siblings(".bf-toolbar")
			.on("mousemove."+appNameShort, (e) => {
				var $this = $(e.currentTarget);
				var pos = e.pageX - $this.parent().offset().left;
				var diff = -$this.width();
				$this.children().each((index, elem) => {
					diff += $(elem).outerWidth();
				});
				$this.scrollLeft(pos / $this.width() * diff);
			})
			.on("mouseenter."+appNameShort, () => {
				hoverInterval = setInterval(() => {
					textarea.focus();
				}, 10);
			})
			.on("mouseleave."+appNameShort, () => {
				clearInterval(hoverInterval);
			})
			.on("click."+appNameShort, "div", (e) => {
				var $button = $(e.currentTarget);
				if ($button.hasClass("bf-arrow")) {
					if (this.settings.plugin.hoverOpen == false) {
						$(".bf-toolbar").toggleClass('bf-visible');
					}
				}
				else {
					this.wrapSelection(textarea[0], this.settings.wrappers[$button.attr("name")]);	
				}
			})
			.show();
	}
	
	generateSettings(panel) {
		
		if (this.hasUpdate) {
			var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded cardWarning-31DHBH card-3DrRmC">')
			var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
			headerText.html("Update Available! Your version: " + appVersion + " | Current version: " + this.remoteVersion + "<br>Get it on Zere's GitHub! http://bit.ly/BFRedux")
			headerText.css("line-height", "150%")
			headerText.appendTo(header)
			header.appendTo(panel)
		}
		
		var wrapperControls = new ControlGroup("Wrapper Options", () => {this.saveSettings()}).appendTo(panel).append(
				new TextSetting("Superscript", "The wrapper for superscripted text.", this.settings.wrappers.superscript, this.defaultSettings.wrappers.superscript,
								(text) => {this.settings.wrappers.superscript = text != "" ? text : this.defaultSettings.wrappers.superscript}),
				new TextSetting("Smallcaps", "The wrapper to make Smallcaps.", this.settings.wrappers.smallcaps, this.defaultSettings.wrappers.smallcaps,
								(text) => {this.settings.wrappers.smallcaps = text != "" ? text : this.defaultSettings.wrappers.smallcaps}),
				new TextSetting("Full Width", "The wrapper for E X P A N D E D  T E X T.", this.settings.wrappers.fullwidth, this.defaultSettings.wrappers.fullwidth,
								(text) => {this.settings.wrappers.fullwidth = text != "" ? text : this.defaultSettings.wrappers.fullwidth}),
				new TextSetting("Upsidedown", "The wrapper to flip the text upsidedown.", this.settings.wrappers.upsidedown, this.defaultSettings.wrappers.upsidedown,
								(text) => {this.settings.wrappers.upsidedown = text != "" ? text : this.defaultSettings.wrappers.upsidedown}),
				new TextSetting("Varied Caps", "The wrapper to VaRy the capitalization.", this.settings.wrappers.varied, this.defaultSettings.wrappers.varied,
								(text) => {this.settings.wrappers.varied = text != "" ? text : this.defaultSettings.wrappers.varied}));
		
		var formatControls = new ControlGroup("Formatting Options", () => {this.saveSettings()}).appendTo(panel).append(
				new CheckboxSetting("Use Char Map?", "This determines if the char map is used, or just spaced capital letters.",
									this.settings.formatting.fullWidthMap, (checked) => {this.settings.formatting.fullWidthMap = checked}), 
				new CheckboxSetting("Reorder Upsidedown Text", "Having this enabled reorders the upside down text to make it in-order.",
									this.settings.formatting.reorderUpsidedown, (checked) => {this.settings.formatting.reorderUpsidedown = checked}),
				new CheckboxSetting("Start VaRiEd Caps With Capital", "Enabling this starts a varied text string with a capital.",
									this.settings.formatting.startCaps, (checked) => {this.settings.formatting.startCaps = checked}));
		
		var pluginControls = new ControlGroup("Plugin Options", () => {this.saveSettings()}).appendTo(panel).append(
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
				new CheckboxSetting("Chain Formats Outward", "Enabling this changes the chaining order from inward to outward. Check the GitHub for more info.",
									this.settings.plugin.chainFormats, (checked) => {this.settings.plugin.chainFormats = checked;}),
				new CheckboxSetting("Toolbar on Right Side", "This option enables swapping toolbar from right side to left side. Enabled means right side.",
									this.settings.plugin.rightSide, (checked) => {this.settings.plugin.rightSide = checked; this.changeSide();})
			)
			
		var bfr = this;
		var resetButton = $("<button>");
		resetButton.on("click."+appNameShort, function() {
			bfr.settings = bfr.defaultSettings;
			bfr.saveSettings();
			panel.empty()
			bfr.generateSettings(panel)
		});
		resetButton.text("Reset To Defaults");
		resetButton.css("float", "right");
		resetButton.attr("type","button")
		
		panel.append(resetButton);
	}
}

return BFRedux;
})();