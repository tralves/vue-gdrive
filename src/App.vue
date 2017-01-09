<template>
<div id="app">
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <page-header></page-header>
    <div class="mdl-layout__drawer">

      <span class="mdl-layout-title">
        
      </span>
      <nav class="mdl-navigation">
        <profile-menu></profile-menu>
        <a class="mdl-navigation__link" @click="newFile()">New</a>
        <!--a class="mdl-navigation__link" @click="openFile">Open</a>
        <a class="mdl-navigation__link" @click="openShare">Share</a-->
      </nav>
    </div>
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

        <mdl-dialog ref="login" full-width title="Hi there">
          <p>Please log in with your Google Drive account</p>
          <template slot="actions">
            <mdl-button primary @click="handleAuthClick">Login</mdl-button>
          </template>
        </mdl-dialog>
        <pre id="output"></pre>
      </div>
    </main>
    <create-new-file-dialog ref="create_new_file"></create-new-file-dialog>
  </div>
</div>
</template>

<script>
import qs from 'querystringify'
import { mapActions } from 'vuex'
import PageHeader from './components/menu/PageHeader'
import CreateNewFileDialog from './components/CreateNewFileDialog'
import TextView from './components/TextView'
import ProfileMenu from './components/menu/ProfileMenu'
import GapiIntegration from './gapi/gapi-integration'
import user from './stores/user'

export default {
  components: {
    PageHeader,
    TextView,
    ProfileMenu,
    'create-new-file-dialog': CreateNewFileDialog
  },
  data: function () {
    return {
      user: null,
      file: null
    }
  },
  mounted: function () {
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
    ...mapActions([
      'loadFile' // map this.increment() to this.$store.dispatch('increment')
    ]),

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
            this.loadFile(file)
          })
      } else {
        this.openCreateNewFile()
      }
    },

    openCreateNewFile () {
      this.$refs.create_new_file.openDialog()
    },

    newFile () {
      window.open('/', '_blank')
      this.closeNav()
    }
  }
}
</script>

<style lang="scss">


</style>



