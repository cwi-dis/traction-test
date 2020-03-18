const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    bundle: "./public/javascripts/main.ts",
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }, {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  }
};
