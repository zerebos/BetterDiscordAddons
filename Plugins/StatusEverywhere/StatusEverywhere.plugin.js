//META{"name":"StatusEverywhere"}*//

var StatusEverywhere = (function() {

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

class StatusEverywhere {
	getName(){return "Status Everywhere"}
	getShortName() {return "StatusEverywhere"}
	getDescription(){return "Adds user status everywhere Discord doesn't."}
	getVersion(){return "0.0.1-beta"}
	getAuthor(){return "Zerebos"}
	loadSettings() {
		try {
			for (settingType in this.settings) {
				this.settings[settingType] = $.extend({}, this.settings[settingType], bdPluginStorage.get(this.getShortName(), settingType));
			}
		} catch (err) {
			console.warn(this.getShortName(), "unable to load settings:", err);
		}
	}

	saveSettings() {
		try {
			for (settingType in this.settings) {
				bdPluginStorage.set(this.getShortName(), settingType, this.settings[settingType]);
			}
		} catch (err) {
			console.warn(this.getShortName(), "unable to save settings:", err);
		}
	}
	
	load(){}
	unload(){}
	
	getReactInstance(node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}
	
	getAuthorStatus(author) {
		author.click()
		var popout = $(".user-popout");
		var block = $(".avatar-popout .status").clone()
		popout.remove()
		return block
	}
	
	start(){
		BdApi.injectCSS(this.getShortName(), ".message-group .avatar-large {margin-left: 5px}")
		$('.message-group .avatar-large').each((index, elem) => {
			if (!$(elem).find('.status').length) $(elem).append(this.getAuthorStatus(elem))
		})
	}
	stop(){
		BdApi.clearCSS(this.getShortName())
		$('.message-group .avatar-large').each((index, elem) => {
			if ($(elem).find('.status').length) $(elem).empty()
		})
	}
	
	observer(e){
		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])
		var self = this
		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			setTimeout(() => {
				elem.find('.avatar-large').each((index, elem) => {
					if (!$(elem).find('.status').length) $(elem).append(this.getAuthorStatus(elem))
				})
			},20)
		}

	}
}


return StatusEverywhere
})();

