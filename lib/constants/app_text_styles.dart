import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  // Title Styles
  static const appTitle = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.gold,
    letterSpacing: 2,
  );

  static const screenTitle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.silverWhite,
  );

  // Answer Text Styles
  static const answerText = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w500,
    color: AppColors.darkGray,
    height: 1.8,
    letterSpacing: 0.5,
  );

  static const answerSignature = TextStyle(
    fontSize: 14,
    fontStyle: FontStyle.italic,
    color: AppColors.deepPurple,
  );

  // Body Text Styles
  static const bodyText = TextStyle(
    fontSize: 16,
    color: AppColors.silverWhite,
  );

  static const caption = TextStyle(
    fontSize: 12,
    color: AppColors.darkGray,
  );

  static const hint = TextStyle(
    fontSize: 16,
    color: Colors.white70,
    fontStyle: FontStyle.italic,
  );

  // Button Text Styles
  static const buttonText = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 1,
  );

  static const smallButtonText = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AppColors.magicPurple,
  );
}
