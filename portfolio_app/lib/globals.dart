import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:logger/logger.dart';
import 'package:portfolio_app/api/api.gen.dart';
import 'package:portfolio_app/config.dart';
import 'package:uuid/data.dart';
import 'package:uuid/rng.dart';
import 'package:uuid/uuid.dart';

// 초기 실행 설정이 반영된 후 처리 되도록
// ignore: unnecessary_late
late final logger = Logger();

// ignore: unnecessary_late
late final api = Api(config.apiServer);

final cacheManager = DefaultCacheManager();

final _uuid = Uuid(goptions: GlobalOptions(CryptoRNG()));

String uuid4() {
  return _uuid.v4();
}
