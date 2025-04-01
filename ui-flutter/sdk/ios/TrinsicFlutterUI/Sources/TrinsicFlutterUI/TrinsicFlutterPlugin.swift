import Flutter
import UIKit
import TrinsicUI

@available(iOS 13.0, macOS 14.4, *)
public class TrinsicFlutterPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "trinsic_flutter_ui", binaryMessenger: registrar.messenger())
    let instance = TrinsicFlutterPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

 public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "getPlatformVersion":
      result("iOS " + UIDevice.current.systemVersion)
    case "launchSession":
        handleLaunchSession(call, result: result)
    default:
      result(FlutterMethodNotImplemented)
    }
  }
  
  private func handleLaunchSession(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
      guard let args = call.arguments as? [String: Any],
          let redirectUrlScheme = args["redirectUrlScheme"] as? String,
          let launchUrlString = args["launchUrl"] as? String else {
        result(FlutterError(code: "BAD_ARGS", message: "Missing or invalid arguments", details: nil))
        return
      }
      let trinsicUI = TrinsicUI()
      
      Task {
          do {
              // Await the asynchronous launchSession function

              let sessionResult = try await trinsicUI.launchSession(launchUrl: launchUrlString, callbackUrlScheme: redirectUrlScheme)
              // You can use sessionResult if needed

                  let returnData: [String: Any?] = [
                    "resultsAccessKey": sessionResult.resultsAccessKey,
                    "sessionId": sessionResult.sessionId,
                    "success": sessionResult.success,
                    "canceled": sessionResult.canceled
                  ]

              // Return the data back to Flutter
              result(returnData)
          } catch {
              // Handle any errors that occur during launchSession
              result(FlutterError(code: "LAUNCH_ERROR", message: "Failed to launch session", details: error.localizedDescription))
          }
      }
  }
}
