'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 50 }),
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    filename: '../index.html',
    template: 'app/index.ejs',
    hash: false
  }),
];

const host = '127.0.0.1';
const port = 2992;
const publicPath = `http://${host}:${port}/`;
const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: ['@babel/preset-env', '@babel/preset-react']
  }
};

module.exports = {
  mode: 'development',
  devtool: 'eval',
  context: __dirname,
  entry: {
    app: ['app.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    publicPath,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [babelLoader]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          { loader: 'url-loader', options: { prefix: 'img/&limit=5000' } }
        ]
      },
      {
        test: /\.(woff|svg|ttf|eot)([?]?.*)$/,
        use: [
          { loader: 'file-loader', options: { name: '[name].[ext]' }  }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'app'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx', '.html', '.css']
  },
  plugins,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port,
    host,
    publicPath,
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
};
