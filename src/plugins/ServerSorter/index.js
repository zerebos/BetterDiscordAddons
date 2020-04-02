module.exports = (Plugin, Api) => {
    const {Modals} = Api;

    return class ServerSorter extends Plugin {
        load() {
            Modals.showConfirmationModal(
                "ServerSorter Is Dead",
                "ServerSorter is going away.\n\nIt's become unrealistic to sort servers/guilds in the list with the new server folders.\n\nIf you do would miss the functionality of ServerSorter, do not worry, the functionality will be absorbed into [ServerSearch](https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ServerSearch) at some point, so keep your eyes peeled for that.",
                {
                    danger: true,
                    confirmText: "Delete Now",
                    cancelText: "Delte Later",
                    onConfirm: function() {
                        const fs = require("fs");
                        const path = require("path");
                        const file = path.resolve(BdApi.Plugins.folder, "ServerSorter.plugin.js");
                        if (fs.existsSync(file)) {
                            fs.unlinkSync(file);
                            BdApi.showToast("Plugin deleted successfully", {type: "success"});
                        }
                        else {
                            Modals.showAlertModal("File Not Found", "Couldn't find the plugin file, please delete it manually!");
                        }
                    }
                }
            );
        }
    };
};