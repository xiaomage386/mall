import Vue from 'vue'
import Vuex from 'vuex'

// 暂时不需要加入vuex-electron，如果需要参考解决方案：https://github.com/vue-electron/vuex-electron/pull/28
// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    // createPersistedState(),
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
