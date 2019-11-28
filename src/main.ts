import Vue, { VueConstructor } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@babel/polyfill';

Vue.config.productionTip = false;


// 组件通信 $emit， $on， $off
const eventBus = {
  install(vue: VueConstructor) {
    vue.prototype.$bus = new Vue();
  },
};
Vue.use(eventBus);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
