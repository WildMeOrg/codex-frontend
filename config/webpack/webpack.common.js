const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const minimist = require('minimist');
const config = require('../config.json');

const argv = minimist(process.argv.slice(2), {
  string: 'houston',
});

const isDev =
  (process.env && process.env.NODE_ENV === 'development') ||
  process.env.env === 'dev';

const defaultHoustonUrl = isDev
  ? config.houston_dev_url
  : config.houston_prod_url;

const houstonUrl =
  argv.houston === undefined ? defaultHoustonUrl : argv.houston;

const globals = {
  __DEV__: isDev && !process.env.LINKED_DEV,
  __config__: JSON.stringify(config),
  __houston_url__: JSON.stringify(houstonUrl),
};

const rootDir = resolve(__dirname, '../../');
const devdist = path.resolve(rootDir, 'devdist');

// no entry specified - only things that would be the same between each app
module.exports = {
  target: 'web',
  entry: { main: resolve(rootDir, 'src', 'index.jsx') },
  output: {
    filename: isDev ? 'bundle.js' : '[name].[contenthash:8].js',
    chunkFilename: isDev
      ? '[name].chunk.js'
      : '[name].[contenthash:8].chunk.js',
    publicPath: '/',
    path: devdist,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: path.resolve(rootDir, 'src'),
        use: {
          loader: 'babel-loader',
          options: JSON.parse(
            fs.readFileSync(path.resolve(rootDir, '.babelrc')),
          ),
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        sideEffects: true,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(gif|jpg|jpeg|png|webm)$/,
        include: [resolve(rootDir, 'src')],
        use: {
          loader: 'file-loader',
          options: {},
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'file-loader'],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: {
          loader: 'file-loader',
          options: {},
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.wasm',
      '.mjs',
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx',
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: -10,
        },
        icons: {
          name: 'icons',
          test: /[\\/]static\/icons[\\/]/,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `,
      meta: {
        viewport:
          'width=device-width, initial-scale=1, user-scalable=no',
      },
      title: '',
      filename: 'index.html',
      minify: {
        useShortDoctype: true,
        keepClosingSlash: true,
        collapseWhitespace: true,
        preserveLineBreaks: true,
      },
    }),
    new webpack.DefinePlugin(globals),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolve(rootDir, 'src/houston/404.html'),
          to: '404.html',
        },
        {
          from: resolve(rootDir, 'src/houston/ocean.jpeg'),
          to: 'ocean.jpeg',
        },
      ],
    }),
  ],
};
