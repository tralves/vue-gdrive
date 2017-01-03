// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
import file from './modules/file'
import * as actions from './actions'

Vue.use(Vuex)
console.log('Using Vuex')

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  // combine sub modules
  modules: {
    file
  },
  strict: debug
})
