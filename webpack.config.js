const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve("dist"),
        filename: "zoom.js",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: "exports-loader",
                options: {
                    type: "commonjs",
                    exports: {
                        syntax: "single",
                        name: "Zoom",
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".js"],
    },
};
