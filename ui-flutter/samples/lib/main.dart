import 'dart:developer';

import 'package:flutter/material.dart';
import 'dart:async';

import 'package:flutter/services.dart';
import 'package:trinsic_flutter_ui/trinsic_flutter_ui.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _buttonText = 'Unknown';

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  void setButtonText(String text) {
    setState(() {
      _buttonText = text;
    });
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    String platformVersion;
    // Platform messages may fail, so we use a try/catch PlatformException.
    // We also handle the message potentially returning null.
    try {
      platformVersion = await TrinsicFlutter.getPlatformVersion() ??
          'Unknown platform version';
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    setButtonText("Running on: $platformVersion");
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Plugin example app'),
        ),
        body: Center(
            child: ElevatedButton(
                child: Text(_buttonText),
                onPressed: () async {
                  setButtonText("Invoking...");
                  Map? result;
                  try {
                    result = await TrinsicFlutter.invoke(
                            "https://josh.trinsic-local.com/api/mobiletest?sessionId=2b128be2-7673-4cc7-bd15-1a99c9a3953e",
                        "trinsic-ui-example-redirect-scheme");
                  } on PlatformException {
                    setButtonText("Failed to invoke");
                    result = null;
                    return;
                  }

                  log("Result: $result");

                  if(result == null) {
                    setButtonText("Result null");
                    return;
                  }

                  if(result.containsKey("resultsAccessKey") && result["resultsAccessKey"] != null && result["resultsAccessKey"]!.toString().isNotEmpty) {
                    setButtonText("Got ResultAccessKey: ${result!["resultsAccessKey"]}");
                    return;
                  }

                  if(result.containsKey("canceled") && result["canceled"] == true) {
                    setButtonText("User canceled");
                    return;
                  }

                  if(result.containsKey("success") && result["success"] == false) {
                    setButtonText("Session failed");
                    return;
                  }

                  setButtonText("Unknown result");
                  return;
                })),
      ),
    );
  }
}
