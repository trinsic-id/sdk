import Foundation

@objc public enum TrinsicErrorCode: Int {
    case unknownError = 0
    case unparsableResultUrl = 1
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
    case unsupportedHttpsLinking = 12
}



@objc public class TrinsicError: NSObject {
    @objc public static func error(with code: TrinsicErrorCode, message: String? = nil) -> NSError {
        let domain = "id.trinsic.TrinsicError"
        let errorDescription = "\(String(describing: code)): \(message ?? "")"
        let userInfo = [NSLocalizedDescriptionKey: errorDescription]
        return NSError(domain: domain, code: code.rawValue, userInfo: userInfo)
    }
}
