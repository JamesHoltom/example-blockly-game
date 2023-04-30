const path = require('path');
const ExtractCssChunksWebpackPlugin = require("extract-css-chunks-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "build"),
    compress: true,
    port: 9000,
  },
  entry: path.resolve(__dirname, "source/import.ts"),
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
        include: path.resolve(__dirname, "source")
      },
      {
        test: /\.css$/i,
        use: [ {
          loader: ExtractCssChunksWebpackPlugin.loader,
          options: {
            publicPath: path.resolve(__dirname, "build")
          }
        }, "css-loader" ],
        include: path.resolve(__dirname, "source")
      }
    ],
  },
  output: {
    clean: true,
    filename: "main.js",
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    new ExtractCssChunksWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "source/template.html")
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Copy the Bootstrap minified files to the build directory.
        {
          from: path.resolve(__dirname, 'node_modules/bootstrap/dist/{css,js}/bootstrap.min.*'),
          to: path.resolve(__dirname, 'build/[name][ext]'),
          toType: "template",
        },
        // Copy the "Built on Blockly" logo to the build directory.
        {
          from: path.resolve(__dirname, 'source/logo_built_on.png'),
          to: path.resolve(__dirname, 'build'),
          toType: 'dir'
        }
      ]
    })
  ],
  resolve: {
    extensions: [ ".js", ".ts", ".css" ],
    modules: [ "node_modules", path.resolve(__dirname, "node_modules") ],
    symlinks: false
  }
};