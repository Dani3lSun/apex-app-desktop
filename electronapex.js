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
