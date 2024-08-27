import Foundation
import AuthenticationServices
//UIKit is only available on iOS
#if canImport(UIKit)
import UIKit
#endif
#if canImport(AppKit)
import AppKit
#endif
#if canImport(RTCBridge)
import RTCBridge
#endif


@objc enum TrinsicErrorCode: Int {
    case unknownError = 0
    case userCancelled = 1
    case couldNotAcquireRootViewController = 2
    case unsupportedIosVersion = 3
    case noRegisteredApplicationForLaunchUrl = 4
    case unparsableLaunchUrl = 5
    case missingSessionId = 6
    case noSupportForiOSBelow12 = 7;
    case emptyLaunchUrl = 8;
    case emptyRedirectUrl = 9
    case cannotReconstructLaunchUrl = 10
    case unparsableCallbackUrl = 11
}

@objc class TrinsicError: NSObject {
    @objc static func error(with code: TrinsicErrorCode, message: String? = nil) -> NSError {
        let domain = "id.trinsic.TrinsicError"
        let userInfo = [NSLocalizedDescriptionKey: message]
        return NSError(domain: domain, code: code.rawValue, userInfo: userInfo)
    }
}

@available(iOS 13.0, macOS 14.4, *)
private class ASWebAuthenticationPresentationContextProvider : NSObject, ASWebAuthenticationPresentationContextProviding {
    private weak var presentationAnchor: ASPresentationAnchor?
    private let semaphore = DispatchSemaphore(value: 0)
    
#if canImport(UIKit)
    public init(window: UIWindow? = nil) {
        super.init()
        DispatchQueue.main.async {
            self.presentationAnchor = ASWebAuthenticationPresentationContextProvider.getPresentationAnchor(window: window)
            self.semaphore.signal()
        }
    }
    public static func getPresentationAnchor(window: UIWindow? = nil) -> ASPresentationAnchor {
        //If an explicit option is provided, use those.
        if let window = window {
            return window
        }
        #if os(iOS)
        if #available(iOS 13.0, *) {
            //Iterate through scenes, on some iOS versions there are multiple windows
            let scenes = UIApplication.shared.connectedScenes
            
            for scene in scenes {
                if let windowScene = scene as? UIWindowScene {
                    for window in windowScene.windows where window.isKeyWindow {
                        return window
                    }
                }
            }
        }
        return UIWindow()
        
        #elseif os(macOS)
        return NSApplication.shared.windows.first
        #endif
    }
#endif
#if canImport(AppKit)
    public override init() {
        super.init()
        DispatchQueue.main.async {
            self.presentationAnchor = ASWebAuthenticationPresentationContextProvider.getPresentationAnchor()
            self.semaphore.signal()
        }
    }
    public static func getPresentationAnchor() -> ASPresentationAnchor {
        return NSApplication.shared.windows.first!
    }
#endif
    
    public func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        semaphore.wait()
        return self.presentationAnchor!;
    }
    
    
    
    
}

@available(iOS 13.0, macOS 14.4, *)
@objc public class TrinsicUI : NSObject {
    private var presentationContextProvider: ASWebAuthenticationPresentationContextProvider
    #if canImport(UIKit)
    public init(window: UIWindow? = nil){
        self.presentationContextProvider = ASWebAuthenticationPresentationContextProvider(window: window)
        super.init()
    }
    #else
    public override init() {
        self.presentationContextProvider = ASWebAuthenticationPresentationContextProvider()
        super.init()
    }
    #endif
    
    @objc public func launchSession(launchUrl: String, callbackURL: String) async throws -> URL {
        return try await withCheckedThrowingContinuation( { continuation in
            Task {
                var completionHandler: ((URL?, Error?) -> Void)?
                do {
                    let (formattedLaunchUrl, callbackURLScheme, callbackURLHost, callbackURLPath) = try self.validateAndFormatLaunchUrl(launchUrl: launchUrl, callbackURL: callbackURL)
                    var sessionToKeepAlive: Any? // if we do not keep the session alive, it will get closed immediately while showing the dialog
                    completionHandler = { (url: URL?, err: Error?) in
                        completionHandler = nil
                        
                        if (sessionToKeepAlive != nil) {
                            (sessionToKeepAlive as! ASWebAuthenticationSession).cancel()
                            sessionToKeepAlive = nil
                        }
                        
                        if let err = err {
                            if case ASWebAuthenticationSessionError.canceledLogin = err {
                                continuation.resume(throwing: TrinsicError.error(with: .userCancelled))
                                return;
                            }
                            continuation.resume(throwing:  TrinsicError.error(with: .unknownError, message: err.localizedDescription))
                            return
                        }
                        guard let url = url else {
                            continuation.resume(throwing: TrinsicError.error(with: .unknownError))
                            return
                        }
                        
                        continuation.resume(returning: url)
                    }
                    
                    if #available(iOS 12, *) {
                        var _session: ASWebAuthenticationSession? = nil
                        if #available(iOS 17.4, *) {
                            if (callbackURLScheme == "https") {
                                guard let callbackURLHostChecked = callbackURLHost, !callbackURLHostChecked.isEmpty else {
                                    throw TrinsicError.error(with: .unparsableLaunchUrl)
                                }
                                guard let callbackURLPathChecked = callbackURLPath, !callbackURLPathChecked.isEmpty else {
                                    throw TrinsicError.error(with: .unparsableLaunchUrl)
                                }
                                
                                _session = ASWebAuthenticationSession(url: formattedLaunchUrl, callback: ASWebAuthenticationSession.Callback.https(host: callbackURLHostChecked, path: callbackURLPathChecked), completionHandler: completionHandler!)
                            } else {
                                _session = ASWebAuthenticationSession(url: formattedLaunchUrl, callback: ASWebAuthenticationSession.Callback.customScheme(callbackURLScheme), completionHandler: completionHandler!)
                            }
                        } else {
                            _session = ASWebAuthenticationSession(url: formattedLaunchUrl, callbackURLScheme: formattedLaunchUrl.scheme, completionHandler: completionHandler!)
                        }
                        let session = _session!
#if canImport(UIKit)
                        if #available(iOS 13, *) {
                            do {
                                session.presentationContextProvider = self.presentationContextProvider;
                                //TODO
                                //                if let preferEphemeral = options["preferEphemeral"] as? Bool {
                                //                    session.prefersEphemeralWebBrowserSession = preferEphemeral
                                //                }
                            }
                            catch {
                                throw TrinsicError.error(with: .couldNotAcquireRootViewController, message: error.localizedDescription)
                            }
                            
                        }
#else
                        let contextProvider = WebAuthenticationPresentationContextProvider()
                        session.presentationContextProvider = contextProvider
#endif
                        
                        //https://api.trinsic-development.com/api/session/launch?clientToken=2vBC1M9F7MT54vBgKUam4rTKMFLsuEaRoqpB9peg5xUnT1c5Ed68Jz9fAdnc1Yas31iU9YQaKdxkiGoHe7hXRmEjStkmuTNBUCMgeDdKFaiwwGK7S7XL38yjgAAoZ93bGjU286hCsWh6ozyft6Jmz289BTwxbM2JXqTnYnJ7CjmgQadgTwowpkeWHPjWgibgVKpbGujLHKLG8qs3eidbMzygbffXjoNNh1os4xYMwMF7PCQVyisZujfBXDdDfQwD4X9bwtrGfJBwWzRUhNxJffHkvq6bX2u5FY2sGWWBhiJQWzbeczN&sessionId=fe3173f0-5d80-4748-8dbc-98417d0cf03c&launchMode=mobile&redirectUrl=trinsic-ui-macos://custom-callback
                        
                        session.start()
                        sessionToKeepAlive = session
                    } else {
                        throw TrinsicError.error(with: .noSupportForiOSBelow12)
                    }
                }
                catch {
                    continuation.resume(throwing: error)
                }
            }
        })
    }
    
    private func validateAndFormatLaunchUrl(launchUrl: String, callbackURL: String) throws -> (formattedLaunchUrl: URL, callbackURLScheme: String, callbackURLHost: String?, callbackURLPath: String?) {
        guard !launchUrl.isEmpty else {
            throw TrinsicError.error(with: .emptyLaunchUrl)
        }
        guard !callbackURL.isEmpty else {
            throw TrinsicError.error(with: .emptyRedirectUrl)
        }
        
        //UIKit is only available on iOS
        #if canImport(UIKit)
        guard UIApplication.shared.canOpenURL(URL(string: callbackURL)!) else {
            throw TrinsicError.error(with: .noRegisteredApplicationForLaunchUrl)
        }
        #endif
        // Parse launchUrl into a URL object
        guard let launchUrlParsed = URL(string: launchUrl) else {
            throw TrinsicError.error(with: .unparsableLaunchUrl)
        }
          
        // Parse launchUrl into a URLComponents object
        guard var urlComponents = URLComponents(string: launchUrl) else {
            throw TrinsicError.error(with: .unparsableLaunchUrl)
        }
          
        var queryItems = urlComponents.queryItems ?? []

        guard let sessionId = queryItems.first(where: { $0.name == "sessionId" })?.value,
            !sessionId.isEmpty else {
            throw TrinsicError.error(with: .missingSessionId)
        }

        // Launchmode affects some validation checks on our backend to ensure a session for a platform has all the required parameters
        if queryItems.first(where: { $0.name == "launchMode" }) == nil {
          queryItems.append(URLQueryItem(name: "launchMode", value: "mobile"))
        }
        
        // Check if redirectUrl exists, if not, add it based on the redirectScheme parameter
        if queryItems.first(where: { $0.name == "redirectUrl" }) == nil {
          queryItems.append(URLQueryItem(name: "redirectUrl", value: callbackURL))
        }

        // Update the URL components with the new query items
        urlComponents.queryItems = queryItems

        // Reconstruct the updated URL which includes the launch mode and redirect url.
        guard let updatedUrl = urlComponents.url else {
            throw TrinsicError.error(with: .cannotReconstructLaunchUrl)
        }
        
        
        guard let callbackURLParsed = URL(string: callbackURL) else {
            throw TrinsicError.error(with: .unparsableCallbackUrl)
        }
        
        guard let callbackScheme = callbackURLParsed.scheme else {
            throw TrinsicError.error(with: .cannotReconstructLaunchUrl)
        }
        guard let callbackHost = callbackURLParsed.host else {
            throw TrinsicError.error(with: .cannotReconstructLaunchUrl)
        }
        var callbackPath = ""
        if #available(iOS 16.0, *) {
            callbackPath = callbackURLParsed.path(percentEncoded: true)
        } else {
            callbackPath = callbackURLParsed.path
        }
        
        return (formattedLaunchUrl: updatedUrl, callbackURLScheme: callbackScheme, callbackURLPath: callbackPath, callbackURLHost: callbackHost)
    }
    
    @objc public func sayHello() -> String {
        return "Hello from MyFramework!";
    }
}
#if canImport(AppKit)
@available(macOS 14.4, *)
class WebAuthenticationPresentationContextProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        
        // Return the window in which the authentication session should be presented
        return NSApplication.shared.windows.first!
        
    
    }
}
#endif
