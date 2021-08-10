
module.exports = (Plugin, Api) => {
    const {Modals} = Api;

    return class StatusEverywhere extends Plugin {
        load() {
            Modals.showConfirmationModal(
                "Discontinued",
                "This version of StatusEverywhere by Zerebos has been discontinued. Please download the maintained version from Strencher https://betterdiscord.app/plugin/StatusEverywhere",
                {
                    confirmText: "Download Now",
                    cancelText: "Maybe Later",
                    onConfirm: function() {
                        require("electron").shell.openExternal(`https://betterdiscord.app/plugin/StatusEverywhere`);
                    }
                }
            );
        }
    };
};