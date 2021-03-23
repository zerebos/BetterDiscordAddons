module.exports = (Plugin, Api) => {
    const { Patcher, WebpackModules, Modals, DiscordModules } = Api;
    const electron = require("electron");
    return class DoNotTrack extends Plugin {
        onStart() {
            this.cancelTracking();
        }

        onSwitch() {
            this.cancelTracking();
        }

        onStop() {
            Patcher.unpatchAll();
        }

        cancelTracking(){
            const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");
            Patcher.instead(Analytics.default, "track", () => { });

            electron.remote.getCurrentWebContents().removeAllListeners("devtools-opened"); // Remove dumb console warning

            const Logger = window.__SENTRY__.logger;
            Logger.disable(); // Kill sentry logs

            const SentryHub = window.DiscordSentry.getCurrentHub();
            SentryHub.getClient().close(0); // Kill reporting
            SentryHub.getStackTop().scope.clear(); // Delete PII

            /* eslint-disable no-console */
            for (const method in console) {
                if (!console[method].__sentry_original__) continue;
                console[method] = console[method].__sentry_original__;
            }

            if (this.settings.stopProcessMonitor) this.disableProcessMonitor();
        }

        disableProcessMonitor() {
            DiscordModules.UserSettingsUpdater.updateLocalSettings({ showCurrentGame: false });
            const NativeModule = WebpackModules.getByProps("getDiscordUtils");
            const DiscordUtils = NativeModule.getDiscordUtils();
            DiscordUtils.setObservedGamesCallback([], () => { });
        }

        enableProcessMonitor() {
            DiscordModules.UserSettingsUpdater.updateLocalSettings({ showCurrentGame: true });
            Modals.showConfirmationModal("Reload Discord?", "To reenable the process monitor Discord needs to be reloaded.", {
                confirmText: "Reload",
                cancelText: "Later",
                onConfirm: () => {
                    window.location.reload();
                }
            });
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

        updateSettings(id, value) {
            if (id !== "stopProcessMonitor") return;
            if (value) return this.disableProcessMonitor();
            return this.enableProcessMonitor();
        }

    };
};
