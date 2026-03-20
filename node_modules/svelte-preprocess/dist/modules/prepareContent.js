"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareContent = void 0;
// todo: could use magic-string and generate some sourcemaps 🗺
function prepareContent({ options, content, }) {
    if (typeof options !== 'object') {
        return content;
    }
    if (options.stripIndent) {
        content = stripIndent(content);
    }
    if (options.prependData) {
        content = `${options.prependData}\n${content}`;
    }
    return content;
}
exports.prepareContent = prepareContent;
/** Get the shortest leading whitespace from lines in a string */
function minIndent(s) {
    const match = s.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
        return 0;
    }
    return match.reduce((r, a) => Math.min(r, a.length), Infinity);
}
/** Strip leading whitespace from each line in a string */
function stripIndent(s) {
    const indent = minIndent(s);
    if (indent === 0) {
        return s;
    }
    const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');
    return s.replace(regex, '');
}
