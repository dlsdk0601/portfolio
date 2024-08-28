import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_app/screen/contact/contacts.dart';
import 'package:portfolio_app/screen/home.dart';
import 'package:portfolio_app/screen/project/list.dart';
import 'package:portfolio_app/screen/project/project.dart';

part 'router.g.dart';

@TypedGoRoute<HomeRoute>(path: '/', routes: [
  TypedGoRoute<ContactsRoute>(path: 'contacts'),
  TypedGoRoute<ProjectListRoute>(path: 'project/list', routes: [
    TypedGoRoute<ProjectShowRoute>(path: 'project/show/:pk'),
  ])
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

class ProjectListRoute extends GoRouteData {
  const ProjectListRoute();

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const ProjectListScreen();
}

class ProjectShowRoute extends GoRouteData {
  const ProjectShowRoute(this.pk);

  final int pk;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ProjectShowScreen(pk: pk);
}

const defaultLocation = '';

GoRouter buildRouter({String? initialLocation}) {
  return GoRouter(
    routes: $appRoutes,
    initialLocation:
        initialLocation == defaultLocation ? null : initialLocation,
  );
}
