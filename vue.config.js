module.exports = {
  outputDir: 'dist',   //build输出目录
  assetsDir: 'public', //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    port: '8081',
    https: false,
    hotOnly: false,
    proxy: {
      '/': {
        target: 'http://localhost:8080', //API服务器的地址
        ws: true,  //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
      }
    },
  }
}
