//META{"name":"SendButton"}*//

var SendButton = (function() {
class SendButton {
	getName(){return "SendButton"}
	getShortName() {return "SendButton"}
	getDescription(){return "Adds a clickable send button"}
	getVersion(){return "0.0.1"}
	getAuthor(){return "Zerebos"}

    constructor() {
        this.mainCSS = `/* Send Button Plugin */
#send-button {
    background-repeat: no-repeat;
    background-position: 50%;
    transition: all 100ms ease;
    width: 35px;
    margin-right:12px;
    max-height: initial!important;
    display: flex;
    align-items: center;
    justify-content: center;
}

#send-button img {
    opacity: 0.2;
    width: 100%;
}

#send-button img:hover {
    cursor: pointer;
    opacity: 1;
}
        `
        
        this.buttonString = '<div class="" id="send-button"><img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTIuMDEgMjFMMjMgMTIgMi4wMSAzIDIgMTBsMTUgMi0xNSAyeiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+">'
    }
	
	load(){}
	unload(){}
	
	addButton() {
        if ($("#send-button").length) return;
        var button = $(this.buttonString);
		$('div[class*="innerEnabled"]').append(button);
		$('.emojiButton-3c_qrT').css('position', 'static');
        $('.emojiButton-3c_qrT').css('margin-right', '12px');
		button.on("click."+this.getShortName(), (e) => {
            var textarea = button.siblings('textarea');
            var options = { key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true };
            var down = new KeyboardEvent("keydown", options);
            Object.defineProperty(down, "keyCode", {value: 13});
            Object.defineProperty(down, "which", {value: 13});
            var press = new KeyboardEvent("keypress", options);
            Object.defineProperty(press, "keyCode", {value: 13});
            Object.defineProperty(press, "which", {value: 13});
            textarea[0].dispatchEvent(down);
            textarea[0].dispatchEvent(press);
        })
	}
	
	start(){
		BdApi.injectCSS(this.getShortName(), this.mainCSS)
        this.addButton()
	}
	
	stop(){
		BdApi.clearCSS(this.getShortName())
        $("*").off("."+this.getShortName());
        $("#send-button").remove()
	}
	
	onSwitch() {
		this.addButton();
	}
	
	observer(e) {
        if (!e.addedNodes.length) return;
        var elem = $(e.addedNodes[0]);
        if (elem.find('.messages.scroller') || elem.hasClass('messages')) this.addButton();
    }
}


return SendButton
})();

