# Cordova Android Shortcuts Plugin

* [Click here for Spanish Readme](https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts/blob/master/README-es.md)

This Cordova Plugin allows you to create maximum 4 Android Static Shortcuts saving in memory the selected one and get this action to do something in the base application. Tested on ionic 1, 2 and 3 based projects.

## Install and configuration

First, install the plugin with the following command:
````
cordova plugin add https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts.git
````
Then, create android-shortcuts.json file with all the information about the shortcuts you want to create (maximum 4 shortcuts):

````
{
    "shortcuts": [
        {
            "shortcutId": "ID_1",
            "icon": "path/of/icon1.png",
            "shortcutShortLabel": "Some Short Label 1",
            "shortcutLongLabel": "Some Long Label 1",
            "shortcutDisabledLabel": "Some shortcut disabled message 1",
            "action": "SOME_ACTION_1"
        },
        ...
        {
            "shortcutId": "ID_4",
            "icon": "path/of/icon4.png",
            "shortcutShortLabel": "Some Short Label 4",
            "shortcutLongLabel": "Some Long Label 4",
            "shortcutDisabledLabel": "Some shortcut disabled message 4",
            "action": "SOME_ACTION_4"
        }
    ]
}
````

To improve launch performance you should set the following into config.xml file:
````
... <platform name="android">
        <preference name="AndroidLaunchMode" value="singleInstance" />
    ...
````

## Get Selected Shortcut

This plugin saves in memory the selected action shortcut. You can get the action string using the following javascript command:

````
AndroidShortcutsPlugin.getSelectedShortcut(function(response){
    if(response.action === 'ACTION_1') {
      //Do something
    } ...
    else if(response.action === 'ACTION_4') {
      //Do something
    }
    // ignore other cases
}, function(error) {
    console.log(error);
});
````

It is possible that getSelectedShortcut returns a response with null action. If this happens you should ignore it.
As a recomendation, you should call getSelectedShortcut when "resume" event is called.

## License
[MIT License](https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts/blob/master/LICENSE)

## Future releases
- Implement dynamic shortcuts
- Improve code optimizations