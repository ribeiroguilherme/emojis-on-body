const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = merge(common, {

    mode: "production",

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },

    //https://medium.com/@hpux/webpack-4-in-production-how-make-your-life-easier-4d03e2e5b081
    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true
    },

    optimization: {

        runtimeChunk: false,

        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor_app",
                    chunks: "all",
                    minChunks: 2
                }
            }
        }
    },

    plugins: [

        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});
