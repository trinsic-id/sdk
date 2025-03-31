import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { LaunchSessionResult } from '.';

export interface Spec extends TurboModule {
  launchSession(
    launchUrl: string,
    callbackUrlScheme: string
  ): Promise<LaunchSessionResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeUi');
