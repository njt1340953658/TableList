import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import ElementUi from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
import TableFormList from '../lib/index' // 本地调试引入

// import TableFormList from '../dist/TableFormList.js'; // 打包引入测试是否正常
// import '../dist/TableFormList/theme-chalk/index.css';

Vue.use(ElementUi);
Vue.use(TableFormList);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})