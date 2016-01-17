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
  // Tray icon
  appIcon = new appTray('img/app.png');
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
  var template = [{
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
  appMenu.setApplicationMenu(appMenu.buildFromTemplate(template));
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
