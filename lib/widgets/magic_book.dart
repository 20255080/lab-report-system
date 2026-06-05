import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../constants/app_colors.dart';

class MagicBook extends StatefulWidget {
  final bool isOpen;
  final VoidCallback? onTap;
  
  const MagicBook({
    super.key,
    this.isOpen = false,
    this.onTap,
  });

  @override
  State<MagicBook> createState() => _MagicBookState();
}

class _MagicBookState extends State<MagicBook>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _floatAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat(reverse: true);

    _floatAnimation = Tween<double>(begin: -10, end: 10).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _rotationAnimation = Tween<double>(begin: -0.02, end: 0.02).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
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
        return Transform.translate(
          offset: Offset(0, _floatAnimation.value),
          child: Transform.rotate(
            angle: _rotationAnimation.value,
            child: GestureDetector(
              onTap: widget.onTap,
              child: Container(
                width: 250,
                height: 300,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.gold.withValues(alpha: 0.3),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    // Book cover
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            AppColors.deepPurple,
                            AppColors.magicPurple,
                            AppColors.deepPurple,
                          ],
                        ),
                        border: Border.all(
                          color: AppColors.gold,
                          width: 3,
                        ),
                      ),
                    ),
                    // Magic circle decoration
                    Center(
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.gold.withValues(alpha: 0.6),
                            width: 2,
                          ),
                        ),
                        child: Stack(
                          children: [
                            // Inner circle
                            Center(
                              child: Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppColors.gold.withValues(alpha: 0.4),
                                    width: 2,
                                  ),
                                ),
                              ),
                            ),
                            // Stars in corners
                            ...List.generate(4, (index) {
                              final angle = (index * 90) * 3.14159 / 180;
                              return Positioned(
                                left: 60 + 40 * math.cos(angle) - 8,
                                top: 60 + 40 * math.sin(angle) - 8,
                                child: Icon(
                                  Icons.star,
                                  color: AppColors.gold.withValues(alpha: 0.8),
                                  size: 16,
                                ),
                              );
                            }),
                          ],
                        ),
                      ),
                    ),
                    // Book spine shadow
                    Positioned(
                      left: 15,
                      top: 10,
                      bottom: 10,
                      child: Container(
                        width: 8,
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                    // Sparkles
                    ...List.generate(8, (index) {
                      return Positioned(
                        left: (index % 4) * 60.0 + 20,
                        top: (index ~/ 4) * 130.0 + 30,
                        child: TweenAnimationBuilder(
                          duration: const Duration(milliseconds: 1500),
                          tween: Tween<double>(begin: 0, end: 1),
                          builder: (context, double value, child) {
                            return Opacity(
                              opacity: (value * 2 - 1).abs(),
                              child: Icon(
                                Icons.auto_awesome,
                                color: AppColors.gold,
                                size: 12,
                              ),
                            );
                          },
                          onEnd: () {
                            // Trigger rebuild to restart animation
                            if (mounted) {
                              setState(() {});
                            }
                          },
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
