import 'package:flutter/cupertino.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:mutex/mutex.dart';

import '../globals.dart';

extension AsyncSnapshotToValue<T> on AsyncSnapshot<T> {
  AsyncValue<T> get asyncValue {
    return switch (this) {
      AsyncSnapshot(connectionState: ConnectionState.waiting) =>
        const AsyncValue.loading(),
      AsyncSnapshot(hasData: true, data: final data) => data == null
          ? AsyncValue.error(StateError('hasData, but data is null'),
              StackTrace.current) // AsyncValue.error
          : AsyncValue.data(data),
      // errors
      AsyncSnapshot(
        hasError: true,
        error: final error,
        stackTrace: final stackTrace
      ) =>
        (error == null)
            ? AsyncValue.error(StateError('hasError, but error is null'),
                stackTrace ?? StackTrace.current)
            : AsyncValue.error(error, stackTrace ?? StackTrace.current),
      AsyncSnapshot(connectionState: ConnectionState.none) =>
        throw StateError('cannot conver ConeectionState.none to AsyncValue'),
      _ => throw StateError('invalid state: $this'),
    };
  }
}

Future<void> yieldStep() async {
  await Future(() {});
}

class ThrottleExecutor {
  final _runners = <Future<void>>[];

  bool execute(Future<void> Function() runner, {bool force = false}) {
    if (_runners.isNotEmpty && !force) {
      return false;
    }

    final newRunner = Future.wait([
      ..._runners,
      Future(runner).catchError((err) {
        logger.e('ThrottleExecutor error', error: err);
      })
    ]);
    newRunner.whenComplete(() {
      _runners.remove(newRunner);
    });
    _runners.add(newRunner);
    return true;
  }
}

class ThrottleLastOneExecutor {
  var _lastId = 0;
  final _lock = Mutex();

  void execute(Future<void> Function() runner) {
    final id = ++_lastId;
    _lock.protect(() async {
      if (id != _lastId) {
        return;
      }
      await runner();
    });
  }
}
