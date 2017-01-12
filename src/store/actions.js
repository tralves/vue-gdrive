import GapiIntegration from '../gapi/gapi-integration'
import * as types from './mutation-types'
import _ from 'lodash'
import qs from 'querystringify'

export const createNewFile = ({commit, state}, filename) => {
  console.log('Creating new file')
  commit(types.NEW_FILE)

  GapiIntegration.saveFile(state.file, filename)
    .then(
      (result) => commit(types.FILE_SAVED, result.result),
      (reason) => commit(types.FILE_NOT_SAVED))
    .then(() => { updateWindowUrl(state.file.metadata) })
}

export const saveFile = ({commit, state}) => {
  console.log('Saving new file')
  commit(types.FILE_SAVING)

  return new Promise((resolve, reject) => {
    GapiIntegration.saveFile(state.file)
    .then(
      (result) => {
        commit(types.FILE_SAVED, result.result)
        resolve()
      },
      (reason) => {
        commit(types.FILE_NOT_SAVED)
        reject(reason)
      }
    )
  })
}

let debounceSave = _.debounce(saveFile, 5000)

export const editContent = ({commit, state}, value) => {
  console.log('Editing file content: ' + value)
  commit(types.EDIT_CONTENT, value)

  // save file / sync with google realtime api
  debounceSave({commit, state})
}

export const renameFile = ({commit, state}, filename) => {
  console.log('renaming file')
  commit(types.RENAME_FILE, filename)

  // save file / sync with google realtime api
  debounceSave({commit, state})
}

export const loadFile = ({commit, state}, file) => {
  commit(types.LOAD_FILE, file)
  updateWindowUrl(state.file.metadata)
}

function updateWindowUrl (fileMetadata) {
  let queryVars = qs.parse(window.location.search)
  queryVars.file = fileMetadata.id
  window.history.pushState({}, fileMetadata.name, '/' + qs.stringify(queryVars, true))
}
