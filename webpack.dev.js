const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");


module.exports = merge(common, {

    mode: "development",

    devtool: "inline-source-map",

    devServer: {
        hot: true,
        contentBase: path.join(__dirname, "public")
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },

    plugins: [

        new webpack.HotModuleReplacementPlugin()

    ]

});
