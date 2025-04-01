import 'trinsic_flutter_platform_interface.dart';

class TrinsicFlutter {
  static Future<String?> getPlatformVersion() {
    return TrinsicFlutterPlatform.instance.getPlatformVersion();
  }

  static Future<Map?> launchSession(String launchUrl, String redirectUrlScheme) {
    return TrinsicFlutterPlatform.instance
        .launchSession(launchUrl, redirectUrlScheme);
  }
}
