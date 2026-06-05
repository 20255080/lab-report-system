import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors - Mystical Purple Theme
  static const deepPurple = Color(0xFF2D1B69);
  static const magicPurple = Color(0xFF6C5CE7);
  static const starBlue = Color(0xFF5F72E1);
  
  // Accent Colors
  static const gold = Color(0xFFFFD700);
  static const silverWhite = Color(0xFFF0F0F5);
  static const darkGray = Color(0xFF2C2C2E);
  
  // Gradients
  static const cosmicGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF1e3c72),
      Color(0xFF2d1b69),
      Color(0xFF6c5ce7),
    ],
  );

  static const buttonGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [
      Color(0xFFFFD700),
      Color(0xFFFFA500),
    ],
  );

  static const cardGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFFFFFFFF),
      Color(0xFFF8F8FF),
    ],
  );

  // Category Colors
  static const careerColor = Color(0xFF4A90E2);
  static const loveColor = Color(0xFFFF6B9D);
  static const studyColor = Color(0xFF4CAF50);
  static const wealthColor = Color(0xFFFFB74D);
  static const healthColor = Color(0xFFE57373);
  static const relationshipsColor = Color(0xFF9575CD);
  static const decisionColor = Color(0xFF26C6DA);
  static const generalColor = Color(0xFFFFD54F);
}
