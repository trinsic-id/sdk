import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@trinsic/react-native-ui' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ReactNativeUiModule = isTurboModuleEnabled
  ? require('./ReactNativeUi').default
  : NativeModules.ReactNativeUi;

const ReactNativeUi = ReactNativeUiModule
  ? ReactNativeUiModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function launchSession(
  launchUrl: string,
  callbackUrlScheme: string
): Promise<LaunchSessionResult> {
  return ReactNativeUi.launchSession(launchUrl, callbackUrlScheme);
}

export interface LaunchSessionResult {
  sessionId: string | null;
  resultsAccessKey: string | null;
  success: boolean;
  canceled: boolean;
}
