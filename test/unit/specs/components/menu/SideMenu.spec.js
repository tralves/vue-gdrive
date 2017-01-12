import Vue from 'vue'
import VueMdl from 'vue-mdl'
import 'material-design-lite'

Vue.use(VueMdl)

// create ActionsStub
var SideMenuInjector = require('!!vue?inject!src/components/menu/SideMenu')
var openFromGDriveStub = sinon.stub()
var shareStub = sinon.stub()
var SideMenu = SideMenuInjector({
  'src/services': {
    file: {
      openFromGDrive: openFromGDriveStub,
      share: shareStub
    }
  }
})

const vm = new Vue({
  template: '<div><side-menu></side-menu></div>',
  components: { SideMenu }
}).$mount()

describe('SideMenu.vue', () => {
  it('should open new file in new tab', done => {
    // arrange
    var windowOpenStub = window.open = sinon.stub()

    // act
    // click 'new file' button
    vm.$el.querySelector('#new-file-button').click()

    // assert
    // open new instance in new tab
    expect(windowOpenStub).calledWith('/', '_blank').calledOnce

    done()
  })

  it('should open file picker', done => {
    // arrange

    // act
    // click 'open file' button
    vm.$el.querySelector('#open-file-button').click()

    // assert
    // open file called
    expect(openFromGDriveStub).calledOnce

    done()
  })

  it('should open share', done => {
    // arrange

    // act
    // click 'open file' button
    vm.$el.querySelector('#share-button').click()

    // assert
    // open share menu
    expect(shareStub).calledOnce

    done()
  })
})
