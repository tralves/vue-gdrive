import MultiPartBuilder from './multipart'

class GApiIntegration {

/* global gapi, google */

  constructor () {
    console.log('CONSTRUCTING GApi!!!!')

    this.CLIENT_ID = process.env.CLIENT_ID
    this.SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.install',
      'https://www.googleapis.com/auth/plus.login']

    this.DEFAULT_FIELDS = 'capabilities(canCopy,canEdit),createdTime,fileExtension,id,mimeType,modifiedTime,name,shared,size,version'
  }

  loadDriveApis () {
    return new Promise(
      (resolve, reject) => {
        (function waitForApi () {
          console.log('loadDriveApi...')
          if (gapi && gapi.client) {
            Promise.all([
              gapi.client.load('drive', 'v3'),
              gapi.client.load('plus', 'v1'),
              gapi.load('picker')])
              .then(() => {
                console.log('gapi.client.load finished!!')
                resolve()
              })
          } else {
            setTimeout(() => waitForApi(), 10)
            console.log('wait for it...')
          }
        })()
      }
    )
  }

  /**
   * Makes the gapi authorization process
   */
  authorize (immediate = true, user = null) {
    console.log('authorize')
    return new Promise(
      (resolve, reject) => {
        gapi.auth.authorize(
          this.buildAuthRequest(immediate, user),
          (authResult) => {
            if (authResult && !authResult.error) {
              console.log('resolved!')
              resolve()
            } else {
              console.log('rejected!')
              reject()
            }
          }
        )
      }
    )
  }

  /**
   * Builds a request object suitable for gapi.auth.authorize calls.
   *
   * @param {Boolean} immediateMode True if auth should be checked silently
   * @param {String} user Optional login hint indiciating which account should be authorized
   * @return {Promise} promise that resolves on completion of the login
   */
  buildAuthRequest (immediateMode, user) {
    var request = {
      client_id: this.CLIENT_ID,
      scope: this.SCOPES.join(' '),
      immediate: immediateMode
    }
    if (user) {
      request.login_hint = user
      request.authuser = -1
    }
    return request
  }

  getUserProfile () {
    return gapi.client.plus.people.get({
      'userId': 'me'
    })
  }

  saveXgzFile (xgzFile, filename) {
    var path
    var method

    if (xgzFile.metadata.id) {
      path = '/upload/drive/v3/files/' + encodeURIComponent(xgzFile.metadata.id)
      method = 'PATCH'
    } else {
      path = '/upload/drive/v3/files'
      method = 'POST'
    }

    const metadata = { mimeType: xgzFile.metadata.mimeType, name: (filename || xgzFile.metadata.name) }

    const multipart = new MultiPartBuilder()
        .append('application/json', JSON.stringify(metadata))
        .append(xgzFile.metadata.mimeType, xgzFile.content)
        .finish()

    return gapi.client.request({
      path: path,
      method: method,
      params: {
        uploadType: 'multipart',
        fields: this.DEFAULT_FIELDS
      },
      headers: { 'Content-Type': multipart.type },
      body: multipart.body
    })
  }

  /**
   * Combines metadata & content into a single object & caches the result
   *
   * @param {Object} metadata File metadata
   * @param {String} content File content
   * @return {Object} combined object
   */
  combineAndStoreResults (metadata, content) {
    var file = {
      metadata: metadata,
      content: content
    }
    return file
  };

  /**
   * Load a file from Drive. Fetches both the metadata & content in parallel.
   *
   * @param {String} fileID ID of the file to load
   * @return {Promise} promise that resolves to an object containing the file metadata & content
   */
  loadFile (fileId) {
    return new Promise(
      (resolve, reject) => {
        var metadataRequest = gapi.client.drive.files.get({
          fileId: fileId,
          fields: this.DEFAULT_FIELDS
        })
        var contentRequest = gapi.client.drive.files.get({
          fileId: fileId,
          alt: 'media'
        })

        resolve(Promise.all([metadataRequest, contentRequest]))
      }).then(function (responses) {
        return {metadata: responses[0].result, content: responses[1].body}
      })
  };

  /**
   * Displays the Drive file picker configured for selecting text files
   *
   * @return {Promise} Promise that resolves with the ID of the selected file
   */
  showPicker () {
    return new Promise(
      (resolve, reject) => {
        var view = new google.picker.DocsView(google.picker.ViewId.DOCS)
        view.setMimeTypes('application/file-xgz')
        view.setSelectFolderEnabled(true)
        view.setIncludeFolders(true)
        var picker = new google.picker.PickerBuilder()
          .setAppId(process.env.APPLICATION_ID)
          .setOAuthToken(gapi.auth.getToken().access_token)
          .addView(view)
          .setCallback(function (data) {
            if (data.action === 'picked') {
              var id = data.docs[0].id
              resolve(id)
            } else if (data.action === 'cancel') {
              reject()
            }
          })
          .build()
        picker.setVisible(true)
      })
  };
}

export default new GApiIntegration()
