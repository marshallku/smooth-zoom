import { babel } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";
import dts from "rollup-plugin-dts";

const { default: pkg } = await import("./package.json", {
    with: { type: "json" },
});

const basePlugins = [
    postcss({
        extensions: [".css"],
        plugins: [cssnano()],
    }),
    babel({
        babelHelpers: "bundled",
        plugins: ["transform-object-rest-spread"],
    }),
    typescript(),
];

export default [
    {
        input: "src/index.ts",
        output: {
            file: pkg.module,
            format: "es",
        },
        plugins: [...basePlugins],
    },
    {
        input: "src/index.ts",
        output: {
            file: pkg.types,
        },
        plugins: [dts()],
    },
    {
        input: "src/index.ts",
        output: {
            name: "Zoom",
            file: pkg.main.replace(".min", ""),
            format: "umd",
        },
        plugins: [...basePlugins],
    },
    {
        input: "src/index.ts",
        output: {
            name: "Zoom",
            file: pkg.main,
            format: "umd",
        },
        plugins: [...basePlugins, terser()],
    },
];
