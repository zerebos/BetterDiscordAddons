//META{"name":"BetterFormattingRedux"}*//

var BetterFormattingRedux = (function() {

var appName = "Better Formatting Redux";
var appAuthor = "Zerebos";
var appVersion = "2.0.0";

var appDescription = "Enables different types of formatting in standard Discord chat. Support Server: bit.ly/ZeresServer";

var appNameShort = "BFRedux"; // Used for namespacing, settings, and logging


class ControlGroup {
	constructor(groupName, callback) {
		this.group = $("<div>").addClass("control-group");

		var label = $("<h2>").text(groupName);
		label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
		label.css("margin-top", "30px")
		this.group.append(label);
		
		if (typeof callback != 'undefined') {
			this.group.on("change."+appNameShort, "input", callback)
		}
	}
	
	getElement() {return this.group;}
	
	append(...nodes) {
		for (var i = 0; i < nodes.length; i++) {
			this.group.append(nodes[i].getElement())
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
		this.input.on("keyup."+appNameShort+" change."+appNameShort, () => {
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
		return 'li[data-reactid*="'+appName+'"] input:focus{outline:0}li[data-reactid*="'+appName+'"] input[type=range]{-webkit-appearance:none;border:none!important;border-radius:5px;height:5px;cursor:pointer}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-runnable-track{background:0 0!important}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;background:#f6f6f7;width:10px;height:20px}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-thumb:hover{box-shadow:0 2px 10px rgba(0,0,0,.5)}li[data-reactid*="'+appName+'"] input[type=range]::-webkit-slider-thumb:active{box-shadow:0 2px 10px rgba(0,0,0,1)}.plugin-setting-label{color:#f6f6f7;font-weight:500}.plugin-setting-input-row{padding-right:5px!important}.plugin-setting-input-container{display:flex;align-items:center;justify-content:center}';
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
		
		this.input.on("input."+appNameShort, function() {
			label.text($(this).val())
		})
		
		this.setInputElement(SettingField.inputContainer().append(label,input));
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
		
		this.input.on("input."+appNameShort, () => {
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

		this.input.on("change."+appNameShort, function() {
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
		
		this.checkboxWrap.find('input').on("click."+appNameShort, function() {
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

class BFRedux {
	constructor() {
		this.isOpen = false
		this.hasUpdate = false
		this.remoteVersion = ""
		this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
		this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
		this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
		this.upsideDownList = " ¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
		this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";

		this.toolbarString = "<div class='bf-toolbar'><div class='bf-arrow'></div><div data-type='discord' data-name='bold'><b>Bold</b></div><div data-type='discord' data-name='italic'><i>Italic</i></div><div data-type='discord' data-name='underline'><u>Underline</u></div><div data-type='discord' data-name='strikethrough'><s>Strikethrough</s></div><div style='font-family:monospace;' data-type='discord' data-name='code'>Code</div><div data-type='bfredux' data-name='superscript'>ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ</div><div data-type='bfredux' data-name='smallcaps'>SᴍᴀʟʟCᴀᴘs</div><div data-type='bfredux' data-name='fullwidth'>Ｆｕｌｌｗｉｄｔｈ</div><div data-type='bfredux' data-name='upsidedown'>uʍopǝpᴉsd∩</div><div data-type='bfredux' data-name='varied'>VaRiEd CaPs</div></div></div>";
		
		this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`"}

		this.defaultSettings = {wrappers: {superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"},
								formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
								plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true},
								style: {rightSide: true, opacity: 1, fontSize: "85%"}}
		this.settings = {wrappers: {superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"},
						formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
						plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true},
						style: {rightSide: true, opacity: 1, fontSize: "85%"}}
						
		this.customWrappers = Object.keys(this.settings.wrappers)
		
		
		// CSS is a modified form of the CSS used in
		// Beard's Material Design Theme for BetterDiscord
		// Make sure to check it out!
		// http://www.beard-design.com/discord-material-theme
		this.mainCSS =  '.bf-toolbar{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;font-size:85%;position:absolute;color:rgba(255,255,255,.5);width:auto;right:0;bottom:auto;border-radius:0;margin:0 5px 0 0;height:27px;top:0;-webkit-transform:translate(0,-100%);-ms-transform:translate(0,-100%);transform:translate(0,-100%);opacity:1;display:block;overflow:hidden;pointer-events:none;padding:10px 30px 15px 10px}.message-group .bf-toolbar .bf-arrow,.upload-modal .bf-toolbar .bf-arrow,.upload-modal .bf-toolbar:before{display:none}.message-group .bf-toolbar{padding:10px 10px 15px}.message-group .bf-toolbar div:not(.bf-arrow),.message-group .bf-toolbar:before{-webkit-animation:bf-slide-up .3s cubic-bezier(.4,0,0,1);animation:bf-slide-up .3s cubic-bezier(.4,0,0,1)}@keyframes bf-slide-up{from{transform:translate(0,55px);opacity:0}}.upload-modal .bf-toolbar{position:relative;transform:none;padding:0;margin-right:0;border-radius:2px}.message-group .bf-toolbar div:not(.bf-arrow),.message-group .bf-toolbar:before,.upload-modal .bf-toolbar div:not(.bf-arrow),.upload-modal .bf-toolbar:before{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.bf-toolbar.bf-hover:hover,.bf-toolbar.bf-visible{pointer-events:initial}.bf-toolbar div:not(.bf-arrow){padding:7px 5px;cursor:pointer;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-transform:translate(0,55px);-ms-transform:translate(0,55px);transform:translate(0,55px);-webkit-transition:all 50ms,-webkit-transform .2s ease;-o-transition:all 50ms,transform .2s ease;transition:all 50ms,transform .2s ease;transition:all 50ms,transform .2s ease,-webkit-transform .2s ease;position:relative;pointer-events:initial;border-radius:2px}.bf-toolbar .bf-arrow,.bf-toolbar:before{content:"";display:block;position:absolute;pointer-events:initial}.bf-toolbar div:not(.bf-arrow):hover{background:rgba(255,255,255,.1);color:rgba(255,255,255,.9)}.bf-toolbar div:not(.bf-arrow):active{background:rgba(0,0,0,.1);-webkit-transition:all 0s,-webkit-transform .2s ease;-o-transition:all 0s,transform .2s ease;transition:all 0s,transform .2s ease;transition:all 0s,transform .2s ease,-webkit-transform .2s ease}.bf-toolbar.bf-hover:hover div:not(.bf-arrow),.bf-toolbar.bf-visible div:not(.bf-arrow){-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);-webkit-transition:all 50ms,-webkit-transform .2s cubic-bezier(0,0,0,1);-o-transition:all 50ms,transform .2s cubic-bezier(0,0,0,1);transition:all 50ms,transform .2s cubic-bezier(0,0,0,1);transition:all 50ms,transform .2s cubic-bezier(0,0,0,1),-webkit-transform .2s cubic-bezier(0,0,0,1)}.bf-toolbar:before{width:100%;height:calc(100% - 15px);z-index:-1;background:#424549;left:0;top:5px;border-radius:3px;-webkit-transform:translate(0,55px);-ms-transform:translate(0,55px);transform:translate(0,55px);-webkit-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease}.bf-toolbar.bf-hover:hover:before,.bf-toolbar.bf-visible:before{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);-webkit-transition:all .2s cubic-bezier(0,0,0,1);-o-transition:all .2s cubic-bezier(0,0,0,1);transition:all .2s cubic-bezier(0,0,0,1)}.bf-toolbar .bf-arrow{background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+) 50% no-repeat;height:30px;width:30px;right:5px;bottom:0;-webkit-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease;opacity:.3;cursor:pointer}.bf-toolbar.bf-hover:hover .bf-arrow,.bf-toolbar.bf-visible .bf-arrow{-webkit-transform:translate(0,-14px) rotate(-90deg);-ms-transform:translate(0,-14px) rotate(-90deg);transform:translate(0,-14px) rotate(-90deg);-webkit-transition:all .2s cubic-bezier(0,0,0,1);-o-transition:all .2s cubic-bezier(0,0,0,1);transition:all .2s cubic-bezier(0,0,0,1);opacity:.9}.bf-toolbar.bf-left{left:0!important;right:auto!important;margin-right:0!important;margin-left:5px!important;padding:10px 10px 15px 30px!important}.bf-toolbar.bf-left .bf-arrow{left:5px!important;right:auto!important}.bf-toolbar.bf-left.bf-hover:hover .bf-arrow,.bf-toolbar.bf-left.bf-visible .bf-arrow{-webkit-transform:translate(0,-14px) rotate(90deg)!important;-ms-transform:translate(0,-14px) rotate(90deg)!important;transform:translate(0,-14px) rotate(90deg)!important}'
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
		$.get("https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js", (result) => {
			var ver = result.match(/"[0-9]+\.[0-9]+\.[0-9]+"/i);
			ver = ver.toString().replace(/"/g, "")
			this.remoteVersion = ver;
			ver = ver.split(".")
			var lver = this.getVersion().split(".")
			if (ver[0] > lver[0]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1] > lver[1]) this.hasUpdate = true;
			else if (ver[0]==lver[0] && ver[1]==lver[1] && ver[2] > lver[2]) this.hasUpdate = true;
			else this.hasUpdate = false;
		});
	}
	unload() {};
	
	start() {
		this.loadSettings();
		BdApi.injectCSS("bf-style", this.mainCSS);
		BdApi.injectCSS("bf-settings", SettingField.getCSS(this.getName()));
		$(".channelTextArea-1HTP3C textarea").each((index, elem) => {
			this.addToolbar($(elem));
		});
	}
	
	stop() {
		$(document).add("*").off(appNameShort);
		$(".bf-toolbar").remove();
		BdApi.clearCSS("bf-style");
		BdApi.clearCSS("bf-settings");
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
				next = text.indexOf("`", i + 1);
				if (next != -1)
					i = next;
			}
			else if (text[i] == "@") {
				var match = /@.*#[0-9]*/.exec(text.substring(i))
				if(match && match.index == 0) i += match[0].length - 1;
			}
			else {
				for (var w=0; w<this.customWrappers.length; w++) {
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
	
	wrapSelection(textarea, wrapper) {
		var text = textarea.value;
		var start = textarea.selectionStart;
		var len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
		text = wrapper + text.substring(textarea.selectionStart, textarea.selectionEnd) + wrapper;
		textarea.focus();
		document.execCommand("insertText", false, text);
		textarea.selectionEnd = (textarea.selectionStart = start + wrapper.length) + len;
	}
	
	addToolbar(textarea) {
		var hoverInterval;
		var toolbarElement = $(this.toolbarString)
		if (this.settings.plugin.hoverOpen == true) toolbarElement.addClass("bf-hover");
		if (this.isOpen) toolbarElement.addClass("bf-visible");
		
		textarea.on("keypress."+appNameShort, (e) => {this.format(e)})
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
			.on("click."+appNameShort, "div", (e) => {
				var button = $(e.currentTarget);
				if (button.hasClass("bf-arrow")) {
					if (!this.settings.plugin.hoverOpen) this.openClose();
				}
				else {
					var wrapper = "";
					if (button.data("type") == "discord") wrapper = this.discordWrappers[button.data("name")];
					else wrapper = this.settings.wrappers[button.data("name")];
					this.wrapSelection(textarea[0], wrapper);	
				}
			})
		this.updateStyle()
	}
	
	generateSettings(panel) {
		
		if (this.hasUpdate) {
			var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded cardWarning-31DHBH card-3DrRmC">').css("background", SettingField.getAccentColor()).css("border-color", "transparent")
			var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
			headerText.html("Update Available! Your version: " + this.getVersion() + " | Current version: " + this.remoteVersion + "<br>Get it on Zere's GitHub! http://bit.ly/ZerebosBD")
			headerText.css("line-height", "150%")
			headerText.appendTo(header)
			header.appendTo(panel)
		}
		
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
							(text) => {this.settings.wrappers.varied = text != "" ? text : this.defaultSettings.wrappers.varied})
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