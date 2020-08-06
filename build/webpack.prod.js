const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = merge(common, {
  mode: 'production',

  entry: {
    'TableFormList': './lib/index.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    library: 'TableFormList',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },

  devtool: false,

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ParallelUglifyPlugin({ // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
      cacheDir: '.cache-loader/', // 使用打包缓存加速构建
      uglifyJS: {  // 传递给 UglifyJS 的参数
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        },
        warnings: false,  // 在UglifyJs删除没有用到的代码时不输出警告
        compress: {
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        }
      },
    })
  ]
});