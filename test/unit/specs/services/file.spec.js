describe('file', () => {
  const fileInjector = require('inject!src/services/file')

  describe('#openFromGDrive()', () => {
    it('opens file picker and loads file', done => {
      // arrange
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

    it('rejects when user cancels the file picker', done => {
      // arrange
      var showPickerStub = sinon.stub().returns(Promise.reject('canceled'))
      var dispatchStub = sinon.stub()
      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'showPicker': showPickerStub
        },
        'src/store': {
          'dispatch': dispatchStub
        }
      }).file
      // act
      // openFromGDrive() is called
      file.openFromGDrive()
        .then(() => {
          assert.fail('should reject')
          done()
        },
        (error) => {
          // assert
          // calls GAPI function to open Picker
          expect(showPickerStub).calledOnce
          error.should.be.equal('not picked')
          done()
        })
    })
  })

  describe('#loadFile()', () => {
    it('loads file from gdrive to the store', done => {
      // arrange
      var fakeFile = {
        metadata: {
          name: 'New document',
          id: 'fakefileid12345'
        },
        content: 'my content'
      }

      var loadFileStub = sinon.stub().returns(Promise.resolve(fakeFile))
      var dispatchStub = sinon.stub()
      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'loadFile': loadFileStub
        },
        'src/store': {
          'dispatch': dispatchStub
        }
      }).file

      // act
      file.loadFromGDrive('fakefileid12345')
        .then(() => {
          // assert
          expect(loadFileStub).calledWith('fakefileid12345').calledOnce
          expect(dispatchStub).calledWith('loadFile', fakeFile)
          done()
        })
        .catch(() => {
          assert.fail('did not load')
          done()
        })
    })

    it('rejects when invalid file', done => {
      // arrange
      var loadFileStub = sinon.stub().returns(Promise.reject('not loaded'))
      var dispatchStub = sinon.stub()
      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'loadFile': loadFileStub
        },
        'src/store': {
          'dispatch': dispatchStub
        }
      }).file

      // act
      file.loadFromGDrive('fakefileid12345')
        .then(() => {
          assert.fail('should reject')
          done()
        })
        .catch((error) => {
          // calls GAPI function to open Picker
          expect(loadFileStub).calledOnce
          error.should.be.equal('not loaded')
          done()
        })
    })
  })
})
