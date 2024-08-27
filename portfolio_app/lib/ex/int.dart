import 'package:intl/intl.dart';

extension IntFormatExtension on int {
  String get commas => NumberFormat('#,###').format(this);

  String get contraction => NumberFormat.compact(locale: 'ko_KR').format(this);
}
