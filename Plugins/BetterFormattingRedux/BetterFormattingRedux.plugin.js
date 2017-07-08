//META{"name":"BetterFormattingRedux"}*//

var BetterFormattingRedux = function() {};

var appName = "Better Formatting Redux";
var appAuthor = "Zerebos";
var appVersion = "1.1.1";

var appDescription = "An advanced version of Anxeal's Better Formatting that allows for customization of wrappers and formatting as well as adding additional formatting types.";

var appNameShort = "BFRedux"; // Used for namespacing, settings, and logging
var newStyleNames = ["superscript", "smallcaps", "fullwidth", "upsidedown", "varied"];

BetterFormattingRedux.prototype.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
BetterFormattingRedux.prototype.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
BetterFormattingRedux.prototype.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
BetterFormattingRedux.prototype.upsideDownList = " ¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
BetterFormattingRedux.prototype.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";

BetterFormattingRedux.prototype.toolbarString = "<div class='bf-toolbar'><div name='bold'><b>Bold</b></div><div name='italic'><i>Italic</i></div><div name='underline'><u>Underline</u></div><div name='strikethrough'><s>Strikethrough</s></div><div style='font-family:monospace;' name='code'>Code</div><div name='superscript'>ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ</div><div name='smallcaps'>SᴍᴀʟʟCᴀᴘs</div><div name='fullwidth'>Ｆｕｌｌｗｉｄｔｈ</div><div name='upsidedown'>uʍopǝpᴉsd∩</div><div name='varied'>VaRiEd CaPs</div></div></div>";

BetterFormattingRedux.prototype.defaultWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"};
BetterFormattingRedux.prototype.wrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"};


BetterFormattingRedux.prototype.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
BetterFormattingRedux.prototype.defaultFormatSettings = {fullWidthMap: true, reorderUpsidedown: true, startCaps: true}
BetterFormattingRedux.prototype.formatSettings = {fullWidthMap: true, reorderUpsidedown: true, startCaps: true}

BetterFormattingRedux.prototype.doFormat = function(text, wrapper, offset) {
	var returnText = text;
	var len = text.length
	if (text.substring(offset, offset+wrapper.length) != wrapper) return text;
	var begin = text.indexOf(wrapper, offset);
	if (text[begin-1] == "\\") {
		return text.substring(0, begin - 1) + text.substring(begin--)
	}
		var end = text.indexOf(wrapper, begin + wrapper.length);
		if (end != -1) {
			end += wrapper.length-1;
		}
		returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
			var letterNum = 0;
			var previousLetter = "";
			middle = middle.replace(/./g, letter => {
				var index = this.replaceList.indexOf(letter);
				letterNum += 1;
				switch (wrapper) {
					case this.wrappers.fullwidth:
						if (this.formatSettings.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
						else return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
					case this.wrappers.superscript:
						return index != -1 ? this.superscriptList[index] : letter
					case this.wrappers.smallcaps:
						return index != -1 ? this.smallCapsList[index] : letter;
					case this.wrappers.upsidedown:
						return index != -1 ? this.upsideDownList[index] : letter;
					case this.wrappers.varied:
						var compare = this.formatSettings.startCaps ? 1 : 0;
						if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
						return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
					default:
						return letter;
				}
				previousLetter = letter;
			})
			if (wrapper == this.wrappers.upsidedown && this.formatSettings.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
			else return before + middle + after;
		});
		begin = text.indexOf(wrapper, end + wrapper.length);
	return returnText;
}

BetterFormattingRedux.prototype.format = function(e) {
    if (e.shiftKey || e.which != 13) return;
    $textarea = $(e.currentTarget);
    var text = $textarea.val();
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
					newText = bfr.doFormat(text, bfr.wrappers[newStyleNames[w]], i);
					if (text != newText) {
						text = newText;
						i = i - bfr.wrappers[newStyleNames[w]].length;
					}
				}
        }
    }
    $textarea.val(text);
};

BetterFormattingRedux.prototype.wrapSelection = function(textarea, wrapper) {
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

BetterFormattingRedux.prototype.showToolbar = function(e) {
    $textarea = $(e.currentTarget);
    $textarea.parent().siblings(".bf-toolbar").stop().slideDown();
}

BetterFormattingRedux.prototype.hideToolbar = function(e) {
    $textarea = $(e.currentTarget);
    $textarea.parent().siblings(".bf-toolbar").stop().slideUp();
}

BetterFormattingRedux.prototype.addToolbar = function($textarea) {
    var hoverInterval;
    $textarea
        .on("keypress."+appNameShort, this.format)
        .on("focus."+appNameShort, this.showToolbar)
        .on("blur."+appNameShort, this.hideToolbar)
        .parent().after(this.toolbarString)
        .siblings(".bf-toolbar")
        .on("mousemove."+appNameShort, (e) => {
            $this = $(e.currentTarget);
            var pos = e.pageX - $this.parent().offset().left;
            var diff = -$this.width();
            $this.children().each((index, elem) => {
                diff += $(elem).outerWidth();
            });
            $this.scrollLeft(pos / $this.width() * diff);
        })
        .on("mouseenter."+appNameShort, () => {
            hoverInterval = setInterval(() => {
                $textarea.focus();
            }, 10);
        })
        .on("mouseleave."+appNameShort, () => {
            clearInterval(hoverInterval);
        })
        .on("click."+appNameShort, "div", (e) => {
            $button = $(e.currentTarget);
            this.wrapSelection($textarea[0], this.wrappers[$button.attr("name")]);
        })
        .show();
};

// unused
BetterFormattingRedux.prototype.load = function() {};
BetterFormattingRedux.prototype.unload = function() {};
BetterFormattingRedux.prototype.onMessage = function() {};
BetterFormattingRedux.prototype.onSwitch = function() {};
// unused

BetterFormattingRedux.prototype.start = function() {
	this.loadSettings();
    $(".channel-textarea textarea").each((index, elem) => {
        this.addToolbar($(elem));
    });
	
	// CSS is a modified form of the CSS used in
	// Beard's Material Design Theme for BetterDiscrod
	// Make sure to check it out!
	// http://www.beard-design.com/discord-material-theme
    BdApi.injectCSS("bf-style", `
.bf-toolbar {
    user-select: none;
    overflow: hidden;
    width: calc(100% - 30px);
    white-space: nowrap;
    font-size:85%;
    height:auto;
    display:flex;
}
.bf-toolbar div {
    display: inline;
    padding: 5px;
    transition: all .2s ease;
    cursor: pointer;
    display : inline-flex;
    align-items : center;
}
.bf-toolbar div:hover {
    background: rgba(102,102,102,.5);
}
.bf-toolbar {
    position: absolute;
    width:auto!important;
    right:0;
    bottom:auto;
    border-radius:0;
    margin:0!important;
    margin-right:10px!important;
    height:27px!important;
    top:0px;
    transform:translate(0,-100%);
    opacity:1;
    display:block!important;
    overflow: hidden!important;
    pointer-events: none;
    padding:10px 40px 15px 20px!important;
    cursor:pointer;
}
.message-group .bf-toolbar{
    padding:10px 20px 15px 20px!important;
    animation:slide-up 300ms cubic-bezier(0,0,0,1), opacity 300ms ease
}
.upload-modal .bf-toolbar{
    padding:10px 20px 15px 20px!important;
    bottom:0!important;
    top:auto!important;
    left:50%;
    right:auto;
    transform:translate(-50%,100%);
}
.upload-modal .bf-toolbar div,
.upload-modal .bf-toolbar:before,
.message-group .bf-toolbar div,
.message-group .bf-toolbar:before{
    transform:translate(0,0);
}
.upload-modal .bf-toolbar:after,
.message-group .bf-toolbar:after{
    display: none;
}
.bf-toolbar:hover{
    pointer-events: initial;
}
.bf-toolbar div{
    transform:translate(0,55px);
    transition:all 50ms,transform 200ms ease!important;
    position:relative;
    pointer-events: initial;
    border-radius:2px;
}
.bf-toolbar div:hover{
    color:rgba(255,255,255,.9);
}
.bf-toolbar div:active{
    transition:all 0ms,transform 200ms ease!important;
}
.bf-toolbar:hover div{
    transform:translate(0,0);
    transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1)!important;
}
.bf-toolbar:before {
    content:"";
    display: block;
    width:calc(100% - 20px);
    height:calc(100% - 15px);
    position: absolute;
    z-index: -1;
    background:#1e2124;
    pointer-events: initial;
    left:10px;
    top:5px;
    border-radius:3px;
    transform:translate(0,55px);
    transition:all 200ms ease!important;
    box-shadow: 0 5px 10px rgba(0,0,0,.1);
}
.bf-toolbar:hover:before {
    transform:translate(0,0px);
    transition:all 200ms cubic-bezier(0,0,0,1)!important;
}

.bf-toolbar:after {
    content:"";
    display:block;
    background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
    height:30px;
    width:30px;
    right:15px;
    position: absolute;
    pointer-events: initial;
    bottom:-5px;
    background-repeat: no-repeat;
    background-position: 50%;
    transition:all 200ms ease!important;
    opacity: .3;
}
.bf-toolbar:hover:after {
    transform:translate(0,-19px)rotate(-90deg);
    transition:all 200ms cubic-bezier(0,0,0,1)!important;
    opacity: .9;
}
`);
};

BetterFormattingRedux.prototype.stop = function() {
	$(document).add("*").off(appNameShort);
	$(".bf-toolbar").remove();
	BdApi.clearCSS("bf-style");
};

BetterFormattingRedux.prototype.observer = function(e) {
    if (!e.addedNodes.length) return;

    var $elem = $(e.addedNodes[0]);

    if ($elem.find(".channel-textarea").length || $elem.closest(".channel-textarea").length) {
        $textarea = $elem.find("textarea");
        this.addToolbar($textarea);
    }
};

BetterFormattingRedux.prototype.getName = function() {
    return appName;
};

BetterFormattingRedux.prototype.getDescription = function() {
    return appDescription
};

BetterFormattingRedux.prototype.getVersion = function() {
    return appVersion;
};

BetterFormattingRedux.prototype.getAuthor = function() {
    return appAuthor;
};

BetterFormattingRedux.prototype.loadSettings = function() {
	var localSettings;

	try {
		this.wrappers = $.extend({}, this.wrappers, bdPluginStorage.get(appNameShort, "wrappers"));
		this.formatSettings = $.extend({}, this.formatSettings, bdPluginStorage.get(appNameShort, "format"));
	} catch (err) {
		console.warn(appNameShort, "unable to load wrappers:", err);
		localSettings = null;
	}
}

BetterFormattingRedux.prototype.saveSettings = function() {
	try {
		bdPluginStorage.set(appNameShort, "wrappers", this.wrappers);
		bdPluginStorage.set(appNameShort, "format", this.formatSettings);
	} catch (err) {
		console.warn(appNameShort, "unable to save settings:", err);
	}
}

// Settings panel

BetterFormattingRedux.prototype.controlGroup = function(groupName) {
	var group = $("<div>").addClass("control-group");

	var label = $("<h2>").text(groupName);
	label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
	group.append(label);

	return group;
}

function SettingField(name, helptext) {
	this.name = name;
	this.helptext = helptext;
	this.row = $("<div>");
	this.row.attr("class", "ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item");
	this.row.attr("style", "margin-top: 0;");
	this.top = $("<div>");
	this.top.attr("class", "ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap")
	this.label = $("<h3>");
	this.label.attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child");
	this.label.text(name);
	
	this.help = $("<div>");
	this.help.attr("class", "ui-form-text style-description margin-top-4");
	this.help.attr("style", "flex:1 1 auto;");
	this.help.text(helptext);
	
	this.top.append(this.label);
	this.row.append(this.top);
	this.row.append(this.help);
}

SettingField.prototype.setField = function(field) {
	this.top.append(field);
}

SettingField.wrapperSetting = function(key, name, helptext) {
	var bfr = BdApi.getPlugin(appName);
	var setting = new SettingField(name, helptext);
	var input = $("<input>", {
		type: "text",
		placeholder: bfr.defaultWrappers[key],
		name: key,
		id: key,
		value: bfr.wrappers[key]
	});

	input.on("keyup."+appNameShort+" change."+appNameShort, function() {
		if ($(this).val() != "") {
			bfr.wrappers[key] = $(this).val();
			bfr.saveSettings();
		}
		else {
			bfr.wrappers[key] = bfr.defaultWrappers[key];
			bfr.saveSettings();
		}
	})
	
	setting.setField(input);
	return setting.row;
}

SettingField.formatSetting = function(key, name, helptext) {
	var bfr = BdApi.getPlugin(appName);
	var setting = new SettingField(name, helptext);
	var input = $("<input>", {
		type: "checkbox",
		name: key,
		id: key,
		checked: bfr.formatSettings[key]
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
		bfr.formatSettings[key] = checked;
		bfr.saveSettings();
	})
	
	var checkboxWrap = $('<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">');
	checkboxWrap.append(input);
	var switchDiv = $('<div class="ui-switch">');
	if (bfr.formatSettings[key]) switchDiv.addClass("checked");
	checkboxWrap.append(switchDiv);
	
	setting.setField(checkboxWrap);
	return setting.row;	
}

BetterFormattingRedux.prototype.getSettingsPanel = function () {
	var panel = $("<form>")
		.addClass("form")
		.css("width", "100%");

	var wrapperControls = this.controlGroup("Wrapper Options").appendTo(panel).append(SettingField.wrapperSetting("superscript","Superscript", "The wrapper for superscripted text."),
			SettingField.wrapperSetting("smallcaps", "Smallcaps", "The wrapper to make Smallcaps."),
			SettingField.wrapperSetting("fullwidth", "Full Width", "The wrapper for E X P A N D E D  T E X T."),
			SettingField.wrapperSetting("upsidedown", "Upsidedown", "The wrapper to flip the text upsidedown."),
			SettingField.wrapperSetting("varied", "Varied Caps", "The wrapper to VaRy the capitalization."));
	
	var formatControls = this.controlGroup("Formatting Options").appendTo(panel).append(SettingField.formatSetting("fullWidthMap", "Use Char Map?", "This determines if the char map is used, or just spaced capital letters."), 
			SettingField.formatSetting("reorderUpsidedown", "Reorder Upsidedown Text", "Having this enabled reorders the upside down text to make it in-order."),
			SettingField.formatSetting("startCaps", "Start VaRiEd Caps With Capital", "Enabling this starts a varied text string with a capital."));
							
	var bfr = this;
	var resetButton = $("<button>");
	resetButton.on("click."+appNameShort, function() {
		bfr.wrappers = bfr.defaultWrappers;
		bfr.formatSettings = bfr.defaultFormatSettings;
		bfr.saveSettings();
	});
	resetButton.text("Reset To Defaults");
	resetButton.attr("style", "float:right;");
	
	panel.append(resetButton);

	return panel[0];
};
