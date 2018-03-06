function AndroidShortcuts() {
}

AndroidShortcuts.prototype.getSelectedShortcut = function (successCallback, errorCallback) {
  cordova.exec(
    successCallback,
    errorCallback,
    "AndroidShortcuts",
    "getSelectedShortcut",
    []
  );
};

var AndroidShortcuts = new AndroidShortcuts();
module.exports = AndroidShortcuts;
