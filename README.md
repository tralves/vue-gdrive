# vue-gdrive

> VueJS text editor with Google Drive integration

If you want to build a VueJS app with Google Drive integration? Start here!

This project is just a text editor written in VueJS uses google drive API for storage, sharing (soon) and realtime colaboration (not yet). Use it as a boilerplate or reference for your awesome project!

## Screenshots

<a href="https://cloud.githubusercontent.com/assets/2600867/17316208/638acbea-5848-11e6-88f6-c84d63d249de.jpg"><img src="https://cloud.githubusercontent.com/assets/2600867/17316208/638acbea-5848-11e6-88f6-c84d63d249de.jpg" width="300" ></a>
<a href="https://cloud.githubusercontent.com/assets/2600867/17316214/6a1bf8e4-5848-11e6-8097-d5b1b6b856db.jpg"><img src="https://cloud.githubusercontent.com/assets/2600867/17316214/6a1bf8e4-5848-11e6-8097-d5b1b6b856db.jpg" width="300" ></a>

## DEMO
Try the app [here](https://tralves.github.io/vue-gdrive/)!

## Roadmap

#### Done:
- VueJS + Vuex boilerplate;
- [Material Design Lite](https://getmdl.io/) and [vue-mdl](http://posva.net/vue-mdl/#!/installation);
- G+ user authentication;
- Create file in GDrive;
- (Auto-)save file in GDrive;
- Load File from GDrive;
- Share file;
- Realtime colaboration;

#### TODO:

- Save in folder;
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


- Go to [https://console.developers.google.com/apis/library](https://console.developers.google.com/apis/library).
    - Ppen the dropdown in the top bar, next to the GoogleAPIs logo.
    - Select **Create project**.
    - Choose the project name.
    - Press **Create**
- Open the **API Manager** on the left sidebar.
- Select **Credentials** -> **Create Credentials** -> **OAuth Client ID**
- If using a new project, select **Configure consent screen* and fill out the form
    - Select an **EMAIL ADDRESS** and enter a **PRODUCT NAME** if not already set and click the Save button.
- Select the application type *Web application**
- List your hostname in the **Authorized JavaScript Origins** field.
- Click the **Create** button. Note the resulting client ID and secret which you'll need later on.

> The hostname cannot be `localhost`. To test from your machine, create an alias in `etc/hosts` like `127.0.0.1 myvuegdrive.dev`. In this case, if you use `npm run dev`, the hostname of your application will be `myvuegdrive.dev:8080`.

To enable integration with the Drive UI, including the sharing dialog, perform the following steps.

- Select **Library** section in **API Manager**.
- Search for 'Drive API' and click on 'Drive API' in the results.
- Click **Enable API**.
- Select the **Drive UI Integration** tab.
- Fill out the **Application Name** and upload at least one **Application Icon**.
- Set the *Open URL** to `http://YOURHOST?file={ids}&user={userId}&action={action}`.
- Check the *Creating files** option and set the **New URL** to `http://YOURHOST?user={userId}&action={action}`.
- Fill *Default MIME types* with `text/markdown` and `text/plain`.
- Fill *Default File Extensions* with `md`.
- Click **Save Changes**.

To enable integration with the Google+ API to retrieve the user name, email and avatar, perform the following steps.

- Select **Library** section in **API Manager**.
- Search for 'Google+' and click on 'Google+ API' in the results.
- Click **Enable**.

Adjust the above URLs as needed for the correct hostname or path. Localhost is currently not allowed.

Note the resulting application ID on top of the page.

### Setup your App information

Copy `config/.env.example.js` to `config/.env.js`.
``` bash
cp config/.env.example.js config/.env.js
```
Update the `CLIENT_ID` and `APPLICATION_ID` constants in `config/.env.js` file. Configurations cascade from `prod` to `dev` to `test`.

## Run and deploy

``` bash
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

This application was build from the VueJS webpack template. For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
