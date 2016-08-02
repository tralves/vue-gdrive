<template>
  <textarea :value="fileContent" @input="editContent"></textarea>
</template>

<script>
import { editContent } from '../vuex/actions'
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