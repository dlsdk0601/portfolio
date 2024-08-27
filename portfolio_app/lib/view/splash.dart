import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:portfolio_app/config.dart';

import '../gen/assets.gen.dart';

class SplashView extends HookWidget {
  const SplashView({super.key, required this.child, this.onNext});

  final Widget child;
  final Future<void> Function()? onNext;

  @override
  Widget build(BuildContext context) {
    final initialized = useState(false);

    useEffect(() {
      var disposed = false;
      final startAt = DateTime.now();

      Future(() async {
        if (disposed) return;
        if (config.splashFadeIn) {
          final endAt = DateTime.now();
          final wait = const Duration(seconds: 1) - endAt.difference(startAt);

          if (wait > Duration.zero) {
            try {
              await Future.delayed(wait);
            } catch (e, stack) {
              logger.e('splash 1sec delay', error: e, stackTrace: stack);
            }
          }
        }

        if (disposed) return;
        initialized.value = true;
      });

      return () {
        disposed = true;
      };
    }, []);
    return !initialized.value
        ? const _SplashView()
        : Container(
            key: _contentViewKey,
            child: child,
          );
  }
}

final _splashViewKey = GlobalKey(debugLabel: 'SplashViewKey');
final _contentViewKey = GlobalKey(debugLabel: 'ContentViewKey');

class _SplashView extends StatelessWidget {
  const _SplashView({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Assets.logo.image(width: 370, height: 371),
    );
  }
}
