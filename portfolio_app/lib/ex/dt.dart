import 'package:intl/intl.dart';

extension DateTimeDtExtension on DateTime {
  String get d1 => DateFormat('yyyy.MM.dd').format(toLocal());

  String get d2 => DateFormat('MMM d, yyyy').format(toLocal());

  String get dt1 => DateFormat('yyyy.MM.dd HH:mm').format(toLocal());

  String get dt2 => DateFormat('yyyy년 MM월 dd일 a HH:mm').format(toLocal());
}
