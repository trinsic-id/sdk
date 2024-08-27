import Foundation

@objc public class LaunchSessionResult : NSObject {
    let sessionId: String?
    let resultsAccessKey: String?
    let success: Bool
    let cancelled: Bool
    
    @objc init(success: Bool, cancelled: Bool, sessionId: String?, resultsAccessKey: String?) {
            self.success = success
            self.cancelled = cancelled
            self.sessionId = sessionId
            self.resultsAccessKey = resultsAccessKey
        }
}
