import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/color.dart';

import '../gen/assets.gen.dart';

class Layout extends StatelessWidget {
  const Layout({
    super.key,
    required this.title,
    required this.child,
    required this.context,
    this.leading,
    this.actions,
    this.backgroundColor,
  });

  final String title;
  final Widget child;
  final BuildContext context;
  final Widget? leading;
  final List<Widget>? actions;
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        elevation: 0,
        backgroundColor: backgroundColor ?? c000000,
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 20,
          ),
        ),
        leading: leading ??
            IconButton(
              icon: Assets.logo.image(width: 30.0, height: 30.0),
              onPressed: () {
                if (context.mounted && context.canPop()) {
                  context.pop();
                }
              },
            ),
        actions: actions,
      ),
      backgroundColor: backgroundColor ?? c000000,
      body: child,
    );
  }
}
