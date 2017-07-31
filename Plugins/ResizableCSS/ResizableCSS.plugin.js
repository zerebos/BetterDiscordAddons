//META{"name":"ResizableCSS"}*//

var ResizableCSS = (function() {

class Plugin {
	getName(){return "ResizableCSS"}
	getShortName() {return "rcss"}
	getDescription(){return "Allows you to resize the detached CustomCSS window. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.1.1"}
	getAuthor(){return "Zerebos"}
	
	load(){}
	unload(){}
	
	start(){
		this.style = `.ui-resizable{position:relative}.ui-resizable-handle{position:absolute;font-size:.1px;display:block;-ms-touch-action:none;touch-action:none}.ui-resizable-disabled .ui-resizable-handle,.ui-resizable-autohide .ui-resizable-handle{display:none}.ui-resizable-n{cursor:n-resize;height:7px;width:100%;top:-5px;left:0}.ui-resizable-s{cursor:s-resize;height:7px;width:100%;bottom:-5px;left:0}.ui-resizable-e{cursor:e-resize;width:7px;right:-5px;top:0;height:100%}.ui-resizable-w{cursor:w-resize;width:7px;left:-5px;top:0;height:100%}.ui-resizable-se{cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.ui-resizable-sw{cursor:sw-resize;width:9px;height:9px;left:-5px;bottom:-5px}.ui-resizable-nw{cursor:nw-resize;width:9px;height:9px;left:-5px;top:-5px}.ui-resizable-ne{cursor:ne-resize;width:9px;height:9px;right:-5px;top:-5px}`
		this.jqui = document.createElement("script");
		this.jqui.setAttribute("src", "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js");
		this.jqui.setAttribute("integrity", "sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=")
		this.jqui.setAttribute("crossorigin", "anonymous")
		document.body.appendChild(this.jqui);
		BdApi.injectCSS(this.getShortName(), this.style)
	}
	stop(){
		this.jqui.remove()
		BdApi.clearCSS(this.getShortName())
		$('#app-mount .app').css("width", "")
		$('#bd-customcss-detach-container').css("width", "").css("left", "")
	}
	
	observer(e){

		if (e.removedNodes.length) {
			var removed = $(e.removedNodes[0])
			if (removed.is("#bd-customcss-detach-editor") || removed.find("#bd-customcss-detach-editor").length) {
				$('#app-mount .app').css("width", "")
				$('#bd-customcss-detach-container').css("width", "").css("left", "")
			}
		}

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])

		if (elem.is("#bd-customcss-detach-editor") || elem.find("#bd-customcss-detach-editor").length) {
			$('#bd-customcss-detach-container').resizable({handles: "w"})
			$('#bd-customcss-detach-container').on("resize."+this.getShortName(), (e, ui) => {
				var size = $(document).width() - $('#bd-customcss-detach-container').width()
				$('.bd-detached-editor .app').css("width", size)
			})
		}

	}
}


return Plugin
})();

