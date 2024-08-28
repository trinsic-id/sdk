import 'package:flutter_test/flutter_test.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_ui.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_platform_interface.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_method_channel.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockTrinsicFlutterPlatform
    with MockPlatformInterfaceMixin
    implements TrinsicFlutterPlatform {

  @override
  Future<String?> getPlatformVersion() => Future.value('42');

  @override
  Future<Map?> invoke(String launchUrl, String redirectScheme) {
    throw UnimplementedError("invoke() has not been implemented.");
  }
}

void main() {
  final TrinsicFlutterPlatform initialPlatform = TrinsicFlutterPlatform.instance;

  test('$MethodChannelTrinsicFlutter is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelTrinsicFlutter>());
  });

  test('getPlatformVersion', () async {
    MockTrinsicFlutterPlatform fakePlatform = MockTrinsicFlutterPlatform();
    TrinsicFlutterPlatform.instance = fakePlatform;

    expect(await TrinsicFlutter.getPlatformVersion(), '42');
  });
}
