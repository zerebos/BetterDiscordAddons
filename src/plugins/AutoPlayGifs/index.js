
module.exports = (Plugin, Api) => {
    const {WebpackModules, DiscordModules, Patcher, ReactComponents, Utilities} = Api;

    return class AutoPlayGifs extends Plugin {
        constructor() {
            super();
            this.cancelChatAvatars = () => {};
            this.cancelMemberListAvatars = () => {};
            this.cancelGuildList = () => {};
            this.cancelActivityStatus = () => {};
        }

        onStart() {
            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            if (this.settings.chat) this.patchChatAvatars();
            if (this.settings.memberList) this.patchMemberListAvatars();
            if (this.settings.guildList) this.patchGuildList(this.promises.state);
            if (this.settings.activityStatus) this.patchActivityStatus();
        }

        onStop() {
            this.cancelChatAvatars();
            this.cancelMemberListAvatars();
            this.cancelGuildList();
            this.cancelActivityStatus();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, value) => {
                if (id == "chat") {
                    if (value) this.patchChatAvatars();
                    else this.cancelChatAvatars();
                }
                if (id == "memberList") {
                    if (value) this.patchMemberListAvatars();
                    else this.cancelMemberListAvatars();
                }
                if (id == "guildList") {
                    if (value) this.patchGuildList();
                    else this.cancelGuildList();
                }
                if (id == "activityStatus") {
                    if (value) this.patchActivityStatus();
                    else this.cancelActivityStatus();
                }
            });
            return panel.getElement();
        }

        async patchGuildList(promiseState) {
            const Guild = await ReactComponents.getComponentByName("Guild", ".listItem-2P_4kh");
            if (promiseState.cancelled) return;
            this.cancelGuildList = Patcher.after(Guild.component.prototype, "render", (thisObject, args, returnValue) => {
                if (!thisObject.props.animatable) return;
                const iconComponent = Utilities.findInReactTree(returnValue, p => p.icon);
                if (!iconComponent) return;
                iconComponent.icon = thisObject.props.guild.getIconURL("gif");
            });
            Guild.forceUpdateAll();
        }

        patchChatAvatars() {
            const MessageHeader = WebpackModules.getByProps("MessageTimestamp");
            this.cancelChatAvatars = Patcher.after(MessageHeader, "default", (_, __, returnValue) => {
                const AvatarComponent = Utilities.getNestedProp(returnValue, "props.children.0");
                if (!AvatarComponent || !AvatarComponent.props || !AvatarComponent.props.renderPopout) return;
                const renderer = Utilities.getNestedProp(AvatarComponent, "props.children");
                if (!renderer || typeof(renderer) !== "function" || renderer.__patchedAPG) return;
                AvatarComponent.props.children = function() {
                    const rv = renderer(...arguments);
                    const id = rv.props.src.split("/")[4];
                    const hasAnimatedAvatar = DiscordModules.ImageResolver.hasAnimatedAvatar(DiscordModules.UserStore.getUser(id));
                    if (!hasAnimatedAvatar) return rv;
                    rv.props.src = DiscordModules.ImageResolver.getUserAvatarURL(DiscordModules.UserStore.getUser(id)).replace("webp", "gif");
                    return rv;
                };
                AvatarComponent.props.children.__patchedAPG = true;
            });
        }

        patchMemberListAvatars() {
            const MemberList = WebpackModules.findByDisplayName("MemberListItem");
            this.cancelMemberListAvatars = Patcher.before(MemberList.prototype, "render", (thisObject) => {
                if (!thisObject.props.user) return;
                const id = thisObject.props.user.id;
                const hasAnimatedAvatar = DiscordModules.ImageResolver.hasAnimatedAvatar(DiscordModules.UserStore.getUser(id));
                if (!hasAnimatedAvatar) return;
                thisObject.props.user.getAvatarURL = () => {return DiscordModules.ImageResolver.getUserAvatarURL(DiscordModules.UserStore.getUser(id)).replace("webp", "gif");};
            });
        }

        patchActivityStatus() {
            const ActivityStatus = WebpackModules.getByProps("ActivityEmoji");
            this.cancelActivityStatus = Patcher.before(ActivityStatus, "default", (_, [props]) => {
                if (!props) return;
                props.animate = true;
            });
        }

    };
};