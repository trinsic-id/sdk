import 'trinsic_flutter_platform_interface.dart';

class TrinsicFlutter {
  static Future<String?> getPlatformVersion() {
    return TrinsicFlutterPlatform.instance.getPlatformVersion();
  }

  static Future<Map?> invokeBREAK(String launchUrl, String redirectUrl) {
    return TrinsicFlutterPlatform.instance.invoke(launchUrl, redirectUrl);
  }
}
