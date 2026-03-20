import { sveltePreprocess } from './autoProcess';
/** @deprecated Use the named export instead: `import { sveltePreprocess } from 'svelte-preprocess'` */
declare const _default: typeof sveltePreprocess;
export default _default;
export { sveltePreprocess } from './autoProcess';
export { pug } from './processors/pug';
export { coffeescript } from './processors/coffeescript';
export { typescript } from './processors/typescript';
export { less } from './processors/less';
export { scss, sass } from './processors/scss';
export { stylus } from './processors/stylus';
export { postcss } from './processors/postcss';
export { globalStyle } from './processors/globalStyle';
export { babel } from './processors/babel';
export { replace } from './processors/replace';
