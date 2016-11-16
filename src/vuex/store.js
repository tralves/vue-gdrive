// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
// import xgzfile from modules
import xgzfile from './modules/xgzfile'

Vue.use(Vuex)
console.log('USED VUEEEEEEEEEXXXX')

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  // combine sub modules
  modules: {
    xgzfile
  },
  strict: debug
})
