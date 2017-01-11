<template>
	<div class="mdl-layout__drawer">

      <span class="mdl-layout-title">
        
      </span>
      <nav class="mdl-navigation">
        <profile-menu></profile-menu>
        <a class="mdl-navigation__link" id="new-file-button" @click="newFile()">New</a>
        <a class="mdl-navigation__link" id="open-file-button" @click="openFile()">Open...</a>
        <a class="mdl-navigation__link" id="share-button" @click="openShare()">Share...</a>
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

