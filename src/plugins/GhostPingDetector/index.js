/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {DiscordModules, Logger, Patcher} = Api;

    const {MessageStore, UserStore, ImageResolver, ChannelStore, Dispatcher} = DiscordModules;

    return class GhostPingDetector extends Plugin {

        onStart() {
            Patcher.before(Dispatcher, "dispatch", (_, args) => {
                const event = args[0];
                if (!event || !event.type || event.type !== "MESSAGE_DELETE") return;
                const message = MessageStore.getMessage(event.channelId, event.id);
                if (!message) return false;
                if (message.mentioned) {
                    const user = UserStore.getUser(message.author.id);
                    const icon = ImageResolver.getUserAvatarURL(UserStore.getUser(user.id));
                    const channel = ChannelStore.getChannel(event.channelId);
                    const body = `New ghost ping by ${user.tag} in #${channel.name}.`;
                    const onclick = () => {Logger.info(message);};
                    const notification = new Notification("Ghost Ping", {body, icon, requireInteraction: true});
                    notification.onclick = onclick;
                }
                return false;
            });
        }
        
        onStop() {
            Patcher.unpatchAll();
        }
    };
};