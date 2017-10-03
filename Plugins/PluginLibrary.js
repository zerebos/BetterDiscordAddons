var PluginContextMenu = {}

/*
Options:
scroll: Boolean — Determines if it should be a scroller context menu
*/
PluginContextMenu.Menu = class Menu {
	constructor(scroll = false) {
		this.theme = $('#app-mount > div > div > .theme-dark').length ? "theme-dark" : "theme-light";
		this.element = $("<div>").addClass("context-menu").addClass("plugin-context-menu").addClass(this.theme)
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
		
		var depth = this.element.parents(".plugin-context-menu").length
		if (depth == 0) this.element.insertBefore('#app-mount > div > div > span');
		this.element.css("top", mouseY).css("left", mouseX)
		
		if (depth > 0) {
			var top = this.element.parents(".plugin-context-menu").last();
			var closest = this.element.parents(".plugin-context-menu").first();
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
		this.element.find(".plugin-context-menu").detach()
		$(document).off(".zctx")
	}
	
	attachTo(menuItem) {
		this.menuItem = menuItem;
		menuItem.on("mouseenter", ()=>{
			this.element.appendTo(menuItem)
			this.show(this.element.parents(".plugin-context-menu").css("left"), menuItem.offset().top)
		})
		menuItem.on("mouseleave", ()=>{this.element.detach()})
	}
}

PluginContextMenu.ItemGroup = class ItemGroup {
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
PluginContextMenu.MenuItem = class MenuItem {
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
PluginContextMenu.TextItem = class TextItem extends PluginContextMenu.MenuItem {
	constructor(label, options = {}) {
		super(label, options)
		var {hint = ""} = options
		this.element.append($("<span>").text(label))
		this.element.append($("<div>").addClass("hint").text(hint));
	}
}

PluginContextMenu.ImageItem = class ImageItem extends PluginContextMenu.MenuItem {
	constructor(label, imageSrc, options = {}) {
		super(label, options)
		this.element.addClass("item-image")
		this.element.append($("<div>").addClass("label").text(label))
		this.element.append($("<img>", {src: imageSrc}));
	}
}

PluginContextMenu.SubMenuItem = class SubMenuItem extends PluginContextMenu.MenuItem {
	constructor(label, subMenu, options= {}) {
		// if (!(subMenu instanceof ContextSubMenu)) throw "subMenu must be of ContextSubMenu type.";
		super(label, options)
		this.element.addClass("item-subMenu").text(label)
		this.subMenu = subMenu
		this.subMenu.attachTo(this.getElement())
	}
}

var PluginSettings = {}

PluginSettings.getAccentColor = function() {
    var bg = $('<div class="ui-switch-item"><div class="ui-switch-wrapper"><input type="checkbox" checked="checked" class="ui-switch-checkbox"><div class="ui-switch checked">')
    bg.appendTo($("#bd-settingspane-container"))
    var bgColor = $(".ui-switch.checked").first().css("background-color")
    var afterColor = window.getComputedStyle(bg.find(".ui-switch.checked")[0], ':after').getPropertyValue('background-color'); // For beardy's theme
    bgColor = afterColor == "rgba(0, 0, 0, 0)" ? bgColor : afterColor
    bg.remove();
    return bgColor
}

PluginSettings.getCSS = function() {
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

PluginSettings.createInputContainer = function() { return $('<div class="plugin-setting-input-container">');}

PluginSettings.ControlGroup = class ControlGroup {
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

PluginSettings.SettingField = class SettingField {
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
}

PluginSettings.Textbox = class Textbox extends PluginSettings.SettingField {
	constructor(label, help, value, placeholder, callback, disabled) {
		super(label, help, {type: "text", placeholder: placeholder, value: value}, callback, disabled);
		
		this.setInputElement(this.input);
	}
}

PluginSettings.ColorPicker = class ColorPicker extends PluginSettings.SettingField {
	constructor(label, help, value, callback, disabled) {
		super(label, help, {type: "color", value: value}, callback, disabled);
		this.input.css("margin-left", "10px")
		
		var label = $('<span class="plugin-setting-label">').text(value)
		
		this.input.on("input", function() {
			label.text($(this).val())
		})
		
		this.setInputElement(PluginSettings.createInputContainer().append(label, this.input));
	}
}

PluginSettings.Slider = class Slider extends PluginSettings.SettingField {
	constructor(settingLabel, help, min, max, step, value, callback, disabled) {
		super(settingLabel, help, {type: "range", min: min, max: max, step: step, value: parseFloat(value)}, callback, disabled);
		this.value = parseFloat(value); this.min = min; this.max = max;
		
		this.getValue = () => {return parseFloat(this.input.val());}
		
		this.accentColor = PluginSettings.getAccentColor()
		this.setBackground()
		this.input.css("margin-left", "10px").css("float", "right")
		
		this.labelUnit = ""
		this.label = $('<span class="plugin-setting-label">').text(this.value + this.labelUnit)
		
		this.input.on("input", () => {
			this.value = parseFloat(this.input.val())
			this.label.text(this.value + this.labelUnit)
			this.setBackground()
		})
		
		this.setInputElement(SettingField.createInputContainer().append(this.label,this.input));
	}
	
	getPercent() {return ((this.value-this.min)/this.max)*100;}
	setBackground() {var percent = this.getPercent(); this.input.css('background', 'linear-gradient(to right, '+this.accentColor+', '+this.accentColor+' '+percent+'%, #72767d '+percent+'%)')}
	setLabelUnit(unit) {this.labelUnit = unit; this.label.text(this.value + this.labelUnit); return this;}
}

PluginSettings.Checkbox = class Checkbox extends PluginSettings.SettingField {
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
PluginSettings.PillButton = class PillButton extends PluginSettings.Checkbox {
	constructor(label, help, leftLabel, rightLabel, isChecked, callback, disabled) {
		super(label, help, isChecked, callback, disabled);
		
		this.checkboxWrap.css("margin","0 9px")
		
		var labelLeft = $('<span class="plugin-setting-label left">')
		labelLeft.text(leftLabel)
		var labelRight = $('<span class="plugin-setting-label right">')
		labelRight.text(rightLabel)
		
		var accent = PluginSettings.getAccentColor()
		
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
		
		this.setInputElement(SettingField.createInputContainer().append(labelLeft, this.checkboxWrap.detach(), labelRight));
	}
}