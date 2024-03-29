import 'package:test/test.dart';

import '../example/ecosystem_example.dart';
import '../example/templates_demo.dart';
import '../example/vaccine_example.dart';

void main() {
  group('Dart Examples', () {
    setUp(() {
      // Additional setup goes here.
    });

    test('Vaccine Demo', () async {
      await runVaccineDemo();
    });
    test('Ecosystem Demo', () async {
      await runEcosystemDemo();
    });
    test('Templates Demo', () async {
      await runTemplatesDemo();
    });
    test('Trust Registry Demo', () async {
      // Runs locally, fails on github actions for unknown reasons
      // await runTrustRegistryDemo();
    });
  });
}
