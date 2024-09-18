import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:portfolio_app/api/schema.gen.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/ex/app.dart';
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
        child: CircularProgressIndicator(),
      );
    }

    final project = model.project!;

    return Layout(
      title: project.title,
      context: context,
      actions: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Icon(
              Icons.remove_red_eye_outlined,
              size: 18.0,
              color: primaryColor,
            ),
            const SizedBox(
              width: 5.0,
            ),
            Text(
              2.toString(),
              style: const TextStyle(
                fontSize: 16.0,
                color: primaryColor,
                height: 1.0,
              ),
            ),
            const SizedBox(
              width: 5.0,
            ),
          ],
        )
      ],
      child: ListView(
        children: [
          _HeaderView(
            project: project,
          ),
          Container(
            color: cFFFFFF,
            padding: const EdgeInsets.symmetric(
              vertical: 48.0,
              horizontal: 16.0,
            ),
            // height: 900.0,
            child: MarkdownBody(
              data: project.mainText,
            ),
          ),
        ],
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

class _HeaderView extends StatelessWidget {
  final ProjectShowRes project;

  const _HeaderView({
    super.key,
    required this.project,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 24.0,
        vertical: 15.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            project.title,
            style: const TextStyle(
              fontSize: 36.0,
              color: cFFFFFF,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(
            height: 24.0,
          ),
          Text(
            project.description,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 18.0,
              color: cFFFFFF,
            ),
          ),
          const SizedBox(
            height: 40.0,
          ),
          if (project.githubUrl.isNotEmpty)
            linkButtonView(
              onTap: () async {
                if (project.githubUrl.isEmpty) {
                  return;
                }
                await openBrowser(project.githubUrl, context);
              },
              url: project.githubUrl,
              title: "GitHub",
            ),
          const SizedBox(
            height: 28.0,
          ),
          if (project.websiteUrl.isNotEmpty)
            linkButtonView(
              onTap: () async {
                if (project.websiteUrl.isEmpty) {
                  return;
                }
                await openBrowser(project.websiteUrl, context);
              },
              url: project.websiteUrl,
              title: "WebSite",
            ),
        ],
      ),
    );
  }

  Widget linkButtonView({
    required VoidCallback onTap,
    required String url,
    required String title,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 16.0, color: cFFFFFF),
          ),
          const SizedBox(
            width: 5.0,
          ),
          const Icon(Icons.arrow_right_alt),
        ],
      ),
    );
  }
}
