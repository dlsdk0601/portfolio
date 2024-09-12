import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/router.dart';
import 'package:portfolio_app/view/layout.dart';

import '../view/particles_view.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Layout(
      title: 'HOME',
      context: context,
      child: Stack(
        children: [
          const Positioned.fill(
            child: ParticlesView(
              quantity: 100,
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () => context.go(const ContactsRoute().location),
                    child: const Text("Contact"),
                  ),
                  ElevatedButton(
                    onPressed: () =>
                        context.go(const ProjectListRoute().location),
                    child: const Text("Project"),
                  )
                ],
              ),
              const Text(
                "Portfolio",
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13.0,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
