import type { PreprocessorGroup, Options } from '../types';
/** Adapted from https://github.com/TehShrike/svelte-preprocess-postcss */
declare const postcss: (options?: Options.Postcss) => PreprocessorGroup;
export { postcss };
export default postcss;
