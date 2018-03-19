
package %CORDOVA_MAIN_PACKAGE%;

import android.content.Intent;
import android.os.Bundle;

import android.app.Activity;
import android.util.Log;

public class ShortcutHelperActivity extends Activity {
    private final static String TAG = "ShortcutHelperActivity";
    public static String ACTION = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ACTION = getIntent().getAction();
        Log.i(TAG, "******************************************");
        Log.i(TAG, ACTION);
        Log.i(TAG, "******************************************");
        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        intent.setAction(ACTION);
        startActivity(intent);
        finish();
    }
}
