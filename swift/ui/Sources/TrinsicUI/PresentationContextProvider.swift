import Foundation
import AuthenticationServices
#if canImport(UIKit)
import UIKit
#endif
#if canImport(AppKit)
import AppKit
#endif

import Foundation

@available(iOS 13.0, macOS 14.4, *)
@objc public class TrinsicPresentationContextProvider : NSObject, ASWebAuthenticationPresentationContextProviding {
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
            self.presentationAnchor = NSApplication.shared.windows.first!
            self.semaphore.signal()
        }
    }
#endif
    
    public func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        semaphore.wait()
        return self.presentationAnchor!;
    }
}
