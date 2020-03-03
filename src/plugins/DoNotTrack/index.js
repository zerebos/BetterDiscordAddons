
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, Modals} = Api;

    return class DoNotTrack extends Plugin {
        onStart() {
            const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");
            Patcher.instead(Analytics.default, "track", () => {});
    
            const Warning = WebpackModules.getByProps("consoleWarning");
            Patcher.instead(Warning, "consoleWarning", () => {});
    
            const MethodWrapper = WebpackModules.getByProps("wrapMethod");
            Patcher.instead(MethodWrapper, "wrapMethod", () => {});

            const Reporter = WebpackModules.getByProps("report");
            Reporter.report.uninstall();
    
            const Sentry = WebpackModules.getByProps("_originalConsoleMethods", "_wrappedBuiltIns");
            Patcher.instead(Sentry, "_breadcrumbEventHandler", () => () => {});
            Patcher.instead(Sentry, "captureBreadcrumb", () => {});
            Patcher.instead(Sentry, "_makeRequest", () => {});
            Patcher.instead(Sentry, "_sendProcessedPayload", () => {});
            Patcher.instead(Sentry, "_send", () => {});
            Object.assign(window.console, Sentry._originalConsoleMethods);
            if (this.settings.stopProcessMonitor) this.disableProcessMonitor();
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

        disableProcessMonitor() {
            const NativeModule = WebpackModules.getByProps("getDiscordUtils");
            const DiscordUtils = NativeModule.getDiscordUtils();
            DiscordUtils.setObservedGamesCallback([], () => {});
        }

        enableProcessMonitor() {
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