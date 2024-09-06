import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/router.dart';
import 'package:portfolio_app/view/layout.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Layout(
      title: 'HOME',
      context: context,
      child: Center(
        child: Column(
          children: [
            const Text('홈'),
            ElevatedButton(
              onPressed: () => context.go(const ContactsRoute().location),
              child: const Text("go contact"),
            ),
            const SizedBox(
              height: 18.0,
            ),
            ElevatedButton(
              onPressed: () => context.go(const ProjectListRoute().location),
              child: const Text("go project"),
            )
          ],
        ),
      ),
    );
  }
}
