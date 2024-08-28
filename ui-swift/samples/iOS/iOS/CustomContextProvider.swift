import Foundation
import AuthenticationServices
import UIKit

class CustomContextProvider : NSObject, ASWebAuthenticationPresentationContextProviding {
    public func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        if let windowScene = UIApplication.shared.connectedScenes
                    .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
                   let window = windowScene.windows.first {
                    return window
                }
                // Fallback if no active scene is found
                return UIWindow()
    }
}
