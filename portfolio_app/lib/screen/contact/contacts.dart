import 'package:flutter/material.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/ex/hook.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'contacts.freezed.dart';
part 'contacts.g.dart';

class ContactsScreen extends HookConsumerWidget {
  const ContactsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      child: const Center(
        child: Text('contacts'),
      ),
    );
  }
}

@riverpod
class _ModelState extends _$ModelState with InitModel {
  @override
  _Model build() => const _Model(initialized: false);

  @override
  Future<void> init() async {
    print(state.initialized);
  }

  @override
  Future<void> deInit() async {}
}

@freezed
class _Model with _$Model {
  const factory _Model({
    required bool initialized,
  }) = __Model;
}
