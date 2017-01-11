import Vue from 'vue'
import Vuex from 'vuex'
import TextView from 'src/components/TextView'

Vue.use(Vuex)

const mockedFileStore = {
  state: {
    file: {
      content: 'file contents'
    }
  }
}

var mockedStore = new Vuex.Store(mockedFileStore)

describe('TextView.vue', () => {
  it('should render contents from store', done => {
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

  it('sends content to store on edit', done => {
    // create ActionsStub
    var TextViewInjector = require('!!vue?inject!src/components/TextView')
    var editContentStub = sinon.stub()

    var TextView = TextViewInjector({
      'vuex': {
        mapActions: function () { return {editContent: editContentStub} },
        mapState: sinon.stub()
      }
    })

    // arrange
    const vm = new Vue({
      template: '<div><text-view></text-view></div>',
      components: { TextView },
      store: mockedStore
    }).$mount()

    /* global Event */
    Vue.nextTick(() => {
      // act
      // edit content
      vm.$el.querySelector('textarea').value = 'more file contents'
      vm.$el.querySelector('textarea').dispatchEvent(new Event('input'))
      // assert
      // vuex that action is called
      expect(editContentStub)
        .calledWith('more file contents')
        .calledOnce
      done()
    })
  })
})
