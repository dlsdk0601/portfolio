import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'home.freezed.dart';
part 'home.g.dart';

class HomeScreen extends HookConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeModel = ref.watch(_homeProvider);

    return Container(
      child: const Center(
        child: Text('홈'),
      ),
    );
  }
}

@freezed
class _HomeModel with _$HomeModel {
  const factory _HomeModel() = __HomeModel;
}

@riverpod
class _Home extends _$Home {
  @override
  _HomeModel build() {
    return const _HomeModel();
  }
}
