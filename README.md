**Table of Contents**

- [APEX Desktop Application using Github Electron](#apex-desktop-application-using-github-electron)
	- [Description](#description)
  - [Helpful links](#helpful-links)
	- [Successful](#successful)
  - [Problems](#problems)
	- [Changelog](#changelog)
	- [Installation](#installation)
		- [Preparations](#preparations)
			- [Install Node.js](#install-nodejs)
		- [Electron App](#electron-app)
			- [package.json](#packagejson)
			- [Install Electron into app folder and globally](#install-electron-into-app-folder-and-globally)
			- [main.js](#mainjs)
			- [index.html](#indexhtml)
			- [apexutils.js](#apexutilsjs)
			- [electronapex.js](#electronapexjs)
			- [Starting the App](#starting-the-app)
			- [Bundle the app into a real Application](#bundle-the-app-into-a-real-Application)
	- [Sample functions](#sample-functions)
		- [Desktop notifications](#desktop-notifications)
		- [File open](#file-open)
		- [APEX Authorization Scheme](#apex-authorization-scheme)
	- [License](#license)
	- [Preview](#preview)

#APEX Desktop Application using Github Electron
##Description
This is not a ready to use software, but much more a showcase and tutorial how to build desktop APEX apps using Electron from Github...

This showcase describes the steps I´ve been done (maybe wrong ones included, too :) ), there I had success and there a had problems with.

##Helpful Links
- [Electron](http://electron.atom.io)
- [Electron on Github](https://github.com/atom/electron)
- [Node.js](https://nodejs.org) (required on your Machine to install all other things)
- [Electron API docs](https://github.com/atom/electron/tree/master/docs/api)
- [Electron Packager](https://github.com/maxogden/electron-packager) (Packaging Apps into container to rollout)
- [Electron Tutorial](http://ryanfrench.co/2015/05/02/harmonic_tutorial_1.html) (Sample App tutorial)

##Successful
- Embed APEX App into electron using webview
- Copy&Paste support with App menu (menubar)
- Open links (href / window.open) inside of electron app
- Desktop Notifications
- React on console.log events from APEX app and do things with this (for example opening a local file)
- App style without border and titlebar
- fullscreen mode

##Problems
- React on electron functions triggered from APEX app (nodeintegration and webview-preload functions in webviews does not work for APEX app (maybe because of the changed URL if page gets rendered))
- Session state (on a hard refresh, app returns to login page (possible solution: on close get last webview URL and save it))
- Closing to OS X dock: Reopening the app shows login page, instead of content from before (minimize works well)

##Changelog

####First testings...


##Installation
###Preparations
####Install Node.js
It is required to have a up and running Node.js installation on your local development machine.
Either install it using a package manager, or download the latest version from Node.js homepage...for example:
- Ubuntu:
```
apt-get install nodejs
apt-get install npm
```

- Mac OS X (Homebrew):
```
brew install nodejs
```

- Windows:
Download and install it from Nodejs homepage

npm is the package manager for node applications. Thus electron is based on node, npm is working all the same...

###Electron App
####package.json
**not required if you decide to download this repository!**

The first step is to generate the package.json file
```
mkdir apex-app-desktop
cd apex-app-desktop
npm init
```

The resulting json file could look like this:
```json
{
  "name": "apex-app-desktop",
  "version": "1.0.0",
  "description": "APEX Desktop Application using Github Electron",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Dani3lSun/apex-app-desktop.git"
  },
  "author": "Daniel Hochleitner",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/Dani3lSun/apex-app-desktop/issues"
  },
  "homepage": "https://github.com/Dani3lSun/apex-app-desktop#readme",
  "devDependencies": {
    "electron-prebuilt": "^0.36.4"
  }
}
```

Now we have to add **"start": "electron ."** to the scripts tag of the json file.
```json
{
  "name": "apex-app-desktop",
  "version": "1.0.0",
  "description": "APEX Desktop Application using Github Electron",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "electron ."
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Dani3lSun/apex-app-desktop.git"
  },
  "author": "Daniel Hochleitner",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/Dani3lSun/apex-app-desktop/issues"
  },
  "homepage": "https://github.com/Dani3lSun/apex-app-desktop#readme",
  "devDependencies": {
    "electron-prebuilt": "^0.36.4"
  }
}
```

####Install Electron into app folder and globally
**not required if you decide to download this repository!**

```
npm i electron-prebuilt --save-dev #for local app folder
npm i -g electron-prebuilt #globally for using commandline
```

####main.js
**not required if you decide to download this repository!**

This is the main javascript file for the app (also mentioned in the package.json file). It will initialize the whole application.
Here you can open new windows, react on app events or create menus...

```javascript
// Libraries used in the app
var app = require('app');
var BrowserWindow = require('browser-window');
var appMenu = require("menu");
var appTray = require("tray");
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
// Crash Reporter (Optional)
require('crash-reporter').start({
  productName: 'APEX Plugins',
  companyName: 'Daniel Hochleitner',
  submitURL: 'https://github.com/Dani3lSun/apex-app-desktop/issues',
  autoSubmit: false
});
// Init mainWindow and Tray
var mainWindow = null;
var appIcon = null;
// Kill the app when all windows are closed
app.on('mainWindow-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
// App is loaded
app.on('ready', function() {
  // Tray icon not on OSX
  // template
  var trayTemplate = [{
    label: "About Application",
    selector: "orderFrontStandardAboutPanel:"
  }, {
    label: "Quit",
    click: function() {
      app.quit();
    }
  }];
  // set tray icon with context menu
  appIcon = new appTray('img/tray.png');
  appIcon.setContextMenu(appMenu.buildFromTemplate(trayTemplate));
  // Create the main window for the app
  mainWindow = new BrowserWindow({
    "width": 1280, // init width
    "height": 800, // init height
    "min-width": 1024,
    "min-height": 800,
    "resizable": true,
    "use-content-size": true,
    "transparent": true, // better look in OSX
    "title-bar-style": "hidden-inset", // better look in OSX
    "icon": "img/app.png" // app icon (for linux build)
  });
  // Load in content with webview to APEX app
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  // Ensure that garbage collection occurs when the window is closed
  mainWindow.on('closed', function(e) {
    mainWindow = null;
  });
  // Create the Application main menu (required for Copy&Paste Support)
  // Application menu
  var menuTemplate = [{
    label: "Application",
    submenu: [{
        label: "About Application",
        selector: "orderFrontStandardAboutPanel:"
      }, {
        type: "separator"
      }, {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }]
      // Edit menu
  }, {
    label: "Edit",
    submenu: [{
      label: "Undo",
      accelerator: "CmdOrCtrl+Z",
      selector: "undo:"
    }, {
      label: "Redo",
      accelerator: "Shift+CmdOrCtrl+Z",
      selector: "redo:"
    }, {
      type: "separator"
    }, {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      selector: "cut:"
    }, {
      label: "Copy",
      accelerator: "CmdOrCtrl+C",
      selector: "copy:"
    }, {
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      selector: "paste:"
    }, {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      selector: "selectAll:"
    }]
  }, {
    // View menu
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.reload();
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: (function() {
        if (process.platform == 'darwin')
          return 'Ctrl+Command+F';
        else
          return 'F11';
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: (function() {
        if (process.platform == 'darwin')
          return 'Alt+Command+I';
        else
          return 'Ctrl+Shift+I';
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.toggleDevTools();
      }
    }]
  }];
  // set menu with options from above
  appMenu.setApplicationMenu(appMenu.buildFromTemplate(menuTemplate));
});
// Create the main window for the app when App is reopened from OSX Dock
app.on('activate', function(e, hasVisibleWindows) {
  if (mainWindow === null) {
    mainWindow = new BrowserWindow({
      "width": 1280, //init width
      "height": 800, // init height
      "min-width": 1024,
      "min-height": 800,
      "resizable": true,
      "use-content-size": true,
      "transparent": true, // better look in OSX
      "title-bar-style": "hidden-inset", // better look in OSX
      "icon": "img/app.png" // app icon (for linux build)
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', function() {
      mainWindow = null;
    });
  }
});
```

####index.html
**not required if you decide to download this repository!**

This file is opened from main.js. It includes the webview element which has as source the APEX URL.
Also this file has js functions that get triggered from webview events.

```html
<!DOCTYPE html>
<html>

<head>
  <title>APEX Plugins</title>
</head>

<body style="overflow: hidden">
  <!-- Webview
  Parameter:
  autosize="on",
  allowpopups (allow new windows created inside webview),
  minwidth,
  minheight,
  useragent (UserAgent inside the webview - used for authorization scheme in APEX)
  -->
  <webview id="apex-plugin-app" src="https://apex.oracle.com/pls/apex/f?p=APEXPLUGIN" autosize="on" allowpopups minwidth="1024" minheight="800" useragent="APEXDESKTOP" style="height:100%;width:100%;position:absolute;"></webview>
  <!-- Webview JS -->
  <script>
    var webview = document.getElementById("apex-plugin-app");
    var apexutils = require('./apexutils');
    // open href links in electron app
    webview.addEventListener('new-window', function(e) {
      window.open(e.url, e.frameName, "resizable,scrollbars,status");
    });
    // console message events (functions wrapped into console messages)
    webview.addEventListener('console-message', function(e) {
      var stringDevider = "::";
      var position = e.message.indexOf(stringDevider);
      var messageType = e.message.substr(0, position);
      // open local file
      if (messageType === 'open-file') {
        apexutils.openLocalFile(e.message);
      }
    });
  </script>
</body>

</html>
```

####apexutil.js
**not required if you decide to download this repository!**

This file contains functions for APEX triggered events in electron opponent for electronapex.js functions inside APEX.
Generally spoken: All functions that are required by electron for the APEX js functions. Wrapped into a own file...

```javascript
// Functions for APEX triggered events in electron
// opponent for electronapex.js functions inside APEX
//

// electron functions
electron = window.require('electron');

var stringDevider = "::";

module.exports = {
  // opens a local file from consol.log text from APEX
  openLocalFile: function(consoleString) {
    var position = consoleString.indexOf(stringDevider) + 2;
    path = consoleString.substr(position);
    var shell = electron.shell;
    shell.openItem(path);
  }
};
```

####electronapex.js
**not required if you decide to download this repository!**

This file contains js functions used in the APEX app itself. For example notifications or opening files.
File open uses console.log to trigger the event on electron side (not nice but works...hopefully someone was here more successful than I!).

**Upload this file to your APEX application or workspace!**

```javascript
// Functions for electron used in APEX
// functions often uses wrapper around console.log (webview.addEventListener('console-message' gets these events))
// upload to APEX App!

var stringDevider = "::";
// global namespace
var electronapex = {
  // open file
  openFile: function(path) {
    var type = 'open-file';
    console.log(type + stringDevider + path);
  },
  // check if notifications are enabled
  notifyCheck: function() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications");
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("You already have granted Notification permissions, great!:)");
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function(permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("Now Notifications should work!");
        }
      });
    }
  },
  // send a notification
  doNotify: function(text) {
    var notification = new Notification(text);
  }
};
```

####Starting the App
- If you cloned this repository than you have to do this:
```
npm install #installs all dependencies from package.json
npm start
```

- If you did all by yourself:
```
npm start
```

####Bundle the app into a real Application
To create a real application from your development app folder you need the "electron-packager" package installed globally:
```
npm install electron-packager -g
```

Now you can create the application on commandline with:
```
cd apex-app-desktop
electron-packager . "APEX Plugins" --platform=darwin --arch=x64 --version=0.36.4 --app-version=1.0.0 --icon img/app.icns
```
This command creates a "APEX Plugins.app" for Mac OS X (darwin) in 64bit, optionally takes the image from img folder as application icon. "--version" is the version string for electron, can be found in your package.json file!

##Sample functions
###Desktop notifications
For this functionality I created a dynamic action (on button click) with this code:
```javascript
var text = $v('P15_NOTIFY_TEXT'); //read text from APEX item
electronapex.doNotify(text); //use function from electronapex.js
```

Uses the Browser Notification API [MDN](https://developer.mozilla.org/de/docs/Web/API/notification)

###File open
Here I wrapped the file path + type "open-file" into console.log. On electron side I react on this with "webview.addEventListener('console-message')".
I created a dynamic action (on button click) with this code:
```javascript
var path = $v('P15_FILE_PATH'); //read path from APEX item
electronapex.openFile(path); //use function from electronapex.js
```

###APEX Authorization Scheme
Thus the webview is created with the option (useragent="APEXDESKTOP" - index.html),
we can use this on APEX side to create a authorization scheme which is true or false based on the user agent of the "browser".

Name: Is Electron User Agent

Message: This page is only visible inside a electron desktop app

```language-sql
DECLARE
  l_user_agent VARCHAR2(500);
BEGIN
  l_user_agent := owa_util.get_cgi_env('HTTP_USER_AGENT');
  IF l_user_agent = 'APEXDESKTOP' THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
```

##License
This software is under **MIT License**.

[LICENSE](https://github.com/Dani3lSun/apex-app-desktop/blob/master/LICENSE)

##Preview
![](https://github.com/Dani3lSun/apex-app-desktop/blob/master/preview.gif)
---
