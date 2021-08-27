// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import MyServerHttp from '../src/plugins/http.js';
//不要忘记引入css文件
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/reset.css';

//使用Vue插件
Vue.use(ElementUI);
Vue.use(MyServerHttp);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
