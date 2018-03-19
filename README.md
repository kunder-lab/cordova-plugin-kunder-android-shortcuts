# Cordova Android Shortcuts Plugin

* [Click here for Spanish Readme](https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts/blob/master/README-es.md)

This Cordova Plugin allows you to create maximum 4 Android Static Shortcuts saving in memory the selected one and get this action to do something in the base application. Tested on ionic 1, 2 and 3 based projects.

## Installing plugin

Install the plugin with the following command:

````
cordova plugin add https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts.git
````

## Static shortcuts configuration

In the project's root folder you should create the following file and folder distribution:

````
android-shortcuts
├─── icons
    └─── icon_1.png //Use words, numbers and "_" characters only.
    └─── icon_2.png //These icons will be copied into Android drawable folder
    ...
    └─── icon_N.png
└─── shortcuts.json
````

In the shortcuts.json file you should set all the information about the shortcuts you want to create (maximum 4 shortcuts. If you define more than 4, these will be ignored):

````
{
    "shortcuts": [
        {
            "shortcutId": "ID_1",
            "icon": "icon_1", // One of the icon names in android-shortcuts/icons without file extension.
            "shortcutShortLabel": "Short Label 1",
            "shortcutLongLabel": "Long Label 1",
            "shortcutDisabledLabel": "Disabled message 1",
            "action": "ACTION_1"
        },
        ...
        {
            "shortcutId": "ID_2",
            "icon": "icon_2", // One of the icon names in android-shortcuts/icons without file extension.
            "shortcutShortLabel": "Short Label 2",
            "shortcutLongLabel": "Long Label 2",
            "shortcutDisabledLabel": "Disabled message 2",
            "action": "ACTION_2"
        }
    ]
}
````

To improve the app launch performance you should set the following code into config.xml file:

````
... <platform name="android">
        <preference name="AndroidLaunchMode" value="singleInstance" />
    ...
````

## Dynamic Shortcuts

### Create a dynamic shortcut

This plugin provides you the following method to create shortcuts dynamically (on runtime):

````
AndroidShortcutsPlugin.createDynamicShortcut(
    {
        id: 'someID',
        action: 'someAction',
        shortLabel: 'ShortLabel', //String. This is the shortcut shown when user long press over the icon when it is located in the home screen.
        longLabel: 'LongLabel', //String. This is the shortcut shown when user long press over the icon when it is located in the app drawer.
        icon: 'BASE64_String_icon', //String, should be the base64 icon or the name of this without extension. 
        iconIsBase64: 'true' // (Optional) Boolean. Flag that indicates if the icon is base64 String or not. False by default.
    },
    successCallback,
    errorCallback
);
````

### Remove all dynamic shortcuts

Use the following method to remove all dynamic shortcuts. The static shortcuts will not be affected:

````
AndroidShortcutsPlugin.removeAllDynamicShortcuts(
    successCallback,
    errorCallback
);
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
- Optimize code