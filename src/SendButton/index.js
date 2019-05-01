module.exports = (Plugin, Api) => {
    const css = require("styles.css");
    const buttonHTML = require("button.html");
    const {DiscordSelectors, PluginUtilities, DOMTools} = Api;
    return class SendButton extends Plugin {
        onStart() {
            PluginUtilities.addStyle(this.getName(), css);
            if (document.querySelector("form")) this.addButton(document.querySelector("form"));
        }
        
        onStop() {
            const button = document.querySelector(".send-button");
            if (button) button.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addButton(elem) {
            if (elem.querySelector(".send-button")) return;
            const button = DOMTools.createElement(buttonHTML);
            elem.querySelector(DiscordSelectors.Textarea.inner).append(button);
            if (elem.querySelector("[class*=\"emojiButton-\"]")) elem.querySelector("[class*=\"emojiButton-\"]").css("margin-right", (button.outerWidth() + 10) + "px");
            button.on("click", () => {
                const textarea = button.siblings("textarea")[0];
                const press = new KeyboardEvent("keypress", {key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true});
                Object.defineProperties(press, {keyCode: {value: 13}, which: {value: 13}});
                textarea.dispatchEvent(press);
            });
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            if (e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner)) {
                this.addButton(e.addedNodes[0]);
            }
        }

    };
};