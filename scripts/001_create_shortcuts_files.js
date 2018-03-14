#!/usr/bin/env node
'use strict';

var fs = require('fs');
var fse = require('fs-extra');

module.exports = function(context) {
	var android_shortcuts_file = fs.readFileSync('android-shortcuts/shortcuts.json', 'utf8');
	var android_shortcuts_json = JSON.parse(android_shortcuts_file);
	if(!android_shortcuts_json) {
		process.stdout.write('No "shortcuts.json" file found. Skipping process.');
	} else {
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

		try {
			if(!fs.existsSync('android-shortcuts') && !fs.existsSync('android-shortcuts/icons')) {
				process.emitWarning('icons folder does not exist');
				process.exit(1);
			}
			fse.copySync('android-shortcuts/icons', 'platforms/android/res/drawable')
		} catch (err) {
			process.emitWarning('Copying android-shortcuts icons failure');
			process.emitWarning(err);
			process.exit(1);
		}

		var shortcutHelperFile = fs.readFileSync(context.opts.plugin.dir+'/src/android/ShortcutHelperActivity.java','utf8');
		shortcutHelperFile = shortcutHelperFile.replace('%CORDOVA_MAIN_PACKAGE%', packageName);
		var packageNameDIR = packageName.replace(/\./g, '/')
		fs.writeFileSync('platforms/android/src/'+packageNameDIR+'/ShortcutHelperActivity.java', shortcutHelperFile);
		
		var pluginFile = fs.readFileSync('platforms/android/src/cl/kunder/androidshortcuts/AndroidShortcutsPlugin.java','utf8');
		pluginFile = pluginFile.replace('%CORDOVA_MAIN_PACKAGE%', packageName);
		fs.writeFileSync('platforms/android/src/cl/kunder/androidshortcuts/AndroidShortcutsPlugin.java', pluginFile);
		
		var androidManifestFile = fs.readFileSync('platforms/android/AndroidManifest.xml', 'utf-8');
		if(androidManifestFile.indexOf('android:name="android.app.shortcuts"') === -1) {
			androidManifestFile = androidManifestFile.replace('</intent-filter>', '</intent-filter>\n\t\t\t<meta-data android:name="android.app.shortcuts" android:resource="@xml/shortcuts" />');
			fs.writeFileSync('platforms/android/AndroidManifest.xml', androidManifestFile);
		}

		var shortcutsXML = '<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">';
		var stringFile = fs.readFileSync('platforms/android/res/values/strings.xml','utf8');
		var i = 1;
		
		for(var shortcut of android_shortcuts_json.shortcuts) {
			
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

			shortcutsXML = shortcutsXML+'\n\t<shortcut' +
						'\n\t\tandroid:shortcutId="'+shortcut.shortcutId+'"' +
						'\n\t\tandroid:enabled="true"' +
						'\n\t\tandroid:icon="@drawable/'+shortcut.icon+'"' +
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
