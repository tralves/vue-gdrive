<template>
    <mdl-dialog ref="createNewXgz" full-width title="Create new XGZ">
    <mdl-textfield floating-label="File name" :value="filename" id="create-filename-input"></mdl-textfield>
    <template slot="actions">
      <mdl-button primary @click="createNew()">Create</mdl-button>
      <mdl-button @click="openFromGDrive()">... or open from Google Drive <img v-bind:src="gdriveSvg" /></mdl-button>
    </template>
  </mdl-dialog>
</template>

<script>
/* global document */
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
      this.createNewXGZ(document.querySelector('#create-filename-input').value)
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
    },
    updateFilename ($event) {
      this.filename = $event.value
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>