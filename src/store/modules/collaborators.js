import {
  INIT_COLLABORATORS
} from '../mutation-types'

const state = {
  users: []
}

const mutations = {
  [INIT_COLLABORATORS] (state, collaborators) {
    state.users = collaborators
  }
}

export default {
  state,
  mutations
}
