"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = exports.babel = exports.globalStyle = exports.postcss = exports.stylus = exports.sass = exports.scss = exports.less = exports.typescript = exports.coffeescript = exports.pug = exports.sveltePreprocess = void 0;
const autoProcess_1 = require("./autoProcess");
// default auto processor
// crazy es6/cjs export mix for backward compatibility
/** @deprecated Use the named export instead: `import { sveltePreprocess } from 'svelte-preprocess'` */
// eslint-disable-next-line no-multi-assign
exports.default = exports = module.exports = autoProcess_1.sveltePreprocess;
// also export auto preprocessor as named export to sidestep default export type issues with "module": "NodeNext" in tsconfig.
// Don't just do export { sveltePreprocess } because the transpiled output is wrong then.
var autoProcess_2 = require("./autoProcess");
Object.defineProperty(exports, "sveltePreprocess", { enumerable: true, get: function () { return autoProcess_2.sveltePreprocess; } });
// stand-alone processors to be included manually, use their named exports for better transpilation or else node will not detect the named exports properly
var pug_1 = require("./processors/pug");
Object.defineProperty(exports, "pug", { enumerable: true, get: function () { return pug_1.pug; } });
var coffeescript_1 = require("./processors/coffeescript");
Object.defineProperty(exports, "coffeescript", { enumerable: true, get: function () { return coffeescript_1.coffeescript; } });
var typescript_1 = require("./processors/typescript");
Object.defineProperty(exports, "typescript", { enumerable: true, get: function () { return typescript_1.typescript; } });
var less_1 = require("./processors/less");
Object.defineProperty(exports, "less", { enumerable: true, get: function () { return less_1.less; } });
var scss_1 = require("./processors/scss");
Object.defineProperty(exports, "scss", { enumerable: true, get: function () { return scss_1.scss; } });
Object.defineProperty(exports, "sass", { enumerable: true, get: function () { return scss_1.sass; } });
var stylus_1 = require("./processors/stylus");
Object.defineProperty(exports, "stylus", { enumerable: true, get: function () { return stylus_1.stylus; } });
var postcss_1 = require("./processors/postcss");
Object.defineProperty(exports, "postcss", { enumerable: true, get: function () { return postcss_1.postcss; } });
var globalStyle_1 = require("./processors/globalStyle");
Object.defineProperty(exports, "globalStyle", { enumerable: true, get: function () { return globalStyle_1.globalStyle; } });
var babel_1 = require("./processors/babel");
Object.defineProperty(exports, "babel", { enumerable: true, get: function () { return babel_1.babel; } });
var replace_1 = require("./processors/replace");
Object.defineProperty(exports, "replace", { enumerable: true, get: function () { return replace_1.replace; } });
