
import 'connect_flutter_platform_interface.dart';

class ConnectFlutter {
  static Future<String?> getPlatformVersion() {
    return ConnectFlutterPlatform.instance.getPlatformVersion();
  }

  static Future<Map?> invoke(String launchUrl) {
    return ConnectFlutterPlatform.instance.invoke(launchUrl);
  }
}
