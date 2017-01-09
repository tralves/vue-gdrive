describe('file', () => {
  describe('#openFromGDrive()', () => {
    it('opens file picker and loads file', done => {
      // arrange
      const fileInjector = require('inject!src/services/file')
      var showPickerStub = sinon.stub().returns(Promise.resolve('fakefileid12345'))
      var loadFileStub = sinon.stub().returns(Promise.resolve({id: 'fakefileid12345'}))
      var dispatchStub = sinon.stub()
      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'showPicker': showPickerStub,
          'loadFile': loadFileStub
        },
        'src/store': {
          'dispatch': dispatchStub
        }
      }).file
  
      // act
      // openFromGDrive() is called
      file.openFromGDrive()
        .then(() => {
           // assert
          // calls GAPI function to open Picker
          expect(showPickerStub).calledOnce

          // calls GAPI function to load file
          expect(loadFileStub).calledWith('fakefileid12345').calledOnce
          // loads file
          expect(dispatchStub).calledWith('loadFile', {id: 'fakefileid12345'})
          done()
        },
        (error) => {
          assert.fail(error)
          done()
        })
    })
  })
})
