import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:logger/logger.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/view/splash.dart';

import 'application.dart';

class UpgraderApp extends HookWidget {
  const UpgraderApp({
    super.key,
    this.initialLocation,
    this.logLevel = Level.debug,
  });

  final String? initialLocation;
  final Level logLevel;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'portfolio',
      themeMode: ThemeMode.dark,
      builder: transitionBuilderChain([
        EasyLoading.init(),
      ]),
      home: const Scaffold(
        backgroundColor: c000000,
        body: SplashView(
          child: Center(
            child: Text('good'),
          ),
        ),
      ),
    );
  }
}
