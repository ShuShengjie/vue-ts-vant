import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import createPersistedState from 'vuex-persistedstate';

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  // 利用vuex-persistedstate插件 持久化state
  plugins: [createPersistedState({
    storage: window.localStorage,    ///  |  window.sessionStorage
  })],
});
