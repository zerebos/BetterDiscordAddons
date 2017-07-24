//META{"name":"ColoredVoice"}*//

var ColoredVoice = function() {};
ColoredVoice.prototype.data = {};
ColoredVoice.prototype.dataVersion = "1";
ColoredVoice.prototype.defaultData = function() {
    return {
        version: "1"
    };
}
ColoredVoice.prototype.loadData = function() {
    this.data = (bdStorage.get('ColoredTyping')) ? JSON.parse(bdStorage.get('ColoredTyping')) : {
        version: '0'
    }
    if (this.data.version != this.dataVersion) {
        // wew lad we're using a new way to save our data
        this.data = this.defaultData();
        this.saveData();
    };
};

ColoredVoice.prototype.saveData = function() {
    bdStorage.set('ColoredTyping',JSON.stringify(this.data));
};

ColoredVoice.prototype.colorize = function() {
    var self = this;
    $(".containerDefault-7RImuF .avatarContainer-303pFz").siblings().each(function(index) {
        var username = $(this).text();
		if (self.data[username]) $(this).css("color", self.data[username]);
		else $(this).css("color", "");
    });
};

ColoredVoice.prototype.decolorize = function() {
    $(".containerDefault-7RImuF .avatarContainer-303pFz").siblings().each(function(index) {
        $(this).css("color", "");
    });
};

// unused
ColoredVoice.prototype.load = function() {};
ColoredVoice.prototype.unload = function() {};
// unused

ColoredVoice.prototype.start = function() {
    this.loadData();
    this.colorize();
};

ColoredVoice.prototype.stop = function() {
    this.decolorize();
	this.saveData();
};

ColoredVoice.prototype.observer = function(e) {
    if (!e.addedNodes.length) return;
	var elem = $(e.addedNodes[0])
	
	if (elem.find(".containerDefault-7RImuF").length || elem.find(".avatarContainer-303pFz").length) {
        this.colorize();
	}
	
	if (elem.find(".member-username-inner").length) {
		var self = this;
		$('.member-username-inner').each(function(index) {
			var username = $(this).text();
			var color = this.style.color;
			if (color) {self.data[username] = color;}
			else {
				if (self.data[username] !== undefined)
					delete self.data[username]
			}
		});
		this.colorize();
	}
	
	if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
		var self = this;
		elem.find('.user-name').each(function(index) {
			var username = $(this).text();
			var color = this.style.color;
			if (color) {self.data[username] = color;}
			else {
				if (self.data[username] !== undefined)
					delete self.data[username]
			}
		});
		this.colorize()
	}
};

ColoredVoice.prototype.getSettingsPanel = function() {
    return "";
};

ColoredVoice.prototype.getName = function() {
    return "Colored Voice";
};

ColoredVoice.prototype.getDescription = function() {
    return "Make the text color of the names in the voice channel same as role color";
};

ColoredVoice.prototype.getVersion = function() {
    return "1.2.1";
};

ColoredVoice.prototype.getAuthor = function() {
    return "Anxeal, Zerebos";
};
