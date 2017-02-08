<template>
  <div>
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
          console.log(getCaretCoordinates(this.$el.querySelector('textarea'), collaborator.cursor))
          return {
            color: collaborator.color,
            collaboratorName: collaborator.displayName,
            position: getCaretCoordinates(this.$el.querySelector('textarea'), collaborator.cursor),
            sessionId: collaborator.sessionId
          }
        }, this)
    }
  },
  methods: {
    inputContent (event) {
      this.editContent(event.target.value)
    },
    carretMoved (event) {
      console.log('carret pos: ' + event.target.selectionStart)
      file.moveCursor(event.target.selectionStart)
    },
    ...mapActions([
      'editContent'
    ])
  }
}
</script>

<style scoped>

  div {
    position: relative;
  }

  textarea {
    background: white;
    width: 100%;
    min-height: 500px;
    position: absolute;
  }
</style>
