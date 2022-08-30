/**
 * @name EmoteSearch
 * @description Search through all emotes in bd with /es emoteuwant.
 * @version 1.2.4
 * @author Ckat/Cate edited by confus, rewritten by zerebos
 * @authorId 249746236008169473
 * @authorLink https://twitter.com/IAmZerebos
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/EmoteSearch
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmoteSearch/EmoteSearch.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
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
const config = {
    info: {
        name: "EmoteSearch",
        authors: [
            {
                name: "Ckat/Cate edited by confus, rewritten by zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "1.2.4",
        description: "Search through all emotes in bd with /es emoteuwant.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/EmoteSearch",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/EmoteSearch/EmoteSearch.plugin.js"
    },
    changelog: [],
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {

    /* globals BdApi:false */
    /* eslint-disable no-console */
    
    return class EmoteSearch extends Plugin {

        constructor() {
            super();
            this.lastSearch = "";
            this.emoteStore = {};

            this.css = `/* EmoteSearch CSS */

            @keyframes backdrop-open {
                to { opacity: 0.85; }
            }

            @keyframes modal-open {
                to { transform: scale(1); opacity: 1; }
            }

            @keyframes backdrop-close {
                to { opacity: 0; }
            }

            @keyframes modal-close {
                to { transform: scale(0.7); opacity: 0; }
            }

            #EmoteSearchModal .backdrop {
                animation: backdrop-open 250ms ease;
                animation-fill-mode: forwards;
                opacity: 0;
                background-color: rgb(0, 0, 0);
                transform: translateZ(0px);
            }

            #EmoteSearchModal.closing .backdrop {
                animation: backdrop-close 200ms linear;
                animation-fill-mode: forwards;
                animation-delay: 50ms;
                opacity: 0.85;
            }

            #EmoteSearchModal.closing .modal {
                animation: modal-close 250ms cubic-bezier(0.19, 1, 0.22, 1);
                animation-fill-mode: forwards;
                opacity: 1;
                transform: scale(1);
            }

            #EmoteSearchModal .modal {
                animation: modal-open 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
                animation-fill-mode: forwards;
                transform: scale(0.7);
                opacity: 0;
            }

            #EmoteSearchModal .emote-list {
                padding-top: 5px;
                min-height: 250px;
            }

            #EmoteSearchModal .modal-inner {
                min-height: unset;
            }

            #EmoteSearchModal .footer {
                display: flex;
                justify-content: space-between;
                color: white;
            }

            #EmoteSearchModal .page-button {
                cursor: pointer;
            }

            #EmoteSearchModal .page-button.disabled {
                pointer-events: none;
                color: transparent;
            }

            #EmoteSearchModal .emotewrapper {
                cursor: pointer;
                margin: 1px;
                vertical-align: top;
            }
            `;

            this.modalHTML = `<div id="EmoteSearchModal" class="theme-dark">
            <div class="backdrop \${backdrop}"></div>
            <div class="modal \${modalWrapper}">
                <div class="\${modalWrapperInner}">
                    <div class="modal-inner \${modal}">
                        <div class="\${header}">
                            <h4 class="title \${title}"></h4>
                            <svg viewBox="0 0 12 12" name="Close" width="18" height="18" class="close-button \${close}"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg>
                        </div>
                        <div class="\${scrollerWrap}">
                            <div class="emote-list \${scroller}">

                            </div>
                        </div>
                        <div class="footer \${footer}">
                            <div class="page-button previous">←</div>
                            <div class="page-indicator"></div>
                            <div class="page-button next">→</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        }

        replace(string, values) {
            for (const val in values) {
                string = string.replace(new RegExp(`\\$\\{${val}\\}`, "g"), values[val]);
            }
            return string;
        }

        async onStart() {
            BdApi.injectCSS(this.getName(), this.css);
            this.textAreaClasses = BDV2.WebpackModules.findByUniqueProperties(["textArea", "channelTextArea"]);
            const modalClasses = BDV2.WebpackModules.findByUniqueProperties(["modal", "close"]);
            const modalWrapClasses = BDV2.WebpackModules.find(m => m.modal && m.inner && !m.close);
            const backdropClass = BDV2.WebpackModules.findByUniqueProperties(["backdrop"]).backdrop;
            const scrollerClasses = BDV2.WebpackModules.findByUniqueProperties(["scrollerWrap"]);
            const titleClasses = BDV2.WebpackModules.findByUniqueProperties(["title", "h4"]);
            const flexClasses = BDV2.WebpackModules.findByUniqueProperties(["flex", "horizontal"]);
            this.modalHTML = this.replace(this.modalHTML, {
                backdrop: backdropClass,
                modalWrapper: modalWrapClasses.modal,
                modalWrapperInner: modalWrapClasses.inner,
                modal: modalClasses.modal + " " + modalClasses.sizeMedium,
                header: `${modalClasses.header} ${flexClasses.flex} ${flexClasses.horizontal} ${flexClasses.directionRow} ${flexClasses.justifyStart} ${flexClasses.alignCenter} ${flexClasses.noWrap}`,
                title: `${titleClasses.title} ${titleClasses.h4} ${titleClasses.defaultColor} ${titleClasses.defaultMarginh4}`,
                close: modalClasses.close,
                scrollerWrap: `${modalClasses.content} ${scrollerClasses.scrollerWrap} ${scrollerClasses.scrollerThemed} ${scrollerClasses.themeGhostHairline}`,
                scroller: modalClasses.inner + " " + scrollerClasses.scroller,
                footer: modalClasses.footer
            });
            this.attachParser();
            const start = performance.now();
            try {
                await window.emotePromise;
                this.emoteStore = Object.assign({}, window.bdEmotes.BTTV, window.bdEmotes.BTTV2, window.bdEmotes.FrankerFaceZ, window.bdEmotes.TwitchGlobal, window.bdEmotes.TwitchSubscriber);
                if (Object.keys(this.emoteStore).length < 10) {
                    console.error("EmoteSearch: zerebos probably broke it go ping him");
                }
                else {
                    console.log("EmoteSearch: emotes loaded");
                }
                const diff = performance.now() - start;
                console.log("EmoteSearch: took " + diff + "ms");
            }
            catch (e) {console.warn("EmoteSearch: failed to load emotes: " + e);}
        }

        onStop() {
            $("*").off("." + this.getName());
            BdApi.clearCSS(this.getName());
        }

        attachParser() {
            const el = $("." + this.textAreaClasses.textArea.split(" ")[0]);
            if (el.length == 0) return;
            el.on("keydown." + this.getName(), this.handleKeypress.bind(this));
        }

        handleKeypress(e) {
            const code = e.keyCode || e.which;
            if (code !== 13) return;
            try {
                const val = $("." + this.textAreaClasses.textArea.split(" ")[0]).val().trim(),
                    split = val.split(" "),
                    commandIndex = split.indexOf("/es"),
                    text = "",
                    query = null;
                if (commandIndex >= 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (commandIndex > 0) text = split.slice(0, commandIndex).join(" ");
                    if (query = split[commandIndex + 1]) {
                        this.lastSearch = query;
                        this.showResults(this.search(query));
                    }
                    this.setText(text);
                    return;
                }
            }
            catch (e) {console.warn("EmoteSearch: failed to show search results: " + e);}
        }

        showResults(results) {
            const modal = $(this.modalHTML);
            const emoteList = modal.find(".emote-list");
            const closeButton = modal.find(".close-button");
            const backdrop = modal.find(".backdrop");
            const nextButton = modal.find(".next");
            const prevButton = modal.find(".previous");
            const pageLabel = modal.find(".page-indicator");

                const closeModal = () => {
                BDV2.reactDom.unmountComponentAtNode(emoteList[0]);
                modal.addClass("closing");
                $(document).off(`mouseover.${this.getName()}`);
                setTimeout(() => {modal.remove();}, 300);
            };
            closeButton.on("click", closeModal);
            backdrop.on("click", closeModal);
            modal.find(".title").text(results.length + " Results containing '" + this.lastSearch + "'");
            $("body").append(modal);

            const component = BDV2.reactDom.render(BDV2.react.createElement(this.component), emoteList[0]);

            const totalPages = results.length / 100;
            const currentPage = totalPages && 1;
            if (results.length % 100) totalPages = (0 | totalPages) + 1;

            const changePage = (pageNum) => {
                currentPage = pageNum;
                if (totalPages === currentPage) nextButton.addClass("disabled");
                else nextButton.removeClass("disabled");
                if (currentPage === 0 || currentPage === 1) prevButton.addClass("disabled");
                else prevButton.removeClass("disabled");
                pageLabel.text(`Page ${currentPage}/${totalPages}`);
                if (currentPage) component.setState({items: this.getEmoteProps(results, (pageNum - 1) * 100, ((pageNum - 1) * 100) + 100)});
            };

            changePage(currentPage);

            nextButton.on("click", () => {changePage(currentPage + 1);});
            prevButton.on("click", () => {changePage(currentPage - 1);});
        }

        getEmoteProps(results, start, end) {
            const self = this;
            const emotes = [];
            if (end >= results.length) end = results.length;
            for (let i = start; i < end; i++) {
                const emoteKey = results[i];
                const emote = this.emoteStore[emoteKey];
                emotes.push({
                    name: emoteKey,
                    url: emote,
                    modifier: "",
                    jumboable: true,
                    onClick: function() {
                    self.addText(this.name);
                }});
            }
            return emotes;
        }

        search(s) {
            s = s.toLowerCase();
            const matches = [];
            for (const k in this.emoteStore) if (k.toLowerCase().indexOf(s) > -1) matches.push(k);
            return matches;
        }

        setText(new_val) {
            try {
                const textarea = $("." + this.textAreaClasses.textArea.split(" ")[0])[0];
                textarea.focus();
                textarea.selectionStart = 0;
                textarea.selectionEnd = textarea.value.length;
                document.execCommand("insertText", false, new_val);
            }
            catch (e) {console.log("failed to set text: " + e);}
        }

        addText(new_val) {
            try {
                new_val = " " + new_val;
                const textarea = $("." + this.textAreaClasses.textArea.split(" ")[0])[0];
                textarea.focus();
                textarea.selectionStart = textarea.value.length;
                textarea.selectionEnd = textarea.value.length;
                document.execCommand("insertText", false, new_val);
            }
            catch (e) {console.log( "failed to add text: " + e);}
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            if (e.addedNodes[0].querySelector("." + this.textAreaClasses.textArea.split(" ")[0])) this.attachParser();
        }

        get component() {
            return class EmoteListWrapper extends BDV2.react.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        items: []
                    };
                }
            
                render() {
                    if (!this.state.items.length) return null;
                    return BDV2.react.createElement(
                        "div", {
                            className: "react-wrapper"
                        }, ...this.state.items.map(i => BDV2.react.createElement(BDEmote, i)));
                }
            };
        }

        onSwitch() {this.attachParser();}
    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/