import Vue from 'vue'
import VueMdl from 'vue-mdl'
import 'material-design-lite'

Vue.use(VueMdl)

describe('CreateNewFileDialog.vue creates or opens new file', () => {
  it('should create new file', done => {
    // create ActionsStub
    var CreateNewFileDialogInjector = require('!!vue?inject!src/components/CreateNewFileDialog')
    var createNewFileStub = sinon.stub()
    var CreateNewFileDialog = CreateNewFileDialogInjector({
      'vuex': {
        mapActions: function () { return {createNewFile: createNewFileStub} }
      }
    })

    // arrange
    const vm = new Vue({
      template: '<div><create-new-file-dialog></create-new-file-dialog></div>',
      components: { CreateNewFileDialog }
    }).$mount()

    // act
    // change filename
    vm.$el.querySelector('#create-filename-input').value = 'my new file name'
    // click button
    vm.$el.querySelector('#create-new-file-button').click()

    // assert
    // action createNewFile is called eith the new name
    Vue.nextTick(() => {
      expect(createNewFileStub)
        .calledWith('my new file name')
        .calledOnce

      // popup is closed
      assert(vm.$el.display, 'none')

      done()
    })
  })

  // it('send content to store on edit', done => {
  //   const vm = new Vue({
  //     template: '<div><create-new-file-dialog></create-new-file-dialog></div>',
  //     components: { CreateNewXgzDialog }
  //   }).$mount()

  //   /* global Event */
  //   Vue.nextTick(() => {
  //     vm.$el.querySelector('textarea').value = 'more file contents'
  //     vm.$el.querySelector('textarea').dispatchEvent(new Event('input'))
  //     expect(ActionsStub)
  //       .calledWith(sinon.match.any, 'more file contents')
  //       .calledOnce
  //     done()
  //   })
  // })
})
