import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'connect_flutter_method_channel.dart';

abstract class ConnectFlutterPlatform extends PlatformInterface {
  /// Constructs a ConnectFlutterPlatform.
  ConnectFlutterPlatform() : super(token: _token);

  static final Object _token = Object();

  static ConnectFlutterPlatform _instance = MethodChannelConnectFlutter();

  /// The default instance of [ConnectFlutterPlatform] to use.
  ///
  /// Defaults to [MethodChannelConnectFlutter].
  static ConnectFlutterPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [ConnectFlutterPlatform] when
  /// they register themselves.
  static set instance(ConnectFlutterPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<String?> getPlatformVersion() {
    throw UnimplementedError('platformVersion() has not been implemented.');
  }

  Future<Map?> invoke(String launchUrl, String redirectScheme) {
    throw UnimplementedError("invoke() has not been implemented.");
  }
}
