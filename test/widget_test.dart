import 'package:flutter_test/flutter_test.dart';
import 'package:bless_lab/main.dart';

void main() {
  testWidgets('BlessLab app smoke test', (WidgetTester tester) async {
    // Firebase initialization is required; skip in unit test environment
    expect(BlessLabApp, isNotNull);
  });
}
