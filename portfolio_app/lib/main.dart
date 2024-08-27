import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:logging/logging.dart' as logging;

import 'application.dart';
import 'ex/logging.dart';

Future<void> main() async {
  await runMain();
}

Future<void> runMain({
  String? initialLocation,
  Level logLevel = Level.warning,
  GlobalKey? providerScopeKey,
  GlobalKey? applicationKey,
}) async {
  Logger.level = logLevel;
  logging.Logger.root.level = _logLevelFromLevel(logLevel);
  logging.Logger.root.onRecord.listen(printLogRecord);

  runApplication(
    initialLocation: initialLocation,
    providerScopeKey: providerScopeKey,
    applicationKey: applicationKey,
  );
}

logging.Level _logLevelFromLevel(Level level) {
  return switch (level) {
    Level.all => logging.Level.ALL,
    Level.verbose || Level.trace => logging.Level.FINE,
    Level.debug => logging.Level.CONFIG,
    Level.info => logging.Level.INFO,
    Level.warning => logging.Level.WARNING,
    Level.error => logging.Level.SEVERE,
    Level.wtf || Level.fatal => logging.Level.SHOUT,
    Level.nothing || Level.off => logging.Level.OFF,
  };
}
