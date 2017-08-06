//META{"name":"ImageToClipboard"}*//

var ImageToClipboard = (function() {

class Plugin {
	getName(){return "Image To Clipboard"}
	getShortName() {return "i2c"}
	getDescription(){return "Copies images (png/jpg) directly to clipboard. Support Server: bit.ly/ZeresServer"}
	getVersion(){return "0.2.2"}
	getAuthor(){return "Zerebos"}

	constructor() {
		this.fs = require("fs");
		this.nativeImage = require("electron").nativeImage;
		this.clipboard = require("electron").clipboard;
		this.link = '<a target="_blank" rel="noreferrer" class="download-button">Copy original</a>'
		this.contextItem = '<div class="item"><span>Copy Image</span><div class="hint"></div></div>'
	}
	
	load(){}
	unload(){}
	
	start(){
	}
	stop(){
	}

	getReactInstance (node) { 
		return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
	}

	getDataUri(targetUrl, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.onload = function () {
	        var reader = new FileReader();
	        reader.onloadend = function () {
	            callback(reader.result);
	        };
	        reader.readAsDataURL(xhr.response);
	    };
	    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
	    //if (targetUrl.startsWith("https://cdn.discordapp.com/")) proxyUrl="";
	    xhr.open('GET', proxyUrl + targetUrl);
	    xhr.responseType = 'blob';
	    xhr.send();
	}

	copyToClipboard(url) {
		this.getDataUri(url, (uri) => {
			this.clipboard.write({image: this.nativeImage.createFromBuffer(new Buffer(uri.split(",")[1], 'base64'))});
		});
	}

	bindMenu(context) {
		var inst = this.getReactInstance(context);
		if (!inst) return;
		var ele = inst._currentElement;
		if (ele.props && ele.props.children) {
			var children = Array.isArray(ele.props.children) ? ele.props.children : [ele.props.children];
			for (var i = 0; i < children.length; i++) {
				if (children[i] && children[i].props && children[i].props.href && children[i].type && children[i].type.displayName == "NativeLinkGroup") {
					var imageLink = children[i].props.href;
					if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
						var item = $(this.contextItem).on("click."+this.getShortName(), ()=>{$(context).hide();this.copyToClipboard(imageLink);});
						$(context).find('.item:contains("Copy Link")').after(item)
						break;
					}
					else {
						imageLink = children[i].props.src
						imageLink = imageLink.match(/https?\/.*(\.png|\.jpg|\.jpeg)/g)[0]
						imageLink = imageLink.replace("http/", "http://").replace("https/", "https://")
						if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
							var item = $(this.contextItem).on("click."+this.getShortName(), ()=>{$(context).hide();this.copyToClipboard(imageLink);});
							$(context).find('.item:contains("Copy Link")').after(item)
							break;
						}
					}
				}
			}
		}
	}

	observer(e){

		if (!e.addedNodes.length) return;
		var elem = $(e.addedNodes[0])

		if (elem.hasClass("modal-image").length || elem.find(".modal-image").length) {
			var linkElement = $(this.link)
			var openElement = $('.modal-image a')
			var imageLink = openElement.attr("href")
			if (imageLink.endsWith('.png') || imageLink.endsWith('.jpg') || imageLink.endsWith('.jpeg')) {
				openElement.after($('<span class="download-button"> | </span>'),linkElement)
				linkElement.on("click", () => {this.copyToClipboard(imageLink)})
			}
		}

		if (elem.hasClass("context-menu")) {
			this.bindMenu(elem[0])
		}

	}

	getSettingsPanel() {}
}


return Plugin
})();

