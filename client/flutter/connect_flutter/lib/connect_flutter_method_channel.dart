import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'connect_flutter_platform_interface.dart';

/// An implementation of [ConnectFlutterPlatform] that uses method channels.
class MethodChannelConnectFlutter extends ConnectFlutterPlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('connect_flutter');

  @override
  Future<String?> getPlatformVersion() async {
    final version = await methodChannel.invokeMethod<String>('getPlatformVersion');
    return version;
  }

  @override
  Future<Map?> invoke(String launchUrl) async {
    final version = await methodChannel.invokeMethod<Map>('invoke', {'launchUrl': launchUrl});
    return version;
  }
}
