import GapiIntegration from '../gapi/gapi-integration'
import * as types from './mutation-types'
import _ from 'lodash'

export const createNewXGZ = ({dispatch, state}, filename) => {
  console.log('Creating new XGZ')

  dispatch(types.NEW_FILE)

  GapiIntegration.saveXgzFile(state.xgzfile, filename)
    .then(
      (result) => dispatch(types.FILE_SAVED, result.result),
      (reason) => dispatch(types.FILE_NOT_SAVED))
}

export const saveXGZ = ({dispatch, state}) => {
  console.log('Saving new XGZ')
  dispatch(types.FILE_SAVING)

  return new Promise((resolve, reject) => {
    GapiIntegration.saveXgzFile(state.xgzfile)
    .then(
      (result) => {
        dispatch(types.FILE_SAVED, result.result)
        resolve()
      },
      (reason) => {
        dispatch(types.FILE_NOT_SAVED)
        reject(reason)
      }
    )
  })
}

let debounceSave = _.debounce(saveXGZ, 5000)

export const editContent = ({dispatch, state}, e) => {
  console.log('Editing XGZ content: ' + e.target.value)
  dispatch(types.EDIT_CONTENT, e.target.value)

  // save file / sync with google realtime api
  debounceSave({dispatch, state})
}

export const renameFile = ({dispatch, state}, filename) => {
  console.log('renaming XGZ')
  dispatch(types.RENAME_FILE, filename)

  // save file / sync with google realtime api
  debounceSave({dispatch, state})
}

export const loadFile = ({dispatch}, file) => {
  dispatch(types.LOAD_FILE, file)
}
