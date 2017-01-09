import Vue from 'vue'
import VueMdl from 'vue-mdl'
import 'material-design-lite'

Vue.use(VueMdl)

// create ActionsStub
var CreateNewFileDialogInjector = require('!!vue?inject!src/components/CreateNewFileDialog')
var createNewFileStub = sinon.stub()
var openFromGDriveStub = sinon.stub().returns(Promise.resolve())
var CreateNewFileDialog = CreateNewFileDialogInjector({
  'vuex': {
    mapActions: function () {
      return {
        createNewFile: createNewFileStub
      }
    }
  },
  'src/services': {
    file: {
      openFromGDrive: openFromGDriveStub
    }
  }
})

describe('CreateNewFileDialog.vue creates or opens new file', () => {
  it('should create new file', done => {
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
    expect(createNewFileStub)
      .calledWith('my new file name')
      .calledOnce

    // // popup is closed
    assert.equal('none', vm.$el.querySelector('.mdl-dialog-container').style.display, 'popup is hidden')

    done()
  })

  it('should open gdrive file picker', done => {
    // arrange
    const vm = new Vue({
      template: '<div><create-new-file-dialog></create-new-file-dialog></div>',
      components: { CreateNewFileDialog }
    }).$mount()

    // act
    // click open file button
    vm.$el.querySelector('#open-from-gdrive-button').click()

    // assert
    // action gdrive picker is called
    expect(openFromGDriveStub).calledOnce

    // // popup is closed
    assert.equal('none', vm.$el.querySelector('.mdl-dialog-container').style.display, 'popup is hidden')

    done()
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
