const ip = require('ip')
const path = require('path')
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const packageConfig = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const devConfig = {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },

  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist'),
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: '../dist',
    port: 3000,
    host: "0.0.0.0", // ip
    quiet: true, // 关闭编译终端出错
    overlay: true, // 编译出现错误时，将错误直接显示在页面上
    historyApiFallback: { // 404响应页面 默认index.html
      rewrites: [{
        from: /.*/,
        to: path.posix.join('/', '../index.html')
      },],
    }
  }
}; 

// 启动消息提示
const createNotifierCallback = () => {
  const notifier = require('node-notifier')
  return (severity, errors) => {
    if (severity !== 'error') return false;
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png'),
      sound: true
    })
  }
}

module.exports = merge(common, devConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      minify: { // 压缩html
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      template: path.resolve(__dirname, '../index.html')
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${ip.address()}:${devConfig.devServer.port}`],
      },
      onErrors: () => createNotifierCallback(),
      clearConsole: true,
    })
  ]
})