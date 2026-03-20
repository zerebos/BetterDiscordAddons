# Changelog

## 0.9.4

- Do not run Svelte preprocessors against Svelte module files ([#354](https://github.com/EMH333/esbuild-svelte/issues/354))

## 0.9.3

- Fix regression introduced in 0.9.0 relating to the `include` option ([#306](https://github.com/EMH333/esbuild-svelte/issues/306))

## 0.9.2

- Fix regression introduced in 0.9.1 related to `*.svelte.ts` files and the `loader` option
- Further restrict options passed to transform `*.svelte.ts` files by default

## 0.9.1

- Fix `*.svelte.ts` transformation issues related to minification and file formats
- Add `esbuildTsTransformOptions` to allow esbuild configuration to be passed directly when transforming `*.svelte.ts` files

## 0.9.0 (Breaking)

This will be the last pre-v1 minor release if all goes according to plan.

- Add support for `*.svelte.js` and `*.svelte.ts` Svelte modules (Thank you [@ElijahJohnson5 for the contribution!](https://github.com/EMH333/esbuild-svelte/pull/254))
- Remove support for boolean values for Svelte `css` compile option (use `external` or `injected` instead)
- Bump svelte minimum version to `4.2.1`
- Bump esbuild minimum version to `0.17.0`
- Bump Node minimum version to 18 (lowest supported by Svelte 5)
- Remove `overzealous` cache option (was unusable)
- Remove `fromEntryFile` option (was unusable)

## 0.8.2

- Update Svelte peer dependency version lock to include Svelte 5 pre-release versions ([#235](https://github.com/EMH333/esbuild-svelte/issues/235#issuecomment-2121502360))

  The version lock will be updated once Svelte 5 is released to remove support for pre-release versions. But for now, this should help prevent needing to use `--force` or `--legacy-peer-deps` when using Svelte 5 pre-releases.

## 0.8.1

- Update Svelte peer dependency version lock to include Svelte 5

  This should have no impact on Svelte 3 or 4 users, but will allow folks to start trying out Svelte 5 if they so please. Any errors or issues should be reported as bugs in order to resolve them before Svelte 5 is offically released.

  **Plugin versions `v0.8.x` will be the last to support Svelte 3 and Svelte 4 below `v4.2.1`**

## 0.8.0 (Breaking)

- **Minorly Breaking** Caching is automatically enabled after two sucessful builds when using the `context` esbuild API

  Previously caching was automatically enabled when using the watch or incremental esbuild options, but those were removed in esbuild `v0.17.0`. This change brings back the automatic cache enabling when using the `context` API which supports the same features as the previous watch and incremental options. esbuild does not provide a way for plugins to determine if the `context` API is being used, so this feature is enabled after two successful builds. This should be a reasonable compromise between not enabling the cache at all and enabling it for every build (which wastes time and space if caching isn't needed).

  If you are using the `context` API and want to disable the cache, you can set the `cache` option to `false` in the plugin options but this isn't recommended (if you do need to disable the cache for some reason, please open an issue to see if your usecase can be fixed).

- **Minorly Breaking** Add dependency to `@jridgewell/trace-mapping` so error messages are more accurate when using preprocessors ([#83](https://github.com/EMH333/esbuild-svelte/issues/83))

  If you are using Svelte 4, this doesn't add additional dependencies because that package is already required by Svelte 4.

- Update development esbuild version to `0.19.0`

  This means that this plugin now supports additional inhancements when using the `context` esbuild `v0.17.0` API as detailed below.

## 0.7.4

- Lock Svelte peerDependency to `>=3.43.0 <5` to protect against breaking changes in future Svelte releases
- Set compilerOptions.css to `external` by default if using Svelte v4 or higher ([#185](https://github.com/EMH333/esbuild-svelte/issues/185))
- Add compatibility tests for different versions of Svelte and esbuild to prevent regressions
- Switch development version of Svelte to v4

## 0.7.3

- Switch from `.npmignore` to `files` property of `package.json` to prevent accidental file inclusion

## 0.7.2

- Support string values for Svelte compiler option `css` added in Svelte `v3.53.0` ([#109](https://github.com/EMH333/esbuild-svelte/pull/109), [#150](https://github.com/EMH333/esbuild-svelte/pull/150))
- Update misc dependencies

## 0.7.1

- Fix watch mode if preprocessing failed ([#132](https://github.com/EMH333/esbuild-svelte/pull/132))
- Remove support for Node 12

  This should probably be another breaking change however Node 12 has reached end of life and is no longer supported. If you are using Node 12, please upgrade to Node 14 in order to continue use of this plugin (or open an issue if you disagree).

## 0.7.0 (Breaking)

- **Breaking** Svelte has been switched to a peer dependency which allows Svelte to be updated independently of this plugin

  Migration is as simple as `npm i --save-dev svelte` if you don't have `svelte` as a dependency already.

- **Breaking** Remove `compileOptions` since it was deprecated in v0.6.0

## 0.6.3

- Add `filterWarnings` option to filter the Svelte warnings that esbuild-svelte passes to esbuild (Thanks [@Prinzhorn](https://github.com/EMH333/esbuild-svelte/pull/108))

  See `dist/index.d.ts` for the type definition of the new option. This hope is to replicate `onwarn` from the Svelte Rollup plugin, but in a way that is more conducive to the way esbuild handles things.

## 0.6.2

- Update Svelte to 3.46.2
- (Unstable) Add "overzealous" cache mode that invalidates the cached version of a file if an imported Svelte component has changed ([#102](https://github.com/EMH333/esbuild-svelte/issues/102))

  As with the standard caching system, this only applies in incremental or watch modes. This shouldn't be used in most situations, but if files aren't rebuilding when they are expected to, then this can be a helpful step before disabling the cache outright. I'm considering this an unstable feature because I'm not set on this way of doing it. This option may change in implementation, name and/or be removed at any time.

## 0.6.1

- Update Svelte to 3.45.0
- Auto create releases
- Rework and improve CI process

## 0.6.0

- **Breaking**: Switch `compileOptions` to `compilerOptions` to better reflect other bundler plugins (Thanks [@tyler-boyd](https://github.com/EMH333/esbuild-svelte/pull/86))
- Add `include` option so the regex filter that selects compiled files can be changed (Thanks [@tyler-boyd](https://github.com/EMH333/esbuild-svelte/pull/86))
- Fix "invalid character" error when using preprocessors and non-ASCII characters on NodeJS 15+. Upstream fix in progress (fixes [#84](https://github.com/EMH333/esbuild-svelte/issues/84))

## 0.5.7

- Handle preprocessors when dealing with sourcemaps

  This should result in more accurate sourcemaps when dealing with one or more preprocessors. Though this was already handled from a purely sourcemap symbols perspective, the sourceContents is now included which should make it easier to understand how the Svelte file was transformed.

- Update Svelte to 3.44.0

## 0.5.6

- Emergency release to fix errors in distributed files

## 0.5.5

- Return `resolveDir` for created css files so they can import content ([#69](https://github.com/EMH333/esbuild-svelte/issues/69))
- Update Svelte to 3.42.6
- Add filtering to determine if the file to be processed is directly from esbuild `entryPoints`.

  This is in preparation for a feature that allows a binding to be automatically generated if a .svelte file is set as an entry point. The current configuration defaults to `false` in order to preserve current behavior, however the code is included for future expansion. Most all of my (and others) projects could be simplified once this is added, though I will preserve the current behavior for those that simply want to compile Svelte components using esbuild.

## 0.5.4

- Fix CSS sourcemaps which are now supported with esbuild v0.12.19 ([#63](https://github.com/EMH333/esbuild-svelte/issues/63))
- Update Svelte to 3.42.1
- Reduce number of development dependencies

## 0.5.3

- Add dependency-aware caching for incremental builds that use a preprocessor ([#59](https://github.com/EMH333/esbuild-svelte/issues/59))
- Report file dependencies to esbuild when using watch mode

  Likely not something very many people ran into but svelte-esbuild now notifies esbuild of all preprocessor dependecies when watch mode is enabled. This means changes to one of those files will now trigger esbuild to rebuild, improving developer experience.

## 0.5.2

- Disabled cache auto-enabling when using a preprocessor (better fix incoming)

  This is pretty embarrassing and something I should have caught earlier (especially because the esbuild website specifically calls it out). I have a good idea about how to properly fix the issue ([#59](https://github.com/EMH333/esbuild-svelte/issues/59)) but wanted to get a quick and dirty fix out there before others ran into it. This does affect rebuild performance if using preprocessors.

  I don't consider disabling the auto-cache in certain scenarios to be a breaking change. The auto-enable cache feature is a progressive enhancement anyway so worst case performance degrades a bit while I get this fixed.

- Improve testing (switched to `uvu`)
- Update Svelte to 3.38.3

## 0.5.1

- Update Svelte to 3.38.2 because of bugs in SSR updates

## 0.5.0

- **Breaking**: Require esbuild 0.9.6 or greater to support `initialOptions` property
- **Potentially Breaking**: Auto-enable cache when build is in incremental mode or in watch mode
- **Breaking**: Remove `preprocessor` option, use `preprocess` instead
- Update Svelte to 3.38.0

## 0.4.3

- Update Svelte to 3.35.0
- Update esbuild peer dependency to allow for 0.9.0 version

## 0.4.2

- Add JSDoc deprecation comment to `preprocessor` and add comments for other options
- Fix error arising from esbuid release 0.8.51 and changes to import resolution (Thanks [@AlexxNB](https://github.com/EMH333/esbuild-svelte/pull/34)!)
- Update dependencies

## 0.4.1

- Deprecate `preprocessor` option in favor of `preprocess`

  This is more in line with other bundler plugins which only use the `preprocess` option. This allows common `svelte.config.js` configurations to be used without modification. The `preprocessor` option is now deprecated, and will be removed with the next breaking release.

- (unstable) Add a cache for incremental and watch builds ([#19](https://github.com/EMH333/esbuild-svelte/issues/19))

  This should speed up building large projects that use incremental esbuild builds or use the new `--watch` flag for esbuild. It is not required (or recommended) on normal `build` or `transform` calls. To enable this feature, simply set the `cache` option to `true`. This feature should be considered unstable until I get better test coverage.

- Update and fix example
- Update and add more detail to README
- Update Svelte to 3.32.1

## 0.4.0 (**Breaking**)

- **Breaking** Combine `esbuild-svelte/configurable` and `esbuild-svelte` into one API

  Instead whatever you were importing before, now just import `esbuild-svelte` and call it as a function to get the plugin.

  I've been wanting to do this for a long time (especially since [#12](https://github.com/EMH333/esbuild-svelte/issues/12)) and it seemed like a decent time to sneak this in. I know this breaks builds (sorry about that), I'd rather get it over with now instead of down the line (once this hits `v1.0`). The author of esbuild has some significant code spliting changes incoming in the beginning of 2021, I'll likely bump this to `v1.0` after that.

- Use TypeScript for development
- Fix example to use `esbuild-svelte` import (`npm link` is a useful command...)

## 0.3.2

- Fix sourcemap generation when exporting external css ([#13](https://github.com/EMH333/esbuild-svelte/issues/13))
- Update Svelte to 3.31.0

## 0.3.1

- Fix path resolution for Windows when exporting css to external files (Thanks [@markoboy](https://github.com/EMH333/esbuild-svelte/pull/8))

  This is already covered by tests (when running on Windows) but I'm not going to run CI on Windows. If it continues to be a problem, I will add explict tests but I don't see that becoming the case.

- Add esbuild as peer dependency
- Update Svelte to 3.29.7

## 0.3.0

- **(Breaking)** Support separate CSS output stream

  No more CSS in JS, yay! If for whatever reason this doesn't work, then just set the `css` compilerOption to `true` and it will revert to the previous behavior.

  In order to implement this, I created a fake file extension loader then set those files to be imported from the js code emited. A map acts as storage between the loaders. I'm not 100% happy with this system because it feels brittle and incomplete but it will work for now. If you have suggestions for how I could do this better, I am all ears!

## 0.2.1

- Fix preprocessor support, currently considered unstable until I test it with some of my personal projects
- Update README because I forgot that I added preprocessor support

## 0.2.0

- Add some simple smoke tests
- Add Github CI
- Add Dependabot
- Fix `configurable` so it actually works now (also add _a bit_ of test coverage so it won't happen again)
- Add typescript types to `configurable` preping for eventual conversion to typescript for development
- Add .npmignore

## 0.1.1

- Format some files
- Update README to reflect the release of the plugin API

## 0.1.0

- Update to esbuild API version 0.8.1
- Add Svelte compiler configuration options
- Fix error/warning reporting from Svelte

## 0.0.4

- Add publishing workflow to reduce mistakes in the future

## 0.0.3

- Update example
- Correct module export
- Update README

## 0.0.2

- Actually export the plugin for use :)
