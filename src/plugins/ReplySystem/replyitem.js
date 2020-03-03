module.exports = ({DiscordModules, WebpackModules}, CloseButton) => {
    const Dispatcher = WebpackModules.getByProps("ComponentDispatch").ComponentDispatch;
    return class ReplyItem extends DiscordModules.React.Component {
        constructor(props) {
            super(props);
    
            this.onClick = this.onClick.bind(this);
        }
    
        shouldComponentUpdate(next) {
            return this.props.id != next.id || this.props.guild_id != next.guild_id;
        }
    
        onClick() {
            Dispatcher.dispatch("REMOVE_REPLY", this.props.id);
            if (this.props.onClick) this.props.onClick(this.props.id);
        }
    
        render() {
            let color = DiscordModules.GuildMemberStore.getMember(this.props.guild_id, this.props.id);
            color = color && color.colorString ? color.colorString : "";
            return DiscordModules.React.createElement("div", {className: "reply-item", style: {color}},
                [this.props.name, DiscordModules.React.createElement(CloseButton, {onClick: this.onClick})]
            );
        }
    };
};