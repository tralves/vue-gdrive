import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const mockedFileStore = {
  state: {
    xgzfile: {
      content: 'file contents'
    }
  }
}

var mockedStore = new Vuex.Store(mockedFileStore)

describe('TextView.vue shows file content', () => {
  var TextViewInjector = require('!!vue?inject!src/components/TextView')
  var ActionsStub = sinon.stub()
  var TextView = TextViewInjector({
    'src/vuex/actions': {
      'editContent': ActionsStub
    }
  })

  it('should render correct contents', done => {
    const vm = new Vue({
      template: '<div><text-view></text-view></div>',
      components: { TextView },
      store: mockedStore
    }).$mount()
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('textarea').value).to.contain('file contents')
      done()
    })
  })

  it('send content to store on edit', done => {
    const vm = new Vue({
      template: '<div><text-view></text-view></div>',
      components: { TextView },
      store: mockedStore
    }).$mount()

    /* global Event */
    Vue.nextTick(() => {
      vm.$el.querySelector('textarea').value = 'more file contents'
      vm.$el.querySelector('textarea').dispatchEvent(new Event('input'))
      expect(ActionsStub)
        .calledWith(sinon.match.any, 'more file contents')
        .calledOnce
      done()
    })
  })
})
