// vue.config.js
const webpack = require('webpack');
module.exports = {
  transpileDependencies: ['vue-class-component'],
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
    ]
  },
  chainWebpack: config => {
    config
    .entry('index')
    .add('@babel/polyfill')
  },
  publicPath: './',
  outputDir: "dist",
  assetsDir: 'static',
  devServer: {
    port: 53250,
    https: false
  }
}