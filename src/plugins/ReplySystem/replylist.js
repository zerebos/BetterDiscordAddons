module.exports = ({DiscordModules, WebpackModules}, ReplyItem, CloseButton) => {
    const Dispatcher = WebpackModules.getByProps("ComponentDispatch").ComponentDispatch;
    return class ReplyList extends DiscordModules.React.Component {
        constructor(props) {
            super(props);
            this.state = {
                items: [],
                guild_id: DiscordModules.SelectedGuildStore.getGuildId()
            };
    
            this.addItem = this.addItem.bind(this);
            this.removeItem = this.removeItem.bind(this);
            this.clearItems = this.clearItems.bind(this);
            this.changeGuild = this.changeGuild.bind(this);
        }
    
        componentDidUpdate() {
            let elem = DiscordModules.ReactDOM.findDOMNode(this);
            if (!elem) return;
            let cta = document.querySelector("[class*=\"channelTextArea\"]");
            // console.dir(cta)
            elem.style.bottom = `calc(100% - ${cta.offsetTop}px)`;
        }
    
        componentWillUnmount() {
            Dispatcher.dispatch("CLEAR_REPLY");
            Dispatcher.unsubscribe("ADD_REPLY", this.addItem);
            Dispatcher.unsubscribe("REMOVE_REPLY", this.removeItem);
            Dispatcher.unsubscribe("CLEAR_REPLY", this.clearItems);
            DiscordModules.SelectedGuildStore.removeChangeListener(this.changeGuild);
        }
    
        componentWillMount() {
            Dispatcher.subscribe("ADD_REPLY", this.addItem);
            Dispatcher.subscribe("REMOVE_REPLY", this.removeItem);
            Dispatcher.subscribe("CLEAR_REPLY", this.clearItems);
            DiscordModules.SelectedGuildStore.addChangeListener(this.changeGuild);
        }
    
        addItem(i) {
            if (this.state.items.find(x => x.id == i.id)) return;
            this.setState({items: [...this.state.items, i]});
        }
    
        removeItem(id) {
            this.setState({
                items: this.state.items.filter(i => i.id != id)
            });
        }
    
        clearItems() {
            this.setState({
                items: []
            });
        }
    
        changeGuild() {
            let newId = DiscordModules.SelectedGuildStore.getGuildId();
            if (this.state.guild_id == newId) return;
            this.setState({guild_id: newId});
        }
    
        render() {
            if (!this.state.items.length) return null;
            return DiscordModules.React.createElement("div",
                {
                    key: "reply-list",
                    className: "reply-list",
                    children: [
                            DiscordModules.React.createElement("div", {className: "reply-list-label"}, "Reply To:"),
                        ...this.state.items.map(i => {
                            return DiscordModules.React.createElement(ReplyItem, Object.assign({showRoleColor: this.props.showRoleColors, guild_id: this.state.guild_id, key: i.id}, i));
                        }),
                        DiscordModules.React.createElement(CloseButton, {className: "reply-clear", size: 15, onClick: () => {Dispatcher.dispatch("CLEAR_REPLY");}})
                    ]
                }
            );
        }
    };
};