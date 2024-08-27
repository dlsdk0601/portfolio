extension ObjectEx<T> on T {
  R let<R>(R Function(T) f) => f(this);
}
