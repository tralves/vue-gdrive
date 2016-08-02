# vue-gdrive

> VueJS text editor with Google Drive integration

If you want to build a VueJS app with Google Drive integration? Start here!

This project is just a text editor written in VueJS uses google drive API for storage, sharing (soon) and realtime colaboration (not yet). Use it as a boilerplate or reference for your awesome project!

## Done:
- VueJS + Vuex boilerplate;
- [Material Design Lite](https://getmdl.io/) and [vue-mdl](http://posva.net/vue-mdl/#!/installation);
- G+ user authentication;
- Create file in GDrive;
- (Auto-)save file in GDrive;
- Load File from GDrive;
 
## TODO:

- Save in folder;
- Share file;
- Realtime colaboration;
- i18n;

## Building from source

### Build Setup

``` bash
# clone
git clone https://github.com/tralves/vue-gdrive.git
cd vue-gdrive

# install dependencies
npm install
```

### Create a Google APIs project and Activate the Drive API

First, you need to activate the Drive API for your app. You can do it by configuring your API project in the
[Google Developers Console](https://console.developers.google.com/).


- Use [this wizard](https://console.developers.google.com/start/api?id=drive) to create or select a project in the Google Developers Console and automatically enable the API.
- Open the **API Manager** on the left sidebar.
- Select **Credentials** -> **New Credentials** -> **OAuth Client ID**
- If using a new proejct, select **Configure consent screen* and fill out the form
    - Select an **EMAIL ADDRESS** and enter a **PRODUCT NAME** if not already set and click the Save button.
- Select the application type *Web application**
- List your hostname in the **Authorized JavaScript Origins** field.
- Click the **Create** button. Note the resulting client ID and secret which you'll need later on.

> The hostname cannot be `localhost`. To test from your machine, create an alias in `etc/hosts` like `127.0.0.1 mytexteditor.dev`. In this case, if you use `npm run dev`, the hostname of your application will be `mytexteditor.dev:8080`.

To enable integration with the Drive UI, including the sharing dialog, perform the following steps.

- Select **Overview** section in **API Manager**
- Search for 'Drive API' and click on 'Drive API' in the results
- Click **Enable API**
- Select the **Drive UI Integration** tab
- Fill out the **Application Name** and upload at least one **Application Icon**.
- Set the *Open URL** to `http://YOURHOST?file={ids}&user={userId}&action={action}`
- Check the *Create With** option and set the **New URL** to `http://YOURHOST?user={userId}&action={action}`
- Click **Save Changes**

Adjust the above URLs as needed for the correct hostname or path. Localhost is currently not allowed.

### Setup your App information

Update the `CLIENT_ID` and `APPLICATION_ID` constants in `index.js` with your app's `config/prod.env.js` file.

## Run and deploy

``` bash
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

This application was build from the VueJS webpack template. For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
