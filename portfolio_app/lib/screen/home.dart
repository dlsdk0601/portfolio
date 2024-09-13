import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/color.dart';
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
          // 배경 화면
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
                    child: const Text(
                      "Contact",
                      style: TextStyle(color: primaryColor),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () =>
                        context.go(const ProjectListRoute().location),
                    child: const Text(
                      "Project",
                      style: TextStyle(color: primaryColor),
                    ),
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
              const SizedBox(
                height: 20.0,
              ),
              const Text(
                "I'm a FullStack developer who likes coding.",
                style: TextStyle(color: primaryColor),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
