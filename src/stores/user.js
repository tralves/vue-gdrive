export default {
  state: {
    name: '',
    image: '',
    email: ''
  },

  setUser: function (user) {
    this.state.name = user.name
    this.state.image = user.image
    this.state.email = user.email
  }
}
