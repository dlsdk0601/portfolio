import 'package:flutter/material.dart';
import 'package:portfolio_app/color.dart';

final darkThemeData = ThemeData(
  brightness: Brightness.dark,
  colorScheme: const ColorScheme.dark(
      surface: backgroundColor, primary: primaryColor, outline: primaryColor),
);
