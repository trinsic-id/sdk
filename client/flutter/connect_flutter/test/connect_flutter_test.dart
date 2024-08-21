import 'package:flutter_test/flutter_test.dart';
import 'package:connect_flutter/connect_flutter.dart';
import 'package:connect_flutter/connect_flutter_platform_interface.dart';
import 'package:connect_flutter/connect_flutter_method_channel.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockConnectFlutterPlatform
    with MockPlatformInterfaceMixin
    implements ConnectFlutterPlatform {

  @override
  Future<String?> getPlatformVersion() => Future.value('42');
}

void main() {
  final ConnectFlutterPlatform initialPlatform = ConnectFlutterPlatform.instance;

  test('$MethodChannelConnectFlutter is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelConnectFlutter>());
  });

  test('getPlatformVersion', () async {
    ConnectFlutter connectFlutterPlugin = ConnectFlutter();
    MockConnectFlutterPlatform fakePlatform = MockConnectFlutterPlatform();
    ConnectFlutterPlatform.instance = fakePlatform;

    expect(await connectFlutterPlugin.getPlatformVersion(), '42');
  });
}
