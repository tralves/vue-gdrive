import Vue from 'vue'
import App from './App'
import VueMdl from 'vue-mdl'

import store from './vuex/store'

// import mdl stuff
import 'material-design-lite'
import 'material-design-lite/material.min.css'
import 'assets/material.cyan-amber.min.css'
// import 'mdi/css/materialdesignicons.css'

Vue.use(VueMdl)

/* eslint-disable no-new */
new Vue({
  store,
  el: 'body',
  components: {
    App
  },
  data: {
  }
})
