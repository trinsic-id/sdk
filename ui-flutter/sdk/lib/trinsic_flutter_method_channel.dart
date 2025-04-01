import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'trinsic_flutter_platform_interface.dart';

/// An implementation of [TrinsicFlutterPlatform] that uses method channels.
class MethodChannelTrinsicFlutter extends TrinsicFlutterPlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('trinsic_flutter_ui');

  @override
  Future<String?> getPlatformVersion() async {
    final version =
        await methodChannel.invokeMethod<String>('getPlatformVersion');
    return version;
  }

  @override
  Future<Map?> launchSession(String launchUrl, String redirectUrlScheme) async {
    final version = await methodChannel.invokeMethod<Map>(
        'launchSession', {'launchUrl': launchUrl, 'redirectUrlScheme': redirectUrlScheme});
    return version;
  }
}
