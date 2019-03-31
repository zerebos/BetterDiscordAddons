module.exports = ({DiscordModules}) => {
    return class CloseButton extends DiscordModules.React.Component {
        constructor(props) {
            super(props);

            this.onClick = this.onClick.bind(this);
        }

        onClick() {
            if (this.props.onClick) this.props.onClick();
        }

        render() {
            return DiscordModules.React.createElement(
                "svg", {
                    className: this.props.className || "reply-remove",
                    onClick: this.onClick,
                    width: this.props.size || 15,
                    height: this.props.size || 15,
                    viewBox: "0 0 24 24"
                },
                DiscordModules.React.createElement("path", {d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),
                DiscordModules.React.createElement("path", {d: "M0 0h24v24H0z", fill: "none"})
            );
        }
    };
};