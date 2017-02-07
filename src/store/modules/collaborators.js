import {
  SET_COLLABORATORS,
  SET_CURSORS
} from '../mutation-types'

const state = {
  users: [],
  cursors: {}
}

const mutations = {
  [SET_COLLABORATORS] (state, collaborators) {
    state.users = collaborators
  },
  [SET_CURSORS] (state, cursors) {
    state.cursors = cursors
  }
}

export default {
  state,
  mutations
}
