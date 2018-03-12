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
AndroidShortcutsPlugin.prototype.createDynamicShortcut = function (params, successCallback, errorCallback) {
  cordova.exec(
    successCallback,
    errorCallback,
    "AndroidShortcutsPlugin",
    "createDynamicShortcut",
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
