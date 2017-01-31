import GapiIntegration from 'src/gapi/gapi-integration'
import store from 'src/store'
import _get from 'lodash/get'

export const file = {
  model: null,

  /**
   * Creates a new file
   * @param  {string} filename
   * @return {Promise}
   */
  createNewFile (filename) {
    return new Promise(
      (resolve, reject) => {
        store.dispatch('createNewFile', filename)
          .then((file) => {
            GapiIntegration.loadRtDoc(file, this.contentEventHandler, this.filenameEventHandler)
              .then(() => {
                resolve(file)
              })
              .catch(() => {
                reject('rt file not loaded')
              })
          })
          .catch(() => reject('not loaded'))
      })
  },

  /**
   * Opens a file from GDrive
   * @return {Promise}
   */
  openFromGDrive () {
    return new Promise(
      (resolve, reject) => {
        GapiIntegration.showPicker()
          .then((id) => {
            if (id !== _get(store, 'state.file.metadata.id')) {
              this.loadFromGDrive(id)
                .then(() => resolve())
                .then((error) => reject(error))
            }
          })
          .catch(() => {
            reject('not picked')
          })
      })
  },

  /**
   * Loads a file from gdrive
   * @param  {string} id GDrive file id.
   * @return {Promise}
   */
  loadFromGDrive (id) {
    return new Promise(
      (resolve, reject) => {
        GapiIntegration.loadFile(id)
          .then(file => {
            store.dispatch('loadFile', file)
            return file
          })
          .then((file) => {
            GapiIntegration.loadRtDoc(file, this.contentEventHandler, this.filenameEventHandler)
              .then(() => {
                store.dispatch('updateContent', GapiIntegration.contentText.getText())
                resolve(file)
              })
              .catch(() => {
                reject('rt file not loaded')
              })
          })
          .catch(() => reject('not loaded'))
      })
  },

  contentEventHandler (evt) {
    // Log the event to the console.
    console.log('contentEventHandler')
    store.dispatch('updateContent', GapiIntegration.contentText.getText())
  },

  filenameEventHandler (evt) {
    // Log the event to the console.
    // console.log(evt)
    console.log('filenameEventHandler: ' + GapiIntegration.filenameText.getText())
    store.dispatch('updateFilename', GapiIntegration.filenameText.getText())
  },

  /**
   * Opens GDrive share screen
   * @param  {string} id GDrive file id.
   */
  share () {
    return GapiIntegration.showSharing(_get(store, 'state.file.metadata.id'))
  }
}
