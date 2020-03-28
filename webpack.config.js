const path = require('path');
const fs  = require('fs');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const lessToJs = require('less-vars-to-js');
// const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-theme-vars.less'), 'utf8'));

const SRC_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'assets/js');

module.exports = {
    entry: path.resolve(SRC_DIR, 'App.js'),
    output: {
      filename: 'bundle.js',
      path: BUILD_DIR,
      publicPath: '/'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'sass-loader'}
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    // {loader: 'postcss-loader'},
                    {loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: {
                                "@primary-color": '#5d8aa8'
                            }
                        }
                    } 
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            ["import", { "libraryName": "antd", "style": true}]
                        ]
                    }
                }
            },
        ]
    },
    plugins: [
        // Or: To strip all locales except “en”, “es-us” and “ru”
        // (“en” is built into Moment and can’t be removed)
        new MomentLocalesPlugin({
            localesToKeep: [],
        }),
    ],
};