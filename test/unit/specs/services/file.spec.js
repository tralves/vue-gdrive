describe('file', () => {
  const fileInjector = require('inject!src/services/file')

  describe('#openFromGDrive()', () => {
    it('opens file picker and loads file', done => {
      // arrange
      var showPickerStub = sinon.stub().returns(Promise.resolve('fakefileid12345'))
      var loadFileStub = sinon.stub().returns(Promise.resolve({id: 'fakefileid12345'}))
      var loadRtDocStub = sinon.stub().returns(Promise.resolve())
      var dispatchStub = sinon.stub()
      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'showPicker': showPickerStub,
          'loadFile': loadFileStub,
          'loadRtDoc': loadRtDocStub,
          'contentText': { getText: sinon.stub() }
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
          // updates content file
          expect(dispatchStub).calledWith('updateContent', sinon.match.any)
          // loads RT doc
          expect(loadRtDocStub).calledWith({id: 'fakefileid12345'}, sinon.match.any)
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

  describe('#loadFromGDrive()', () => {
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
      var loadRtDocStub = sinon.stub().returns(Promise.resolve())
      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'loadFile': loadFileStub,
          'loadRtDoc': loadRtDocStub,
          'contentText': { getText: sinon.stub() }
        },
        'src/store': {
          'dispatch': dispatchStub
        }
      }).file

      // act
      file.loadFromGDrive('fakefileid12345')
        .then(() => {
          // assert
          // calls GAPI function to load file
          expect(loadFileStub).calledWith('fakefileid12345').calledOnce
          // loads file
          expect(dispatchStub).calledWith('loadFile', fakeFile)
          // updates content file
          expect(dispatchStub).calledWith('updateContent', sinon.match.any)
          // loads RT doc
          expect(loadRtDocStub).calledWith(fakeFile, sinon.match.any)
          done()
        })
        .catch((reason) => {
          assert.fail('did not load: ' + reason)
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

  describe('#createNewFile()', () => {
    it('creates file in store, saves file in gdrive and starts rt doc', (done) => {
      // arrange
      var fakeFile = {
        metadata: {
          name: 'New document',
          id: 'fakefileid12345'
        },
        content: 'my content'
      }
      var dispatchStub = sinon.stub().returns(Promise.resolve(fakeFile))
      var loadRtDocStub = sinon.stub().returns(Promise.resolve())

      var file = fileInjector({
        'src/gapi/gapi-integration': {
          'loadRtDoc': loadRtDocStub
        },
        'src/store': {
          'dispatch': dispatchStub
        }
      }).file

      file.createNewFile('new file name')
        .then(() => {
          // creates file in store
          expect(dispatchStub).calledWith('createNewFile', 'new file name')
          // loads RT doc
          expect(loadRtDocStub).calledWith(fakeFile, sinon.match.any)
          done()
        })
        .catch((reason) => {
          // calls GAPI function to open Picker
          assert.fail('did not create: ' + reason)
          done()
        })
    })
  })
})
