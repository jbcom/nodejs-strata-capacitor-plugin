import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(StrataPlugin)
public class StrataPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StrataPlugin"
    public let jsName = "Strata"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getDeviceInfo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "haptics", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setScreenOrientation", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSafeAreaInsets", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPerformanceMode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "configureTouchHandling", returnType: CAPPluginReturnPromise)
    ]

    @objc func getDeviceInfo(_ call: CAPPluginCall) {
        let device = UIDevice.current
        call.resolve([
            "isMobile": true,
            "platform": "ios",
            "model": device.model,
            "osVersion": device.systemVersion
        ])
    }

    @objc func haptics(_ call: CAPPluginCall) {
        let type = call.getString("type") ?? "impact"
        let style = call.getString("style") ?? "medium"

        DispatchQueue.main.async {
            if type == "impact" {
                var feedbackStyle: UIImpactFeedbackGenerator.FeedbackStyle = .medium
                if style == "light" { feedbackStyle = .light }
                else if style == "heavy" { feedbackStyle = .heavy }
                let generator = UIImpactFeedbackGenerator(style: feedbackStyle)
                generator.impactOccurred()
            } else if type == "notification" {
                let generator = UINotificationFeedbackGenerator()
                generator.notificationOccurred(.success)
            } else if type == "selection" {
                let generator = UISelectionFeedbackGenerator()
                generator.selectionChanged()
            }
        }
        call.resolve()
    }

    @objc func setScreenOrientation(_ call: CAPPluginCall) {
        let orientation = call.getString("orientation") ?? "any"

        DispatchQueue.main.async {
            if #available(iOS 16.0, *) {
                let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene
                var mask: UIInterfaceOrientationMask = .all
                if orientation.contains("portrait") { mask = .portrait }
                else if orientation.contains("landscape") { mask = .landscape }
                
                windowScene?.requestGeometryUpdate(.iOS(interfaceOrientations: mask))
            } else {
                var value = UIInterfaceOrientation.unknown.rawValue
                if orientation.contains("portrait") { value = UIInterfaceOrientation.portrait.rawValue }
                else if orientation.contains("landscape") { value = UIInterfaceOrientation.landscapeLeft.rawValue }
                UIDevice.current.setValue(value, forKey: "orientation")
            }
        }
        call.resolve()
    }

    @objc func getSafeAreaInsets(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let window = UIApplication.shared.windows.first
            let insets = window?.safeAreaInsets ?? .zero
            call.resolve([
                "top": insets.top,
                "right": insets.right,
                "bottom": insets.bottom,
                "left": insets.left
            ])
        }
    }

    @objc func getPerformanceMode(_ call: CAPPluginCall) {
        call.resolve([
            "enabled": ProcessInfo.processInfo.isLowPowerModeEnabled
        ])
    }

    @objc func configureTouchHandling(_ call: CAPPluginCall) {
        // Implementation for native iOS if needed
        call.resolve()
    }
}
