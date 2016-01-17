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
