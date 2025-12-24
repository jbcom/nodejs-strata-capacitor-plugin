import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin with the native methods listed that should be exposed
// to JavaScript.
CAP_PLUGIN(StrataPlugin, "Strata",
           CAP_PLUGIN_METHOD(getDeviceInfo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(haptics, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setScreenOrientation, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getSafeAreaInsets, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getPerformanceMode, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(configureTouchHandling, CAPPluginReturnPromise);
)
