# Cordova Android Shortcuts Plugin

Este es un plugin de cordova que permite, de forma estática, definir hasta 4 shortcurs, almacenando la acción del shortcut temporalmente para realizar alguna acción cuando se abra la aplicación base. Probado en proyectos basados en ionic 1, 2 y 3.

## Instalación y configuración

Para instalar este plugin se deberá hacer con el siguiente comando:

````
cordova plugin add https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts.git
````

En la raíz del proyecto base, se deberá crear un archivo json llamado android-shortcuts.json, en el cual se deberán definir las configuraciones de los shortcuts de la siguiente forma (máximo 4 shortcuts):

````
{
    "shortcuts": [
        {
            "shortcutId": "ID_1",
            "icon": "path/del/icono1.png",
            "shortcutShortLabel": "Label Corto 1",
            "shortcutLongLabel": "Label Largo 1",
            "shortcutDisabledLabel": "Mensaje cuando el shortcut no esté disponible 1",
            "action": "ACCION_1"
        },
        ...
        {
            "shortcutId": "ID_4",
            "icon": "path/del/icono4.png",
            "shortcutShortLabel": "Label Corto 4",
            "shortcutLongLabel": "Label Largo 4",
            "shortcutDisabledLabel": "Mensaje cuando el shortcut no esté disponible 4",
            "action": "ACCION_4"
        },
    ]
}
````


## Obtener Shortcut seleccionado

Este plugin almacena temporalmente la acción del shortcut seleccionado por el usuario. Para obtener la acción presionada, se deberá utilizar el siguiente código:

````
AndroidShortcutsPlugin.getSelectedShortcut(function(response){
    if(response.action === 'ACCION_1') {
      //Do something
    } ...
    else if(response.action === 'ACCION_4') {
      //Do something
    }
    // ignore other cases
}, function(error) {
    console.log(error);
});
````

Es posible que la acción sea nula. En este caso, se debería ignorar.

## Licencia
[MIT License](https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts/blob/master/LICENSE)

## Futuros features
- Implementar shortcuts dinámicos
- Optimizar código