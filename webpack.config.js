const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

const frontend = {
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

const backend = {
  mode: "development",
  target: "node",
  node: {
    __dirname: true
  },
  externals: [nodeExternals()],
  entry: {
    backend: "./setup.ts",
  },
  output: {
    path: __dirname + "/bin",
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
      }
    ]
  }
};

module.exports = [frontend, backend];
