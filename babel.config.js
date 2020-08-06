const presets = [
  [
    "@babel/preset-env",
    {
      "corejs": 2,
      "modules": false,
      "useBuiltIns": 'usage'
    },
    "es2015",
  ]
]

const plugins = [
  [ // 抽离bable helpers async重复添加引入函数
    '@babel/plugin-transform-runtime', {
      "corejs": 2,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }
  ]
]

module.exports = {
  presets,
  plugins
}