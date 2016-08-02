<template>
  <mdl-dialog v-ref:create_new_xgz full-width title="Create new XGZ">
    <mdl-textfield floating-label="File name" :value.sync="filename"></mdl-textfield>
    <template slot="actions">
      <mdl-button primary raised @click="createNew()">Create</mdl-button>
    </template>
  </mdl-dialog>
</template>

<script>
import { createNewXGZ } from '../vuex/actions'

export default {
  data () {
    return {
      filename: 'New XGZ document'
    }
  },
  vuex: {
    actions: {
      createNewXGZ
    }
  },
  methods: {
    openDialog () {
      this.filename = 'New XGZ document'
      this.$refs.create_new_xgz.open()
    },
    createNew () {
      this.$refs.create_new_xgz.close()
      this.createNewXGZ(this.filename)
    }
  }
}
</script>