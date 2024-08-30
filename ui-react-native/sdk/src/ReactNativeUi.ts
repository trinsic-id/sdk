import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { LaunchSessionResult } from '.';

export interface Spec extends TurboModule {
  launchSession(
    launchUrl: string,
    callbackUrl: string
  ): Promise<LaunchSessionResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeUi');
