<template>
  <textarea :value="fileContent" @input="editContent($event.target.value)"></textarea>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      fileContent: state => state.file.content
    })
  },
  methods: {
    ...mapActions([
      'editContent'
    ])
  }
}
</script>

<style lang="scss" scoped>
textarea {
  background: white;
  width: 100%;
  min-height: 500px;
}
</style>