const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const HTMLPlugin = require('html-webpack-plugin')
var PrerenderSpaPlugin = require('prerender-spa-plugin')
var PrerenderRoute = require('./prerender-route')
var pathToBourbon = require('node-bourbon').includePaths //???
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    devtool: '#source-map',
    entry: {
        app: './src/static-entry.js',
        vendor: ['vue', 'vue-router', 'vuex', 'lru-cache', 'es6-promise']
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        loaders: [{
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new FaviconsWebpackPlugin(path.join(__dirname, '../src/assets/logo.png')),
        new webpack.LoaderOptionsPlugin({
            vue: vueConfig
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [pathToBourbon]
                }
            }
        }),
        new HTMLPlugin({
            template: 'index.static.html'
        }),
        new PrerenderSpaPlugin(
            // Absolute path to compiled SPA
            path.join(__dirname, '../dist'),
            // List of routes to prerender
            PrerenderRoute.routes,
            {
                ignoreJSErrors: true,
                captureAfterTime: 50000,
                phantomPageViewportSize: {
                    width: 1280,
                    height: 800
                },
            }
        )
    ]
}
