import { NativeModules, Platform } from 'react-native';
import type { LaunchSessionResult } from './ReactNativeUi';

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
  callbackUrl: string
): Promise<LaunchSessionResult> {
  return ReactNativeUi.launchSession(launchUrl, callbackUrl);
}
