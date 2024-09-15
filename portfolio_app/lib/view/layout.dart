import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/color.dart';

class Layout extends StatelessWidget {
  const Layout({
    super.key,
    required this.title,
    required this.child,
    required this.context,
    this.hasLeading = false,
    this.actions,
    this.backgroundColor,
  });

  final String title;
  final Widget child;
  final BuildContext context;
  final bool hasLeading;
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
        leading: hasLeading
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  if (context.mounted && context.canPop()) {
                    context.pop();
                  }
                },
              )
            : null,
        actions: actions,
      ),
      backgroundColor: backgroundColor ?? c000000,
      body: child,
    );
  }
}
