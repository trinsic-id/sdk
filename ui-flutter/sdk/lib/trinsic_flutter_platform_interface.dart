import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'trinsic_flutter_method_channel.dart';

abstract class TrinsicFlutterPlatform extends PlatformInterface {
  /// Constructs a TrinsicFlutterPlatform.
  TrinsicFlutterPlatform() : super(token: _token);

  static final Object _token = Object();

  static TrinsicFlutterPlatform _instance = MethodChannelTrinsicFlutter();

  /// The default instance of [TrinsicFlutterPlatform] to use.
  ///
  /// Defaults to [MethodChannelTrinsicFlutter].
  static TrinsicFlutterPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [TrinsicFlutterPlatform] when
  /// they register themselves.
  static set instance(TrinsicFlutterPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<String?> getPlatformVersion() {
    throw UnimplementedError('platformVersion() has not been implemented.');
  }

  Future<Map?> launchSession(String launchUrl, String redirectUrlScheme) {
    throw UnimplementedError("launchSession() has not been implemented.");
  }
}
