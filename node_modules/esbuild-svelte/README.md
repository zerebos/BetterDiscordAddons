# esbuild-svelte

[![npm version](https://badge.fury.io/js/esbuild-svelte.svg)](https://badge.fury.io/js/esbuild-svelte) [![npm downloads](http://img.shields.io/npm/dm/esbuild-svelte.svg)](https://www.npmjs.org/package/esbuild-svelte) [![CI](https://github.com/EMH333/esbuild-svelte/actions/workflows/ci.yml/badge.svg)](https://github.com/EMH333/esbuild-svelte/actions/workflows/ci.yml)

Plugin to compile svelte components for bundling with esbuild.

## Install

Install this plugin, [esbuild](https://github.com/evanw/esbuild) and [Svelte](https://github.com/sveltejs/svelte).

A simple build script looks like

```javascript
import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";

esbuild
  .build({
    entryPoints: ["app.js"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    bundle: true,
    outfile: "out.js",
    plugins: [sveltePlugin()],
    logLevel: "info",
  })
  .catch(() => process.exit(1));
```

The `example-js` folder of this repository is a great starting off point for a "complete" project. You can quickly get started using [degit](https://github.com/Rich-Harris/degit):

```sh
# Clone the JavaScript example to get started
npx degit EMH333/esbuild-svelte/example-js my-svelte-app

# Clone the TypeScript example to get started
npx degit EMH333/esbuild-svelte/example-ts my-svelte-app
```

### CSS Output

By default, `esbuild-svelte` emits external css files from Svelte for `esbuild` to process. If this isn't desired, use a configuration that turns off external css output and instead includes it in the javascript output. For example: `sveltePlugin({compilerOptions: {css: "injected"}})`

### Typescript and Other Svelte Preprocessing

In order to support Typescript and other languages that require preprocessing before being fed into the Svelte compiler, simply add the preprocessor to the `preprocess` option (which accepts both a single preprocessor or an array of them). The example script below is a great place to start, you can also look at the `example-ts` folder for a more complete project.

```javascript
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

esbuild
  .build({
    entryPoints: ["index.js"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    bundle: true,
    outdir: "./dist",
    plugins: [
      esbuildSvelte({
        preprocess: sveltePreprocess(),
      }),
    ],
  })
  .catch(() => process.exit(1));
```

Typescript in `.svelte.ts` files is supported natively.

### `svelte` exports condition

If you are importing a svelte component library, you need to add `"svelte"` to `conditions` in esbuild build options. This lets esbuild use the `svelte` property in svelte component's `exports` conditions in `package.json` .

## Advanced

For incremental or watch build modes, esbuild-svelte will automatically cache files if they haven't changed. This allows esbuild to skip the Svelte compiler for those files altogether, saving time. Setting `cache: false` will disable this file level cache if an issue arises (please report).

You can see the full API for this plugin [here](https://github.com/EMH333/esbuild-svelte/blob/main/dist/index.d.ts), which includes support for Svelte's compiler options, preprocessing API, and more.

## Developing

Clone, `npm install`, `npm link` and it's good to go! Releases are automated (with the right permissions), just by running `npm version patch|minor|major`.
