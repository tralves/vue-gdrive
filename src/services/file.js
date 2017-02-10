import GapiIntegration from 'src/gapi/gapi-integration'
import store from 'src/store'
import _get from 'lodash/get'
import _find from 'lodash/find'

/* global gapi */

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
            GapiIntegration.loadRtDoc(file,
              this.contentEventHandler,
              this.filenameEventHandler,
              this.collaboratorEventHandler,
              this.cursorsMapEventHandler.bind(this))
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
            GapiIntegration.loadRtDoc(file,
              this.contentEventHandler,
              this.filenameEventHandler,
              this.collaboratorEventHandler,
              this.cursorsMapEventHandler.bind(this))
              .then(() => {
                store.dispatch('updateContent', GapiIntegration.contentText.getText())
                resolve(file)
              })
              .catch((error) => {
                reject(error)
              })
          })
          .catch((error) => {
            console.error(error)
            reject(error.result.error.message)
          })
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

  collaboratorEventHandler (evt) {
    // Log the event to the console.
    console.log('---------------- collaboratorEventHandler: ' + (evt ? evt.type : 'none'))
    console.log(evt.target.getCollaborators().length + 'COLLABORATORS')
    evt.target.getCollaborators().forEach((collaborator) => {
      console.log('User ID:' + collaborator.userId)
      console.log('Session ID:' + collaborator.sessionId)
      console.log('Name:' + collaborator.displayName)
      console.log('Color:' + collaborator.color)
      console.log('IS_ME: ' + collaborator.isMe)
    })

    store.dispatch('setCollaborators', evt.target.getCollaborators())
  },

  moveCursor (pos) {
    this.getMyRegisteredReference(pos).index = pos
  },

  cursorsMapEventHandler (evt) {
    store.dispatch('setCursors', this.getCursors())
  },

  getCursors () {
    const cursorsMap = this.garbageCollectCursors()
    const keys = cursorsMap.keys()
    let cursors = {}
    for (let i = 0; i < keys.length; i++) {
      cursors[keys[i]] = cursorsMap.get(keys[i]).index
    }

    return cursors
  },

  garbageCollectCursors: function () {
    const cursorsMap = GapiIntegration.cursorsMap
    const keys = cursorsMap.keys()
    for (let i = 0; i < keys.length; i++) {
      //
      if (!this.getCollaborator(keys[i])) {
        cursorsMap.delete(keys[i])
      } else {
        cursorsMap.get(keys[i]).removeAllEventListeners()
        cursorsMap.get(keys[i]).addEventListener(
          gapi.drive.realtime.EventType.REFERENCE_SHIFTED,
          this.onReferenceShifted.bind(this))
      }
    }

    return cursorsMap
  },

  getCollaborator: function (sessionId) {
    const collaborators = _get(store, 'state.collaborators.users')
    if (!collaborators) {
      return null
    }
    return _find(collaborators, {'sessionId': sessionId})
  },

  getMyCollaborator: function () {
    const collaborators = _get(store, 'state.collaborators.users')
    if (!collaborators) {
      return null
    }
    return _find(collaborators, {'isMe': true})
  },

  getMyRegisteredReference: function (pos) {
    const cursorsMap = GapiIntegration.cursorsMap
    if (!cursorsMap) {
      return null
    }

    // if there is no registered reference, create it
    const myRegisteredReference = cursorsMap.get(this.getMyCollaborator().sessionId)
    if (myRegisteredReference) {
      return myRegisteredReference
    }
    let myNewRegisteredReference = GapiIntegration.contentText.registerReference(pos, true)
    myNewRegisteredReference.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.onReferenceShifted.bind(this))
    GapiIntegration.cursorsMap.set(this.getMyCollaborator().sessionId, myNewRegisteredReference)
    return myNewRegisteredReference
  },

  onReferenceShifted: function () {
    store.dispatch('setCursors', this.getCursors())
  },

  /**
   * Opens GDrive share screen
   * @param  {string} id GDrive file id.
   */
  share () {
    return GapiIntegration.showSharing(_get(store, 'state.file.metadata.id'))
  }
}
