<template>
	<div class="mdl-layout__drawer">

      <span class="mdl-layout-title">

      </span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" id="new-file-button" @click="newFile()">
          <i class="material-icons">insert_drive_file</i> New file
        </a>
        <a class="mdl-navigation__link" id="open-file-button" @click="openFile()">
          <i class="material-icons">folder_open</i> Open...
        </a>
        <a class="mdl-navigation__link" id="share-button" @click="openShare()">
          <i class="material-icons">share</i> Share...
        </a>
      </nav>
    </div>
</template>

<script>
import { file } from 'src/services'
import indexOf from 'lodash/indexOf'

export default {
  methods: {
    newFile () {
      window.open('/', '_blank')
      this.closeNav()
    },

    openFile () {
      file.openFromGDrive()
    },

    openShare () {
      file.share()
    },

    closeNav () {
      setTimeout(() => {
        let d = document.querySelector('.mdl-layout__drawer')
        if (indexOf(d.classList, 'is-visible') !== -1) {
          document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer()
        }
      }, 100)
    }

  }
}
</script>

<style lang="scss" scoped>
</style>

