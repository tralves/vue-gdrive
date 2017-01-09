import GapiIntegration from 'src/gapi/gapi-integration'
import store from 'src/store'

export const file = {
  openFromGDrive () {
    return new Promise(
      (resolve, reject) => {
        GapiIntegration.showPicker()
          .then((id) => {
            if (id !== this.fileId) {
              GapiIntegration.loadFile(id)
                .then(file => {
                  store.dispatch('loadFile', file)
                  resolve()
                })
                .catch(() => reject('no load'))
            }
          })
          .catch(() => {
            reject('no picked')
          })
      })
  }
}
