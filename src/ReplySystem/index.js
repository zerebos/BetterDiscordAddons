
module.exports = (Plugin, Api) => {
    const {WebpackModules, DiscordModules, Settings, Patcher, DiscordSelectors, PluginUtilities, ReactComponents} = Api;

    const Dispatcher = WebpackModules.getByProps("ComponentDispatch").ComponentDispatch;
    const CloseButton = require("closebutton.js")(Api);
	const ReplyButton = require("replybutton.js")(Api);
    const ReplyItem = require("replyitem.js")(Api, CloseButton);
	const ReplyList = require("replylist.js")(Api, ReplyItem, CloseButton);

    return class ReplySystem extends Plugin {

        constructor() {
            super();
            this.css = require("styles.css");
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
                const replyString = this.replies.map(r => {
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
                const id = thisObject.props.message.author.id;
                const name = thisObject.props.message.author.username;
                if (id == DiscordModules.UserStore.getCurrentUser().id) return;
                const button = DiscordModules.React.createElement(ReplyButton, {
                    id: id,
                    name: name,
                    icon: this.settings.icon
                });
    
                const children = this.safelyGetNestedProp(returnValue,
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