const os = require('os')
const path = require('path');
const HappyPack = require('happypack');
const vueloaderOptions = require('./vue-loader.config');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

module.exports = {
  resolve: { // 解析模块请求的选项
    extensions: [".vue", ".js", ".json", ".jsx", ".css"], // 使用的扩展名
    alias: {  // 模块别名列表
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
  },

  performance: {
    maxEntrypointSize: 2.5 * 1024 * 1024,
    maxAssetSize: 3 * 1024 * 1024
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueloaderOptions(true),
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBable',
        exclude: /node_modules\/(?!module-[^\s]+)/,
        include: [
          path.resolve(__dirname, '../lib'),
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, 'node_modules/webpack-dev-server/client'),
          /module-[^\s]+/i,
        ]
      },
      {
        test: /\.(css|less)$/,
        use: [
          'cache-loader',
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          'cache-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          'cache-loader',
          'url-loader'
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new HappyPack({
      id: 'happyBable',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyThreadPool,
      verbose: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name]/theme-chalk/index.css",
      ignoreOrder: false,
    })
  ],
};