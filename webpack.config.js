const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    // filename: "[name].[contenthash].css",
    filename: "[name]",
    disable: process.env.NODE_ENV === "development",
    allChunks: true,
});


module.exports = {
    entry: {
        "main.js": "./src/main.js",
        "style.css": "./style/main.sass"
    },
    output: {
        path: path.resolve(__dirname, 'bundles'),
        publicPath: '/bundles/',
        filename: '[name]',
    },
    module: {
        rules: [
            {
                test: [/\.sass$/, /\.scss$/],
                exclude: /node_modules/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'sass-loader',
                            // options: {
                            //     includePaths: [path.resolve(__dirname, 'node_modules')]
                            // },
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: [/\.jsx?$/, /\.es6$/],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'env', 'stage-0'],
                        plugins: ['transform-runtime'],
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimeType: 'application/font-woff',
                    }
                },
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimeType: 'application/octet-stream',
                    }
                },
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimeType: 'image/svg+xml',
                    }
                },
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'file-loader',
                },
            },
        ],
    },
    plugins: [
        extractSass
    ],
    // resolve: {
    //     // extensions: [
    //     //     '.js', '.es6'
    //     // ],
    //     modules: ['node_modules', './node_modules', './node_modules/font-awesome/fonts']
    // },
    devtool: 'source-map',
    // devtool: 'eval-source-map',
    watch: true
}
