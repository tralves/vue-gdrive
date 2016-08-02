
<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <page-header></page-header>
    <main class="mdl-layout__content mdl-color--grey-100">
      <div class="page-content">

        <div class="mdl-grid">
          <div class="mdl-cell mdl-cell--2-col" id="left-tools">
          </div>
          <div class="mdl-cell mdl-cell--8-col" id="text-view">
            <text-view></text-view>
          </div>
          <div class="mdl-cell mdl-cell--2-col" id="right-tools">
          </div>          
        </div>

        <mdl-dialog v-ref:login full-width title="Hi there">
          <p>Please log in</p>
          <template slot="actions">
            <mdl-button primary @click="handleAuthClick">Login</mdl-button>
            <mdl-button @click="$refs.login.close">Close</mdl-button>
          </template>
        </mdl-dialog>
        <pre id="output"></pre>
      </div>
    </main>
    <create-new-xgz-dialog v-ref:create_new></create-new-xgz-dialog>
  </div>
</template>

<script>
import qs from 'querystringify'
import { loadFile } from './vuex/actions'
import PageHeader from './components/menu/PageHeader'
import CreateNewXgzDialog from './components/CreateNewXgzDialog'
import TextView from './components/TextView'
import GapiIntegration from './gapi/gapi-integration'
import user from './stores/User'

export default {
  components: {
    PageHeader,
    TextView,
    'create-new-xgz-dialog': CreateNewXgzDialog
  },
  data: function () {
    return {
      user: null,
      file: null
    }
  },
  vuex: {
    actions: {
      loadFile
    }
  },
  attached: function () {
    console.log(GapiIntegration)
    let queryVars = qs.parse(window.location.search)
    console.log(queryVars)
    this.user = queryVars.user
    this.file = queryVars.file

    GapiIntegration.loadDriveApis()
      .then(() => {
        console.log('starting authorize')
        GapiIntegration.authorize(true, this.user)
          .then(() => {
            this.loadUserData()
            this.loadThisFile()
          })
          .catch((reason) => {
            console.log('error inload or authorize')
            this.$refs.login.open()
          })
      })
  },
  methods: {
    handleAuthClick () {
      this.$refs.login.close()
      GapiIntegration.authorize(false, this.user)
        .then(() => {
          this.loadUserData()
          this.loadThisFile()
        })
    },

    loadUserData () {
      console.log('load userData')
      GapiIntegration.getUserProfile().then((resp) => {
        console.log(resp)
        user.setUser({
          name: resp.result.displayName,
          image: resp.result.image.url,
          email: resp.result.emails[0].value
        })
      })
    },

    loadThisFile () {
      console.log('load file')

      // if no file id in URL, open create dialog
      if (this.file) {
        GapiIntegration.loadFile(this.file)
          .then(file => {
            console.log('GOT FILE!!!!!!')
            console.log(file)
            this.loadFile(file)
          })
      } else {
        this.openCreateNewXGZ()
      }
    },

    openCreateNewXGZ () {
      this.$refs.create_new.openDialog()
    }
  }
}
</script>

<style lang="scss">


</style>



