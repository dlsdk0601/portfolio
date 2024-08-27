import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter/services.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:path/path.dart' as path_lib;

extension CacheManagerEx on CacheManager {
  Future<File> getAssetFile(String assetName) async {
    final content = await rootBundle.load(assetName);
    final bytes = content.buffer.asUint8List();
    final hash = sha256.convert(bytes).toString();
    final key = '$assetName-$hash';
    final cacheInfo = await getFileFromCache(key);

    if (cacheInfo != null) {
      return cacheInfo.file;
    }

    final extension = path_lib.extension(assetName);

    return await putFile(
      assetName,
      bytes,
      key: key,
      fileExtension: extension.isNotEmpty ? extension : 'file',
    );
  }
}
