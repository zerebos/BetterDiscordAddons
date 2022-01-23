
module.exports = (Plugin, Api) => {
    const {WebpackModules, DiscordModules, Patcher} = Api;

    return class AutoPlayGifs extends Plugin {

        onStart() {
            if (this.settings.avatars) this.patchUsers();
            if (this.settings.guilds) this.patchGuilds();
            if (this.settings.activityStatus) this.patchActivityStatus();
        }

        onStop() {
            Patcher.unpatchAll();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, value) => {
                if (id == "avatars") {
                    if (value) this.patchUsers();
                    else this.cancelUsers();
                }
                if (id == "guilds") {
                    if (value) this.patchGuilds();
                    else this.cancelGuilds();
                }
                if (id == "activityStatus") {
                    if (value) this.patchActivityStatus();
                    else this.cancelActivityStatus();
                }
            });
            return panel.getElement();
        }

        patchGuilds() {
            const firstGuild = DiscordModules.SortedGuildStore.getFlattenedGuilds()[0];
            this.cancelGuildList = Patcher.before(firstGuild.constructor.prototype, "getIconURL", (thisObject, args) => {
                args[1] = true;
            });
        }

        patchUsers() {
            const selfUser = DiscordModules.UserStore.getCurrentUser();
            this.cancelUsers = Patcher.before(selfUser.constructor.prototype, "getAvatarURL", (thisObject, args) => {
                args[2] = true;
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