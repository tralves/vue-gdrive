<template>
    <mdl-dialog ref="create_new_file" full-width title="Create new file">
    <mdl-textfield floating-label="File name" :value="filename" id="create-filename-input"></mdl-textfield>
    <template slot="actions">
      <mdl-button primary @click.native="createNew()" id='create-new-file-button'>Create</mdl-button>
      <mdl-button @click.native="openFromGDrive()">... or open from Google Drive <img v-bind:src="gdriveSvg" /></mdl-button>
    </template>
  </mdl-dialog>
</template>

<script>
/* global document */
import { createNewFile, loadFile } from '../vuex/actions'
import gdriveSvg from '../assets/google-drive.svg'
import GapiIntegration from '../gapi/gapi-integration'

export default {
  data () {
    return {
      filename: 'New document',
      gdriveSvg
    }
  },
  methods: {
    openDialog () {
      this.filename = 'New document'
      this.$refs.create_new_file.open()
    },
    createNew () {
      this.$refs.create_new_file.close()
      createNewFile(this.$el.querySelector('#create-filename-input').value)
    },
    openFromGDrive () {
      this.$refs.create_new_file.close()
      GapiIntegration.showPicker()
        .then((id) => {
          console.log('open file:' + id)
          if (id !== this.fileId) {
            GapiIntegration.loadFile(id)
            .then(file => {
              console.log('GOT FILE!!!!!!')
              loadFile(file)
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