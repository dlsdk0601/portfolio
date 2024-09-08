import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/color.dart';
import 'package:portfolio_app/view/particles_view.dart';

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
              icon: const Icon(Icons.arrow_back),
              onPressed: () {
                if (context.mounted && context.canPop()) {
                  context.pop();
                }
              },
            ),
        actions: actions,
      ),
      backgroundColor: backgroundColor ?? c000000,
      // TODO :: 메인 배경만 해당 되므로 수정
      body: Stack(
        children: [
          const Positioned.fill(
            child: ParticlesView(
              quantity: 100,
            ),
          ),
          child,
        ],
      ),
    );
  }
}
