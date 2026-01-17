import type {ReactElement} from "react";
import type {Changelog, Manifest} from "@betterdiscord/manifest";
import type {Meta} from "@betterdiscord/meta";


interface Settings {
    [key: string]: unknown;
}

export default class Plugin {
    meta: Meta;
    manifest: Manifest;
    settings: Settings;
    defaultSettings: Settings;
    onStart?(): void;
    onStop?(): void;
    LocaleManager?: {locale: string;};
    getSettingsPanel?(): ReactElement;
    observer?(mutation: MutationRecord): void;

    get strings() {
        if (!this.manifest.strings) return {};
        const locale = this.LocaleManager?.locale.split("-")[0] ?? "en";
        if (this.manifest.strings.hasOwnProperty(locale)) return this.manifest.strings[locale];
        if (this.manifest.strings.hasOwnProperty("en")) return this.manifest.strings.en;
        return this.manifest.strings;
    }

    constructor(meta: Meta, zplConfig: Manifest) {
        this.meta = meta;
        this.manifest = zplConfig;

        // Build the settings model from the default if it exists
        if (typeof this.manifest.config !== "undefined") {
            this.defaultSettings = {};
            for (let s = 0; s < this.manifest.config.length; s++) {
                const current = this.manifest.config[s];
                if (current.type != "category") {
                    this.defaultSettings[current.id] = current.value;
                }
                else {
                    for (let si = 0; si < current.settings.length; si++) {
                        const subCurrent = current.settings[si];
                        this.defaultSettings[subCurrent.id] = subCurrent.value;
                    }
                }
            }

            // Clone the default settings to the current ones
            this.settings = BdApi.Utils.extend({}, this.defaultSettings) as Settings;
        }

        // Load previously stored info to check if changelog is needed then check for update
        const currentVersionInfo = BdApi.Data.load<string>(this.meta.name, "version");
        if (currentVersionInfo !== this.meta.version) {
            this.#showChangelog();
            BdApi.Data.save(this.meta.name, "version", this.meta.version);
        }

        // Only grab the localemanager for plugins that have string localization
        if (this.manifest.strings) this.LocaleManager = BdApi.Webpack.getByKeys("locale", "initialize");

        // Automatically build settings panel if config found
        if (this.manifest.config && !this.getSettingsPanel) {
            this.getSettingsPanel = () => {
                this.#updateConfig();
                return BdApi.UI.buildSettingsPanel({
                    onChange: (_: string, id: string, value: unknown) => {
                        this.settings[id] = value;
                        this.saveSettings();
                    },
                    settings: this.manifest.config
                });
            };
        }
    }

    async start() {
        BdApi.Logger.info(this.meta.name, `version ${this.meta.version} has started.`);
        if (this.defaultSettings) this.settings = this.loadSettings();
        if (typeof this.onStart == "function") this.onStart();
    }

    stop() {
        BdApi.Logger.info(this.meta.name, `version ${this.meta.version} has stopped.`);
        if (typeof this.onStop == "function") this.onStop();
    }

    #showChangelog() {
        if (typeof this.manifest.changelog == "undefined") return;
        const changelog: Partial<Changelog> = {
            title: this.meta.name + " Changelog",
            subtitle: `v${this.meta.version}`,
            changes: []
        };
        if (!Array.isArray(this.manifest.changelog)) Object.assign(changelog, this.manifest.changelog);
        else changelog.changes = this.manifest.changelog;
        BdApi.UI.showChangelogModal(changelog);
    }

    saveSettings() {
        BdApi.Data.save(this.meta.name, "settings", this.settings);
    }

    loadSettings() {
        return BdApi.Utils.extend({}, this.defaultSettings ?? {}, BdApi.Data.load(this.meta.name, "settings")) as Settings;
    }

    #updateConfig() {
        if (!this.manifest.config) return;

        for (const setting of this.manifest.config) {
            if (setting.type !== "category") {
                setting.value = this.settings[setting.id] ?? setting.value;
            }
            else {
                for (const subsetting of setting.settings) {
                    subsetting.value = this.settings[subsetting.id] ?? subsetting.value;
                }
            }
        }
    }

    buildSettingsPanel(onChange?: (groupId: string, settingId: string, value: unknown) => void): ReactElement {
        this.#updateConfig();

        return BdApi.UI.buildSettingsPanel({
            onChange: (groupId: string, id: string, value: unknown) => {
                this.settings[id] = value;
                onChange?.(groupId, id, value);
                this.saveSettings();
            },
            settings: this.manifest.config
        });
    }
}