import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/ex/hook.dart';
import 'package:portfolio_app/view/layout.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../api/schema.gen.dart';
import '../../globals.dart';

part 'contacts.freezed.dart';
part 'contacts.g.dart';

class ContactsScreen extends HookConsumerWidget {
  const ContactsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final model = ref.watch(_modelStateProvider);

    useEffect(() {
      Future.microtask(() => ref.read(_modelStateProvider.notifier).init());

      return null;
    }, []);

    if (!model.initialized) {
      return Container();
    }

    return Layout(
      title: 'contacts',
      context: context,
      child: Column(
        children: [
          ...model.contacts.map(
            (e) => Column(
              children: [
                Text(e.pk.toString()),
                Text(e.id),
                Text(e.href),
                Text(e.type.toString()),
              ],
            ),
          ),
          const SizedBox(
            height: 18.0,
          ),
        ],
      ),
    );
  }
}

@riverpod
class _ModelState extends _$ModelState with InitModel {
  @override
  _Model build() => const _Model(initialized: false, contacts: []);

  @override
  Future<void> init() async {
    if (state.initialized) {
      return;
    }

    final res = await api.contactShow(const ContactShowReq());

    if (res == null) {
      return;
    }

    state = state.copyWith(initialized: true, contacts: res.contacts);
    return;
  }

  @override
  Future<void> deInit() async {}
}

@freezed
class _Model with _$Model {
  const factory _Model({
    required bool initialized,
    required List<ContactShowResItem> contacts,
  }) = __Model;
}
