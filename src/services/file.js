import GapiIntegration from 'src/gapi/gapi-integration'
import store from 'src/store'
import _get from 'lodash/get'

export const file = {
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
            resolve()
          })
          .catch(() => reject('not loaded'))
      })
  },

  /**
   * Opens GDrive share screen
   * @param  {string} id GDrive file id.
   */
  share () {
    return GapiIntegration.showSharing(_get(store, 'state.file.metadata.id'))
  }
}
