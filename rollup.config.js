import resolve from "@rollup/plugin-node-resolve"; // resoleve node_modules dependencies
import commonjs from "@rollup/plugin-commonjs"; // convert CommonJS modules to ES6
import babel from "@rollup/plugin-babel"; // transpiling modern JS and JSX
import svg from "rollup-plugin-svg"; // import svg files
import postcss from "rollup-plugin-postcss"; // process CSS
import { terser } from "rollup-plugin-terser"; // code minification
import alias from "@rollup/plugin-alias"; // manage paths and aliases
import replace from "@rollup/plugin-replace"; // replace variables in code

const production = !process.env.ROLLUP_WATCH; // determine the build mode

export default {
  input: "./src/index.js", // Pointing to library's main file
  // Setting up output files
  output: [
    {
      file: "dist/index.es.js", // ES module
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.cjs", // CommonJS module
      format: "cjs",
      sourcemap: true,
    },
  ],
  // Code Processing Plugins
  plugins: [
    alias({
      entries: [
        { find: "react", replacement: "preact/compat" },
        { find: "react-dom", replacement: "preact/compat" },
        { find: "../preact", replacement: "preact" },
        { find: "../preact/hooks", replacement: "preact/hooks" },
        { find: "../preact/jsx-runtime", replacement: "preact/jsx-runtime" },
      ],
    }),
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".json", ".node"],
      mainFields: ["browser", "module", "main"],
    }),
    commonjs({
      include: "node_modules/**",
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
      plugins: ["@babel/plugin-transform-react-jsx"],
    }),
    postcss({
      extensions: [".css"],
      minimize: true,
      extract: "assets/styles.css",
    }),
    svg(),
    production &&
      terser({
        mangle: {
          reserved: ["apiSelectField", "ApiSelectField", "rangeField", "RangeField", "formFields.register", "formFields"],
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
  ],
  external: [
  ],
};
