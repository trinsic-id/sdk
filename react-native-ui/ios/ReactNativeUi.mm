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
    
    TrinsicApi *trinsicApi = [[TrinsicApi alloc]init];
    
    NSDictionary *result = @{
        @"sessionId": [NSNull null],
        @"resultsAccessKey": [trinsicApi sayHello],
        @"success": @(success),
        @"cancelled": @(cancelled)
    };

    resolve(result);
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
