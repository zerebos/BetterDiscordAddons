import {Meta} from "@betterdiscord/meta";
import Plugin from "@common/plugin";

import Config from "./config";


const {Patcher, Webpack, UI} = BdApi;

const SettingsManager = Webpack.getModule<{updateAsync(cat: string, fn: CallableFunction, delay: number): void;}>(m => m?.updateAsync && m?.type === 1, {searchExports: true});
const BoolSetting = Webpack.getModule<{create(opt: {value: boolean}): object}>(m => m?.typeName?.includes("Bool"), {searchExports: true});
const Analytics = Webpack.getByKeys<{default: {track(): void}}>("AnalyticEventConfigs");
const NativeModule = Webpack.getByKeys<{ensureModule(): void, getDiscordUtils(): {setObservedGamesCallback(l: string[], fn: CallableFunction): void}}>("getDiscordUtils");

export default class DoNotTrack extends Plugin {
    constructor(meta: Meta) {
        super(meta, Config);
    }

    onStart() {
        
        if (Analytics) {
            Patcher.instead(this.meta.name, Analytics.default, "track", () => {});
        }
        
        if (NativeModule) {
            Patcher.instead(this.meta.name, NativeModule, "ensureModule", (_, [moduleName]: [string], originalFunction) => {
                if (moduleName?.includes("discord_rpc")) return;
                return originalFunction(moduleName);
            });
        }

        const hub = window.DiscordSentry?.getCurrentHub?.();
        const client = hub?.getClient?.();
        if (client) {
            client.getOptions().enabled = false;
            client.getOptions().dsn = "";
            client.close?.(0);
        }
        hub?.getScope?.()?.clear?.();
        hub?.getIsolationScope?.()?.clear?.();
        hub?.getGlobalScope?.()?.clear?.();

        for (const method in console) {
            // eslint-disable-next-line no-console
            if (!Object.hasOwn(console[method as keyof typeof console], "__sentry_original__")) continue;

            // @ts-expect-error __sentry_original__ obviously doesn't normally exist on console but I cba to do the proper typing rn
            console[method as keyof typeof console] = console[method as keyof typeof console].__sentry_original__; // eslint-disable-line no-console
        }

        if (this.settings.stopProcessMonitor) this.disableProcessMonitor();
    }
    
    onStop() {
        Patcher.unpatchAll(this.meta.name);
    }

    disableProcessMonitor() {
        SettingsManager?.updateAsync("status", (settings: Record<string, unknown>) => settings.showCurrentGame = BoolSetting?.create({value: false}), 0);
        const DiscordUtils = NativeModule?.getDiscordUtils();
        if (!DiscordUtils) return UI.alert("DoNotTrack", "Unable to disable process monitor!");

        // Clear the current callback and patch it so no new one can be added
        DiscordUtils.setObservedGamesCallback([], () => {});
        Patcher.instead(this.meta.name, DiscordUtils, "setObservedGamesCallback", () => {});
    }

    enableProcessMonitor() {
        SettingsManager?.updateAsync("status", (settings: Record<string, unknown>) => settings.showCurrentGame = BoolSetting?.create({value: true}), 0);
        UI.showConfirmationModal("Reload Discord?", "To reenable the process monitor Discord needs to be reloaded.", {
            confirmText: "Reload",
            cancelText: "Later",
            onConfirm: () => window.location.reload()
        });
    }

    getSettingsPanel() {
        return this.buildSettingsPanel((_, id, value) => {
            if (id !== "stopProcessMonitor") return;
            if (value) return this.disableProcessMonitor();
            return this.enableProcessMonitor();
        });
    }
};
