import Vue from 'vue'
import Vuex from 'vuex'
import TextView from 'src/components/TextView'

Vue.use(Vuex)

const mockedFileStore = {
  state: {
    xgzfile: {
      content: 'file contents'
    }
  }
}

var mockedStore = new Vuex.Store(mockedFileStore)

describe('TextView.vue shows file content', done => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: '<div><text-view></text-view></div>',
      components: { TextView },
      store: mockedStore
    }).$mount()
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('textarea').textContent).to.contain('file contents')
      done()
    })
  })
})
