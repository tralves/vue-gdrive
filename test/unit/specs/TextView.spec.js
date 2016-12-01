import Vue from 'vue'
import Vuex from 'vuex'
import TextView from 'src/components/TextView'

Vue.use(Vuex)

const mockedFileStore = {
  state: {
    xgzfile: {
      contents: 'file contents'
    }
  }
}

describe('TextView.vue shows file content', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div><text-view></text-view></div>',
      components: { TextView },
      store: new Vuex.Store(mockedFileStore)
    }).$mount()
    expect(vm.$el.querySelector('textarea').textContent).to.contain('file contents')
  })
})
