//META{"name":"ReplySystem","displayName":"ReplySystem","website":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ReplySystem","source":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ReplySystem/ReplySystem.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

var ReplySystem = (() => {
    const config = {"info":{"name":"ReplySystem","authors":[{"name":"Zerebos","discord_id":"249746236008169473","github_username":"rauenzi","twitter_username":"ZackRauen"}],"version":"0.0.10","description":"Adds a native-esque reply button with preview. Support Server: bit.ly/ZeresServer","github":"https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/ReplySystem","github_raw":"https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/ReplySystem/ReplySystem.plugin.js"},"changelog":[{"title":"Bugfixes","type":"fixed","items":["Tooltips are existent again!"]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [TextElement({color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {WebpackModules, DiscordModules, Settings, Patcher, DiscordSelectors, PluginUtilities, ReactComponents} = Api;

    const Dispatcher = WebpackModules.getByProps("ComponentDispatch").ComponentDispatch;
    const CloseButton = (({DiscordModules}) => {
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
})(Api);
	const ReplyButton = (({DiscordModules, WebpackModules}) => {
    const Dispatcher = WebpackModules.getByProps("ComponentDispatch").ComponentDispatch;
    const TooltipWrapper = WebpackModules.getByPrototypes("showDelayed") || WebpackModules.getByDisplayName("TooltipDeprecated");
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
})(Api);
    const ReplyItem = (({DiscordModules, WebpackModules}, CloseButton) => {
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
})(Api, CloseButton);
	const ReplyList = (({DiscordModules, WebpackModules}, ReplyItem, CloseButton) => {
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
})(Api, ReplyItem, CloseButton);

    return class ReplySystem extends Plugin {

        constructor() {
            super();
            this.css = `.reply-button {
    margin-left: 6px;
    font-size: 0.75rem;
    opacity: 0;
    transition: opacity 200ms ease;
    cursor: pointer;
    color: white;
}
.reply-icon {
    fill: white;
    vertical-align: top;
}

.theme-light .reply-button {
    color: gray;
}

.theme-light .reply-icon {
    fill: gray;
}

.container-1YxwTf:hover .reply-button {
    opacity: 0.4;
}

.container-1YxwTf .reply:hover {
    opacity: 1;
}

.messageCompact-kQa7ES {
    flex-direction: row;
}

.containerCompact-3V0ioj .reply-button {
    margin: 0;
}

.containerCompact-3V0ioj .reply-button+.contentCompact-1QLHBj time {
    width: 50px;
}

.containerCompact-3V0ioj time {
    width: 65px;
}

.reply-list {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #2f3136;
    padding: 0 18px 5px 5px;
    border-radius: 5px 5px 0 0;
    font-size: 14px;
    color: white;
}

@keyframes reply-add {
    from {
        transform: scale(0.5);
    }
}

.reply-item {
    animation: reply-add 200ms;
    transform: scale(1);
    display: flex;
    background: #36393f;
    align-items: center;
    padding: 3px;
    border-radius: 3px;
    font-weight: 500;
    margin-right: 3px;
    margin-top: 5px;
}

.reply-remove {
    fill: white;
    margin-left: 3px;
    margin-top: 3px;
    opacity: 0.4;
    cursor: pointer;
}

.reply-remove:hover {
    opacity: 1;
}

.reply-list-label {
    display: flex;
    align-items: center;
    padding: 3px;
    margin-right: 3px;
    margin-top: 5px;
}

.reply-clear {
    fill: white;
    cursor: pointer;
    opacity: 0.4;
    position: absolute;
    top: 2px;
    right: 2px;
}

.reply-clear:hover {opacity: 1;}`;
            this.replies = [];
            this.defaultSettings = {icon: true, roleColor: true};
            this.settings = Object.assign({}, this.defaultSettings);
            this.addReply = this.addReply.bind(this);
            this.removeReply = this.removeReply.bind(this);
            this.clearReply = this.clearReply.bind(this);
        }

        onStart() {
            PluginUtilities.addStyle(this.getName(), this.css);
            Dispatcher.subscribe("ADD_REPLY", this.addReply);
            Dispatcher.subscribe("REMOVE_REPLY", this.removeReply);
            Dispatcher.subscribe("CLEAR_REPLY", this.clearReply);
    
            Patcher.before(DiscordModules.MessageActions, "sendMessage", (t,a) => {
                if (!this.replies.length) return;
                let replyString = this.replies.map(r => {
                    return `<@!${r.id}> `;
                });
                a[1].content = replyString.join("") + a[1].content;
                
                Dispatcher.dispatch("CLEAR_REPLY");
            });
    
            this.patchTextareaComponent();
            this.patchMessageComponent();
        }
        
        onStop() {
            PluginUtilities.removeStyle(this.getName());
            Patcher.unpatchAll();
            Dispatcher.unsubscribe("ADD_REPLY", this.addReply);
            Dispatcher.unsubscribe("REMOVE_REPLY", this.removeReply);
            Dispatcher.unsubscribe("CLEAR_REPLY", this.clearReply);
        }

        addReply(reply) {
            if (this.replies.find(x => x.id == reply.id)) return;
            this.replies.push(reply);
        }
    
        removeReply(id) {
            this.replies = this.replies.filter(i => i.id != id);
        }
    
        clearReply() {
            this.replies.splice(0, this.replies.length);
        }
    
        safelyGetNestedProp(obj, path) {
            return path.split(/\s?\.\s?/).reduce(function(obj, prop) {
                return obj && obj[prop];
            }, obj);
        }
    
        async patchTextareaComponent() {
            const Textarea = await ReactComponents.getComponentByName("ChannelTextAreaForm", ".chat-3bRxxu form");
            const list = DiscordModules.React.createElement(ReplyList);
            Patcher.after(Textarea.component.prototype, "render", (thisObject, args, returnValue) => {
                returnValue.props.children.push(list);
                return returnValue;
            });
            Textarea.forceUpdateAll();
        }
    
        async patchMessageComponent() {    
            const Message = await ReactComponents.getComponentByName("Message", DiscordSelectors.Messages.message);
            Patcher.after(Message.component.prototype, "render", (thisObject, args, returnValue) => {
                if (!thisObject.props.isHeader || thisObject.props.message.type != 0) return returnValue;
                let id = thisObject.props.message.author.id;
                let name = thisObject.props.message.author.username;
                if (id == DiscordModules.UserStore.getCurrentUser().id) return;
                let button = DiscordModules.React.createElement(ReplyButton, {
                    id: id,
                    name: name,
                    icon: this.settings.icon
                });
    
                let children = this.safelyGetNestedProp(returnValue,
                    !thisObject.props.isCompact ? "props.children.0.props.children.1.props.children" : "props.children"
                );
                if (!children || !Array.isArray(children)) return returnValue;
    
                if (thisObject.props.isCompact) children.splice(0, 0, button);
                else children.push(button);
    
                return returnValue;
            });
            Message.forceUpdateAll();
        }
    
        getSettingsPanel() {
            return Settings.SettingPanel.build(this.saveSettings.bind(this), 
                new Settings.SettingGroup("Plugin Options", {shown: true}).append(
                    new Settings.RadioGroup("Reply Button Style", "Switches between reply button styles.", this.settings.icon, [
                        {name: "Text", value: false, desc: "Show the text REPLY as the button"},
                        {name: "Icon", value: true, desc: "Show the button as a reply icon."}
                    ], (e) => {this.settings.icon = e;})
                )
            );
        }
    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/