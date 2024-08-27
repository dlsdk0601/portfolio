import 'package:flutter/cupertino.dart';

AppLifecycleListener appDetachedListener(VoidCallback onDetached) {
  return AppLifecycleListener(onStateChange: (state) {
    final detached = switch (state) {
      AppLifecycleState.detached => true,
      AppLifecycleState.resumed ||
      AppLifecycleState.inactive ||
      AppLifecycleState.hidden ||
      AppLifecycleState.paused =>
        false,
    };

    if (detached) {
      onDetached();
    }
  });
}
