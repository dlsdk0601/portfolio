import 'dart:math';
import 'package:flutter/material.dart';

class ParticlesView extends StatefulWidget {
  final int quantity;
  final double minSize;
  final double maxSize;

  const ParticlesView({
    super.key,
    this.quantity = 100,
    this.minSize = 0.5,
    this.maxSize = 2.0,
  });

  @override
  State<ParticlesView> createState() => _ParticlesViewState();
}

class _ParticlesViewState extends State<ParticlesView>
    with SingleTickerProviderStateMixin {
  List<Particle> particles = [];
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(vsync: this, duration: const Duration(seconds: 10))
          ..repeat();
    _initialize();
  }

  void _initialize() {
    particles = List.generate(
      widget.quantity,
      (_) => Particle.random(widget.minSize, widget.maxSize),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        _updateParticles();
        return CustomPaint(
          painter: ParticlePainter(particles),
          size: Size.infinite,
        );
      },
    );
  }

  void _updateParticles() {
    for (var particle in particles) {
      particle.update(MediaQuery.of(context).size);
    }
  }
}

class Particle {
  Offset position;
  Offset velocity;
  double size;
  double alpha;

  Particle({
    required this.position,
    required this.velocity,
    required this.size,
    required this.alpha,
  });

  factory Particle.random(double minSize, double maxSize) {
    final random = Random();
    return Particle(
      position: Offset(
        random.nextDouble() * 400,
        random.nextDouble() * 400,
      ),
      velocity: Offset(
        random.nextDouble() * 0.2 - 0.1,
        random.nextDouble() * 0.2 - 0.1,
      ),
      size: random.nextDouble() * (maxSize - minSize) + minSize,
      alpha: random.nextDouble() * 0.6 + 0.1,
    );
  }

  void update(Size size) {
    position += velocity;

    if (position.dx < 0 || position.dx > size.width) {
      velocity = Offset(-velocity.dx, velocity.dy);
    }

    if (position.dy < 0 || position.dy > size.height) {
      velocity = Offset(velocity.dx, -velocity.dy);
    }

    alpha += (Random().nextDouble() - 0.5) * 0.01;
    alpha = alpha.clamp(0.0, 0.7); // 투명도를 0.0 에서 0.7 사이로 제한
  }
}

class ParticlePainter extends CustomPainter {
  final List<Particle> particles;

  ParticlePainter(this.particles);

  @override
  void paint(Canvas canvas, Size size) {
    for (var particle in particles) {
      final paint = Paint()
        ..color = Colors.white.withOpacity(particle.alpha)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(particle.position, particle.size, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
