/**
 * @name RoleMembers
 * @description Allows you to see the members of each role on a server.
 * @version 0.1.24
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/RoleMembers
 * @source https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js
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

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugins/RoleMembers/index.ts
var RoleMembers_exports = {};
__export(RoleMembers_exports, {
  default: () => RoleMembers
});
module.exports = __toCommonJS(RoleMembers_exports);

// src/common/plugin.ts
var Plugin = class {
  meta;
  manifest;
  settings;
  defaultSettings;
  LocaleManager;
  get strings() {
    if (!this.manifest.strings) return {};
    const locale = this.LocaleManager?.getLocale().split("-")[0] ?? "en";
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
    if (this.manifest.strings) this.LocaleManager = BdApi.Webpack.getModule((m) => m?.Messages && Object.keys(m?.Messages).length > 0);
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

// src/common/formatstring.ts
function formatString(stringToFormat, values) {
  for (const val in values) {
    let replacement = values[val];
    if (Array.isArray(replacement)) replacement = JSON.stringify(replacement);
    if (typeof replacement === "object" && replacement !== null) replacement = replacement.toString();
    stringToFormat = stringToFormat.replace(new RegExp(`{{${val}}}`, "g"), replacement.toString());
  }
  return stringToFormat;
}

// src/plugins/RoleMembers/config.ts
var manifest = {
  info: {
    name: "RoleMembers",
    authors: [{
      name: "Zerebos",
      discord_id: "249746236008169473",
      github_username: "zerebos",
      twitter_username: "IAmZerebos"
    }],
    version: "0.1.24",
    description: "Allows you to see the members of each role on a server.",
    github: "https://github.com/zerebos/BetterDiscordAddons/tree/master/Plugins/RoleMembers",
    github_raw: "https://raw.githubusercontent.com/zerebos/BetterDiscordAddons/master/Plugins/RoleMembers/RoleMembers.plugin.js"
  },
  changelog: [
    { title: "Hot Fix", type: "fixed", items: ["The settings panel will now reflect your actual settings!"] }
  ],
  config: [
    {
      type: "switch",
      id: "showCounts",
      name: "Show Member Counts",
      note: "Enabling this shows the members counts of each role in the context menu",
      value: false
    }
  ],
  main: "index.ts"
};
var config_default = manifest;

// src/plugins/RoleMembers/popout.html
var popout_default = '<div class="theme-dark layer_cd0de5" style="z-index: 100">\n<div class="animatorBottom_f88ae3 translate_f88ae3 didRender_f88ae3 popout-role-members" style="margin-top: 0;">\n    <div class="container_ac201b selectFilterPopout_cfe282 elevationBorderHigh_ff8688 scroller_ac201b role-members-popout">\n        <div class="searchWithScrollbar_eef3ef container_c18ec9 medium_c18ec9">\n            <div class="inner_c18ec9">\n                <input class="input_c18ec9" placeholder="Search Members \u2014 {{memberCount}}" value="">\n                <div tabindex="0" class="iconLayout_c18ec9 medium_c18ec9" role="button">\n                    <div class="iconContainer_c18ec9">\n                        <svg name="Search" class="icon_c18ec9 visible_c18ec9" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div>\n            <div class="list_eef3ef list_ac201b scroller_eef3ef thin_eed6a8 scrollerBase_eed6a8 role-members" dir="ltr" style="overflow: hidden scroll; padding-right: 0px; max-height: 400px;">\n                \n            </div>\n        </div>\n    </div>\n</div>\n</div>';

// src/plugins/RoleMembers/item.html
var item_default = '<div class="item_eef3ef role-member">\n    <div class="itemCheckbox_eef3ef">\n        <div class="wrapper_c51b4e avatar_cfe282" role="img" aria-hidden="false" style="width: 32px; height: 32px;">\n            <svg width="40" height="32" viewBox="0 0 40 32" class="mask_c51b4e svg_c51b4e" aria-hidden="true">\n                <foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-default)">\n                        <div class="avatarStack_c51b4e">\n                            <img src="{{avatar_url}}" alt=" " class="avatar_c51b4e" aria-hidden="true">\n                        </div>\n                </foreignObject>\n            </svg>\n        </div>\n    </div>\n    <div class="itemLabel_eef3ef">\n        <span class="defaultColor_a595eb text-sm/normal_dc00ef username">{{username}}</span>\n    </div>\n</div>';

// src/plugins/RoleMembers/index.ts
var { DOM, ContextMenu, Patcher, Webpack, UI, Utils } = BdApi;
var from = (arr) => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({ [k]: v })));
var filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {
  return predicate(o[1]);
}));
var SelectedGuildStore = BdApi.Webpack.getStore("SelectedGuildStore");
var GuildStore = BdApi.Webpack.getStore("GuildStore");
var GuildMemberStore = BdApi.Webpack.getStore("GuildMemberStore");
var UserStore = BdApi.Webpack.getStore("UserStore");
var ImageResolver = BdApi.Webpack.getByKeys("getUserAvatarURL", "getEmojiURL");
var LayerClasses = BdApi.Webpack.getByKeys("layerContainer");
var getRoles = (guild) => guild?.roles ?? GuildStore?.getRoles(guild?.id);
var RoleMembers = class extends Plugin {
  constructor(meta) {
    super(meta, config_default);
  }
  onStart() {
    this.patchRoleMention();
    this.patchGuildContextMenu();
  }
  onStop() {
    const elements = document.querySelectorAll(".popout-role-members");
    for (const el of elements) el?.remove();
    Patcher.unpatchAll(this.meta.name);
    this.contextMenuPatch?.();
  }
  patchRoleMention() {
    const Pill = Webpack.getModule(Webpack.Filters.byStrings("interactive", "iconType"), { defaultExport: false });
    Patcher.before(this.meta.name, Pill, "Z", (_, [props]) => {
      if (!props?.className?.toLowerCase().includes("rolemention")) return;
      props.className += ` interactive`;
      props.onClick = (e) => {
        const roles = getRoles({ id: SelectedGuildStore.getGuildId() });
        const name = props.children[1][0].slice(1);
        const filtered = filter(roles, (r) => r.name == name);
        if (!filtered) return;
        const role = filtered[Object.keys(filtered)[0]];
        this.showRolePopout(e.nativeEvent.target, SelectedGuildStore.getGuildId(), role.id);
      };
    });
  }
  patchGuildContextMenu() {
    this.contextMenuPatch = ContextMenu.patch("guild-context", (retVal, props) => {
      const guild = props.guild;
      const guildId = guild.id;
      const roles = getRoles(guild);
      const roleItems = [];
      for (const roleId in roles) {
        const role = roles[roleId];
        let label = role.name;
        if (this.settings.showCounts) {
          let members = GuildMemberStore.getMembers(guildId);
          if (guildId != roleId) members = members.filter((m) => m.roles.includes(role.id));
          label = `${label} (${members.length})`;
        }
        const item = ContextMenu.buildItem({
          id: roleId,
          label,
          style: { color: role.colorString ? role.colorString : "" },
          closeOnClick: false,
          action: (e) => {
            if (e.ctrlKey) {
              try {
                DiscordNative.clipboard.copy(role.id);
                UI.showToast("Copied Role ID to clipboard!", { type: "success" });
              } catch {
                UI.showToast("Could not copy Role ID to clipboard", { type: "success" });
              }
            } else {
              this.showRolePopout({
                getBoundingClientRect() {
                  return {
                    top: e.pageY,
                    bottom: e.pageY,
                    left: e.pageX,
                    right: e.pageX
                  };
                }
              }, guildId, role.id);
            }
          }
        });
        roleItems.push(item);
      }
      const newOne = ContextMenu.buildItem({ type: "submenu", label: "Role Members", children: roleItems });
      const separatorIndex = retVal.props?.children?.findIndex((k) => !k?.props?.label);
      const insertIndex = separatorIndex && separatorIndex > 0 ? separatorIndex + 1 : 1;
      retVal.props?.children?.splice(insertIndex, 0, newOne);
    });
  }
  showRolePopout(target, guildId, roleId) {
    const roles = getRoles({ id: guildId });
    if (!roles) return;
    const role = roles[roleId];
    let members = GuildMemberStore.getMembers(guildId);
    if (guildId != roleId) members = members.filter((m) => m.roles.includes(role.id));
    const popout = DOM.parseHTML(formatString(popout_default, { memberCount: members.length.toString() }));
    const searchInput = popout.querySelector("input");
    searchInput.addEventListener("keyup", () => {
      const items = popout.querySelectorAll(".role-member");
      for (let i = 0, len = items.length; i < len; i++) {
        const search = searchInput.value.toLowerCase();
        const item = items[i];
        const username = item.querySelector(".username").textContent.toLowerCase();
        if (!username.includes(search)) item.style.display = "none";
        else item.style.display = "";
      }
    });
    const scroller = popout.querySelector(".role-members");
    for (const member of members) {
      const user = UserStore.getUser(member.userId);
      const elem = DOM.parseHTML(formatString(item_default, { username: Utils.escapeHTML(user.username), avatar_url: ImageResolver.getUserAvatarURL(user) }));
      elem.addEventListener("click", () => {
        UI.showToast("Sorry, user popouts are currently broken!", { type: "error" });
      });
      scroller.append(elem);
    }
    this.showPopout(popout, target);
    searchInput.focus();
  }
  showPopout(popout, relativeTarget) {
    if (this.listener) this.listener(null);
    document.querySelector(`[class*="app_"] ~ .${LayerClasses?.layerContainer ?? "layerContainer_cd0de5"}`)?.append(popout);
    const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const offset = relativeTarget.getBoundingClientRect();
    if (offset.right + popout.offsetHeight >= maxWidth) {
      popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
      const original = Math.round(offset.left - popout.offsetWidth - 20);
      const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
      DOM.animate(function(progress) {
        let value = 0;
        if (endPoint > original) value = original + progress * (endPoint - original);
        else value = original - progress * (original - endPoint);
        popout.style.left = value + "px";
      }, 100);
    } else {
      popout.style.left = offset.right + 10 + "px";
      const original = offset.right + 10;
      const endPoint = offset.right;
      DOM.animate(function(progress) {
        let value = 0;
        if (endPoint > original) value = original + progress * (endPoint - original);
        else value = original - progress * (original - endPoint);
        popout.style.left = value + "px";
      }, 100);
    }
    if (offset.top + popout.offsetHeight >= maxHeight) popout.style.top = Math.round(maxHeight - popout.offsetHeight) + "px";
    else popout.style.top = offset.top + "px";
    this.listener = (e) => {
      const target = e?.target;
      if (!target || !target?.classList?.contains("popout-role-members") && !target?.closest(".popout-role-members")) {
        popout.remove();
        document.removeEventListener("click", this.listener);
        delete this.listener;
      }
    };
    setTimeout(() => document.addEventListener("click", this.listener), 500);
  }
};

/*@end@*/
