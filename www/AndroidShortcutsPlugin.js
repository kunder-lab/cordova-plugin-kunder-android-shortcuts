function AndroidShortcutsPlugin() {
}

AndroidShortcutsPlugin.prototype.getSelectedShortcut = function (successCallback, errorCallback) {
  cordova.exec(
    successCallback,
    errorCallback,
    "AndroidShortcutsPlugin",
    "getSelectedShortcut",
    []
  );
};

var AndroidShortcutsPlugin = new AndroidShortcutsPlugin();
module.exports = AndroidShortcutsPlugin;
