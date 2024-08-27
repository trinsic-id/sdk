import Foundation

@objc public class LaunchSessionResult : NSObject {
    public let sessionId: String?
    public let resultsAccessKey: String?
    public let success: Bool
    public let canceled: Bool
    
    @objc init(success: Bool, canceled: Bool, sessionId: String?, resultsAccessKey: String?) {
            self.success = success
            self.canceled = canceled
            self.sessionId = sessionId
            self.resultsAccessKey = resultsAccessKey
        }
}
