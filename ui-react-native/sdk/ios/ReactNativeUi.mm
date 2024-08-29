#import "ReactNativeUi.h"
#import <React/RCTBridge.h>
#import <TrinsicUI/TrinsicUI-Swift.h>

@implementation ReactNativeUi
RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(launchSession:(NSString*)launchURl
                  callbackUrl:(NSString*)callbackUrl
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    
    NSString *resultsAccessKey = @"someAccessKey"; // Replace with actual logic
    BOOL success = YES; // Replace with actual logic
    BOOL cancelled = NO; // Replace with actual logic
    
    TrinsicUI *trinsicUI = [TrinsicUI alloc];
    [trinsicUI launchSessionWithLaunchUrl:launchURl callbackURL:callbackUrl completionHandler:^(LaunchSessionResult * _Nullable result, NSError * _Nullable error) {
        if(error) {
            reject(@"launch_session_error", @"Failed to launch session", error);
            return;
        }
        // Assuming LaunchSessionResult has these properties (replace with actual logic)
        NSString *sessionId = result.sessionId ? result.sessionId : @"";
        NSString *resultsAccessKey = result.resultsAccessKey ? result.resultsAccessKey : @"";
        BOOL success = result.success;
        BOOL cancelled = result.cancelled;

        NSDictionary *resultDict = @{
            @"sessionId": sessionId,
            @"resultsAccessKey": resultsAccessKey,
            @"success": @(success),
            @"canceled": @(cancelled)
        };

        resolve(result);
    }
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::ReactNativeUiSpecJSI>(params);
}
#endif

@end
