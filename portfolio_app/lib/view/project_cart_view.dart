import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/api/schema.gen.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/ex/dt.dart';
import 'package:portfolio_app/router.dart';

class ProjectCardView extends StatelessWidget {
  final ProjectListResItem project;

  const ProjectCardView({
    super.key,
    required this.project,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(ProjectShowRoute(project.pk).location),
      child: Container(
        margin: const EdgeInsets.all(8.0),
        padding: const EdgeInsets.symmetric(
          vertical: 16.0,
          horizontal: 16.0,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: primaryColor),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(project.issueAt.d2),
                viewCountIcon(project.viewCount)
              ],
            ),
            Text(
              project.title,
              style: const TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(
              height: 16.0,
            ),
            Text(project.description),
          ],
        ),
      ),
    );
  }

  Widget viewCountIcon(int countView) {
    return Row(
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
        Text(countView.toString()),
      ],
    );
  }
}
