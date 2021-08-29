// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import MyServerHttp from '../src/plugins/http.js';
import moment from 'moment'
//不要忘记引入css文件
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/reset.css';

//使用Vue插件
Vue.use(ElementUI);
Vue.use(MyServerHttp);

Vue.config.productionTip = false


//全局过滤器
Vue.filter('fmtdate',(v)=>{
  v=v*1000
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
