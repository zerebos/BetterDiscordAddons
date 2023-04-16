/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, Modals} = Api;

    const SettingsManager = WebpackModules.getModule(m => m?.updateAsync, {searchExports: true});
    const BoolSetting = WebpackModules.getModule(m => m?.typeName?.includes("Bool"), {searchExports: true});
    const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");
    const NativeModule = WebpackModules.getByProps("getDiscordUtils");

    return class DoNotTrack extends Plugin {
        onStart() {
            
            Patcher.instead(Analytics.default, "track", () => {});
            Patcher.instead(NativeModule, "ensureModule", (_, [moduleName], originalFunction) => {
                if (moduleName.includes("discord_rpc")) return;
                return originalFunction(moduleName);
            });

            // No more global processors
            window.__SENTRY__.globalEventProcessors.splice(0, window.__SENTRY__.globalEventProcessors.length);

            // Kill sentry logs
            window.__SENTRY__.logger.disable(); 

            const SentryHub = window.DiscordSentry.getCurrentHub();
            SentryHub.getClient().close(0); // Kill reporting
            SentryHub.getScope().clear(); // Delete PII

            if (this.settings.stopProcessMonitor) this.disableProcessMonitor();
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

        disableProcessMonitor() {
            SettingsManager?.updateAsync("status", settings => settings.showCurrentGame = BoolSetting.create({value: false}));
            const DiscordUtils = NativeModule.getDiscordUtils();
            const original = DiscordUtils.setObservedGamesCallback;
            Patcher.instead(DiscordUtils, "setObservedGamesCallback", () => {});
            setTimeout(() => original([], () => {}), 3000); // Delay this in case there's a boot order issue
        }

        enableProcessMonitor() {
            SettingsManager?.updateAsync("status", settings => settings.showCurrentGame = BoolSetting.create({value: true}));
            Modals.showConfirmationModal("Reload Discord?", "To reenable the process monitor Discord needs to be reloaded.", {
                confirmText: "Reload",
                cancelText: "Later",
                onConfirm: () => window.location.reload()
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