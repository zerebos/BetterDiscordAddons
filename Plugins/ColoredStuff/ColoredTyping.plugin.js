//META{"name":"ColoredTyping"}*//

var ColoredTyping = function() {};
ColoredTyping.prototype.data = {};
ColoredTyping.prototype.dataVersion = "1";
ColoredTyping.prototype.defaultData = function() {
    return {
        version: "1"
    };
}
ColoredTyping.prototype.loadData = function() {
    this.data = (bdStorage.get('ColoredTyping')) ? JSON.parse(bdStorage.get('ColoredTyping')) : {
        version: '0'
    };
    if (this.data.version != this.dataVersion) {
        // wew lad we're using a new way to save our data
        this.data = this.defaultData();
        this.saveData();
    };
};

ColoredTyping.prototype.saveData = function() {
    bdStorage.set('ColoredTyping',JSON.stringify(this.data)); 
};

ColoredTyping.prototype.colorize = function() {
    var self = this;
    $(".typing strong").each(function(index) {
        var username = $(this).text();
        if (self.data[username]) $(this).css("color", self.data[username]);
		else $(this).css("color", "");
    });
};

ColoredTyping.prototype.decolorize = function() {
    $(".typing strong").each(function(index) {
        $(this).css("color", "");
    });
};

// unused
ColoredTyping.prototype.load = function() {};
ColoredTyping.prototype.unload = function() {};
// unused

ColoredTyping.prototype.start = function() {
    this.loadData();
    this.colorize();
};

ColoredTyping.prototype.stop = function() {
    this.decolorize();
	this.saveData();
};

ColoredTyping.prototype.observer = function(e) {
	
	if (e.removedNodes.length) {
		var removed = $(e.removedNodes[0])
		if (removed.hasClass("spinner") || removed.prop("tagName") == "STRONG") {
			this.colorize()
		}
	}
	
    if (!e.addedNodes.length) return;
	var elem = $(e.addedNodes[0])
	
	if (elem.find("strong").length || elem.find(".spinner").length || elem.hasClass(".typing") || elem.prop("tagName") == "STRONG") {
        this.colorize()
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
		this.colorize()
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

ColoredTyping.prototype.getSettingsPanel = function() {
    return "";
};

ColoredTyping.prototype.getName = function() {
    return "Colored Typing";
};

ColoredTyping.prototype.getDescription = function() {
    return "Make the text color of the \"typing...\" text same as role color";
};

ColoredTyping.prototype.getVersion = function() {
    return "1.2.1";
};

ColoredTyping.prototype.getAuthor = function() {
    return "Anxeal, Zerebos";
};
