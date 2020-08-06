module.exports = (isDev) => {
  return {
    cacheDirectory: true,
    extractCSS: isDev ? false : true, // 把vue的css提取到单独的文件，默认
    cssModules: { localIndetName: '[xxx]', camcelcase: true }, // 用法：<style module>
    hotReload: true, // 热更新，默认会自动判断是否开发环境自动开启关闭，其实关闭后也会刷新页面更新
  };
};