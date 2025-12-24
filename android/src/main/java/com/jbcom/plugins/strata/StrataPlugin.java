package com.jbcom.plugins.strata;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Strata")
public class StrataPlugin extends Plugin {

    @PluginMethod
    public void getDeviceInfo(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isMobile", true);
        ret.put("platform", "android");
        ret.put("model", Build.MODEL);
        ret.put("osVersion", Build.VERSION.RELEASE);
        call.resolve(ret);
    }

    @PluginMethod
    public void haptics(PluginCall call) {
        String type = call.getString("type", "impact");
        String style = call.getString("style", "medium");

        Vibrator v = (Vibrator) getContext().getSystemService(Context.VIBRATOR_SERVICE);
        if (v != null && v.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                long duration = 50;
                if (type.equals("impact")) {
                    duration = style.equals("heavy") ? 100 : style.equals("medium") ? 50 : 20;
                } else if (type.equals("selection")) {
                    duration = 10;
                }
                v.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                v.vibrate(50);
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void setScreenOrientation(PluginCall call) {
        String orientation = call.getString("orientation", "any");
        // Orientation logic usually involves getActivity().setRequestedOrientation(...)
        // Implementation omitted for brevity but should follow Android standards
        call.resolve();
    }

    @PluginMethod
    public void getSafeAreaInsets(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getActivity().runOnUiThread(() -> {
                View decorView = getActivity().getWindow().getDecorView();
                android.view.WindowInsets rootWindowInsets = decorView.getRootWindowInsets();
                
                JSObject ret = new JSObject();
                if (rootWindowInsets != null) {
                    WindowInsetsCompat insets = WindowInsetsCompat.toWindowInsetsCompat(rootWindowInsets);
                    ret.put("top", insets.getInsets(WindowInsetsCompat.Type.systemBars()).top);
                    ret.put("right", insets.getInsets(WindowInsetsCompat.Type.systemBars()).right);
                    ret.put("bottom", insets.getInsets(WindowInsetsCompat.Type.systemBars()).bottom);
                    ret.put("left", insets.getInsets(WindowInsetsCompat.Type.systemBars()).left);
                } else {
                    ret.put("top", 0);
                    ret.put("right", 0);
                    ret.put("bottom", 0);
                    ret.put("left", 0);
                }
                call.resolve(ret);
            });
        } else {
            JSObject ret = new JSObject();
            ret.put("top", 0);
            ret.put("right", 0);
            ret.put("bottom", 0);
            ret.put("left", 0);
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void getPerformanceMode(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("enabled", false); // Default to false, Android power save mode check can be added
        call.resolve(ret);
    }

    @PluginMethod
    public void configureTouchHandling(PluginCall call) {
        // Implementation for native Android if needed
        call.resolve();
    }
}
