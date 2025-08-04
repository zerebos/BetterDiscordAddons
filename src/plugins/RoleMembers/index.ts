import {ReactElement, SyntheticEvent} from "react";

import {Meta} from "@betterdiscord/meta";

import Plugin from "@common/plugin";
import formatString from "@common/formatstring";

import Config from "./config";
import popoutHTML from "./popout.html";
import itemHTML from "./item.html"; 


const {DOM, ContextMenu, Patcher, Webpack, UI, Utils} = BdApi;

// @ts-expect-error Object.assign indeed has a rest parameter version, however it refuses to select it
const from = (arr: [string, unknown][]) => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
const filter = <T extends Record<string, unknown>>(obj: T, predicate: (o: unknown) => boolean) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

const SelectedGuildStore = BdApi.Webpack.getStore<{getGuildId(): string}>("SelectedGuildStore");
const GuildStore = BdApi.Webpack.getStore<{getRoles(id: string): Record<string, Role>}>("GuildStore");
const GuildMemberStore = BdApi.Webpack.getStore<{getMembers(id: string): {userId: string; roles: string[]}[]}>("GuildMemberStore");
const UserStore = BdApi.Webpack.getStore<{getUser(id: string): {username: string}}>("UserStore");
const ImageResolver = BdApi.Webpack.getByKeys<{getUserAvatarURL(user: object): string}>("getUserAvatarURL", "getEmojiURL");

type ClassModule = Record<string, string>;

const LayerClasses = BdApi.Webpack.getByKeys<ClassModule>("layerContainer");

interface Role {
    id: string;
    name: string;
    colorString: string;
}
const getRoles = (guild: {roles?: Record<string, Role>; id: string}): Record<string, Role> | undefined => guild?.roles ?? GuildStore?.getRoles(guild?.id);

export default class RoleMembers extends Plugin {
    constructor(meta: Meta) {
        super(meta, Config);
    }

    contextMenuPatch?(): void;
    listener?(e: MouseEvent | null): void;

    onStart() {
        this.patchRoleMention(); // <@&367344340231782410>
        this.patchGuildContextMenu();
    }

    onStop() {
        const elements = document.querySelectorAll(".popout-role-members");
        for (const el of elements) el?.remove();
        Patcher.unpatchAll(this.meta.name);
        this.contextMenuPatch?.();
    }

    patchRoleMention() {
        const Pill = Webpack.getModule(Webpack.Filters.byStrings("interactive", "iconType"), {defaultExport: false});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Patcher.before(this.meta.name, Pill, "Z" as keyof typeof Pill, (_, [props]: [Record<string, any>]) => {
            if (!props?.className?.toLowerCase().includes("rolemention")) return;
            props.className += ` interactive`;
            props.onClick = (e: SyntheticEvent<MouseEvent>) => {
                const roles = getRoles({id: SelectedGuildStore!.getGuildId()});
                const name = props.children[1][0].slice(1);
                const filtered = filter(roles!, (r: Role) => r.name == name) as Record<string, Role>;
                if (!filtered) return;
                const role = filtered[Object.keys(filtered)[0]];
                this.showRolePopout(e.nativeEvent.target as HTMLSpanElement, SelectedGuildStore!.getGuildId(), role.id);
            };
        });
    }

    patchGuildContextMenu() {
        this.contextMenuPatch = ContextMenu.patch("guild-context", (retVal: ReactElement<{children?: ReactElement<{label?: string}>[]}>, props) => {
            const guild = props.guild;
            const guildId = guild.id;
            const roles = getRoles(guild);
            const roleItems = [];

            for (const roleId in roles) {
                const role = roles[roleId];
                let label = role.name;
                if (this.settings.showCounts) {
                    let members = GuildMemberStore!.getMembers(guildId);
                    if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
                    label = `${label} (${members.length})`;
                }
                const item = ContextMenu.buildItem({
                    id: roleId,
                    label: label,
                    style: {color: role.colorString ? role.colorString : ""},
                    closeOnClick: false,
                    action: (e: MouseEvent) => {
                        if (e.ctrlKey) {
                            try {
                                DiscordNative.clipboard.copy(role.id);
                                UI.showToast("Copied Role ID to clipboard!", {type: "success"});
                            }
                            catch {
                                UI.showToast("Could not copy Role ID to clipboard", {type: "success"});
                            }
                        }
                        else {
                            this.showRolePopout({
                                getBoundingClientRect() {
                                    return {
                                        top: e.pageY,
                                        bottom: e.pageY,
                                        left: e.pageX,
                                        right: e.pageX
                                    } as DOMRect;
                                }
                            }, guildId, role.id);
                        }
                    }
                });
                roleItems.push(item);
            }

            const newOne = ContextMenu.buildItem({type: "submenu", label: "Role Members", children: roleItems}) as ReactElement<{type: string, label: string, children: ReactElement[]}>;

            const separatorIndex = retVal.props?.children?.findIndex(k => !k?.props?.label);
            const insertIndex = separatorIndex && separatorIndex > 0 ? separatorIndex + 1 : 1;
            retVal.props?.children?.splice(insertIndex, 0, newOne);
            // return original;

        });
    }

    showRolePopout(target: HTMLElement | {getBoundingClientRect(): DOMRect}, guildId: string, roleId: string) {
        const roles = getRoles({id: guildId});
        if (!roles) return;
        const role = roles[roleId];
        let members = GuildMemberStore!.getMembers(guildId);
        if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

        const popout = DOM.parseHTML(formatString(popoutHTML, {memberCount: members.length.toString()})) as HTMLElement;
        const searchInput = popout.querySelector("input") as HTMLInputElement;
        searchInput.addEventListener("keyup", () => {
            const items = popout.querySelectorAll(".role-member");
            for (let i = 0, len = items.length; i < len; i++) {
                const search = searchInput.value.toLowerCase();
                const item = items[i] as HTMLDivElement;
                const username = (item.querySelector(".username") as HTMLSpanElement).textContent!.toLowerCase();
                if (!username.includes(search)) item.style.display = "none";
                else item.style.display = "";
            }
        });

        const scroller = popout.querySelector(".role-members") as HTMLDivElement;
        for (const member of members) {
            const user = UserStore!.getUser(member.userId);
            const elem = DOM.parseHTML(formatString(itemHTML, {username: Utils.escapeHTML(user.username), avatar_url: ImageResolver!.getUserAvatarURL(user)})) as HTMLDivElement;
            elem.addEventListener("click", () => {
                UI.showToast("Sorry, user popouts are currently broken!", {type: "error"});
                // setTimeout(() => Popouts.showUserPopout(elem, user, {guild: guildId}), 1);
            });
            scroller.append(elem);
        }

        this.showPopout(popout, target);
        searchInput.focus();
    }

    showPopout(popout: HTMLElement, relativeTarget: HTMLElement | {getBoundingClientRect(): DOMRect}) {
        if (this.listener) this.listener(null); // Close any previous popouts
        
        document.querySelector(`[class*="app_"] ~ .${LayerClasses?.layerContainer ?? "layerContainer_cd0de5"}`)?.append(popout);

        const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        const offset = relativeTarget.getBoundingClientRect();
        if (offset.right + popout.offsetHeight >= maxWidth) {
            // popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
            popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
            // popout.animate({left: Math.round(offset.left - popout.offsetWidth - 10)}, 100);
            const original = Math.round(offset.left - popout.offsetWidth - 20);
            const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
            DOM.animate(function(progress) {
                    let value = 0;
                    if (endPoint > original) value = original + (progress * (endPoint - original));
                    else value = original - (progress * (original - endPoint));
                    popout.style.left = value + "px";
            }, 100);
        }
        else {
            // popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
            popout.style.left = (offset.right + 10) + "px";
            // popout.animate({left: offset.right}, 100);
            const original = offset.right + 10;
            const endPoint = offset.right;
            DOM.animate(function(progress) {
                    let value = 0;
                    if (endPoint > original) value = original + (progress * (endPoint - original));
                    else value = original - (progress * (original - endPoint));
                    popout.style.left = value + "px";
            }, 100);
        }

        if (offset.top + popout.offsetHeight >= maxHeight) popout.style.top = Math.round(maxHeight - popout.offsetHeight) + "px";
        else popout.style.top = offset.top + "px";

        this.listener = (e) => {
            const target = e?.target;
            if (!target || (!(target as HTMLElement)?.classList?.contains("popout-role-members") && !(target as HTMLElement)?.closest(".popout-role-members"))) {
                popout.remove();
                document.removeEventListener("click", this.listener!);
                delete this.listener;
            }
        };
        setTimeout(() => document.addEventListener("click", this.listener!), 500);
    }
};