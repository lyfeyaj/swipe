'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 50 }),
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    filename: '../index.html',
    template: 'app/index.ejs',
    hash: false
  }),
];

var publicPath = 'http://127.0.0.1:2992/';
var babelLoader = 'babel?cacheDirectory=true&presets[]=es2015&presets[]=react';

module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: {
    app: ['app.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    publicPath: publicPath,
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        loaders: ['react-hot-loader', babelLoader],
        exclude: /(node_modules|bower_components)/
      },
      { test: /\.css$/,    loader: 'style-loader!css-loader!resolve-url' },
      { test: /\.png$/,    loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.jpg$/,    loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.gif$/,    loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: 'file-loader?name=[name].[ext]' }
    ],
    preLoaders: [
      {
        test: /\.js|jsx$/,
        include: pathToRegExp(path.join(__dirname, 'app')),
        loaders: [
          'eslint-loader',
          babelLoader
        ]
      }
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    root: [path.join(__dirname, 'app')],
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.html', '.css']
  },
  plugins: plugins,
  fakeUpdateVersion: 0,
  devServer: {
    publicPath: publicPath,
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
};

function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); }
function pathToRegExp(p) { return new RegExp('^' + escapeRegExpString(p)); }
