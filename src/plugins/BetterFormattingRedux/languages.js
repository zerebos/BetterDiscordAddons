module.exports = {
    A: {ada: "Ada", awk: "Awk"},
    B: {bash: "Bash"},
    C: {c: "c", clj: "Clojure", coffeescript: "CoffeeScript", cpp: "C++", crystal: "Crystal", csharp: "C#", css: "CSS"},
    D: {d: "D", dart: "Dart", dockerfile: "Dockerfile"},
    E: {elixir: "Elixir", erl: "Erlang"},
    F: {fs: "F#"},
    H: {hs: "Haskell", html: "HTML/XML"},
    J: {java: "Java", js: "JavaScript", json: "JSON", julia: "Julia"},
    K: {kt: "Kotlin"},
    L: {latex: "LaTeX", lisp: "Lisp", lua: "Lua"},
    O: {ml: "OCaml"},
    M: {markdown: "Markdown"},
    N: {nim: "Nim"},
    P: {perl: "Perl", php: "PHP", powershell: "Powershell", prolog: "Prolog", py: "Python"},
    R: {r: "R", rs: "Rust", ruby: "Ruby"},
    S: {ts: "TypeScript"},
    V: {vbnet: "VB.NET", vhdl: "VHDL"},
    Z: {zsh: "ZSH"},
};

// Log the Object sorted
// Object.keys(module.exports).forEach(function(key, index) {
//     console.log(`${key}: {${Object.keys(module.exports[key]).sort().map(str => `${str}: "${module.exports[key][str]}"`).join(', ')}},`)
// });