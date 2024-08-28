
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNReactNativeUiSpec.h"
@interface ReactNativeUi : NSObject <ReactNativeUiSpec>
#else
#import <React/RCTBridgeModule.h>
@interface ReactNativeUi : NSObject <RCTBridgeModule>
#endif

@end
