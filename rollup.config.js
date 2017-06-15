import legacy from "rollup-plugin-legacy"
import string from "rollup-plugin-string"
import uglify from "rollup-plugin-uglify"
import buble from "rollup-plugin-buble"
import alias from "rollup-plugin-alias"
import commonjs from "rollup-plugin-commonjs"

const min = !!process.env.MIN

const name = "luminate-embed-0.0.2"
let dest = "build/" + name + ".js"

const plugins = [
  legacy({
    "vendor/luminateExtend-1.8.1.js": "luminateExtend"
  }),
  string({
    include: "**/*.css"
  }),
  buble(),
  alias({
    "es6-promise": __dirname + "/node_modules/es6-promise/dist/es6-promise.js",
    "luminateExtend": __dirname + "/vendor/luminateExtend-1.8.1.js",
    "spin.js": __dirname + "/vendor/spin-2.3.2.js",
    "underscore": __dirname + "/node_modules/underscore-es"
  }),
  commonjs({
    include: "node_modules/**",
    sourceMap: false
  })
]

if (min) {
  dest = "build/" + name + ".min.js"

  // Set IE8 compatibility flags for stuff like `.catch` -> `["catch"]`.
  plugins.push(uglify({
    compress: { screw_ie8: false },
    mangle: { screw_ie8: false },
    output: { screw_ie8: false },
  }))
}

export default {
  entry: "src/index.js",
  format: "iife",
  moduleName: "luminate-embed",
  dest,
  plugins
}
