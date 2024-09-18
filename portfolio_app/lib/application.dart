import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:logger/logger.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/router.dart';
import 'package:portfolio_app/upgrader.dart';

import 'gen/fonts.gen.dart';

final darkThemeData = ThemeData(
  brightness: Brightness.dark,
  colorScheme: const ColorScheme.dark(
    surface: backgroundColor,
    primary: primaryColor,
    outline: primaryColor,
  ),
  fontFamily: FontFamily.calsans,
  appBarTheme: const AppBarTheme(
    titleTextStyle: TextStyle(
      color: primaryColor,
      fontFamily: FontFamily.calsans,
      fontSize: 20.0,
    ),
    centerTitle: true,
    color: backgroundColor,
    iconTheme: IconThemeData(color: primaryColor),
    actionsIconTheme: IconThemeData(color: primaryColor),
  ),
);

final themeData = darkThemeData.copyWith(
  textTheme: darkThemeData.textTheme.apply(
    bodyColor: primaryColor,
    displayColor: primaryColor,
  ),
);

class Application extends StatelessWidget {
  const Application({super.key, required this.goRouter});

  final GoRouter goRouter;

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: goRouter,
      themeMode: ThemeMode.dark,
      darkTheme: themeData,
      builder: EasyLoading.init(),
    );
  }
}

TransitionBuilder transitionBuilderChain(List<TransitionBuilder> builders) {
  return (context, child) {
    return builders.fold(child ?? Container(), (transitedChild, builder) {
      return builder(context, transitedChild);
    });
  };
}

Future<void> runUpgrader({
  String? initialLocation,
  GlobalKey? providerScopeKey,
  GlobalKey? applicationKey,
  Level logLevel = Level.debug,
  bool isReRun = false,
}) async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(UpgraderApp(initialLocation: initialLocation));
}

void runApplication({
  String? initialLocation,
  GlobalKey? providerScopeKey,
  GlobalKey? applicationKey,
}) {
  runApp(ProviderScope(
    key: providerScopeKey,
    child: Application(
      key: applicationKey,
      goRouter: buildRouter(
        initialLocation: initialLocation,
      ),
    ),
  ));
}
