import 'dart:developer';

import 'package:flutter/material.dart';
import 'dart:async';

import 'package:flutter/services.dart';
import 'package:connect_flutter/connect_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String _platformVersion = 'Unknown';

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    String platformVersion;
    // Platform messages may fail, so we use a try/catch PlatformException.
    // We also handle the message potentially returning null.
    try {
      platformVersion = await ConnectFlutter.getPlatformVersion() ??
          'Unknown platform version';
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }

    // If the widget was removed from the tree while the asynchronous platform
    // message was in flight, we want to discard the reply rather than calling
    // setState to update our non-existent appearance.
    if (!mounted) return;

    setState(() {
      _platformVersion = platformVersion;
    });
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
                child: Text('Running on: $_platformVersion\n'),
                onPressed: () async {
                  setState(() {
                    _platformVersion = "1";
                  });
                  Map? result;
                  try {
                    result = await ConnectFlutter.invoke(
                            "https://josh.trinsic-local.com/api/mobiletest?sessionId=2b128be2-7673-4cc7-bd15-1a99c9a3953e",
                        "blap");
                  } on PlatformException {
                    setState(() {
                      _platformVersion = "exception";
                    });
                    result = null;
                    return;
                  }

                  log("Result: $result");

                  if(result == null) {
                    setState(() {
                      _platformVersion = "result null";
                    });
                    return;
                  }

                  if(result.containsKey("resultsAccessKey") && result["resultsAccessKey"] != null && result["resultsAccessKey"]!.toString().isNotEmpty) {
                    setState(() {
                      _platformVersion = "RAK: ${result!["resultsAccessKey"]}";
                    });
                    return;
                  }

                  if(result.containsKey("canceled") && result["canceled"] == true) {
                    setState(() {
                      _platformVersion = "canceled";
                    });
                    return;
                  }

                  if(result.containsKey("success") && result["success"] == false) {
                    setState(() {
                      _platformVersion = "failed";
                    });
                    return;
                  }

                  setState(() {
                    _platformVersion = "unknown!!";
                  });
                  return;
                })),
      ),
    );
  }
}
