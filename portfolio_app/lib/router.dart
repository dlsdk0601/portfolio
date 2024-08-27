import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/screen/contact/contacts.dart';
import 'package:portfolio_app/screen/home.dart';

part 'router.g.dart';

@TypedGoRoute<HomeRoute>(path: '/', routes: [
  TypedGoRoute<ContactsRoute>(path: 'contacts'),
])
class HomeRoute extends GoRouteData {
  const HomeRoute();

  @override
  Widget build(BuildContext context, GoRouterState state) => const HomeScreen();
}

class ContactsRoute extends GoRouteData {
  const ContactsRoute();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const ContactsScreen();
}

const defaultLocation = '';

GoRouter buildRouter({String? initialLocation}) {
  return GoRouter(
    routes: $appRoutes,
    initialLocation:
        initialLocation == defaultLocation ? null : initialLocation,
  );
}
