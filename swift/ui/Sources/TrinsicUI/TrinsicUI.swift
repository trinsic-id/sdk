import Foundation
import AuthenticationServices

@objc enum TrinsicError: Int, Error {
    case unknownError = 0
    case userCancelled = 1
    case invalidLaunchURL = 2
    case couldNotAcquireRootViewController = 3
    case unsupportedIosVersion = 4
    case emptyString = 5
}

@objc public class TrinsicUI : NSObject {
    
    var completionHandler: ((URL?, Error?) throws -> Void)?
    
    @objc public func launchSession(launchUrl: String, redirectUrl: String) {
        let formattedLaunchUrl = validateAndFormatLaunchUrl(launchUrl: launchUrl, redirectUrl: redirectUrl)
        var sessionToKeepAlive: Any? // if we do not keep the session alive, it will get closed immediately while showing the dialog
        completionHandler = { (url: URL?, err: Error?) in
            self.completionHandler = nil

            if (sessionToKeepAlive != nil) {
                if #available(iOS 12, *) {
                    (sessionToKeepAlive as! ASWebAuthenticationSession).cancel()
                } else if #available(iOS 11, *) {
                    (sessionToKeepAlive as! SFAuthenticationSession).cancel()
                }
                sessionToKeepAlive = nil
            }

            if let err = err {
                if #available(iOS 12, *) {
                    if case ASWebAuthenticationSessionError.canceledLogin = err {
                        throw TrinsicFlowError.userCancelled;
                    }
                }

                if #available(iOS 11, *) {
                    if case SFAuthenticationError.canceledLogin = err {
                        throw TrinsicFlowError.userCancelled;
                    }
                }
                throw TrinsicError.unknownError(err.localizedDescription)
            }
        }
        
        if #available(iOS 12, *) {
            var _session: ASWebAuthenticationSession? = nil
            if #available(iOS 17.4, *) {
                if (callbackURLScheme == "https") {
                    //TODO
//                    guard let host = options["httpsHost"] as? String else {
//                        throw TrinsicError.invalidLaunchURL(<#T##String#>)
//                        result(FlutterError.invalidHttpsHostError)
//                        return
//                    }
//
//                    guard let path = options["httpsPath"] as? String else {
//                        result(FlutterError.invalidHttpsPathError)
//                        return
//                    }

                    _session = ASWebAuthenticationSession(url: formattedLaunchUrl.formattedLaunchUrl, callback: ASWebAuthenticationSession.Callback.https(host: host, path: path), completionHandler: completionHandler!)
                } else {
                    _session = ASWebAuthenticationSession(url: formattedLaunchUrl.formattedLaunchUrl, callback: ASWebAuthenticationSession.Callback.customScheme(formattedLaunchUrl.scheme), completionHandler: completionHandler!)
                }
            } else {
                _session = ASWebAuthenticationSession(url: url, callbackURLScheme: formattedLaunchUrl.scheme, completionHandler: completionHandler!)
            }
            let session = _session!

            if #available(iOS 13, *) {
                var rootViewController: UIViewController? = nil

                // FlutterViewController
                if (rootViewController == nil) {
                    rootViewController = UIApplication.shared.delegate?.window??.rootViewController as? FlutterViewController
                }

                // UIViewController
                if (rootViewController == nil) {
                    rootViewController = UIApplication.shared.keyWindow?.rootViewController
                }

                // ACQUIRE_ROOT_VIEW_CONTROLLER_FAILED
                if (rootViewController == nil) {
                    result(FlutterError.acquireRootViewControllerFailed)
                    return
                }

                while let presentedViewController = rootViewController!.presentedViewController {
                    rootViewController = presentedViewController
                }
                if let nav = rootViewController as? UINavigationController {
                    rootViewController = nav.visibleViewController ?? rootViewController
                }

                guard let contextProvider = rootViewController as? ASWebAuthenticationPresentationContextProviding else {
                    throw TrinsicError.couldNotAcquireRootViewController;
                    return
                }
                session.presentationContextProvider = contextProvider
                //TODO
//                if let preferEphemeral = options["preferEphemeral"] as? Bool {
//                    session.prefersEphemeralWebBrowserSession = preferEphemeral
//                }
            }

            session.start()
            sessionToKeepAlive = session
        } else if #available(iOS 11, *) {
            let session = SFAuthenticationSession(url: url, callbackURLScheme: callbackURLScheme, completionHandler: completionHandler!)
            session.start()
            sessionToKeepAlive = session
        } else {
            throw TrinsicError.unsupportedIosVersion("This plugin does currently not support iOS lower than iOS 11")
        }
    }
    
    private func validateAndFormatLaunchUrl(launchUrl: String, redirectUrl: String) -> (formattedLaunchUrl: String, scheme: String) {
        guard !launchUrl.isEmpty else {
            throw TrinsicError.emptyString
        }
        guard !redirectrl.isEmpty else {
            throw TrinsicError.emptyString
        }
        guard UIApplication.shared.canOpenURL(redirectUrl)  else {
            throw TrinsicError.invalidLaunchURL("There is no registered application on this device that can launch the provided url \(launchUrl)")
        }
        // Parse launchUrl into a URL object
        guard let launchUrlParsed = URL(string: launchUrl) else {
            throw TrinsicError.invalidLaunchURL("Can't parse the provided url \(launchUrl)")
        }
          
        // Parse launchUrl into a URLComponents object
        guard var urlComponents = URLComponents(string: launchUrl) else {
            throw TrinsicError.invalidLaunchURL("Cannot parse \(launchUrl) into URLComponents")
        }
          
        var queryItems = urlComponents.queryItems ?? []

        guard let sessionId = queryItems.first(where: { $0.name == "sessionId" })?.value,
            !sessionId.isEmpty else {
            throw TrinsicError.invalidLaunchURL("Missing session id in the launch url, did you use the Trinsic API to generate a launch url?")
          return
        }

        // Launchmode affects some validation checks on our backend to ensure a session for a platform has all the required parameters
        if queryItems.first(where: { $0.name == "launchMode" }) == nil {
          queryItems.append(URLQueryItem(name: "launchMode", value: "mobile"))
        }
        
        // Check if redirectUrl exists, if not, add it based on the redirectScheme parameter
        if queryItems.first(where: { $0.name == "redirectUrl" }) == nil {
          queryItems.append(URLQueryItem(name: "redirectUrl", value: redirectUrl))
        }

        // Update the URL components with the new query items
        urlComponents.queryItems = queryItems

        // Reconstruct the updated URL which includes the launch mode and redirect url.
        guard let updatedUrl = urlComponents.url else {
            throw TrinsicError.invalidLaunchURL("Cannot parse the updated launch url")
        }
        
        return (formattedLaunchUrl: updatedUrl, scheme: urlComponents.scheme)
    }
    
    @objc public func sayHello() -> String {
        return "Hello from MyFramework!";
    }
}
