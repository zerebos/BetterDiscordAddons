//META{"name":"BlurNSFW"}*//

var BlurNSFW = (function() {

class Plugin {
	getName(){return "BlurNSFW"}
	getShortName() {return "bnsfw"}
	getDescription(){return "Blurs images in NSFW channels until you hover over it. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.1.4"}
	getAuthor(){return "Zerebos"}

	constructor() {
		this.style = `:root {--blur-nsfw: 10px; --blur-nsfw-time: 200ms;}
		.attachment-image img.blur:hover, .embed-thumbnail img.blur:hover, .attachment-image canvas.blur:hover, .embed-thumbnail canvas.blur:hover, .attachment-image video.blur:hover, .embed-thumbnail video.blur:hover {
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
			filter: blur(0px) !important;
		}
		.attachment-image img.blur, .embed-thumbnail img.blur, .attachment-image canvas.blur, .embed-thumbnail canvas.blur, .attachment-image video.blur, .embed-thumbnail video.blur {
			filter: blur(var(--blur-nsfw)) !important;
			transition: var(--blur-nsfw-time) cubic-bezier(.2, .11, 0, 1) !important;
		}`
		this.selectors = ['.attachment-image img', '.attachment-image canvas', '.attachment-image video', '.embed-thumbnail img', '.embed-thumbnail canvas', '.embed-thumbnail video']
	}
	
	load(){}
	unload(){}
	
	start(){
		BdApi.injectCSS(this.getShortName(), this.style)
		this.blurStuff()
	}
	stop(){
		this.unblurStuff()
		BdApi.clearCSS(this.getShortName())
	}

	getReactInstance(node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}

	isNSFWChannel() {
		if (!$('.title-wrap').length) return false;
		return this.getReactInstance($('.title-wrap')[0])._currentElement.props.children[2].props.channel.nsfw || this.getReactInstance($('.title-wrap')[0])._currentElement.props.children[2].props.channel.name.toLowerCase().indexOf("nsfw") !== -1
	}

	blurStuff() {
		if (!this.isNSFWChannel()) return;

		var blurAction = (index, elem) => {
			var img = $(elem)
			if (!img.hasClass("blur")) {
				img.addClass("blur");
				img.parent().css("overflow", "hidden")
			}
		}

		for (var i=0; i<this.selectors.length; i++) $(this.selectors[i]).each(blurAction);
	}

	unblurStuff() {
		var unblurAction = (index, elem) => {
			var img = $(elem)
			if (img.hasClass("blur")) img.removeClass("blur");
		}

		for (var i=0; i<this.selectors.length; i++) $(this.selectors[i]).each(unblurAction);
	}

	observer(e){

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])

		if (elem.parents(".messages.scroller").length || elem.find(".message-group").parents(".messages.scroller").length) {
			this.blurStuff()
		}

		if (elem.hasClass(".image").length || elem.find("span.image").parents(".messages.scroller").length) {
			this.blurStuff()
		}

	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		var header = $('<div class="formNotice-2tZsrh margin-bottom-20 padded card-3DrRmC">')//.css("background", SettingField.getAccentColor()).css("border-color", "transparent")
		var headerText = $('<div class="default-3bB32Y formText-1L-zZB formNoticeBody-1C0wup whiteText-32USMe modeDefault-389VjU primary-2giqSn">')
		headerText.html("To update the blur amount change the css variable <span style='font-family: monospace;'>--blur-nsfw</span> to something like <span style='font-family: monospace;'>20px</span>. <br> You can also change the tranistion time by changing <span style='font-family: monospace;'>--blur-nsfw-time</span> to something like <span style='font-family: monospace;'>500ms</span>")
		headerText.css("line-height", "150%")
		headerText.appendTo(header)
		header.appendTo(panel)
		return panel[0]
	}
}


return Plugin
})();

