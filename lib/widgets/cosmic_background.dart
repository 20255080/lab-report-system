import 'package:flutter/material.dart';
import 'dart:math';
import '../constants/app_colors.dart';

class CosmicBackground extends StatefulWidget {
  final Widget child;
  
  const CosmicBackground({super.key, required this.child});

  @override
  State<CosmicBackground> createState() => _CosmicBackgroundState();
}

class _CosmicBackgroundState extends State<CosmicBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Star> _stars = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();

    // Generate random stars
    for (int i = 0; i < 50; i++) {
      _stars.add(Star(
        x: _random.nextDouble(),
        y: _random.nextDouble(),
        size: _random.nextDouble() * 3 + 1,
        opacity: _random.nextDouble() * 0.5 + 0.3,
        twinkleSpeed: _random.nextDouble() * 2 + 1,
      ));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: AppColors.cosmicGradient,
      ),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            painter: StarPainter(_stars, _controller.value),
            child: widget.child,
          );
        },
      ),
    );
  }
}

class Star {
  final double x;
  final double y;
  final double size;
  final double opacity;
  final double twinkleSpeed;

  Star({
    required this.x,
    required this.y,
    required this.size,
    required this.opacity,
    required this.twinkleSpeed,
  });
}

class StarPainter extends CustomPainter {
  final List<Star> stars;
  final double animationValue;

  StarPainter(this.stars, this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    for (var star in stars) {
      final twinkle = (sin(animationValue * 2 * pi * star.twinkleSpeed) + 1) / 2;
      final paint = Paint()
        ..color = AppColors.gold.withValues(alpha: star.opacity * twinkle)
        ..style = PaintingStyle.fill;

      final position = Offset(
        star.x * size.width,
        star.y * size.height,
      );

      // Draw star as a circle
      canvas.drawCircle(position, star.size, paint);

      // Add sparkle effect for larger stars
      if (star.size > 2) {
        final sparklePaint = Paint()
          ..color = Colors.white.withValues(alpha: 0.3 * twinkle)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(position, star.size * 0.5, sparklePaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant StarPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
