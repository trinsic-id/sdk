import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface LaunchSessionResult {
  sessionId: string | null;
  resultsAccessKey: string | null;
  success: boolean;
  cancelled: boolean;
}

export interface Spec extends TurboModule {
  launchSession(
    launchUrl: string,
    callbackUrl: string
  ): Promise<LaunchSessionResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeUi');
