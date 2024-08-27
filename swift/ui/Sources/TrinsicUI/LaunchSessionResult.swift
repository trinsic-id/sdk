import Foundation

@objc public class LaunchSessionResult : NSObject {
    public let sessionId: String?
    public let resultsAccessKey: String?
    public let success: Bool
    public let cancelled: Bool
    
    @objc init(success: Bool, cancelled: Bool, sessionId: String?, resultsAccessKey: String?) {
            self.success = success
            self.cancelled = cancelled
            self.sessionId = sessionId
            self.resultsAccessKey = resultsAccessKey
        }
}
