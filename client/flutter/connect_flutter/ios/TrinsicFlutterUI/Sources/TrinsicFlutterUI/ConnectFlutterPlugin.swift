import Flutter
import UIKit
import TrinsicUI

public class TrinsicFlutterUIPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "connect_flutter", binaryMessenger: registrar.messenger())
    let instance = TrinsicFlutterUIPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "getPlatformVersion":
      result("iOS " + UIDevice.current.systemVersion)
    case "invoke":
        handleInvoke(call, result: result)
    default:
      result(FlutterMethodNotImplemented)
    }
  }

  private func handleInvoke(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
      // Safely access arguments
      guard let args = call.arguments as? [String: Any],
            let redirectScheme = args["redirectScheme"] as? String,
            let launchUrlString = args["launchUrl"] as? String else {
          result(FlutterError(code: "BAD_ARGS", message: "Missing or invalid arguments", details: nil))
          return
      }
      // Parse launchUrl into a URL object
      guard let launchUrl = URL(string: launchUrlString) else {
          result(FlutterError(code: "INVALID_URL", message: "Invalid launch URL", details: nil))
          return
      }
      
      // Parse launchUrl into a URLComponents object
      guard var urlComponents = URLComponents(string: launchUrlString) else {
          result(FlutterError(code: "INVALID_URL", message: "Invalid launch URL", details: nil))
          return
      }
      
      var queryItems = urlComponents.queryItems ?? []
      
      guard let sessionId = queryItems.first(where: { $0.name == "sessionId" })?.value,
            !sessionId.isEmpty else {
          result(FlutterError(code: "MISSING_SESSION_ID", message: "sessionId query parameter is missing or empty", details: nil))
          return
      }
      
      // Check if launchMode exists, if not, add it
      if queryItems.first(where: { $0.name == "launchMode" }) == nil {
          queryItems.append(URLQueryItem(name: "launchMode", value: "mobile"))
      }

      // Check if redirectUrl exists, if not, add it based on the redirectScheme parameter
      if queryItems.first(where: { $0.name == "redirectUrl" }) == nil {
          let redirectUrlString = "\(redirectScheme)://callback"
          queryItems.append(URLQueryItem(name: "redirectUrl", value: redirectUrlString))
      }

      // Update the URL components with the new query items
      urlComponents.queryItems = queryItems

      // Reconstruct the updated URL
      guard let updatedUrl = urlComponents.url else {
          result(FlutterError(code: "INVALID_UPDATED_URL", message: "Failed to construct the updated URL", details: nil))
          return
      }
      
      let returnData: [String: Any] = [
        "resultsAccessKey": updatedUrl.absoluteString
      ]
      
      result(returnData)
      
  }
}
