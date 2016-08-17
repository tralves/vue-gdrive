<template>
    <mdl-dialog v-ref:create_new_xgz full-width title="Create new XGZ">
    <mdl-textfield floating-label="File name" :value.sync="filename"></mdl-textfield>
    <template slot="actions">
      <mdl-button primary @click="createNew()">Create</mdl-button>
      <mdl-button @click="openFromGDrive()">... or open from Google Drive <img v-bind:src={{gdriveSvg}} /></mdl-button>
    </template>
  </mdl-dialog>
</template>

<script>
import { createNewXGZ, loadFile } from '../vuex/actions'
import gdriveSvg from '../assets/google-drive.svg'
import GapiIntegration from '../gapi/gapi-integration'

export default {
  data () {
    return {
      filename: 'New XGZ document',
      gdriveSvg
    }
  },
  vuex: {
    actions: {
      createNewXGZ,
      loadFile
    }
  },
  methods: {
    openDialog () {
      this.filename = 'New XGZ document'
      this.$refs.create_new_xgz.open()
    },
    createNew () {
      this.$refs.create_new_xgz.close()
      this.createNewXGZ(this.filename)
    },
    openFromGDrive () {
      this.$refs.create_new_xgz.close()
      GapiIntegration.showPicker()
        .then((id) => {
          console.log('open file:' + id)
          if (id !== this.fileId) {
            GapiIntegration.loadFile(id)
            .then(file => {
              console.log('GOT FILE!!!!!!')
              this.loadFile(file)
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>