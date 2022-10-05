/**
 * @param {import("zerespluginlibrary").Plugin} Plugin
 * @param {import("zerespluginlibrary").BoundAPI} Api
 */
module.exports = (Plugin, Api) => {
    const { Patcher, WebpackModules, Modals } = Api;

    const SettingsManager = WebpackModules.getByProps("ShowCurrentGame");
    //const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");

    return class DoNotTrack extends Plugin {
        onStart() {
            webpackJsonp.push([
                [],
                {
                    [""]: (_, e, r) => {
                        e.cache = r.c;
                        Object.values(r.c).find((m) => m.exports && m.exports.default && m.exports.default.track !== void 0).exports.default.track = function () {};
                        //console.log(Object.values(r.c).find(m => m.exports && m.exports.default && m.exports.default.track !== void 0).exports.default.track )
                    },
                },
                [[""]],
            ]);

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

        onStop() {
            Modals.showConfirmationModal("Reload Discord?", "To disable DoNotTrack, Discord needs to be reloaded.", {
                confirmText: "Reload",
                cancelText: "Later",
                onConfirm: () => {
                    window.location.reload();
                },
            });
        }

        disableProcessMonitor() {
            /*SettingsManager?.ShowCurrentGame?.updateSetting(false);
            const NativeModule = WebpackModules.getByProps("getDiscordUtils");
            const DiscordUtils = NativeModule.getDiscordUtils();
            DiscordUtils.setObservedGamesCallback([], () => {});*/

            webpackJsonp.push([
                [],
                {
                    [""]: (_, e, r) => {
                        e.cache = r.c;
                        const DiscordUtils = Object.values(r.c)
                            .find((m) => m.exports && m.exports.default && m.exports.default.getDiscordUtils !== void 0)
                            .exports.default.getDiscordUtils();

                        DiscordUtils.setObservedGamesCallback([], () => {});
                    },
                },
                [[""]],
            ]);
        }

        enableProcessMonitor() {
            //SettingsManager?.ShowCurrentGame?.updateSetting(true);
            Modals.showConfirmationModal("Reload Discord?", "To reenable the process monitor Discord needs to be reloaded.", {
                confirmText: "Reload",
                cancelText: "Later",
                onConfirm: () => {
                    window.location.reload();
                },
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
