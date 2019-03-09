const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = {

    entry: { main: "./src/index.tsx" },

    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].js"
    },

    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"]
    },

    module: {

        rules: [

            {
                test: /\.(ts|tsx)$/,
                enforce: "pre",
                loader: "tslint-loader"
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader"
            },

        ]

    },

    plugins: [
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),

        new HtmlWebpackPlugin({
            inject: false,
            template: "./src/index.html",
            filename: "index.html"
        }),

        new webpack.HotModuleReplacementPlugin()
    ]
};
