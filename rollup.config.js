import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import pkg from "./package.json";

const basePlugins = [
    postcss({
        extensions: [".css"],
        plugins: [cssnano()],
    }),
    babel({
        babelHelpers: "bundled",
        plugins: ["transform-object-rest-spread"],
    }),
];

export default [
    {
        input: "src/index.js",
        output: {
            file: pkg.module,
            format: "es",
        },
        plugins: [...basePlugins],
    },
    // {
    //     input: "src/index.js",
    //     output: {
    //         name: "Zoom",
    //         file: pkg.main.replace(".min", ".browser"),
    //         format: "umd",
    //     },
    //     plugins: [...basePlugins, terser()],
    // },
    {
        input: "src/index.js",
        output: {
            name: "Zoom",
            file: pkg.main.replace(".min", ""),
            format: "umd",
        },
        plugins: [...basePlugins],
    },
    {
        input: "src/index.js",
        output: {
            name: "Zoom",
            file: pkg.main,
            format: "umd",
        },
        plugins: [...basePlugins, terser()],
    },
];
