//META{"name":"ShowHiddenChannels"}*//

class ShowHiddenChannels {
    getName() {return "ShowHiddenChannels";} // Name of your plugin to show on the plugins page 
    getDescription() {return "This plugin does not yet exist.";} // Description to show on the plugins page 
    getVersion() {return "0.0.2";} // Current version. I recommend following semantic versioning <http://semver.org/> (e.g. 0.0.1)
    getAuthor() {return "Serega007";} // Your name

    load() {} // Called when the plugin is loaded in to memory

    start() {} // Called when the plugin is activated (including after reloads)
    stop() {} // Called when the plugin is deactivated

    observer(changes) {} // Observer for the document. Better documentation than I can provide is found here: <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>
}

