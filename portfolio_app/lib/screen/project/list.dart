import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/api/schema.gen.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/ex/hook.dart';
import 'package:portfolio_app/router.dart';
import 'package:portfolio_app/view/layout.dart';
import 'package:portfolio_app/view/project_cart_view.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../globals.dart';

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
      actions: [
        ElevatedButton(
          onPressed: () => context.go(const ContactsRoute().location),
          child: const Text(
            "Contact",
            style: TextStyle(fontSize: 16.0),
          ),
        )
      ],
      child: ListView(
        padding: const EdgeInsets.only(top: 30.0),
        children: [
          const _HeaderView(),
          ...model.projects.map(
            (e) => ProjectCardView(project: e),
          ),
          const SizedBox(
            height: 18.0,
          )
        ],
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

    final res = await api.projectList(const ProjectListReq());

    if (res == null) {
      return;
    }

    state = state.copyWith(initialized: true, projects: res.projects);
    return;
  }

  @override
  Future<void> deInit() async {}
}

@freezed
class _Model with _$Model {
  const factory _Model({
    required bool initialized,
    required List<ProjectListResItem> projects,
  }) = __Model;
}

class _HeaderView extends StatelessWidget {
  const _HeaderView({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(
        left: 16.0,
        right: 16.0,
        bottom: 16.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Projects",
            style: TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 30.0,
              color: cFFFFFF,
            ),
          ),
          const SizedBox(
            height: 16.0,
          ),
          const Text(
            "Some of the projects are from work and some are on my own time.",
            style: TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 16.0,
            ),
          ),
          const SizedBox(
            height: 32.0,
          ),
          SizedBox(
            height: 1.0,
            width: MediaQuery.of(context).size.width,
            child: Container(
              color: primaryColor,
            ),
          ),
        ],
      ),
    );
  }
}
