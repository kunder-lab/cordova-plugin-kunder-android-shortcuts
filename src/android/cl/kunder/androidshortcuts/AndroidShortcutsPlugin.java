package cl.kunder.androidshortcuts;

import android.annotation.TargetApi;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Icon;
import android.util.Base64;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;

import %CORDOVA_MAIN_PACKAGE%.ShortcutHelperActivity;

public class AndroidShortcutsPlugin extends CordovaPlugin {

    private static final String TAG = "AndroidShortcutsPlugin";
    public AndroidShortcutsPlugin(){}

    @TargetApi(25)
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
        } else if("setDynamicShortcut".equals(action)) {
            ShortcutManager shortcutManager = this.cordova.getActivity().getSystemService(ShortcutManager.class);
            if(shortcutManager.getDynamicShortcuts().size() == 4) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
                return false;
            }
            Intent intent = new Intent(this.cordova.getActivity().getApplicationContext(), ShortcutHelperActivity.class);
            try {
                JSONObject jsonObject = new JSONObject(args.getString(0));
                intent.setAction(jsonObject.getString("action"));
                String encodedImage = jsonObject.getString("icon");
                byte[] decodedString = Base64.decode(encodedImage, Base64.DEFAULT);
                Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
                ShortcutInfo shortcutInfo = new ShortcutInfo.Builder(this.cordova.getActivity(), jsonObject.getString("id"))
                        .setShortLabel(jsonObject.getString("shortLabel"))
                        .setLongLabel(jsonObject.getString("longLabel"))
                        .setIcon(Icon.createWithBitmap(decodedByte))
                        .setIntent(intent)
                        .build();
                shortcutManager.setDynamicShortcuts(Arrays.asList(shortcutInfo));
            } catch (JSONException e) {
                e.printStackTrace();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
            }

        } else if("removeAllDynamicShortcuts".equals(action)) {
            ShortcutManager shortcutManager = this.cordova.getActivity().getSystemService(ShortcutManager.class);
            shortcutManager.removeAllDynamicShortcuts();
        } else {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
        }
        return true;
    }
}