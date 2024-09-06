import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class Config {
  Config._();

  late Uri apiServer = Uri.parse('http://localhost:5001/application');
  Level loggerLevel = kDebugMode ? Level.debug : Level.warning;
  String appName = 'portfolio';

  bool splashFadeIn = true;
}

final config = Config._();
