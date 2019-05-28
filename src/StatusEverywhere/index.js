
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities} = Api;

    const Flux = WebpackModules.getByProps("connectStores");
    const StatusStore = DiscordModules.UserStatusStore;

    return class StatusEverywhere extends Plugin {

        onStart() {
			PluginUtilities.addStyle(this.getName(), `.channels-Ie2l6A .avatar-3bWpYy { position: relative; }`);
            const Avatar = WebpackModules.getByProps("AvatarWrapper");
            const original = Avatar.default;
            Patcher.after(Avatar, "default", (_, args, returnValue) => {
                if (args[0].status) return;
                const props = args[0];
                const id = props.src.split("/")[4];
                const fluxWrapper = Flux.connectStores([StatusStore], () => ({status: StatusStore.getStatus(id)}));
                const wrappedStatus = fluxWrapper(({status}) => {
                    return DiscordModules.React.createElement(Avatar.AvatarStatusIcon, {
                        isTyping: false,
                        shouldAnimateTypingIndicator: false,
                        size: props.size,
                        status: status
                    });
                });
                returnValue.props.children[1] = DiscordModules.React.createElement(wrappedStatus);
            });
            Object.assign(Avatar.default, original);
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
            Patcher.unpatchAll();
        }

    };
};