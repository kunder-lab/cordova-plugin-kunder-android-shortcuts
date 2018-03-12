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
AndroidShortcutsPlugin.prototype.removeAllDynamicShortcuts = function (successCallback, errorCallback) {
  cordova.exec(
    successCallback,
    errorCallback,
    "AndroidShortcutsPlugin",
    "removeAllDynamicShortcuts",
    []
  );
};

var AndroidShortcutsPlugin = new AndroidShortcutsPlugin();
module.exports = AndroidShortcutsPlugin;
