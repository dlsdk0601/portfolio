import 'collection.dart';

extension StringExtension on String {
  String data(Map<String, dynamic> map) {
    return '$this : ${map.repr()}';
  }

  String indent(int indentCount) {
    return split('\n').map((line) => '  ' * indentCount + line).join('\n');
  }
}
