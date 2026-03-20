import ts from 'typescript';
import type { Transformer, Options } from '../types';
export declare function loadTsconfig(fallback: {
    options: ts.CompilerOptions;
    errors: ts.Diagnostic[];
}, filename: string, tsOptions: Options.Typescript): {
    options: ts.CompilerOptions;
    errors: ts.Diagnostic[];
};
declare const transformer: Transformer<Options.Typescript>;
export { transformer };
