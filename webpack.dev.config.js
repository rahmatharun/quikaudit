const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "QuikAudit/www/"),
    publicPath: "",
    filename: "js/index.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env",] }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
        use: 'file-loader?name=img/[name].[ext]'
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  
  plugins: [new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/index.css"
    })
  ],
};