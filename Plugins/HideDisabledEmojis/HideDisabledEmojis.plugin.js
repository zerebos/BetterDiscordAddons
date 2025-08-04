/**
 * @name HideDisabledEmojis
 * @description Hides disabled emojis from the emoji picker.
 * @version 0.1.0
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis
 * @source https://github.com/zerebos/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js
 */

/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

// why are we letting Zere, the braindead American let control BD when he can't even
// fucking read clearly documented and well known standards, such as __filename being
// the files full fucking path and not just the filename itself, IS IT REALLY SO HARD
// TO FUCKING READ?! https://nodejs.org/api/modules.html#modules_filename

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugins/HideDisabledEmojis/index.ts
var HideDisabledEmojis_exports = {};
__export(HideDisabledEmojis_exports, {
  default: () => HideDisabledEmojis
});
module.exports = __toCommonJS(HideDisabledEmojis_exports);

// src/common/plugin.ts
var Plugin = class {
  meta;
  manifest;
  settings;
  defaultSettings;
  LocaleManager;
  get strings() {
    if (!this.manifest.strings) return {};
    const locale = this.LocaleManager?.locale.split("-")[0] ?? "en";
    if (this.manifest.strings.hasOwnProperty(locale)) return this.manifest.strings[locale];
    if (this.manifest.strings.hasOwnProperty("en")) return this.manifest.strings.en;
    return this.manifest.strings;
  }
  constructor(meta, zplConfig) {
    this.meta = meta;
    this.manifest = zplConfig;
    if (typeof this.manifest.config !== "undefined") {
      this.defaultSettings = {};
      for (let s = 0; s < this.manifest.config.length; s++) {
        const current = this.manifest.config[s];
        if (current.type != "category") {
          this.defaultSettings[current.id] = current.value;
        } else {
          for (let si = 0; si < current.settings.length; si++) {
            const subCurrent = current.settings[si];
            this.defaultSettings[subCurrent.id] = subCurrent.value;
          }
        }
      }
      this.settings = BdApi.Utils.extend({}, this.defaultSettings);
    }
    const currentVersionInfo = BdApi.Data.load(this.meta.name, "version");
    if (currentVersionInfo !== this.meta.version) {
      this.#showChangelog();
      BdApi.Data.save(this.meta.name, "version", this.meta.version);
    }
    if (this.manifest.strings) this.LocaleManager = BdApi.Webpack.getByKeys("locale", "initialize");
    if (this.manifest.config && !this.getSettingsPanel) {
      this.getSettingsPanel = () => {
        this.#updateConfig();
        return BdApi.UI.buildSettingsPanel({
          onChange: (_, id, value) => {
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
    const changelog = {
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
    return BdApi.Utils.extend({}, this.defaultSettings ?? {}, BdApi.Data.load(this.meta.name, "settings"));
  }
  #updateConfig() {
    if (!this.manifest.config) return;
    for (const setting of this.manifest.config) {
      if (setting.type !== "category") {
        setting.value = this.settings[setting.id] ?? setting.value;
      } else {
        for (const subsetting of setting.settings) {
          subsetting.value = this.settings[subsetting.id] ?? subsetting.value;
        }
      }
    }
  }
  buildSettingsPanel(onChange) {
    this.#updateConfig();
    return BdApi.UI.buildSettingsPanel({
      onChange: (groupId, id, value) => {
        this.settings[id] = value;
        onChange?.(groupId, id, value);
        this.saveSettings();
      },
      settings: this.manifest.config
    });
  }
};

// src/plugins/HideDisabledEmojis/config.ts
var manifest = {
  info: {
    name: "HideDisabledEmojis",
    authors: [{
      name: "Zerebos",
      discord_id: "249746236008169473",
      github_username: "zerebos",
      twitter_username: "IAmZerebos"
    }],
    version: "0.1.0",
    description: "Hides disabled emojis from the emoji picker.",
    github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/HideDisabledEmojis",
    github_raw: "https://github.com/zerebos/BetterDiscordAddons/blob/master/Plugins/HideDisabledEmojis/HideDisabledEmojis.plugin.js"
  },
  changelog: [
    {
      title: "What's New?",
      type: "added",
      items: [
        "No longer dependent on ZeresPluginLibrary!"
      ]
    },
    {
      title: "Bugs Squashed",
      type: "fixed",
      items: [
        "Correctly hides emojis in the picker.",
        "Also hides categories in the sidebar that have no emojis available to be used.",
        "Hides other nitro promo in the emoji picker."
      ]
    }
  ],
  main: "index.ts"
};
var config_default = manifest;

// src/plugins/HideDisabledEmojis/index.ts
var { Patcher, Webpack, Logger, Utils } = BdApi;
var EmojiInfo = Webpack.getByKeys("isEmojiDisabled", "isEmojiFiltered");
var HideDisabledEmojis = class extends Plugin {
  constructor(meta) {
    super(meta, config_default);
  }
  async onStart() {
    if (!EmojiInfo) return Logger.error(this.meta.name, "Important modules needed not found");
    Patcher.after(this.meta.name, EmojiInfo, "isEmojiFiltered", (thisObject, methodArguments, returnValue) => {
      return returnValue || EmojiInfo.isEmojiDisabled(methodArguments[0]);
    });
    const [memoModule, key] = BdApi.Webpack.getWithKey(BdApi.Webpack.Filters.byStrings("topEmojis", "getDisambiguatedEmojiContext"));
    if (key && memoModule) {
      Patcher.before(this.meta.name, memoModule, key, (_, args) => {
        if (args[1] == null) {
          args[1] = {
            getGuildId: () => null
          };
        }
      });
    }
    const doFiltering = (props) => {
      props.rowCountBySection = props.rowCountBySection.filter((c, i) => c || props.collapsedSections.has(props.sectionDescriptors[i].sectionId));
      props.sectionDescriptors = props.sectionDescriptors.filter((s) => s.count || props.collapsedSections.has(s.sectionId));
      const wasFiltered = props.emojiGrid.filtered;
      props.emojiGrid = props.emojiGrid.filter((r) => r.length > 0);
      if (wasFiltered) props.emojiGrid.filtered = true;
    };
    const PickerWrapMemo = Webpack.getModule((m) => m?.type?.render?.toString?.()?.includes("EMOJI_PICKER_POPOUT"));
    if (!PickerWrapMemo) return;
    Patcher.after(this.meta.name, PickerWrapMemo.type, "render", (_, [inputProps], ret) => {
      const pickerChild = Utils.findInTree(ret, (m) => !!m?.props?.emojiGrid, { walkable: ["props", "children"] });
      if (!pickerChild?.type?.type) return;
      ret.props.children.props.page = "DM Channel";
      if (pickerChild.type.type.__patched) return;
      Patcher.before(this.meta.name, pickerChild.type, "type", (__, [props]) => {
        if (!props.rowCountBySection) return;
        if (props.emojiGrid.filtered) return doFiltering(props);
        props.emojiGrid.filtered = true;
        let row = 0;
        for (let s = 0; s < props.sectionDescriptors.length; s++) {
          const section = props.sectionDescriptors[s];
          const rowCount = props.rowCountBySection[s];
          const rowEnd = row + rowCount - 1;
          let countLeft = 0;
          let rowsLeft = 0;
          for (let r = row; r <= rowEnd; r++) {
            props.emojiGrid[r] = props.emojiGrid[r].filter((e) => {
              const hasDisabled = Object.hasOwn(e, "isDisabled");
              const isDisabled = !e.isDisabled;
              const typeCheck = e.type !== 1;
              const pickerCheck = inputProps?.pickerIntention !== 1;
              return hasDisabled && isDisabled && (typeCheck || pickerCheck);
            });
            const remaining = props.emojiGrid[r].length;
            if (remaining) {
              rowsLeft = rowsLeft + 1;
              countLeft = countLeft + remaining;
            }
          }
          section.count = countLeft;
          props.rowCountBySection[s] = rowsLeft;
          row = rowEnd + 1;
        }
        doFiltering(props);
      });
      pickerChild.type.type.__patched = true;
    });
    const [catModule, catKey] = BdApi.Webpack.getWithKey(BdApi.Webpack.Filters.byStrings("useEmojiCategories"));
    Patcher.after(this.meta.name, catModule, catKey, (_, [intention, channel], ret) => {
      return ret.filter((c) => c.type !== "GUILD" || !c.isNitroLocked && c.emojis?.some((e) => !EmojiInfo.isEmojiFiltered({ emoji: e, channel, intention })));
    });
  }
  onStop() {
    Patcher.unpatchAll(this.meta.name);
  }
};

/*@end@*/
