# Cordova Android Shortcuts Plugin

Este es un plugin de cordova que permite, de forma estática y dinámica, definir hasta 4 shortcuts, almacenando la acción del shortcut temporalmente para realizar alguna acción cuando se abra la aplicación base. Probado en proyectos basados en ionic 1, 2 y 3.

## Instalación del plugin

Para instalar este plugin se deberá hacer con el siguiente comando:

````
cordova plugin add https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts.git
````

## Configuración de Shortcuts estáticos

En la raíz del proyecto base, se deberá crear la siguiente distribución de archivos:

````
android-shortcuts
├─── icons
    └─── icon_1.png //Sólo se pueden utilizar letras, números y guíones bajo para los nombres de los íconos
    └─── icon_2.png //Estos íconos se copiarán directamente a la carpeta drawable de Android
    ...
    └─── icon_N.png
└─── shortcuts.json
````

En el archivo shortcuts.json, se deberán definir las configuraciones de los shortcuts de la siguiente forma (máximo 4 shortcuts. Si se define más de 4, éstos serán ignorados):

````
{
    "shortcuts": [
        {
            "shortcutId": "ID_1",
            "icon": "icon_1", // Nombre del ícono de la carpeta android-shortcuts/icons sin la extrensión
            "shortcutShortLabel": "Label Corto 1",
            "shortcutLongLabel": "Label Largo 1",
            "shortcutDisabledLabel": "Mensaje cuando el shortcut no esté disponible 1",
            "action": "ACCION_1"
        },
        ...
        {
            "shortcutId": "ID_4",
            "icon": "icon_4",
            "shortcutShortLabel": "Label Corto 4",
            "shortcutLongLabel": "Label Largo 4",
            "shortcutDisabledLabel": "Mensaje cuando el shortcut no esté disponible 4",
            "action": "ACCION_4"
        }
    ]
}
````

Para mejorar el rendimiento en el proceso de lanzamiendo de la actividad principal, se debe configurar lo siguiente en el archivo config.xml del proyecto:

````
...
<platform name="android">
    <preference name="AndroidLaunchMode" value="singleInstance" />
    ...
````

## Shortcuts dinámicos

### Crear shortcut dinámico

Este plugin, además, provee de un método para crear shortcuts dinámicamente (en tiempo de ejecución). Para ello, se deberá utilizar el siguiente código:

````
AndroidShortcutsPlugin.createDynamicShortcut(
    {
        id: 'someID',
        action: 'someAction',
        shortLabel: 'ShortLabel', //String que se muestra en el home de android al hacer un long press sobre la aplicación.
        longLabel: 'LongLabel', //String que se muestra en el cajón de aplicaciones al hacer un long press sobre la aplicación.
        icon: 'BASE64_String_icon', //String en base64 o nombre del ícono de la carpeta drawable de Android (sin extensión).
        iconIsBase64: 'true' // (opcional) Booleano que indica si el ícono está en formato base64.
    },
    successCallback,
    errorCallback
);
````

### Eliminar todos los shortcuts dinámicos

Es posible eliminar todos los shortcuts dinámicos que se hayan creado con el siguiente código (no se elimiman los shortcuts estáticos):

````
AndroidShortcutsPlugin.removeAllDynamicShortcuts(
    successCallback,
    errorCallback
);
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
Se recomienda llamar a la función getSelectedShortcut cuando el evento "resume" sea llamado.

## Licencia
[MIT License](https://github.com/kunder-lab/cordova-plugin-kunder-android-shortcuts/blob/master/LICENSE)

## Futuros features
- Optimizar código