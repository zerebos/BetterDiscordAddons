//META{"name":"BetterFormattingRedux"}*//

var BetterFormattingRedux = (function() {

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

var appName = "Better Formatting Redux";
var appAuthor = "Zerebos";
var appVersion = "1.1.5";

var appDescription = "Enables different formatting in standard Discord chat. Support Server: bit.ly/ZeresServer";

var appNameShort = "BFRedux"; // Used for namespacing, settings, and logging
var newStyleNames = ["superscript", "smallcaps", "fullwidth", "upsidedown", "varied"];

class BFRedux {
	constructor() {
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
	}
	getName() { return appName; };

	BetterFormattingRedux.prototype.getDescription = function() {
		return appDescription
	};

	BetterFormattingRedux.prototype.getVersion = function() {
		return appVersion;
	};

	BetterFormattingRedux.prototype.getAuthor = function() {
		return appAuthor;
	};
}

BetterFormattingRedux.prototype.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

BetterFormattingRedux.prototype.doFormat = function(text, wrapper, offset) {

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
			newText = this.doFormat(returnText, this.settings.wrappers[newStyleNames[w]], begin+wrapper.length);
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
					newText = bfr.doFormat(text, bfr.settings.wrappers[newStyleNames[w]], i);
					if (text != newText) {
						text = newText;
						i = i - bfr.settings.wrappers[newStyleNames[w]].length*2
					}
				}
        }
    }
    $textarea.val(text);
	$textarea[0].dispatchEvent(new Event('input', { bubbles: true }))
	if (bfr.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass('bf-visible');
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
	var toolbarElement = $(this.toolbarString)
	if (this.settings.plugin.hoverOpen == true) {
		toolbarElement.addClass("bf-hover")
	}
    $textarea
        .on("keypress."+appNameShort, this.format)
        .parent().after(toolbarElement)
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
			if ($button.hasClass("bf-arrow")) {
				if (this.settings.plugin.hoverOpen == false) {
					$(".bf-toolbar").toggleClass('bf-visible');
				}
			}
			else {
				this.wrapSelection($textarea[0], this.settings.wrappers[$button.attr("name")]);	
			}
        })
        .show();
}

BetterFormattingRedux.isUpdate = false
BetterFormattingRedux.remoteVersion = ""
BetterFormattingRedux.prototype.load = function() {
	$.get("https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js", function(result){
		var ver = result.match(/"[0-9]+\.[0-9]+\.[0-9]+"/i);
		ver = ver.toString().replace(/"/g, "")
		BetterFormattingRedux.remoteVersion = ver;
		if (ver != appVersion) BetterFormattingRedux.isUpdate = true;
	});
};

// unused
BetterFormattingRedux.prototype.unload = function() {};
BetterFormattingRedux.prototype.onMessage = function() {};
BetterFormattingRedux.prototype.onSwitch = function() {};
// unused

BetterFormattingRedux.prototype.leftCSS = `
.bf-toolbar {
	right: auto;
	left: 0;
	margin-left: 5px;
	margin-right: 0;
	padding: 10px 10px 15px 30px
}

.bf-toolbar .bf-arrow {
	right: auto;
	left: 5px;
}

.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
	-webkit-transform:translate(0,-14px)rotate(90deg);
	-ms-transform:translate(0,-14px)rotate(90deg);
	transform:translate(0,-14px)rotate(90deg);
}`;

BetterFormattingRedux.prototype.rightCSS = `
.bf-toolbar {
	right: 0;
	left: auto;
	margin-left: 0;
	margin-right: 5px;
	padding: 10px 30px 15px 10px
}

.bf-toolbar .bf-arrow {
	right: 5px;
	left: auto;
}

.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
	-webkit-transform:translate(0,-14px)rotate(-90deg);
	-ms-transform:translate(0,-14px)rotate(-90deg);
	transform:translate(0,-14px)rotate(-90deg);
}`;

BetterFormattingRedux.prototype.start = function() {
	this.loadSettings();
    $(".channel-textarea textarea").each((index, elem) => {
        this.addToolbar($(elem));
    });
	$(".channelTextArea-1HTP3C textarea").each((index, elem) => {
        this.addToolbar($(elem));
    });
	
	// CSS is a modified form of the CSS used in
	// Beard's Material Design Theme for BetterDiscrod
	// Make sure to check it out!
	// http://www.beard-design.com/discord-material-theme
    BdApi.injectCSS("bf-style", `
.bf-toolbar {
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    white-space: nowrap;
    font-size:85%;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    position: absolute;
    color: rgba(255, 255, 255, .5);
    width:auto;
    bottom:auto;
    border-radius:0;
    margin:0;
    height:27px;
    top:0px;
    -webkit-transform:translate(0,-100%);
        -ms-transform:translate(0,-100%);
            transform:translate(0,-100%);
    opacity:1;
    display:block;
    overflow: hidden;
    pointer-events: none;
}
.message-group .bf-toolbar{
    padding:10px 30px 15px 10px;
}
.message-group .bf-toolbar div:not(.bf-arrow),
.message-group .bf-toolbar:before{
    -webkit-animation:bf-slide-up 300ms cubic-bezier(.4,0,0,1);
            animation:bf-slide-up 300ms cubic-bezier(.4,0,0,1);
}
@keyframes bf-slide-up {
    from {
        transform: translate(0, 55px);
        opacity:0;
    }
}
.upload-modal .bf-toolbar{
    position: relative;
    transform:none;
    padding:0;
    margin-left:0;
	margin-right: 0;
    border-radius:2px;
}

.upload-modal .bf-toolbar:before{
    display: none;
}
.upload-modal .bf-toolbar div:not(.bf-arrow),
.upload-modal .bf-toolbar:before,
.message-group .bf-toolbar div:not(.bf-arrow),
.message-group .bf-toolbar:before{
    -webkit-transform:translate(0,0);
        -ms-transform:translate(0,0);
            transform:translate(0,0);
}
.upload-modal .bf-toolbar .bf-arrow,
.message-group .bf-toolbar .bf-arrow{
    display: none;
}
.bf-toolbar.bf-visible,
.bf-toolbar.bf-hover:hover{
    pointer-events: initial;
}
.bf-toolbar div:not(.bf-arrow){
    display: inline;
    padding: 7px 5px;
    cursor: pointer;
    display : -webkit-inline-box;
    display : -ms-inline-flexbox;
    display : inline-flex;
    -webkit-box-align : center;
        -ms-flex-align : center;
            align-items : center;
    -webkit-transform:translate(0,55px);
        -ms-transform:translate(0,55px);
            transform:translate(0,55px);
    -webkit-transition:all 50ms,-webkit-transform 200ms ease;
            transition:all 50ms,-webkit-transform 200ms ease;
         -o-transition:all 50ms,transform 200ms ease;
            transition:all 50ms,transform 200ms ease;
            transition:all 50ms,transform 200ms ease,-webkit-transform 200ms ease;
    position:relative;
    pointer-events: initial;
    border-radius:2px;
}
.bf-toolbar div:not(.bf-arrow):hover{
    background:rgba(255,255,255,.1);
    color:rgba(255,255,255,.9);
}
.bf-toolbar div:not(.bf-arrow):active{
    background:rgba(0,0,0,.1);
    -webkit-transition:all 0ms,-webkit-transform 200ms ease;
            transition:all 0ms,-webkit-transform 200ms ease;
         -o-transition:all 0ms,transform 200ms ease;
            transition:all 0ms,transform 200ms ease;
            transition:all 0ms,transform 200ms ease,-webkit-transform 200ms ease;
}
.bf-toolbar.bf-visible div:not(.bf-arrow),
.bf-toolbar.bf-hover:hover div:not(.bf-arrow){
    -webkit-transform:translate(0,0);
        -ms-transform:translate(0,0);
            transform:translate(0,0);
    -webkit-transition:all 50ms,-webkit-transform 200ms cubic-bezier(0,0,0,1);
            transition:all 50ms,-webkit-transform 200ms cubic-bezier(0,0,0,1);
         -o-transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1);
            transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1);
            transition:all 50ms,transform 200ms cubic-bezier(0,0,0,1),-webkit-transform 200ms cubic-bezier(0,0,0,1);
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
    -webkit-transform:translate(0,55px);
        -ms-transform:translate(0,55px);
            transform:translate(0,55px);
    -webkit-transition:all 200ms ease;
         -o-transition:all 200ms ease;
            transition:all 200ms ease;
}
.bf-toolbar.bf-visible:before,
.bf-toolbar.bf-hover:hover:before {
    -webkit-transform:translate(0,0px);
        -ms-transform:translate(0,0px);
            transform:translate(0,0px);
    -webkit-transition:all 200ms cubic-bezier(0,0,0,1);
         -o-transition:all 200ms cubic-bezier(0,0,0,1);
            transition:all 200ms cubic-bezier(0,0,0,1);
}

.bf-toolbar .bf-arrow {
    content:"";
    display:block;
    background:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTcuNDEgMTUuNDFMMTIgMTAuODNsNC41OSA0LjU4TDE4IDE0bC02LTYtNiA2eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
    height:30px;
    width:30px;
    position: absolute;
    pointer-events: initial;
    bottom:0;
    background-repeat: no-repeat;
    background-position: 50%;
    -webkit-transition:all 200ms ease;
         -o-transition:all 200ms ease;
            transition:all 200ms ease;
    opacity: .3;
    cursor:pointer;
}
.bf-toolbar.bf-visible .bf-arrow,
.bf-toolbar.bf-hover:hover .bf-arrow {
    -webkit-transition:all 200ms cubic-bezier(0,0,0,1);
         -o-transition:all 200ms cubic-bezier(0,0,0,1);
            transition:all 200ms cubic-bezier(0,0,0,1);
    opacity: .9;
}`);
this.changeSide()
};

BetterFormattingRedux.prototype.changeSide = function() {
	BdApi.injectCSS("bf-style-side", this.settings.plugin.rightSide ? this.rightCSS : this.leftCSS)
}

BetterFormattingRedux.prototype.stop = function() {
	$(document).add("*").off(appNameShort);
	$(".bf-toolbar").remove();
	BdApi.clearCSS("bf-style");
	BdApi.clearCSS("bf-style-side")
};

BetterFormattingRedux.prototype.observer = function(e) {
    if (!e.addedNodes.length) return;

    var $elem = $(e.addedNodes[0]);

    if ($elem.find(".channel-textarea").length || $elem.closest(".channel-textarea").length) {
        $textarea = $elem.find("textarea");
        this.addToolbar($textarea);
    }
	
	if ($elem.find(".channelTextArea-1HTP3C").length || $elem.closest(".channelTextArea-1HTP3C").length) {
        $textarea = $elem.find("textarea");
        this.addToolbar($textarea);
    }
};

BetterFormattingRedux.prototype.loadSettings = function() {
	try {
		for (settingType in this.settings) {
			this.settings[settingType] = $.extend({}, this.settings[settingType], bdPluginStorage.get(appNameShort, settingType));
		}
	} catch (err) {
		console.warn(appNameShort, "unable to load settings:", err);
	}
}

BetterFormattingRedux.prototype.saveSettings = function() {
	try {
		for (settingType in this.settings) {
			bdPluginStorage.set(appNameShort, settingType, this.settings[settingType]);
		}
	} catch (err) {
		console.warn(appNameShort, "unable to save settings:", err);
	}
}

// Settings panel

BetterFormattingRedux.prototype.controlGroup = function(groupName, callback) {
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

BetterFormattingRedux.prototype.generateSettings = function(panel) {
	
	if (BetterFormattingRedux.isUpdate) {
		var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded cardWarning-31DHBH card-3DrRmC">')
		var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
		headerText.html("Update Available! Your version: " + appVersion + " | Current version: " + BetterFormattingRedux.remoteVersion + "<br>Get it on Zere's GitHub! http://bit.ly/BFRedux")
		headerText.css("line-height", "150%")
		headerText.appendTo(header)
		header.appendTo(panel)
	}
	
	var wrapperControls = this.controlGroup("Wrapper Options", () => {this.saveSettings()}).appendTo(panel).append(
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
	
	var formatControls = this.controlGroup("Formatting Options", () => {this.saveSettings()}).appendTo(panel).append(
			new CheckboxSetting("Use Char Map?", "This determines if the char map is used, or just spaced capital letters.",
								this.settings.formatting.fullWidthMap, (checked) => {this.settings.formatting.fullWidthMap = checked}), 
			new CheckboxSetting("Reorder Upsidedown Text", "Having this enabled reorders the upside down text to make it in-order.",
								this.settings.formatting.reorderUpsidedown, (checked) => {this.settings.formatting.reorderUpsidedown = checked}),
			new CheckboxSetting("Start VaRiEd Caps With Capital", "Enabling this starts a varied text string with a capital.",
								this.settings.formatting.startCaps, (checked) => {this.settings.formatting.startCaps = checked}));
	
	var pluginControls = this.controlGroup("Plugin Options", () => {this.saveSettings()}).appendTo(panel).append(
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

BetterFormattingRedux.prototype.getSettingsPanel = function () {
	var panel = $("<form>")
		.addClass("form")
		.css("width", "100%");

	this.generateSettings(panel)
	
	return panel[0];
};

return BFRedux;
})();