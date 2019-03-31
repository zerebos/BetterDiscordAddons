module.exports = ({DiscordModules, WebpackModules}) => {
    const Dispatcher = WebpackModules.getByProps("ComponentDispatch").ComponentDispatch;
    const TooltipWrapper = WebpackModules.getByPrototypes("showDelayed");
    return class ReplyButton extends DiscordModules.React.Component {
        constructor(props) {
            super(props);
            this.onClick = this.onClick.bind(this);
        }
        
        onClick() {
            Dispatcher.dispatch("ADD_REPLY", this.props);
            this.props.onClick && this.props.onClick();
        }

        render() {
            return DiscordModules.React.createElement(TooltipWrapper,
                    {color: "black", position: "top", text: "Reply!"},
                    DiscordModules.React.createElement("span", {className: "reply-button"},
                        !this.props.icon ? DiscordModules.React.createElement(
                            "span", {
                                className: "reply-label",
                                onClick: this.onClick,
                            },
                            "REPLY"
                        ) : DiscordModules.React.createElement(
                            "svg", {
                                className: "reply-icon",
                                onClick: this.onClick,
                                width: 15,
                                height: 15,
                                viewBox: "0 0 24 24"
                            },
                            DiscordModules.React.createElement("path", {d: "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"}),
                            DiscordModules.React.createElement("path", {d: "M0 0h24v24H0z", fill: "none"})
                        )
                    )
            );
        }
    };
}