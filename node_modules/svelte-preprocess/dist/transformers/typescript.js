"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformer = exports.loadTsconfig = void 0;
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const errors_1 = require("../modules/errors");
/**
 * Map of valid tsconfigs (no errors). Key is the path.
 */
const tsconfigMap = new Map();
function createFormatDiagnosticsHost(cwd) {
    return {
        getCanonicalFileName: (fileName) => fileName.replace('.injected.ts', ''),
        getCurrentDirectory: () => cwd,
        getNewLine: () => typescript_1.default.sys.newLine,
    };
}
function formatDiagnostics(diagnostics, basePath) {
    if (Array.isArray(diagnostics)) {
        return typescript_1.default.formatDiagnosticsWithColorAndContext(diagnostics, createFormatDiagnosticsHost(basePath));
    }
    return typescript_1.default.formatDiagnostic(diagnostics, createFormatDiagnosticsHost(basePath));
}
let warned_verbatim = false;
function getCompilerOptions({ filename, options, basePath, }) {
    var _a;
    const inputOptions = typescript_1.default.convertCompilerOptionsFromJson((_a = options.compilerOptions) !== null && _a !== void 0 ? _a : {}, basePath);
    const { errors, options: convertedCompilerOptions } = options.tsconfigFile !== false || options.tsconfigDirectory
        ? loadTsconfig(inputOptions, filename, options)
        : inputOptions;
    if (errors.length) {
        throw new Error(formatDiagnostics(errors, basePath));
    }
    const compilerOptions = {
        target: typescript_1.default.ScriptTarget.ES2015,
        ...convertedCompilerOptions,
        // force module(resolution) to esnext and a compatible moduleResolution. Reason:
        // transpileModule treats NodeNext as CommonJS because it doesn't read the package.json.
        // Also see https://github.com/microsoft/TypeScript/issues/53022 (the filename workaround doesn't work).
        module: typescript_1.default.ModuleKind.ESNext,
        moduleResolution: convertedCompilerOptions.moduleResolution ===
            typescript_1.default.ModuleResolutionKind.Bundler
            ? typescript_1.default.ModuleResolutionKind.Bundler
            : typescript_1.default.ModuleResolutionKind.Node10,
        customConditions: undefined, // fails when using an invalid moduleResolution combination which could happen when we force moduleResolution to Node10
        allowNonTsExtensions: true,
        // Clear outDir since it causes source map issues when the files aren't actually written to disk.
        outDir: undefined,
    };
    if (!warned_verbatim && !compilerOptions.verbatimModuleSyntax) {
        warned_verbatim = true;
        console.warn('\x1b[1m%s\x1b[0m', 'The TypeScript option verbatimModuleSyntax is now required when using Svelte files with lang="ts". Please add it to your tsconfig.json.');
        // best effort to still add it, if possible, in case no config was found whatsoever
        if (Object.keys(inputOptions.options).length === 0 &&
            convertedCompilerOptions === inputOptions.options) {
            compilerOptions.verbatimModuleSyntax = true;
        }
    }
    if (compilerOptions.target === typescript_1.default.ScriptTarget.ES3 ||
        compilerOptions.target === typescript_1.default.ScriptTarget.ES5) {
        throw new Error(`Svelte only supports es6+ syntax. Set your 'compilerOptions.target' to 'es6' or higher.`);
    }
    return compilerOptions;
}
function transpileTs({ code, fileName, basePath, options, compilerOptions, transformers, }) {
    const { outputText: transpiledCode, sourceMapText, diagnostics, } = typescript_1.default.transpileModule(code, {
        fileName,
        compilerOptions,
        reportDiagnostics: options.reportDiagnostics !== false,
        transformers,
    });
    if (diagnostics && diagnostics.length > 0) {
        // could this be handled elsewhere?
        const hasError = diagnostics.some((d) => d.category === typescript_1.default.DiagnosticCategory.Error);
        if (hasError) {
            const formattedDiagnostics = formatDiagnostics(diagnostics, basePath);
            console.log(formattedDiagnostics);
            (0, errors_1.throwTypescriptError)();
        }
    }
    return { transpiledCode, sourceMapText, diagnostics };
}
function loadTsconfig(fallback, filename, tsOptions) {
    if (typeof tsOptions.tsconfigFile === 'boolean') {
        return fallback;
    }
    let basePath = process.cwd();
    const fileDirectory = (tsOptions.tsconfigDirectory ||
        (0, path_1.dirname)(filename));
    let tsconfigFile = tsOptions.tsconfigFile ||
        typescript_1.default.findConfigFile(fileDirectory, typescript_1.default.sys.fileExists);
    if (!tsconfigFile) {
        return fallback;
    }
    tsconfigFile = (0, path_1.isAbsolute)(tsconfigFile)
        ? tsconfigFile
        : (0, path_1.join)(basePath, tsconfigFile);
    basePath = (0, path_1.dirname)(tsconfigFile);
    if (tsconfigMap.has(tsconfigFile)) {
        return {
            errors: [],
            options: tsconfigMap.get(tsconfigFile),
        };
    }
    const { error, config } = typescript_1.default.readConfigFile(tsconfigFile, typescript_1.default.sys.readFile);
    if (error) {
        throw new Error(formatDiagnostics(error, basePath));
    }
    // Do this so TS will not search for initial files which might take a while
    config.include = [];
    let { errors, options } = typescript_1.default.parseJsonConfigFileContent(config, typescript_1.default.sys, basePath, fallback.options, tsconfigFile);
    // Filter out "no files found error"
    errors = errors.filter((d) => d.code !== 18003);
    if (errors.length === 0) {
        tsconfigMap.set(tsconfigFile, options);
    }
    return { errors, options };
}
exports.loadTsconfig = loadTsconfig;
let warned_mixed = false;
const transformer = async ({ content, filename = 'input.svelte', options = {}, }) => {
    const basePath = process.cwd();
    filename = (0, path_1.isAbsolute)(filename) ? filename : (0, path_1.resolve)(basePath, filename);
    const compilerOptions = getCompilerOptions({ filename, options, basePath });
    if ('handleMixedImports' in options && !warned_mixed) {
        warned_mixed = true;
        console.warn('The svelte-preprocess TypeScript option handleMixedImports was removed. Use the verbatimModuleSyntax TypeScript option instead.');
    }
    const { transpiledCode, sourceMapText, diagnostics } = transpileTs({
        code: content,
        fileName: filename,
        basePath,
        options,
        compilerOptions,
    });
    return {
        code: transpiledCode,
        map: sourceMapText,
        diagnostics,
    };
};
exports.transformer = transformer;
