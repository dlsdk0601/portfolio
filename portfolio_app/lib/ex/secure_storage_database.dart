import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:logging/logging.dart';

import 'string.dart';

final _logger = Logger('secure_storage_database');

abstract class SecureStorageDatabase {
  SecureStorageDatabase({required this.fieldPrefix});

  final String fieldPrefix;

  final _secureStorage = const FlutterSecureStorage(
      aOptions:
          AndroidOptions(encryptedSharedPreferences: true, resetOnError: true));

  @protected
  FieldList<T> fieldList<T>(
    String fieldName,
    T Function(dynamic json) decoder,
    dynamic Function(T value) encoder,
  ) =>
      FieldList<T>(fieldName, this, decoder, encoder);

  @protected
  FieldList<T> fieldObjectList<T>(
    String fieldName,
    T Function(Map<String, dynamic> json) decoder,
    Map<String, dynamic> Function(T value) encoder,
  ) =>
      FieldList<T>(
        fieldName,
        this,
        (dynamic json) {
          return switch (json) {
            Map() => decoder(json as Map<String, dynamic>),
            _ => throw _NotMapJsonException(json),
          };
        },
        encoder,
      );
}

class FieldList<T> {
  FieldList(this._fieldName, this._db, this._decoder, this._encoder);

  final String _fieldName;
  final SecureStorageDatabase _db;
  final T Function(dynamic json) _decoder;
  final dynamic Function(T value) _encoder;

  String get _key => '${_db.fieldPrefix}-$_fieldName';

  Future<List<T>> get() async {
    final value = await _db._secureStorage.read(key: _key);
    if (value == null) {
      return [];
    }

    final dynamic json;
    try {
      json = await compute(
        jsonDecode,
        value,
        debugLabel: 'secure_storage_database-fieldList-jsonDecode-$_key}',
      );
    } on FormatException catch (e) {
      _logger.warning(
        'jsonDecode failed'.data({'json': value, 'key': _key}),
        e,
      );
      return [];
    }

    return switch (json) {
      List() => () {
          final items = <T>[];
          for (final item in json) {
            final T decoded;
            try {
              decoded = _decoder(item);
            } on _NotMapJsonException catch (e) {
              _logger.warning(
                'expected a map, but get a non-map json'.data({
                  'json': e.json,
                  'key': _key,
                }),
              );
              continue;
            } catch (e, stackTrace) {
              _logger.warning(
                'decoder failed'.data({'json': item, 'key': _key}),
                e,
                stackTrace,
              );
              continue;
            }
            items.add(decoded);
          }

          return items;
        }(),
      _ => () {
          _logger.warning('json is not a list'.data({
            'json': json,
            'key': _key,
          }));
          return <T>[];
        }(),
    };
  }

  Future<void> set(List<T> list) async {
    final encoded = list.map(_encoder).toList();
    final json = await compute(
      jsonEncode,
      encoded,
      debugLabel: 'secure_storage_database-fieldList-jsonEncode-$_key',
    );

    await _db._secureStorage.write(key: _key, value: json);
    return;
  }
}

class _NotMapJsonException implements Exception {
  _NotMapJsonException(this.json);

  final dynamic json;
}
