
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules} = Api;

    return class DoNotTrack extends Plugin {
        onStart() {
            const Analytics = WebpackModules.getByProps("AnalyticEventConfigs");
            Patcher.instead(Analytics.default, "track", () => {});
    
            const Warning = WebpackModules.getByProps("consoleWarning");
            Patcher.instead(Warning, "consoleWarning", () => {});
    
            const MethodWrapper = WebpackModules.getByProps("wrapMethod");
            Patcher.instead(MethodWrapper, "wrapMethod", () => {});
    
            const Sentry = WebpackModules.getByProps("_originalConsoleMethods", "_wrappedBuiltIns");
            Sentry.uninstall();
            Patcher.instead(Sentry, "_breadcrumbEventHandler", () => () => {});
            Patcher.instead(Sentry, "captureBreadcrumb", () => {});
            Patcher.instead(Sentry, "_makeRequest", () => {});
            Patcher.instead(Sentry, "_sendProcessedPayload", () => {});
            Patcher.instead(Sentry, "_send", () => {});
            Object.assign(window.console, Sentry._originalConsoleMethods);
        }
        
        onStop() {
            Patcher.unpatchAll();
        }

    };
};