import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'dart:async';

import 'package:flutter/services.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_ui.dart';

// Replace the below with a URL that, when called with a GET request, will return a session launch URL as the only text content of the response.
// It will likely do so by using the Trinsic backend API SDK to create a session and return the launch URL.
const String backendCreateSessionEndpoint =
    'https://api.trinsic.id/api/mobiletest/create-session';

// Replace the below with the custom scheme that you've properly registered in your app's AndroidManifest.xml
const String callbackRedirectUrlScheme =
    "trinsic-flutter-ui-example-redirect-scheme";

//----------- No need to modify anything below here -----------
void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _stateText = 'Welcome!';

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  void setStateText(String text) {
    setState(() {
      _stateText = text;
    });
  }

  Future<void> initPlatformState() async {
    String platformVersion;
    try {
      platformVersion = await TrinsicFlutter.getPlatformVersion() ??
          'Unknown platform version';
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }
    if (!mounted) return;

    setStateText("Running on: $platformVersion");
  }

  Future<String> getLaunchUrl() async {
    setStateText("Getting launch URL...");
    return await http.read(Uri.parse(backendCreateSessionEndpoint));
  }

  Future<void> launchSession() async {
    var launchUrl = await getLaunchUrl();

    setStateText("Launching...");
    Map? result;
    try {
      result =
          await TrinsicFlutter.launchSession(launchUrl, callbackRedirectUrlScheme);
    } on PlatformException catch (e) {
      debugPrint("Error: $e");
      setStateText("Failed to launch");
      result = null;
      return;
    }

    if (result == null) {
      setStateText("Result null");
      return;
    }

    if (result.containsKey("resultsAccessKey") &&
        result["resultsAccessKey"] != null &&
        result["resultsAccessKey"]!.toString().isNotEmpty) {
      setStateText("Got ResultAccessKey: ${result["resultsAccessKey"]}");
      return;
    }

    if (result.containsKey("canceled") && result["canceled"] == true) {
      setStateText("User canceled");
      return;
    }

    if (result.containsKey("success") && result["success"] == false) {
      setStateText("Session failed");
      return;
    }

    setStateText("Unknown result");
    return;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Trinsic Flutter UI Sample'),
        ),
        floatingActionButton: FloatingActionButton(
            onPressed: launchSession,
            tooltip: 'Launch Session',
            child: const Icon(Icons.add)),
        body: Center(
          child: Text(_stateText),
        ),
      ),
    );
  }
}
