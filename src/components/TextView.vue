<template>
  <div class="textarea-container">
    <textarea :value="fileContent" @input="inputContent($event)" @keyup="carretMoved($event)" @click="carretMoved($event)"></textarea>
    <collaborator-cursor v-for="cursor in cursors" v-bind:cursor="cursor"></collaborator-cursor>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { file } from 'src/services'
import getCaretCoordinates from 'textarea-caret'

import CollaboratorCursor from 'src/components/CollaboratorCursor'

export default {
  components: {
    CollaboratorCursor
  },
  computed: {
    ...mapState({
      fileContent: state => state.file.content,
      collaborators: state => state.collaborators.users
    }),
    cursors () {
      return this.collaborators
        .filter((collaborator) => (typeof collaborator.cursor !== 'undefined' && !collaborator.isMe))
        .map((collaborator) => {
          // use fileContent so it will update when the file content changes too.
          const position = this.$el
            ? getCaretCoordinates(this.$el.querySelector('textarea'), collaborator.cursor)
            : { top: 0, left: 0 }
          return {
            color: collaborator.color,
            collaboratorName: collaborator.displayName,
            position: position,
            sessionId: collaborator.sessionId
          }
        }, this)
    }
  },
  watch: {
    fileContent (fileContent) {
      this.$nextTick(() => {
        const me = this.collaborators.find(collaborator => collaborator.isMe)
        if (me && me.cursor) {
          this.$el.querySelector('textarea').setSelectionRange(me.cursor, me.cursor)
        }
      })
    }
  },
  methods: {
    inputContent (event) {
      this.editContent(event.target.value)
    },
    carretMoved (event) {
      file.moveCursor(event.target.selectionStart)
    },
    ...mapActions([
      'editContent'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../styles/globals';

  div {
    position: relative;
  }

  div.textarea-container {
    height:100%;
  }

  textarea {
    background: white;
    width: 100%;
    height: 100%;
    position: absolute;

    resize: none;
    border: 1px solid $primary-color;
    font-size: 14px;
    font-family: monospace;
    outline: none;
  }
</style>
