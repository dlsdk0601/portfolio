import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/view/layout.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'project.freezed.dart';
part 'project.g.dart';

class ProjectShowScreen extends HookConsumerWidget {
  const ProjectShowScreen({super.key, required this.pk});

  final int pk;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final model = ref.watch(_modelStateProvider);

    useEffect(() {
      Future.microtask(() => ref.read(_modelStateProvider.notifier).init(pk));

      return null;
    }, []);

    return Layout(
      title: 'project title',
      context: context,
      child: const SafeArea(
        child: Center(
          child: Text('project show'),
        ),
      ),
    );
  }
}

@riverpod
class _ModelState extends _$ModelState {
  @override
  _Model build() => const _Model(initialized: false);

  Future<void> init(int pk) async {
    if (state.initialized) {
      return;
    }

    final res = null;

    if (res == null) {
      return;
    }

    state = state.copyWith(initialized: true);

    return;
  }
}

@freezed
class _Model with _$Model {
  const factory _Model({
    required bool initialized,
  }) = __Model;
}
