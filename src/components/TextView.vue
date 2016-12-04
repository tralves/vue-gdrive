<template>
  <textarea :value="fileContent" @input="editContent($event.target.value)"></textarea>
</template>

<script>
import { editContent } from 'src/vuex/actions'
export default {
  vuex: {
    getters: {
      fileContent: state => state.xgzfile.content
    },
    actions: {
      editContent
    }
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