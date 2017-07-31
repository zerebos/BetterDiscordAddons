//META{"name":"AlwaysTyping"}*//

var AlwaysTyping = (function() {
class AlwaysTyping {
	getName(){return "Always Typing"}
	getShortName() {return "AlwaysTyping"}
	getDescription(){return "Makes people think you're always typing, even when you're not. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.0.1"}
	getAuthor(){return "Zerebos"}
	
	load(){}
	unload(){}
	
	start(){
		this.interval = setInterval(()=>{$(".channelTextArea-1HTP3C textarea")[0].dispatchEvent(new Event('input', { bubbles: true }))}, 300)
	}
	stop(){
		clearInterval(this.interval)
	}
	
	observer(e) {}
}


return AlwaysTyping
})();

