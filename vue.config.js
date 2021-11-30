/**
 * 配置参考:
 * https://cli.vuejs.org/zh/config/
 */
// const url = 'http://192.168.0.149:8094' 'http://xpmswc.sjxpm.cn'
const webpack = require('webpack')
module.exports = {
  publicPath: "./",
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    // 忽略的打包文件
    config.externals({
      axios: "axios",
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
    const svgRule = config.module.rule("svg");
    // 清除已有的所有 loader,如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();
    // 添加要替换的 loader
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
  },
  // 配置转发代理
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      "/api": {
        // target: "http://192.168.40.67:8999",
        target: "http://192.168.0.103:49999",
        // target: "http://114.115.200.195:8081/wm",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/variables.scss";`
      },
    }
  }
};
