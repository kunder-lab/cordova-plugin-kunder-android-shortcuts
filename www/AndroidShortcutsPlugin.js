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
AndroidShortcutsPlugin.prototype.setDynamicShortcut = function (params, successCallback, errorCallback) {
  cordova.exec(
    successCallback,
    errorCallback,
    "AndroidShortcutsPlugin",
    "setDynamicShortcut",
    [params]
  );
};

var AndroidShortcutsPlugin = new AndroidShortcutsPlugin();
module.exports = AndroidShortcutsPlugin;
