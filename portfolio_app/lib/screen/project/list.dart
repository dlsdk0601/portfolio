import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/ex/hook.dart';
import 'package:portfolio_app/view/layout.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'list.freezed.dart';
part 'list.g.dart';

class ProjectListScreen extends HookConsumerWidget {
  const ProjectListScreen({super.key});

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
      title: 'projects',
      context: context,
      child: const SafeArea(
        child: Center(
          child: Text('project list'),
        ),
      ),
    );
  }
}

@riverpod
class _ModelState extends _$ModelState with InitModel {
  @override
  _Model build() => const _Model(initialized: false, projects: []);

  @override
  Future<void> init() async {
    if (state.initialized) {
      return;
    }

    final List<dynamic>? res = [];

    if (res == null) {
      return;
    }

    state = state.copyWith(initialized: true, projects: res);
    return;
  }

  @override
  Future<void> deInit() async {}
}

@freezed
class _Model with _$Model {
  const factory _Model({
    required bool initialized,
    required List<dynamic> projects,
  }) = __Model;
}