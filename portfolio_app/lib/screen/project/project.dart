import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/api/schema.gen.dart';
import 'package:portfolio_app/ex/dt.dart';
import 'package:portfolio_app/view/layout.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../globals.dart';

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

    if (!model.initialized) {
      return const CircularProgressIndicator();
    }

    if (model.project == null) {
      return const Center(
        child: Text('데이터가 조회되지 않습니다.'),
      );
    }

    final project = model.project!;

    return Layout(
      title: 'project title',
      context: context,
      child: SafeArea(
        child: Column(
          children: [
            Text(project.pk.toString()),
            Text(project.title),
            Text(project.type.toString()),
            Text(project.description),
            Text(project.websiteUrl),
            Text(project.githubUrl),
            Text(project.mainText),
            Text(project.createAt.d2),
          ],
        ),
      ),
    );
  }
}

@riverpod
class _ModelState extends _$ModelState {
  @override
  _Model build() => const _Model(initialized: false, project: null);

  Future<void> init(int pk) async {
    if (state.initialized) {
      return;
    }

    final res = await api.projectShow(ProjectShowReq(pk: pk));

    if (res == null) {
      return;
    }

    state = state.copyWith(initialized: true, project: res);

    return;
  }
}

@freezed
class _Model with _$Model {
  const factory _Model({
    required bool initialized,
    required ProjectShowRes? project,
  }) = __Model;
}
