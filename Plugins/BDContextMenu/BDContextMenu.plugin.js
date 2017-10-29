//META{"name":"BDContextMenu"}*//

/* global PluginUtilities:false, PluginContextMenu:false, BdApi:false */

class BDContextMenu {
	getName() { return "BDContextMenu"; }
	getShortName() { return "BDContextMenu"; }
	getDescription() { return "Adds BD shortcuts to the settings context menu. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }

	constructor() {
        this.initialized = false;
        this.contextObserver = new MutationObserver((changes) => {
			for (let change in changes) this.observeContextMenus(changes[change]);
		});
    }
	
	load() {}
	unload() {}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
        else libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	
	initialize() {
		this.initialized = true;
        PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
        $('.container-iksrDt div.button-1aU9q1').on('contextmenu.bdcs', () => { this.bindContextMenus(); });
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}
	
    stop() {
        $('*').off('.bdcs');
    }

    observer(e) {
        if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
        if (!e.addedNodes[0].querySelector('.container-iksrDt div.button-1aU9q1')) return;
        $('.container-iksrDt div.button-1aU9q1').on('contextmenu.bdcs', () => { this.bindContextMenus(); });
    }
    
    bindContextMenus() {
		this.contextObserver.observe(document.querySelector('.app'), {childList: true});
	}

	unbindContextMenus() {
		this.contextObserver.disconnect();
	}

	observeContextMenus(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
		let elem = e.addedNodes[0];
		let isContext = elem.classList.contains('context-menu');
        if (!isContext) return;
        let contextMenu = $(elem);
        let items = ['Core', 'Emotes', 'CustomCSS', 'Plugins', 'Themes'];

        let menuItems = [];

        items.forEach((val, i) => {
            ((i) => {
                menuItems.push(new PluginContextMenu.TextItem(items[i], {callback: () => {
                    contextMenu.hide();
                    this.openMenu(i);
                }}));
            })(i);
        });
        let menu = new PluginContextMenu.SubMenuItem("BetterDiscord", new PluginContextMenu.Menu(false).addItems(...menuItems));
        contextMenu.append(menu.getElement());
        contextMenu.css("top", "-=" + menu.getElement().outerHeight());
        //document.querySelectorAll('#bd-settings-sidebar .ui-tab-bar-item')[2].click()
        this.unbindContextMenus();

    }

    openMenu(index) {
        let observer = new MutationObserver((changes) => {
            for (let change in changes) {
                let e = changes[change];
                if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
                if (e.addedNodes[0].querySelector('#bd-settings-sidebar') || e.addedNodes[0].id === "bd-settings-sidebar") {
                    document.querySelectorAll('#bd-settings-sidebar .ui-tab-bar-item')[index].click();
                    document.querySelectorAll('#bd-settings-sidebar .ui-tab-bar-item')[index].classList.add('selected');
                    observer.disconnect();
                }
            }
        });
        observer.observe(document.querySelector('.app'), {childList: true, subtree: true});
        $('.container-iksrDt div.button-1aU9q1').click();
    }
    
}