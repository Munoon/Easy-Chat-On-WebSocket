const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    filename: './index.js',
    path: path.resolve(__dirname, 'public')
  },

  /*
    For development - development
    For production - production
    https://webpack.js.org/configuration/mode/
  */
  mode: 'development',

  // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',
  
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    contentBase: './public'
  },

  module: {
    rules: [
      // {
      //   // https://webpack.js.org/loaders/babel-loader/
      //   test: /\.m?js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env'],

      //       /*
      //         npm install @babel/plugin-transform-runtime --save-dev
      //         npm install @babel/runtime --save-dev
      //         https://github.com/babel/babel-loader#troubleshooting
      //       */
      //       plugins: ['@babel/plugin-transform-runtime'],
      //     }
      //   }
      // },
      {
        // https://webpack.js.org/loaders/style-loader/
        // https://webpack.js.org/loaders/css-loader/
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },

  plugins: [
    // https://webpack.js.org/plugins/html-webpack-plugin/
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),

    // https://webpack.js.org/plugins/copy-webpack-plugin/
    new CopyWebpackPlugin([
        { from: './src/style.css' }
    ])
  ]
};