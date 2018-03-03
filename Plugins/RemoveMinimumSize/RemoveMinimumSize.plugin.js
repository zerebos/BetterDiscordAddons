//META{"name":"RemoveMinimumSize"}*//

class RemoveMinimumSize {
	getName() { return "RemoveMinimumSize"; }
	getDescription() { return "Removes the minimum window size forced by Discord. Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.1"; }
	getAuthor() { return "Zerebos"; }
	
	load() {}
	unload() {}
	
	start() {
		require('electron').remote.getCurrentWindow().setMinimumSize(1,1);
	}

	stop() {
		require('electron').remote.getCurrentWindow().setMinimumSize(940,500);
	}

}

