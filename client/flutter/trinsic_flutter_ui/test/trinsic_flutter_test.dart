import 'package:flutter_test/flutter_test.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_platform_interface.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_method_channel.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockTrinsicFlutterPlatform
    with MockPlatformInterfaceMixin
    implements TrinsicFlutterPlatform {

  @override
  Future<String?> getPlatformVersion() => Future.value('42');
}

void main() {
  final TrinsicFlutterPlatform initialPlatform = TrinsicFlutterPlatform.instance;

  test('$MethodChannelTrinsicFlutter is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelTrinsicFlutter>());
  });

  test('getPlatformVersion', () async {
    TrinsicFlutter trinsicFlutterPlugin = TrinsicFlutter();
    MockTrinsicFlutterPlatform fakePlatform = MockTrinsicFlutterPlatform();
    TrinsicFlutterPlatform.instance = fakePlatform;

    expect(await trinsicFlutterPlugin.getPlatformVersion(), '42');
  });
}
