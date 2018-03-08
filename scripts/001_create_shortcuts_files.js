#!/usr/bin/env node
'use strict';

var fs = require('fs');

module.exports = function(context) {
	var android_shortcuts_file = fs.readFileSync('android-shortcuts.json', 'utf8');
	var android_shortcuts_json = JSON.parse(android_shortcuts_file);
	if(!android_shortcuts_json) {
		process.stdout.write('No "android-shortcuts.json" file found. Skipping process.');
	} else {
		// process.stdout.write(android_shortcuts_file.toString() + '\n');
		var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util'),
		ConfigParser = context.requireCordovaModule('cordova-lib').configparser,
		projectRoot = cordova_util.isCordova(),
		xml = cordova_util.projectConfig(projectRoot),
		cfg = new ConfigParser(xml),
		packageName = cfg.packageName();

		var dir = 'platforms/android/res/drawable';

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		dir = 'platforms/android/res/xml';

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		// process.stdout.write(packageName + '\n');

		//TODO
		/** 
		 * - Modificar ShortcutHelper.java para añadir el import de la clase MainActivity. Se debe reemplazar %CORDOVA_MAIN_PACKAGE%.
		 * - Leer los shortcuts del config.xml y crear el archivo res/xml/shortcuts.xml
		 * - Copiar los íconos a la carpeta drawable acorde a las referencias de cada shortcut del config.xml.
		 * - De no ser posible añadir directamente la referencia de shortcuts.xml con el plugin.xml en el Android Manifest, hacer eso mediante este hook.
		 * 
		 */


		// Modificar ShortcutHelper.java para añadir el import de la clase MainActivity. Se debe reemplazar %CORDOVA_MAIN_PACKAGE% por el ID de la app.

		var shortcutHelperFile = fs.readFileSync(context.opts.plugin.dir+'/src/android/ShortcutHelperActivity.java','utf8');
		
		shortcutHelperFile = shortcutHelperFile.replace('%CORDOVA_MAIN_PACKAGE%', packageName);

		var packageNameDIR = packageName.replace(/\./g, '/')
		
		fs.writeFileSync('platforms/android/src/'+packageNameDIR+'/ShortcutHelperActivity.java', shortcutHelperFile);
		
		var pluginFile = fs.readFileSync('platforms/android/src/cl/kunder/androidshortcuts/AndroidShortcutsPlugin.java','utf8');
		pluginFile = pluginFile.replace('%CORDOVA_MAIN_PACKAGE%', packageName);
		fs.writeFileSync('platforms/android/src/cl/kunder/androidshortcuts/AndroidShortcutsPlugin.java', pluginFile);
		
		
		// Modificar AndroidManifest para añadir la meta-data indicando que se debe implementar los shortcuts
		var androidManifestFile = fs.readFileSync('platforms/android/AndroidManifest.xml', 'utf-8');
		if(androidManifestFile.indexOf('android:name="android.app.shortcuts"') === -1) {
			androidManifestFile = androidManifestFile.replace('</intent-filter>', '</intent-filter>\n\t\t\t<meta-data android:name="android.app.shortcuts" android:resource="@xml/shortcuts" />');
			fs.writeFileSync('platforms/android/AndroidManifest.xml', androidManifestFile);
		}

		//Analizando el archivo android-shortcuts.json
		var shortcutsXML = '<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">';
		var stringFile = fs.readFileSync('platforms/android/res/values/strings.xml','utf8');
		var i = 1;
		
		for(var shortcut of android_shortcuts_json.shortcuts) {
			//Primero se debe procesar los elementos independientes: iconos. Se deben 
			//copiar directamente en la carpeta drawable
			var iconName = 'icon.png';
			if(shortcut.icon) {
				var iconURLArray = shortcut.icon.split('/');
				iconName = iconURLArray[iconURLArray.length-1];
				fs.writeFileSync('platforms/android/res/drawable/'+iconName, fs.readFileSync(shortcut.icon));
			}

			//Segundo, se deben reemplazar los strings de shortcuts por los valores del json
			
			if(stringFile.indexOf('<string name="shortcutShortLabel_'+i+'">') > -1){
				var regex = new RegExp('\<string name\=\"shortcutShortLabel_'+i+'\"\>[ \S]*\<\/string\>', 'i');
				stringFile = stringFile.replace(regex, '<string name="shortcutShortLabel_'+i+'">'+shortcut.shortcutShortLabel+'</string>');
			} else{
				stringFile = stringFile.replace('</resources>', '<string name="shortcutShortLabel_'+i+'">'+shortcut.shortcutShortLabel+'</string>\n</resources>');
			}

			if(stringFile.indexOf('<string name="shortcutLongLabel_'+i+'">') > -1){
				var regex = new RegExp('\<string name\=\"shortcutLongLabel_'+i+'\"\>[ \S]*\<\/string\>', 'i');
				stringFile = stringFile.replace(regex, '<string name="shortcutLongLabel_'+i+'">'+shortcut.shortcutLongLabel+'</string>');
			} else{
				stringFile = stringFile.replace('</resources>', '<string name="shortcutLongLabel_'+i+'">'+shortcut.shortcutLongLabel+'</string>\n</resources>');
			}

			if(stringFile.indexOf('<string name="shortcutDisabledLabel_'+i+'">') > -1){
				var regex = new RegExp('\<string name\=\"shortcutDisabledLabel_'+i+'\"\>[ \S]*\<\/string\>', 'i');
				stringFile = stringFile.replace(regex, '<string name="shortcutDisabledLabel_'+i+'">'+shortcut.shortcutDisabledLabel+'</string>');
			} else{
				stringFile = stringFile.replace('</resources>', '<string name="shortcutDisabledLabel_'+i+'">'+shortcut.shortcutDisabledLabel+'</string>\n</resources>');
			}
			
			//Tercero, crear el contenido del archivo shortcuts.xml con las referencias de los strings creados o actualizados

			shortcutsXML = shortcutsXML+'\n\t<shortcut' +
						'\n\t\tandroid:shortcutId="'+shortcut.shortcutId+'"' +
						'\n\t\tandroid:enabled="true"' +
						'\n\t\tandroid:icon="@drawable/'+iconName.split('.')[0]+'"' +
						'\n\t\tandroid:shortcutShortLabel="@string/shortcutShortLabel_'+i+'"' +
						'\n\t\tandroid:shortcutLongLabel="@string/shortcutLongLabel_'+i+'"' +
						'\n\t\tandroid:shortcutDisabledMessage="@string/shortcutDisabledLabel_'+i+'" >' +
						'\n\t\t<intent' +
						'\n\t\t\tandroid:action="'+shortcut.action+'"' +
						'\n\t\t\tandroid:targetPackage="'+packageName+'"' +
						'\n\t\t\tandroid:targetClass="'+packageName+'.ShortcutHelperActivity" />' +
						'\n\t</shortcut>';
			i++;
		}
		shortcutsXML = shortcutsXML + '\n</shortcuts>';
		fs.writeFileSync('platforms/android/res/values/strings.xml', stringFile);
		fs.writeFileSync('platforms/android/res/xml/shortcuts.xml', shortcutsXML);
	}

	
};
