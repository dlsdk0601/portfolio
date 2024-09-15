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
                    onPressed: () =>
                        context.go(const ProjectListRoute().location),
                    child: const Text(
                      "Project",
                      style: TextStyle(color: primaryColor, fontSize: 15.0),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => context.go(const ContactsRoute().location),
                    child: const Text(
                      "Contact",
                      style: TextStyle(color: primaryColor, fontSize: 15.0),
                    ),
                  ),
                ],
              ),
              const SizedBox(
                height: 64.0,
              ),
              const Text(
                "Portfolio",
                style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 36.0,
                    color: cFFFFFF),
              ),
              const SizedBox(
                height: 64.0,
              ),
              const Text(
                "I'm a FullStack developer who likes coding.",
                style: TextStyle(color: primaryColor, fontSize: 14.0),
              ),
              const SizedBox(
                height: 100,
              )
            ],
          ),
        ],
      ),
    );
  }
}
