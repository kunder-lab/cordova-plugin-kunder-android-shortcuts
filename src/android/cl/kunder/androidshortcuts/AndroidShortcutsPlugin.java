package cl.kunder.androidshortcuts;

import android.os.Build;
import android.os.Bundle;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import %CORDOVA_MAIN_PACKAGE%.ShortcutHelperActivity;


public class AndroidShortcutsPlugin extends CordovaPlugin {

    private static final String TAG = "AndroidShortcutsPlugin";

    public AndroidShortcutsPlugin(){}

    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
        if("getSelectedShortcut".equals(action)) {
            JSONObject response = new JSONObject();
            try {
                response.put("action", ShortcutHelperActivity.ACTION);
                callbackContext.success(response);
                ShortcutHelperActivity.ACTION = null;
            } catch (JSONException e) {
                e.printStackTrace();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
            }
        } else {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
        }
        return true;
    }
}