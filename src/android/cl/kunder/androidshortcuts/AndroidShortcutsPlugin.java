package cl.kunder.androidshortcuts;

import android.annotation.TargetApi;
import android.content.Context;
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
    private Context context = null;
    public AndroidShortcutsPlugin(){}

    @TargetApi(25)
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
        context = this.cordova.getActivity().getApplicationContext();
        if("getSelectedShortcut".equals(action)) {
            JSONObject response = new JSONObject();
            try {
                response.put("action", ShortcutHelperActivity.ACTION);
                callbackContext.success(response);
                ShortcutHelperActivity.ACTION = null;
            } catch (JSONException e) {
                e.printStackTrace();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
            }
        } else if("createDynamicShortcut".equals(action)) {
            ShortcutManager shortcutManager = context.getSystemService(ShortcutManager.class);
            if( (shortcutManager.getDynamicShortcuts().size() + shortcutManager.getManifestShortcuts().size()) >= 4) {
                /**
                 * TODO
                 * Override one of the dynamic shortcuts
                 */
                callbackContext.error("You can not create more than 4 shortcuts");
                return false;
            }
            Intent intent = new Intent(context, ShortcutHelperActivity.class);
            try {
                JSONObject jsonObject = new JSONObject(args.getString(0));
                intent.setAction(jsonObject.getString("action"));
                String icon = jsonObject.getString("icon");
                ShortcutInfo shortcutInfo = null;

                if(jsonObject.has("iconIsBase64") && jsonObject.getBoolean("iconIsBase64")) {
                    byte[] decodedString = Base64.decode(icon, Base64.DEFAULT);
                    Bitmap decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
                    shortcutInfo = new ShortcutInfo.Builder(context, jsonObject.getString("id"))
                            .setShortLabel(jsonObject.getString("shortLabel"))
                            .setLongLabel(jsonObject.getString("longLabel"))
                            .setIcon(Icon.createWithBitmap(decodedByte))
                            .setIntent(intent)
                            .build();
                } else {
                    shortcutInfo = new ShortcutInfo.Builder(context, jsonObject.getString("id"))
                            .setShortLabel(jsonObject.getString("shortLabel"))
                            .setLongLabel(jsonObject.getString("longLabel"))
                            .setIcon(Icon.createWithResource(context, context.getResources().getIdentifier(icon, "drawable", context.getPackageName())))
                            .setIntent(intent)
                            .build();
                }
                shortcutManager.setDynamicShortcuts(Arrays.asList(shortcutInfo));
                callbackContext.success();
            } catch (JSONException e) {
                e.printStackTrace();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
            }

        } else if("removeAllDynamicShortcuts".equals(action)) {
            ShortcutManager shortcutManager = context.getSystemService(ShortcutManager.class);
            shortcutManager.removeAllDynamicShortcuts();
            callbackContext.success();
        } else {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
        }
        return true;
    }
}