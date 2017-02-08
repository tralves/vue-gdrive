import {
  SET_COLLABORATORS,
  SET_CURSORS
} from '../mutation-types'

const state = {
  users: []
}

const mutations = {
  [SET_COLLABORATORS] (state, collaborators) {
    state.users = collaborators
  },

  [SET_CURSORS] (state, cursors) {
    state.users = state.users.reduce((users, user) => {
      if (cursors[user.sessionId]) {
        user = { ...user, cursor: cursors[user.sessionId] }
      }

      users.push(user)
      return users
    }, [])
  }
}

export default {
  state,
  mutations
}
