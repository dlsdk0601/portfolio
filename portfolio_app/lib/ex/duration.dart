extension DurationEx on Duration {
  double operator /(Duration other) {
    return inMicroseconds / other.inMicroseconds;
  }

  double toJson() {
    return (inMicroseconds / 1000 / 1000);
  }

  static Duration fromJson(double json) {
    return Duration(
      microseconds: (json * 1000 * 1000).floor(),
    );
  }
}

String formatDuration(Duration duration) {
  int totalSeconds = duration.inSeconds;
  int hours = totalSeconds ~/ 3600;
  int minutes = (totalSeconds % 3600) ~/ 60;
  int seconds = totalSeconds % 60;

  // 시간 단위 있을 경우
  if (hours > 0) {
    return '${hours.toString().padLeft(1, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
}
