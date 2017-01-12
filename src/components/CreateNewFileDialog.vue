<template>
    <mdl-dialog ref="create_new_file" full-width title="Create new file">
    <mdl-textfield floating-label="File name" :value="filename" id="create-filename-input"></mdl-textfield>
    <template slot="actions">
      <mdl-button primary @click.native="createNew()" id='create-new-file-button'>Create</mdl-button>
      <mdl-button @click.native="openFromGDrive()" id='open-from-gdrive-button'>... or open from Google Drive <img v-bind:src="gdriveSvg" /></mdl-button>
    </template>
  </mdl-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import gdriveSvg from 'src/assets/google-drive.svg'
import { file } from 'src/services'

export default {
  data () {
    return {
      filename: 'New document',
      gdriveSvg
    }
  },
  methods: {
    ...mapActions([
      'createNewFile',
      'loadFile'
    ]),
    openDialog () {
      this.filename = 'New document'
      this.$refs.create_new_file.open()
    },
    createNew () {
      this.$refs.create_new_file.close()
      this.createNewFile(this.$el.querySelector('#create-filename-input').value)
    },
    openFromGDrive () {
      file.openFromGDrive()
        .then(() => { this.$refs.create_new_file.close() })
        .catch(() => { console.info('Canceled gapi picker.') })
    },
    updateFilename ($event) {
      this.filename = $event.value
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>