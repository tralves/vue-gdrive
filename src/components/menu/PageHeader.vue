<template>
    <header class="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <i class="material-icons">short_text</i>
        <input class='filename' contenteditable="true" @blur='rename' :value='fileName' ref="filename"/>
        <span class="filestatus">{{ fileStatus }}</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>
        
        <!-- Navigation. We hide it in small screens. -->
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <mdl-button @click="openShare"><i class="material-icons">share</i> Share</mdl-button>
          <!-- <profile-menu></profile-menu> -->
        </nav>
      </div>
    </header>
</template>

<script>
/* global Event */
import { mapState, mapActions } from 'vuex'
import indexOf from 'lodash/indexOf'
import autosizeInput from 'autosize-input'
import { STATUS_LIST } from '../../store/modules/file'
import GapiIntegration from '../../gapi/gapi-integration'

export default {
  components: {
  },
  computed: {
    fileName () {
      if (this && this.$refs.filename) {
        setTimeout(() => { this.$refs.filename.dispatchEvent(new Event('input')) }, 10)
      }
      return this.$store.state.file.metadata.name
    },
    fileStatus () {
      switch (this.$store.state.file.status) {
        case STATUS_LIST.INTIAL: return 'New file'
        case STATUS_LIST.SAVING: return 'Saving...'
        case STATUS_LIST.SAVED: return 'Last change on ' + this.$store.state.file.metadata.modifiedTime
        case STATUS_LIST.NOT_SAVED: return 'Could not save to drive'
        case STATUS_LIST.DIRTY: return 'Not saved'
      }
    },
    ...mapState({
      fileId: (state) => state.file.metadata.id
    })
  },
  watch: {
    'fileName': function (val, oldVal) {
      if (typeof this !== 'undefined') {
        // trigger the autosize-input
        this.$refs.filename.dispatchEvent(new Event('input'))
      }
    }
  },
  methods: {
    ...mapActions([
      'renameFile',
      'loadFile'
    ]),

    rename (e) {
      this.renameFile(e.target.value)
    },

    closeNav () {
      setTimeout(() => {
        let d = document.querySelector('.mdl-layout__drawer')
        if (indexOf(d.classList, 'is-visible') !== -1) {
          document.querySelector('.mdl-layout').MaterialLayout.toggleDrawer()
        }
      }, 100)
    },

    openFile () {
      GapiIntegration.showPicker()
        .then((id) => {
          console.log('open file: ' + id)
          if (id !== this.fileId) {
            GapiIntegration.loadFile(id)
            .then(file => {
              console.log('GOT FILE!!!!!!')
              this.loadFile(file)
            })
          }
        })
      this.closeNav()
    },

    openShare () {
      GapiIntegration.showSharing(this.fileId)
      this.closeNav()
    }

  },

  mounted () {
    this.$nextTick(() => {
      autosizeInput(this.$refs.filename)
    })
  }
}
</script>

<style lang="scss">
@import '../../styles/globals';

.mdl-navigation > * {
  margin-left: 20px;
}

.filename {
  border: 1px solid transparent;
  border-radius: 2px!important;
  font-size: 18px;
  height: 20px;
  line-height: 22px;
  margin: 0;
  min-width: 1px;
  padding: 2px 7px;
  background-color: transparent;

  &:focus {
    border: 1px solid $secondary-color;
    outline: $secondary-color auto 5px;
  }
  &:hover {
    border: 1px solid $secondary-color;
  }
}

.filestatus {
  margin-left: 10px;
  height: 20px;
  line-height: 22px;
}

.mdl-layout__drawer-button {
  color: $secondary-color;
  background-color: $primary-color;
}

</style>
