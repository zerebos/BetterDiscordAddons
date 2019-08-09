
module.exports = (Plugin, Api) => {
    const {Patcher, WebpackModules, DiscordModules, PluginUtilities} = Api;

    const Flux = WebpackModules.getByProps("connectStores");
    const StatusStore = DiscordModules.UserStatusStore;

    return class StatusEverywhere extends Plugin {

        onStart() {
			PluginUtilities.addStyle(this.getName(), `.channels-Ie2l6A .avatar-3bWpYy { position: relative; }`);
            const Avatar = WebpackModules.getByProps("AnimatedAvatar");
            const original = Avatar.default;
            Patcher.after(Avatar, "default", (_, [props]) => {
                if (props.status || props.size.includes("100")) return;
                const id = props.src.split("/")[4];
                const fluxWrapper = Flux.connectStores([StatusStore], () => ({status: StatusStore.getStatus(id)}));
                return DiscordModules.React.createElement(fluxWrapper(({status}) => {
                    return DiscordModules.React.createElement(original, Object.assign({}, props, {status}));
                }));
            });
            Object.assign(Avatar.default, original);
        }

        onStop() {
            PluginUtilities.removeStyle(this.getName());
            Patcher.unpatchAll();
        }

    };
};