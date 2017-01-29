import MultiPartBuilder from './multipart'

class GApiIntegration {

/* global gapi, google */

  constructor () {
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
          console.info('loadDriveApi...')
          if (gapi && gapi.client) {
            Promise.all([
              gapi.client.load('drive', 'v3'),
              gapi.client.load('plus', 'v1'),
              gapi.load('picker'),
              gapi.load('drive-share'),
              gapi.load('drive-realtime')])
              .then(() => {
                console.info('gapi.client.load finished!')
                resolve()
              })
          } else {
            setTimeout(() => waitForApi(), 100)
            console.info('wait for it...')
          }
        })()
      }
    )
  }

  /**
   * Makes the gapi authorization process
   */
  authorize (immediate = true, user = null) {
    console.info('authorize')
    return new Promise(
      (resolve, reject) => {
        gapi.auth.authorize(
          this.buildAuthRequest(immediate, user),
          (authResult) => {
            console.info('RESULT!!!!!!!!')
            if (authResult && !authResult.error) {
              console.info('resolved!')
              resolve()
            } else {
              console.info('rejected!')
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

  saveFile (file, filename) {
    var path
    var method

    if (file.metadata.id) {
      path = '/upload/drive/v3/files/' + encodeURIComponent(file.metadata.id)
      method = 'PATCH'
    } else {
      path = '/upload/drive/v3/files'
      method = 'POST'
    }

    const metadata = { mimeType: file.metadata.mimeType, name: (filename || file.metadata.name) }

    const multipart = new MultiPartBuilder()
        .append('application/json', JSON.stringify(metadata))
        .append(file.metadata.mimeType, file.content)
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
      }).then((responses) => {
        return {metadata: responses[0].result, content: responses[1].body}
      })
  };

  loadRtDoc (file, contentEventHandler) {
    var that = this
    console.log('UAI!?')
    return new Promise(
      (resolve, reject) => {
        gapi.drive.realtime.load(file.metadata.id,
          (doc) => {
            console.log('loaded realtime doc', doc)
            // Get the field named "text" in the root map.
            that.contentText = doc.getModel().getRoot().get('content')
            // Connect the event to the listener.
            that.contentText.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, contentEventHandler)
            that.contentText.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, contentEventHandler)
            resolve(doc.getModel())
          },
          (model) => {
            console.log('initializing model', model)
            var string = model.createString(file.content)
            model.getRoot().set('content', string)
          },
          (error) => {
            console.log('failed realtime load', error)
            reject(error)
          })
      })
  }

  /**
   * Displays the Drive file picker configured for selecting text files
   *
   * @return {Promise} Promise that resolves with the ID of the selected file
   */
  showPicker () {
    return new Promise(
      (resolve, reject) => {
        var view = new google.picker.DocsView(google.picker.ViewId.DOCS)
        view.setMimeTypes(process.env.DEFAULT_MIMETYPE)
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
              reject('cancel')
            }
          })
          .build()
        picker.setVisible(true)
      })
  };

  /**
   * Displays the Drive sharing dialog
   *
   * @param {String} id ID of the file to share
   */
  showSharing (id) {
    var share = new gapi.drive.share.ShareClient(process.env.APPLICATION_ID)
    share.setOAuthToken(gapi.auth.getToken().access_token)
    share.setItemIds([id])
    share.showSettingsDialog()
  };
}

export default new GApiIntegration()
