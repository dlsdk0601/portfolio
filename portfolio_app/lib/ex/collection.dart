import 'package:collection/collection.dart';
import 'package:flutter/rendering.dart';

extension IterableExtension<E> on Iterable<E> {
  Iterable<(bool, E)> withLast() {
    return mapIndexed((index, e) => (index + 1 == length, e));
  }

  Iterable<E> mapWhere(bool Function(E e) predicate, E Function(E e) mapper) {
    return map((e) => predicate(e) ? mapper(e) : e);
  }

  Iterable<E> join2(E Function() joiner) {
    return withLast().expand((e) {
      final (last, i) = e;
      return last ? [i] : [i, joiner()];
    });
  }

  Iterable<E> without(E element) => whereNot((e) => identical(e, element));
}

extension ListExtension<E> on List<E> {
  int get lastIndex {
    return length - 1;
  }

  E? getOrNull(int? index) {
    if (index == null || index >= length) {
      return null;
    }

    return this[index];
  }

  E? next(E? current) {
    if (current == null) {
      return null;
    }

    final index = indexOf(current);

    // 없을 경우
    if (index < 0) {
      return null;
    }

    // 오버플로우 (넘었을 경우)
    if (index + 1 >= length) {
      return null;
    }

    return this[index + 1];
  }

  E? nextWhere(bool Function(E element) test) {
    return next(firstWhereOrNull(test));
  }
}

extension MApExtension<K, V> on Map<K, V> {
  MapEntry<K, V>? getOrNull(K? key) {
    if (key == null) {
      return null;
    }

    final value = this[key];
    if (!containsKey(key) || value == null) {
      return null;
    }

    return MapEntry(key, value);
  }

  String repr({String separator = ', '}) {
    final values = entries.map((e) {
      final needRepresent = switch (e.value) {
        String _ => true,
        int _ => true,
        double _ => true,
        bool _ => true,
        null => true,
        _ => true,
      };

      final value =
          needRepresent ? '${e.value.runtimeType}(${e.value})' : e.value;
      return '${e.key}=$value';
    }).join(separator);
    return values;
  }
}
