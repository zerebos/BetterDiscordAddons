import type {FunctionComponent, MouseEvent as ReactMouseEvent, ReactElement} from "react";

import type {Meta} from "@betterdiscord/meta";

import Plugin from "@common/plugin";

import Config from "./config";
import type {GuildRole, User} from "@discord";

import UserSearchPopout from "./UserSearchPopout.svelte";
import {mount} from "svelte";
import type {ImageResolver, UserModalOpener} from "@discord/modules";


const {DOM, ContextMenu, Patcher, Webpack, UI} = BdApi;

// @ts-expect-error Object.assign indeed has a rest parameter version, however it refuses to select it
const from = (arr: [string, unknown][]) => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
const filter = <T extends Record<string, unknown>>(obj: T, predicate: (o: unknown) => boolean) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

const SelectedGuildStore = BdApi.Webpack.Stores.SelectedGuildStore;
// const GuildStore = BdApi.Webpack.getStore<{getRoles(id: string): Record<string, Role>}>("GuildStore");
const GuildMemberStore = BdApi.Webpack.Stores.GuildMemberStore;
const GuildRoleStore = BdApi.Webpack.Stores.GuildRoleStore;
const UserStore = BdApi.Webpack.Stores.UserStore;
const Images = BdApi.Webpack.getByKeys<ImageResolver>("getUserAvatarURL", "getEmojiURL");
const UserModals = BdApi.Webpack.getByKeys<UserModalOpener>("openUserProfileModal");

type ClassModule = Record<string, string>;

const LayerClasses = BdApi.Webpack.getByKeys<ClassModule>("layerContainer");

const getRoles = (guild: {roles?: Record<string, GuildRole>; id: string;}): Record<string, GuildRole> | undefined => guild?.roles ?? GuildRoleStore?.getRolesSnapshot(guild?.id);

const UserProfileWrapperComponent = BdApi.Webpack.getByStrings<FunctionComponent<{currentUser: User; user: User; guildId: string;}>>("onClickContainer:", "user:", ".isNonUserBot()?");

function openUserPopout(event: MouseEvent, userId: string, guildId: string) {
    if (!UserProfileWrapperComponent) {
        UI.showToast("User popouts are currently not supported in this version of Discord.", {type: "error"});
        UserModals!.openUserProfileModal({userId});
        return;
    }

    const rendered = BdApi.React.createElement(UserProfileWrapperComponent, {
        currentUser: BdApi.Webpack.Stores.UserStore.getCurrentUser()!,
        user: BdApi.Webpack.Stores.UserStore.getUser(userId)!,
        guildId: guildId
    });

    return BdApi.ContextMenu.open(event, () => rendered, {noBlurEvent: true});
}

interface OffsetRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width?: number;
    height?: number;
}

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
            if (!props?.className?.toLowerCase?.()?.includes?.("rolemention")) return;
            if (props.className.toLowerCase().includes("interactive")) return; // Already patched
            props.className += ` interactive`;
            props.onClick = (e: ReactMouseEvent<HTMLElement>) => {
                const roles = getRoles({id: SelectedGuildStore!.getGuildId()!});
                const name = props.children[1][0].props.children.slice(1) as string;
                const filtered = filter(roles!, (r: GuildRole) => r.name == name) as Record<string, GuildRole>;
                if (!filtered) return;
                const role = filtered[Object.keys(filtered)[0]];
                this.showSveltePopout(e.nativeEvent, SelectedGuildStore!.getGuildId()!, role.id, e.currentTarget.getBoundingClientRect());
            };
        });
    }

    patchGuildContextMenu() {
        this.contextMenuPatch = ContextMenu.patch("guild-context", (retVal: ReactElement<{children?: ReactElement<{label?: string;}>[];}>, props) => {
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
                    label: () => BdApi.React.createElement("span", {style: {color: role.colorStrings?.primaryColor ? role.colorStrings.primaryColor : ""}}, label),
                    // dontCloseOnAction: true,
                    action: (e: ReactMouseEvent<HTMLElement>) => {
                        e.currentTarget = e.target as HTMLElement; // Fixes incorrect target typing

                        if (e.ctrlKey) {
                            try {
                                DiscordNative.clipboard.copy(role.id);
                                UI.showToast("Copied Role ID to clipboard!", {type: "success"});
                            }
                            catch {
                                UI.showToast("Could not copy Role ID to clipboard", {type: "error"});
                            }
                        }
                        else {
                            this.showSveltePopout(e.nativeEvent, guildId, role.id, {top: e.pageY, bottom: e.pageY, left: e.pageX, right: e.pageX});
                        }
                    }
                });
                roleItems.push(item);
            }

            const newOne = ContextMenu.buildItem({type: "submenu", label: "Role Members", children: roleItems}) as ReactElement<{type: string, label: string, children: ReactElement[];}>;

            const separatorIndex = retVal.props?.children?.findIndex(k => !k?.props?.label);
            const insertIndex = separatorIndex && separatorIndex > 0 ? separatorIndex + 1 : 1;
            retVal.props?.children?.splice(insertIndex, 0, newOne);
            // return original;

        });
    }

    showSveltePopout(event: MouseEvent, guildId: string, roleId: string, offset: OffsetRect) {
        const roles = getRoles({id: guildId});
        if (!roles) return;
        const role = roles[roleId];
        let members = GuildMemberStore!.getMembers(guildId);
        if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));

        const svelteMountContainer = document.createElement("div");
        svelteMountContainer.style.position = "fixed";
        svelteMountContainer.style.pointerEvents = "all";
        mount(UserSearchPopout, {
            target: svelteMountContainer,
            props: {
                onItemClick: (ev, user) => openUserPopout(ev, user.id, guildId),
                users: members.map(m => {
                    const user = UserStore.getUser(m.userId)!;
                    return {
                        id: m.userId,
                        avatar: Images!.getUserAvatarURL(user),
                        name: user.username,
                        color: m.colorStrings?.primaryColor ? m.colorStrings.primaryColor : undefined
                    };
                })
            }
        });

        // BdApi.ContextMenu.open(event, () => BdApi.React.createElement(BdApi.ReactUtils.wrapElement(svelteMountContainer)), {noBlurEvent: true});

        this.showPopout(svelteMountContainer, offset);
    }

    showPopout(popout: HTMLElement, offset: OffsetRect) {
        if (this.listener) this.listener(null); // Close any previous popouts

        const layerContainers = document.querySelectorAll(`[class*="-app"] ~ .${LayerClasses?.layerContainer ?? "_59d0d7075b521375-layerContainer"}`);
        const firstLayerContainer = layerContainers[0];
        if (!firstLayerContainer) return;
        // const lastLayerContainer = layerContainers[layerContainers.length - 1];
        firstLayerContainer.appendChild(popout);

        const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (offset.right + popout.offsetHeight >= maxWidth) {
            popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
            const original = Math.round(offset.left - popout.offsetWidth - 20);
            const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
            DOM.animate(function (progress) {
                let value = 0;
                if (endPoint > original) value = original + (progress * (endPoint - original));
                else value = original - (progress * (original - endPoint));
                popout.style.left = value + "px";
            }, 100);
        }
        else {
            popout.style.left = (offset.right + 10) + "px";
            const original = offset.right + 10;
            const endPoint = offset.right;
            DOM.animate(function (progress) {
                let value = 0;
                if (endPoint > original) value = original + (progress * (endPoint - original));
                else value = original - (progress * (original - endPoint));
                popout.style.left = value + "px";
            }, 100);
        }

        if (offset.top + popout.offsetHeight >= maxHeight) popout.style.top = Math.round(maxHeight - popout.offsetHeight) + "px";
        else popout.style.top = offset.top + "px";

        this.listener = (e) => {
            const target = e?.target as HTMLElement | null;
            if (target?.classList.value.includes("trapClicks")) return; // User popout is open
            if (!target || (!target?.classList?.contains("popout-role-members") && !target?.closest(".popout-role-members"))) {
                popout.remove();
                document.removeEventListener("click", this.listener!);
                delete this.listener;
            }
        };
        setTimeout(() => document.addEventListener("click", this.listener!), 500);
    }
};