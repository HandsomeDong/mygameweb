/**
 * Created by lsd on 2017/2/17.
 */

var path = require("path")
// var webpack = require('webpack')
//var BundleTracker = require('webpack-bundle-tracker')
// var UglifyJsPlugin = require("./node_modules/webpack/lib/optimize/UglifyJsPlugin");

module.exports = {
    context: __dirname,

    entry: {
        "index":['./static/entry/index.js'],
        "reversi":['./static/entry/reversi.js']
    },

    output: {
        path: path.resolve('./static/bundles/'),
        filename: "[name].bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader'
                ]
            }
        ]
    }
}

