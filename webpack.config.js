const path = require("path");
const fs = require("fs");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const publicPath = "/";

// const publicPath = "https://admin.levaapp.com/";

// const publicPath = "http://3.140.166.216/";

// const publicPath = "http://192.168.1.133:3000/";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OfflinePlugin = require("offline-plugin");

module.exports = {
  entry: ["babel-polyfill", "react-hot-loader/patch", "./src/index.js"],
  output: {
    path: resolveApp("dist"),
    filename: "static/js/[name].[hash:8].js",
    chunkFilename: "static/js/[name].[hash:8].chunk.js",
    publicPath: publicPath,
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
  },
  devServer: {
    contentBase: "./src/index.js",
    host: "localhost",
    compress: true,
    port: 3005, // port number
    historyApiFallback: true,
    quiet: true,
  },
  // resolve alias (Absolute paths)
  resolve: {
    alias: {
      Actions: path.resolve(__dirname, "src/actions/"),
      Components: path.resolve(__dirname, "src/components/"),
      Assets: path.resolve(__dirname, "src/assets/"),
      Util: path.resolve(__dirname, "src/util/"),
      Routes: path.resolve(__dirname, "src/routes/"),
      Constants: path.resolve(__dirname, "src/constants/"),
      Helpers: path.resolve(__dirname, "src/helpers/"),
      Api: path.resolve(__dirname, "src/api/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      // Scss compiler
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "style-loader", // inject CSS to page
          },
          {
            loader: "css-loader", // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              plugins: function() {
                // post css plugins, can be exported to postcss.config.js
                return [require("precss"), require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        // Enable file caching
        cache: true,
        parallel: true,

        uglifyOptions: {
          compress: false,
          ecma: 8,
          mangle: true,
        },
        sourceMap: true,
      }),
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin({
      dry: false,
      verbose: false,
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "static/css/[name].[hash:8].css",
    }),
    new OfflinePlugin({
      relativePaths: false,
      publicPath: "/",
      appShell: "/",
      ServiceWorker: {
        events: true,
        entry: path.join(process.cwd(), "./public/firebase-messaging-sw.js"), //<-- path for your extended service worker
      },
    }),
    // new BundleAnalyzerPlugin()
  ],
};
