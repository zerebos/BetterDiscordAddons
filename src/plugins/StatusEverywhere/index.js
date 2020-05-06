
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities, Utilities, Popouts} = Api;

    const Flux = WebpackModules.getByProps("connectStores");
    const StatusStore = DiscordModules.UserStatusStore;

    return class StatusEverywhere extends Plugin {

        onStart() {
			PluginUtilities.addStyle(this.getName(), `.message-2qnXI6 .avatar-1BDn8e { overflow: visible; position: absolute; }`);
            const Avatar = WebpackModules.getByProps("AnimatedAvatar");
            const original = Avatar.default;
            Patcher.after(Avatar, "default", (_, [props]) => {
                if (props.status || props.size.includes("100")) return;
                const id = props.src.split("/")[4];
                const size = props.size.includes("128") ? Avatar.Sizes.SIZE_120 : props.size;
                const fluxWrapper = Flux.connectStores([StatusStore], () => ({status: StatusStore.getStatus(id)}));
                return DiscordModules.React.createElement(fluxWrapper(({status}) => {
                    return DiscordModules.React.createElement(original, Object.assign({}, props, {status, size}));
                }));
            });
            Object.assign(Avatar.default, original);

            const MessageHeader = WebpackModules.getByProps("MessageTimestamp");
            Patcher.after(MessageHeader, "default", (_, __, returnValue) => {
                const AvatarComponent = Utilities.getNestedProp(returnValue, "props.children.0");
                if (!AvatarComponent || !AvatarComponent.props || !AvatarComponent.props.renderPopout) return;
                const renderer = Utilities.getNestedProp(AvatarComponent, "props.children");
                if (!renderer || typeof(renderer) !== "function" || renderer.__patched) return;
                AvatarComponent.props.children = function() {
                    const rv = renderer(...arguments);
                    if (rv.type !== "img") return rv;
                    const id = rv.props.src.split("/")[4];
                    return DiscordModules.React.createElement(Avatar.default, Object.assign({}, rv.props, {size: Avatar.Sizes.SIZE_40, onClick: (event) => {
                        Popouts.showUserPopout(event.target, DiscordModules.UserStore.getUser(id));
                    }}));
                };
                AvatarComponent.props.children.__patched = true;
            });
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
            Patcher.unpatchAll();
        }

    };
};