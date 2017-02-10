<template>
    <header class="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div class="mdl-layout__header-row">
        <!-- Title -->
        <i class="material-icons">insert_drive_file</i>
        <input class='filename' contenteditable="true" @blur='rename' :value='fileName' ref="filename"/>
        <span class="filestatus">{{ fileStatus }} {{ savedMoment }}</span>
        <!-- Add spacer, to align navigation to the right -->
        <div class="mdl-layout-spacer"></div>
        <collaborator v-for="collaborator in collaborators" v-bind:collaborator="collaborator">
        </collaborator>
        <!-- Navigation. We hide it in small screens. -->
        <nav class="mdl-navigation mdl-layout--large-screen-only">
          <mdl-button @click.native="openShare()"><i class="material-icons">share</i> Share</mdl-button>
        </nav>
      </div>
    </header>
</template>

<script>
/* global Event */
import { mapState, mapActions } from 'vuex'
import autosizeInput from 'autosize-input'
import { STATUS_LIST } from '../../store/modules/file'
import { file } from 'src/services'
import moment from 'moment'

import Collaborator from 'src/components/menu/Collaborator'

export default {
  components: {
    Collaborator
  },
  data: () => {
    return {
      showSavedMoment: false,
      now: Date.now()
    }
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
        case STATUS_LIST.SAVED: return 'Saved ' + moment(this.$store.state.file.metadata.modifiedTime).from(this.now)
        case STATUS_LIST.NOT_SAVED: return 'Could not save to drive'
        case STATUS_LIST.DIRTY: return 'Saving...'
      }
    },
    ...mapState({
      fileId: (state) => state.file.metadata.id,
      collaborators: (state) => state.collaborators.users
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
      'renameFile'
    ]),

    rename (e) {
      this.renameFile(e.target.value)
    },

    openShare () {
      file.share()
    }
  },

  mounted () {
    this.$nextTick(() => {
      autosizeInput(this.$refs.filename)
    })

    setInterval(() => {
      this.now = new Date()
    }, 1000)
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
