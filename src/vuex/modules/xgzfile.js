import _ from 'lodash'
import {
  NEW_FILE,
  FILE_SAVED,
  FILE_SAVING,
  FILE_NOT_SAVED,
  EDIT_CONTENT,
  RENAME_FILE,
  LOAD_FILE
} from '../mutation-types'

export const STATUS_LIST = {
  INITIAL: 'INTIAL',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  NOT_SAVED: 'NOT_SAVED',
  DIRTY: 'DIRTY'
}

const state = {
  metadata: {
    name: 'New XGZ document'
  },
  content: '',
  status: STATUS_LIST.INITIAL
}

const mutations = {
  [NEW_FILE] (state, name) {
    state.metadata = {
      id: null,
      mimeType: 'application/file-xgz',
      name: name
    }
    state.content = ''
  },

  [FILE_SAVED] (state, metadata) {
    _.assign(state.metadata, metadata)
    state.status = STATUS_LIST.SAVED
  },

  [FILE_NOT_SAVED] (state) {
    state.status = STATUS_LIST.NOT_SAVED
  },

  [FILE_SAVING] (state) {
    state.status = STATUS_LIST.SAVING
  },

  [EDIT_CONTENT] (state, content) {
    state.content = content
    state.status = STATUS_LIST.DIRTY
  },

  [RENAME_FILE] (state, filename) {
    state.metadata.name = filename
    state.status = STATUS_LIST.DIRTY
  },

  [LOAD_FILE] (state, file) {
    state.metadata = file.metadata
    state.content = file.content
    state.status = state.status = STATUS_LIST.SAVED
  }
}

export default {
  state,
  mutations
}
