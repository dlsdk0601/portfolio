import 'package:collection/collection.dart';
import 'package:logging/logging.dart';
import 'package:stack_trace/stack_trace.dart';

import 'object.dart';

String formatLogRecord(final LogRecord record) {
  final log =
      '${record.time} ${record.level.name} ${record.loggerName} - ${record.message}';
  final error = record.error?.let((error) => error.toString());
  final stackTrace = record.stackTrace?.let(Trace.format);

  return [log, error, stackTrace].whereNotNull().join("\n");
}

void printLogRecord(final LogRecord record) {
  return print(formatLogRecord(record));
}
