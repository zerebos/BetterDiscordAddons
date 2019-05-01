module.exports = (Plugin, Api) => {
    const {DiscordModules, Toasts, WebpackModules, Utilities, PluginUtilities} = Api;
    return class CommandLine extends Plugin {
        constructor() {
            super();
            this.autocompleteHTML = require("autocomplete.html");
            this.autocompleteItemHTML = require("autocomplete_item.html");
            this.autocompleteHTMLHorizontal = require("autocomplete_horizontal.html");
            this.autocompleteItemHTMLHorizontal = require("autocomplete_item_horizontal.html");
            this.modalHTML = require("modal.html");
            this.commands = require("commands.js")(Api, this);
            // Notification
            // Aliasing
            this.MAX_RESULTS = 10;
            this.prefix = "//";
            this.isTypingPatched = false;
        }

        onStart() {
            PluginUtilities.addStyle(this.getName(), require("styles.css"));
            this.KeyboardActions = WebpackModules.findByUniqueProperties(["UNREAD_NEXT"]);
            this.MAX_RESULTS = DiscordModules.DiscordConstants.MAX_USER_AUTOCOMPLETE_RESULTS;
            var textarea = document.querySelector(".textArea-2Spzkt");
            this.addListener($(textarea));
        }
        
        onStop() {
            PluginUtilities.removeStyle(this.getName());
            $("*").off("." + this.getName());
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;

            var elem = e.addedNodes[0];
            
            if (elem.querySelector(".textArea-2Spzkt")) {
                var textarea = elem.querySelector(".textArea-2Spzkt");
                this.addListener($(textarea));
            }
        }

        validateArgument(validator, arg) {
            if (typeof(validator) === "function") {
                return validator(arg);
            }
            else if (Array.isArray(validator)) {
                let matched = validator.filter(c => c.name ? c.name == arg : c == arg);
                if (matched.length) arg = matched[0];
                return validator.includes(arg);
            }
            return true;
        }
    
        processCommand(command, args) {
            let argCount = command.arguments ? command.arguments.length : 0;
            let correctArgCount = args.length == argCount;
            let lastArg = command.arguments ? command.arguments[argCount - 1] : {};
            if (lastArg.rest) correctArgCount = args.length >= argCount;
    
            if (!correctArgCount) return Toasts.show(`Error for command "${command.name}". Expected ${argCount} parameters, got ${args.length}`, {type: "error"});
    
            for (let r = 0; r < args.length; r++) {
                let validator = command.arguments[r] ? command.arguments[r].validator : lastArg.validator;
                let isValid = this.validateArgument(validator, args[r]);
                if (!isValid) return Toasts.show(`Invalid value for parameter ${r + 1}.`, {type: "error"}), false;
    
                if (Array.isArray(validator)) {
                    let matched = validator.filter(c => c.name ? c.name == args[r] : c == args[r]);
                    if (matched.length && matched[0].value) args[r] = matched[0].value;
                }
            }
    
            try {
                if (command.callback && typeof(command.callback) == "function") command.callback(...args);
                return true;
            }
            catch (error) {
                Toasts.show(`Error for command "${command.name}". See console for details.`, {type: "error"});
                console.error(error); // eslint-disable-line no-console
                return false;
            }
        }
        
        runCommand(text) {
            let items = text.match(/"([^"]*)"|'([^']*)'|[^\s]+/g);
            let commandName = items.shift().replace(this.prefix, "");
            let command = this.commands.find(x => x.name == commandName);
            if (!command) return Toasts.show(`Could not find command ${commandName}`, {type: "error"});
    
            items = items.map((e) => {
                if (e.startsWith("\"") || e.startsWith("'")) return e.substring(1, e.length - 1);
                return e;
            });
    
            let depth = 0;
            for (let i = 0; i < items.length; i++) {
                if (command.subcommands) {
                    let subcommandName = items[i];
                    let subcommand = command.subcommands.find(x => x.name == subcommandName);
                    if (subcommand) {
                        command = subcommand;
                        depth++;
                        continue;
                    }
                }
                break;
            }
    
            let commandSuccess = this.processCommand(command, items.slice(depth, items.length + 1));
            if (commandSuccess) this.clearTextarea();
        }
    
        clearTextarea() {
            let txt = document.querySelector(".textArea-2Spzkt");
            if (!txt) return;
            txt.selectionStart = 0;
            txt.selectionEnd = txt.value.length;
            txt.focus();
            document.execCommand("insertText", false, "");
        }
    
        
        addListener(textarea) {
            textarea.on("keypress." + this.getName(), (e) => {
                if (e.shiftKey || e.which != 13) return;
                if (!e.currentTarget.value.startsWith(this.prefix)) return;
                e.stopPropagation();
                e.preventDefault();
                $("#commandLine").remove();
                textarea.off("keydown." + this.getName());
                this.runCommand(e.currentTarget.value);
            });
            textarea.on("input." + this.getName(), () => {
                $("#commandLine").remove();
                textarea.off("keydown." + this.getName());
                var text = textarea.val();
                // if (!text.startsWith(this.prefix)) {
                //     if (!this.isTypingPatched) return;
                //     this.unpatchTyping();
                //     this.isTypingPatched = false;
                //     return;
                // }
                // else if (!this.isTypingPatched) {this.patchTyping();}
                text = text.substring(0, textarea[0].selectionEnd);
                text = text.replace(this.prefix, "");
    
                let items = text.match(/"([^"]*)"|'([^']*)'|[^\s]+/g);
                // console.log(items)
                // get command
                //   get subcommand
                //     get arguments
                //   get arguments
                if (!items) items = [""];
                items = items.map(i => i.replace(/"/g, "").replace(/'/g, ""));
                let search = items[0];
                let command = this.commands.find(x => x.name == search);
                // console.log(textarea.val().lastIndexOf(" "), textarea[0].selectionEnd);
                if (items.length == 1 && !text.includes(" ")) return this.showCommandAutoComplete(this.commands, search); // show autocomplete for command
                if (!command) return;
                // console.log(items);
                text = textarea.val();
                let subcommandDepth = 0;
                for (let i = 1; i < items.length + 1; i++) {
                    let starting = items.length == i && text.lastIndexOf(" ") + 1 == textarea[0].selectionEnd;
                    let ending = items.length == i + 1 && text.lastIndexOf(" ") + 1 != textarea[0].selectionEnd;
    
                    search = items[i] ? items[i] : "";
                    // console.log(`${i}, ${command.name}, ${search}`);
                    if (command.subcommands) {
                        console.log("subcommands");
                        let subcommand = command.subcommands.find(x => x.name == search);
                        // console.log(subcommand);
                        if (!subcommand || ending) return this.showCommandAutoComplete(command.subcommands, search); // show autocomplete for subcommands
                        if (subcommand) command = subcommand, subcommandDepth++;
                    }
                    if (command.arguments) {
                        console.log("args");
                        let argNum = i - subcommandDepth;
                        // console.log("Show arg " + argNum)
                        let argAtNum = command.arguments[argNum];
                        console.log(argNum, command.arguments);
                        if (!argAtNum) {
                            let lastArg = command.arguments[command.arguments.length - 1];
                            if (lastArg.rest) argAtNum = lastArg;
                        }
                        if (!argAtNum) return;
    
                        if (argAtNum.getElement) {
                            if (!starting && !ending) return;
                            let elements = [];
                            let defaults = argAtNum.validator;
                            for (let e = 0; e < defaults.length; e++) {
                                elements.push({
                                    name: defaults[e].value ? defaults[e].value.toString() : defaults[e].toString(),
                                    element: defaults[e].value ? argAtNum.getElement(defaults[e].value) : argAtNum.getElement(defaults[e])
                                });
                            }
                            //this.showAutoComplete(argAtNum.validator, search);
                            let ac = this.generateAutocomplete(elements.slice(0, elements.length > this.MAX_RESULTS ? this.MAX_RESULTS + 1 : elements.length + 1), {title: "SEARCHING", horizontal: true});
                            ac.appendTo($(".inner-zqa7da"));
                        }
                        else if (Array.isArray(argAtNum.validator)) {
                            if ((starting || ending) && !argAtNum.unique) return this.showAutoComplete(argAtNum.validator, search);
                            let options = argAtNum.validator.filter(o => !items.includes(o));
                            if (starting || ending) this.showAutoComplete(options, search);
                        }
                    }
                }
            });
        }
    
        showAutoComplete(items, search) {
            search = search.toLowerCase();
            items = items.map(i => i.name ? i : i.toString());
            items = items.filter(x => x.name ? x.name.toLowerCase().includes(search) : x.toLowerCase().includes(search));
            items.sort((a, b) => {
                var first = this.similar(a.name ? a.name.toLowerCase() : a.toLowerCase(), search);
                var second = this.similar(b.name ? b.name.toLowerCase() : b.toLowerCase(), search);
                
                if (first > second) return -1;
                if (second > first) return 1;
                return 0;
            });
            let ac = this.generateAutocomplete(items.slice(0, items.length > this.MAX_RESULTS ? this.MAX_RESULTS + 1 : items.length + 1), {title: "Options"});
            let existing = $(".autocomplete");
            ac.appendTo($(".inner-zqa7da"));
            existing.css("bottom", ac.outerHeight());
        }
    
        generateAutocomplete(items, options = {}) {
            const {title = "Options", horizontal = false} = options;
            let autocomplete = $(Utilities.formatTString(horizontal ? this.autocompleteHTMLHorizontal : this.autocompleteHTML, {title: title}));
            let inner = horizontal ? autocomplete.find(".horizontalAutocompletes-x8hlrn") : autocomplete.find(".autocomplete-list");
            let elements = [];
            for (let c = 0; c < items.length; c++) {
                let item = items[c];
                let name = item.name ? item.name : item;
                let description = item.description ? item.description : item;
                let insertion = name;
                if (insertion.includes(" ")) insertion = `"${insertion}"`;
                let itemElement = $(Utilities.formatTString(this.autocompleteItemHTML, {name: name, description: description}));
                if (horizontal) itemElement = $(Utilities.formatTString(this.autocompleteItemHTMLHorizontal, {element: item.element}));
                itemElement.on("mouseenter", () => {
                    inner.find(".selectorSelected-1_M1WV").removeClass("selectorSelected-1_M1WV");
                    itemElement.children(".selectable-3dP3y-").addClass("selectorSelected-1_M1WV");
                });
                itemElement.on("click", () => {
                    var txt = document.querySelector(".textArea-2Spzkt");
                    let insertStart = txt.value.lastIndexOf(" ") + 1;
                    if (insertStart <= 0) insertStart = this.prefix.length;
                    txt.focus();
                    txt.selectionStart = insertStart;
                    txt.selectionEnd = txt.value.length;
                    document.execCommand("insertText", false, insertion + " ");
                });
                elements.push(itemElement);
            }
            if (elements.length) elements[0].children(".selectable-3dP3y-").addClass("selectorSelected-1_M1WV");
            inner.append(elements);
            let textarea = $(".textArea-2Spzkt");
            textarea.on("keydown.autocomplete", (e) => {
                if (e.which != 38 && e.which != 40 && e.which != 9 && e.which != 13 && e.which != 27) return;
                e.stopPropagation();
                e.preventDefault();
                if (e.which == 40) {
                    let nextElement = inner.find(".selectorSelected-1_M1WV").parent().next();
                    inner.find(".selectorSelected-1_M1WV").removeClass("selectorSelected-1_M1WV");
                    if (nextElement.length) nextElement.children(".selectable-3dP3y-").addClass("selectorSelected-1_M1WV");
                    else elements[0].children(".selectable-3dP3y-").addClass("selectorSelected-1_M1WV");
                }
                else if (e.which == 38) {
                    let prevElement = inner.find(".selectorSelected-1_M1WV").parent().prev();
                    inner.find(".selectorSelected-1_M1WV").removeClass("selectorSelected-1_M1WV");
                    if (prevElement.length && prevElement.children(".selectable-3dP3y-").length) {
                        prevElement.children(".selectable-3dP3y-").addClass("selectorSelected-1_M1WV");
                    }
                    else {elements[elements.length - 1].children(".selectable-3dP3y-").addClass("selectorSelected-1_M1WV");}
                }
                else if (e.which == 9 || e.which == 13) {
                    textarea.off("keydown.autocomplete");
                    inner.find(".selectorSelected-1_M1WV").click();
                }
                else if (e.which == 27) {
                    textarea.off("keydown.autocomplete");
                    autocomplete.remove();
                }
                if (inner.find(".selectorSelected-1_M1WV").length) inner.find(".selectorSelected-1_M1WV")[0].scrollIntoViewIfNeeded(false);
                
            });
            return autocomplete;
        }
            
    
        showCommandAutoComplete(items, search) {
            search = search.toLowerCase();
            items = items.filter(x => x.name.toLowerCase().includes(search));
            items.sort((a, b) => {
                var first = this.similar(a.name.toLowerCase(), search);
                var second = this.similar(b.name.toLowerCase(), search);
                
                if (first > second) return -1;
                if (second > first) return 1;
                return 0;
            });
            let ac = this.generateAutocomplete(items.slice(0, items.length > this.MAX_RESULTS ? this.MAX_RESULTS + 1 : items.length + 1), {title: "Commands"});
            ac.appendTo($(".inner-zqa7da"));
        }
    
        similar2(a, b) {
            var tmp;
            if (a.length === 0) { return b.length; }
            if (b.length === 0) { return a.length; }
            if (a.length > b.length) { tmp = a; a = b; b = tmp; }
    
            var i, j, res, alen = a.length, blen = b.length, row = Array(alen);
            for (i = 0; i <= alen; i++) { row[i] = i; }
    
            for (i = 1; i <= blen; i++) {
                res = i;
                for (j = 1; j <= alen; j++) {
                    tmp = row[j - 1];
                    row[j - 1] = res;
                    res = b[i - 1] === a[j - 1] ? tmp : Math.min(tmp + 1, Math.min(res + 1, row[j] + 1));
                }
            }
            return res;
        }
    
        patchTyping() {
            return;
        }
    
        similar(s, t) {
            let d = []; //2d matrix
    
            // Step 1
            let n = s.length;
            let m = t.length;
    
            if (n == 0) return m;
            if (m == 0) return n;
    
            //Create an array of arrays in javascript (a descending loop is quicker)
            for (let i = n; i >= 0; i--) d[i] = [];
    
            // Step 2
            for (let i = n; i >= 0; i--) d[i][0] = i;
            for (let j = m; j >= 0; j--) d[0][j] = j;
    
            // Step 3
            for (let i = 1; i <= n; i++) {
                let s_i = s.charAt(i - 1);
    
                // Step 4
                for (let j = 1; j <= m; j++) {
    
                    //Check the jagged ld total so far
                    if (i == j && d[i][j] > 4) return n;
    
                    let t_j = t.charAt(j - 1);
                    let cost = (s_i == t_j) ? 0 : 1; // Step 5
    
                    //Calculate the minimum
                    let mi = d[i - 1][j] + 1;
                    let b = d[i][j - 1] + 1;
                    let c = d[i - 1][j - 1] + cost;
    
                    if (b < mi) mi = b;
                    if (c < mi) mi = c;
    
                    d[i][j] = mi; // Step 6
    
                    //Damerau transposition
                    if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
                    }
                }
            }
    
            // Step 7
            let length = s.length > t.length ? s.length : t.length;
            return (length - d[n][m]) / length;
        }

    };
};