import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

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

Future<void> openBrowser(String url, BuildContext context) async {
  final Uri uri = Uri.parse(url);
  final isBrowserOpen = await launchUrl(
    uri,
    mode: LaunchMode.externalApplication,
  );

  if (!isBrowserOpen && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("링크 열기에 실패하였습니다."),
        duration: Duration(seconds: 5),
      ),
    );
  }
}

String? encodeQueryParameters(Map<String, String> params) {
  return params.entries
      .map((MapEntry<String, String> e) =>
          '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
      .join('&');
}

Future<void> mailTo(String url, BuildContext context) async {
  final Uri uri = Uri(
    scheme: 'mailto',
    path: url,
    queryParameters: {
      'subject': "",
      'body': "",
    },
  );

  final isEmailOpen = await launchUrl(
    uri,
  );

  if (!isEmailOpen && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("링크 열기에 실패하였습니다."),
        duration: Duration(seconds: 5),
      ),
    );
  }
}
