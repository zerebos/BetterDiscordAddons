module.exports = (Plugin, Api) => {
    const {DiscordSelectors, ReactComponents, DiscordAPI, Patcher, Utilities} = Api;
    return class ThemeHelper extends Plugin {
        onStart() {
            const componentPatchFunctions = Object.getOwnPropertyNames(this.constructor.prototype).filter(p => p.startsWith("patch"));
            return Promise.all(componentPatchFunctions.map(p => this[p].call(this)));
        }
        
        onStop() {
            const componentPatchFunctions = Object.getOwnPropertyNames(this).filter(p => p.startsWith("unpatch"));
            return Promise.all(componentPatchFunctions.map(p => this[p].call(this)));
        }

        async patchMessage() {
            this.Message = await ReactComponents.getComponent("Message", DiscordSelectors.Messages.message, m => m.prototype && m.prototype.renderCozy);

            this.unpatchMessageRender = Patcher.after(this.Message.component.prototype, "render", (component, args, retVal) => {
                const {message, jumpSequenceId, canFlash} = component.props;
                const {id, colorString, bot, author, attachments, embeds} = message;
                if (jumpSequenceId && canFlash) retVal = retVal.props.children;
                retVal.props["data-message-id"] = id;
                retVal.props["data-colourstring"] = colorString;
                if (author && author.id) retVal.props["data-user-id"] = author.id;
                if (bot || (author && author.bot)) retVal.props.className += " bd-isBot";
                if (attachments && attachments.length) retVal.props.className += " bd-hasAttachments";
                if (embeds && embeds.length) retVal.props.className += " bd-hasEmbeds";
                if (author && author.id === DiscordAPI.currentUser.id) retVal.props.className += " bd-isCurrentUser";

                const dapiMessage = DiscordAPI.Message.from(message);
                if (dapiMessage.guild && author.id === dapiMessage.guild.ownerId) retVal.props.className += " bd-isGuildOwner";
                if (dapiMessage.guild && dapiMessage.guild.isMember(author.id)) retVal.props.className += " bd-isGuildMember";
            });

            this.Message.forceUpdateAll();
        }

        async patchMessageGroup() {
            this.MessageGroup = await ReactComponents.getComponent("MessageGroup", DiscordSelectors.Messages.container);

            this.unpatchMessageGroupRender = Patcher.after(this.MessageGroup.component.prototype, "render", (component, args, retVal) => {
                const {author, type} = component.props.messages[0];
                retVal.props["data-author-id"] = author.id;
                if (author.id === DiscordAPI.currentUser.id) retVal.props.className += " bd-isCurrentUser";
                if (type !== 0) retVal.props.className += " bd-isSystemMessage";

                const dapiMessage = DiscordAPI.Message.from(component.props.messages[0]);
                if (dapiMessage.guild && author.id === dapiMessage.guild.ownerId) retVal.props.className += " bd-isGuildOwner";
                if (dapiMessage.guild && dapiMessage.guild.isMember(author.id)) retVal.props.className += " bd-isGuildMember";
            });

            this.MessageGroup.forceUpdateAll();
        }

        async patchChannelMember() {
            this.ChannelMember = await ReactComponents.getComponent("ChannelMember", DiscordSelectors.MemberList.member, m => m.prototype.renderActivity);

            this.unpatchChannelMemberRender = Patcher.after(this.ChannelMember.component.prototype, "render", (component, args, retVal) => {
                if (!retVal.props || !retVal.props.children) return;
                const user = Utilities.findInReactTree(component, m => m.user).user;
                if (!user) return;
                retVal.props.children.props["data-user-id"] = user.id;
                retVal.props.children.props["data-colourstring"] = component.props.colorString;
                if (component.props.isOwner) retVal.props.children.props.className += " bd-isGuildOwner";
            });

            this.ChannelMember.forceUpdateAll();
        }

        async patchGuild() {
            const selector = `div${DiscordSelectors.Guilds.guild}:not(:first-child)`;
            this.Guild = await ReactComponents.getComponent("Guild", selector, m => m.prototype.renderBadge);

            this.unpatchGuild = Patcher.after(this.Guild.component.prototype, "render", (component, args, retVal) => {
                const {guild} = component.props;
                if (!guild) return;
                retVal.props["data-guild-id"] = guild.id;
                retVal.props["data-guild-name"] = guild.name;
            });

            this.Guild.forceUpdateAll();
        }

        /**
         * The Channel component contains the header, message scroller, message form and member list.
         */
        async patchChannel() {
            const selector = ".chat";
            this.Channel = await ReactComponents.getComponent("Channel", selector);

            this.unpatchChannel = Patcher.after(this.Channel.component.prototype, "render", (component, args, retVal) => {
                const channel = component.props.channel || component.state.channel;
                if (!channel) return;
                retVal.props["data-channel-id"] = channel.id;
                retVal.props["data-channel-name"] = channel.name;
                if ([0, 2, 4].includes(channel.type)) retVal.props.className += " bd-isGuildChannel";
                if ([1, 3].includes(channel.type)) retVal.props.className += " bd-isPrivateChannel";
                if (channel.type === 3) retVal.props.className += " bd-isGroupChannel";
            });

            this.Channel.forceUpdateAll();
        }

        /**
         * The TextChannel component represents a text channel in the guild channel list.
         */
        async patchTextChannel() {
            this.TextChannel = await ReactComponents.getComponent("TextChannel", DiscordSelectors.ChannelList.containerDefault, c => c.prototype.renderMentionBadge);
            this.unpatchTextChannel = Patcher.after(this.TextChannel.component.prototype, "render", this._afterChannelRender);
            this.TextChannel.forceUpdateAll();
        }

        /**
         * The VoiceChannel component represents a voice channel in the guild channel list.
         */
        async patchVoiceChannel() {
            this.VoiceChannel = await ReactComponents.getComponent("VoiceChannel", DiscordSelectors.ChannelList.containerDefault, c => c.prototype.handleVoiceConnect);
            this.unpatchVoiceChannel = Patcher.after(this.VoiceChannel.component.prototype, "render", this._afterChannelRender);
            this.VoiceChannel.forceUpdateAll();
        }

        /**
         * The PrivateChannel component represents a channel in the direct messages list.
         */
        async patchPrivateChannel() {
            const selector = ".privateChannels-1nO12o .channel-2QD9_O";
            this.PrivateChannel = await ReactComponents.getComponent("PrivateChannel", selector, c => c.prototype.renderAvatar);
            this.unpatchPrivateChannel = Patcher.after(this.PrivateChannel.component.prototype, "render", this._afterChannelRender);
            this.PrivateChannel.forceUpdateAll();
        }

        _afterChannelRender(component, args, retVal) {
            const {channel} = component.props;
            if (!channel) return;

            retVal.props["data-channel-id"] = channel.id;
            retVal.props["data-channel-name"] = channel.name;
            if ([0, 2, 4].includes(channel.type)) retVal.props.className += " bd-isGuildChannel";
            if (channel.type === 2) retVal.props.className += " bd-isVoiceChannel";
            // if (channel.type === 4) retVal.props.className += ' bd-isChannelCategory';
            if ([1, 3].includes(channel.type)) retVal.props.className += " bd-isPrivateChannel";
            if (channel.type === 3) retVal.props.className += " bd-isGroupChannel";
        }

        async patchUserProfileBody() {
            this.UserProfileBody = await ReactComponents.getComponent("UserProfileBody", DiscordSelectors.UserModal.root, c => c && c.prototype && c.prototype.renderHeader && c.prototype.renderBadges);
            this.unpatchUserProfileBody = Patcher.after(this.UserProfileBody.component.prototype, "render", (component, args, retVal) => {
                const {user} = component.props;
                if (!user) return;
                retVal.props.children.props["data-user-id"] = user.id;
                if (user.bot) retVal.props.children.props.className += " bd-isBot";
                if (user.id === DiscordAPI.currentUser.id) retVal.props.children.props.className += " bd-isCurrentUser";
            });

            this.UserProfileBody.forceUpdateAll();
        }

        async patchUserPopout() {
            this.UserPopout = await ReactComponents.getComponent("UserPopout", DiscordSelectors.UserPopout.userPopout, c => c.defaultProps && c.displayName == "UserPopout");
            this.unpatchUserPopout = Patcher.after(this.UserPopout.component.prototype, "render", (component, args, retVal) => {
                const {user, guild, guildMember} = component.props;
                if (!user) return;
                retVal.props.children.props["data-user-id"] = user.id;
                if (user.bot) retVal.props.children.props.className += " bd-isBot";
                if (user.id === DiscordAPI.currentUser.id) retVal.props.children.props.className += " bd-isCurrentUser";
                if (guild) retVal.props.children.props["data-guild-id"] = guild.id;
                if (guild && user.id === guild.ownerId) retVal.props.children.props.className += " bd-isGuildOwner";
                if (guild && guildMember) retVal.props.children.props.className += " bd-isGuildMember";
                if (guildMember && guildMember.roles.length) retVal.props.children.props.className += " bd-hasRoles";
            });

            this.UserPopout.forceUpdateAll();
        }

    };
};