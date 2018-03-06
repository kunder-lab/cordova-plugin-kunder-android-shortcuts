# Descripción

Este es un plugin de cordova que permite, mediante servicio, obtener el listado de dispositivos registrados en distintas aplicaciones del Banco de Chile.
Este plugin proporciona una directiva que se deberá incorporar en las vistas donde se deberá mostrar los "Dispositivos Registrados" . Se recomienda utilizar esta directiva en una única vista en toda la aplicación.

# Instalación y configuración

Para instalar este plugin se deberá hacer con el siguiente comando

````
cordova plugin add http://200.14.166.183/EluPersonas/bancochile-cordova-plugin-enrolled-devices
````

Además, en el index.html del proyecto, se deberá incluir lo siguiente:

````
En apartado de estilos
<link href="js/enrolledDevices/enrolledDevices.min.css" rel="stylesheet">
````

````
En apartado de javascripts
<script src="js/enrolledDevices/enrolledDevices.min.js"></script>
````

Además, es posible utilizar el mismo plugin, sin llamadas a los servicios y con información aleatoria, con el comando "ionic serve". Para realizar esto se deberá crear la siguiente tarea en gulp: 

````
gulp.task('enrolledDevices',function() {
  gulp.src(['./plugins/bancochile-cordova-plugin-enrolled-devices/www/ionic_serve/**/*'])
  .pipe(gulp.dest(paths.www + 'js/enrolledDevices'));
});
Donde paths.www es la ruta de la carpeta www del proyecto. Idealmente, debería ser "www/"
````

Finalmente, se deberá modificar el archivo ionic.project (depende de la versión de ionic utilizada) y añadir la tarea de gulp:

````
"gulpStartupTasks": [
    "enrolledDevices",
    ...
  ]
````

## Requerimientos

* ELU debe estar instalado (en su versión 3.7.x) debido a que "Dispositivos Registrados" utiliza el motor ELU para obtener los datos. Además, necesita de algunos métodos proporcionados por eluService para su funcionamiento.

# Uso de la directiva

Una vez realizada la instalación y configuración del plugin, la directiva se podrá utilizar con solo añadir en la vista deseada lo siguiente:

````
<enrolled-devices></enrolled-devices>
````

## Evento deleteEnrolledDeviceFinished 

La directiva provee el evento broadcast "deleteEnrolledDeviceFinished", el cual proporciona la muestra de mensajes de éxito al momento de eliminar un dispositivo registrado. Este incluye un mensaje que debe ser mostrado en las popups de éxito de las aplicaciones. 

````
_broadcastEventWithData('deleteEnrolledDeviceFinished', {message: 'Registros en ' + deviceName + ' se eliminaron con éxito' });

* (deviceName, es el nombre del dispositivo que ha sido eliminado del listado de dispositivos registrados)
````

Para utilizar dicho evento, tan solo basta con realizar la siguiente configuración dentro de las aplicaciones:

````
$scope.$on('deleteEnrolledDeviceFinished', function(event, params) {
    console.log(params.message); //Mensaje de éxito a mostrar
});
````

## Evento enrolledDeviceError

La directiva provee el evento broadcast "enrolledDeviceError", el cual proporciona la muestra de mensajes de error al momento de eliminar un dispositivo registrado o al momento de obtener el listado de dispositivo registrados. A diferencia del evento anterior, "enrolledDeviceError" a demás de proporcionar el mensaje a mostrar, también proporciona un flag con key "goBack", el que contiene un flag true (para volver atrás si falló la obtención de datos) o false (para no hacerlo en caso de que falle el servicio de eliminar dispositivo registrado). Dependerá del usuario si se utiliza o no. 

````
_broadcastEventWithData('enrolledDeviceError', {message: 'errorMessage', goBack: true (or false) });

* (goBack, dependerá del caso en que se ejecuté la llamada a servicios obtener dispositivos registrados o eliminar dispositivo registrado)
````

Para utilizar dicho evento, tan solo basta con realizar la siguiente configuración dentro de las aplicaciones:

````
$scope.$on('enrolledDeviceError', function(event, params) {
    console.log(params.message); //Mensaje de éxito a mostrar
    console.log(params.goBack); //Flag para volver atrás en la vista o no. Dependerá del usuario si se utiliza o no.
});
````

# Realizar cambios y pruebas

Para hacer cambios en este plugin, primero se deberá crear un nuevo branch con el nombre "feature-nombre-de-la-funcionalidad". Posteriormente, se deberán instalar las dependencias de node mediante el comando:

````
npm install
````

Se deberá modificar la lógica, vistas o estilos de la carpeta "www/src" del plugin. Una vez realizados los cambios, se deberán ejecutar los siguientes comandos para generar los archivos finales que serán utilizados por la aplicación:

````
gulp generate-dist 
gulp generate-ionic-serve
````

Cabe destacar que antes de generar un nuevo release del plugin se deberán ejecutar los comandos anteriores para asegurarse que los archivos finales hayan sido creados correctamente.