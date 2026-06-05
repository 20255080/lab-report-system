import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';
import 'services/firestore_service.dart';
import 'screens/daily_report_screen.dart';
import 'screens/weekly_report_screen.dart';
import 'screens/view_all_screen.dart';
import 'screens/timetable_screen.dart';
import 'screens/calendar_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(
    MultiProvider(
      providers: [
        Provider<FirestoreService>(create: (_) => FirestoreService()),
      ],
      child: const BlessLabApp(),
    ),
  );
}

class BlessLabApp extends StatelessWidget {
  const BlessLabApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BLESS Lab',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2c3e50),
          primary: const Color(0xFF2c3e50),
        ),
        fontFamily: 'NotoSansKR',
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF2c3e50),
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
          titleTextStyle: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  bool _initialized = false;

  final List<_TabItem> _tabs = const [
    _TabItem(label: '보고서 제출', icon: Icons.edit_note, activeIcon: Icons.edit),
    _TabItem(label: '전체 조회', icon: Icons.list_alt_outlined, activeIcon: Icons.list_alt),
    _TabItem(label: '시간표', icon: Icons.table_chart_outlined, activeIcon: Icons.table_chart),
    _TabItem(label: '캘린더', icon: Icons.calendar_month_outlined, activeIcon: Icons.calendar_month),
  ];

  @override
  void initState() {
    super.initState();
    _initApp();
  }

  Future<void> _initApp() async {
    try {
      final svc = context.read<FirestoreService>();
      await svc.initStudentsIfEmpty();
    } catch (_) {}
    if (mounted) setState(() => _initialized = true);
  }

  // Submit tab has 2 sub-tabs: Daily and Weekly
  int _submitSubTab = 0;

  @override
  Widget build(BuildContext context) {
    if (!_initialized) {
      return const Scaffold(
        backgroundColor: Color(0xFF2c3e50),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: Colors.white),
              SizedBox(height: 20),
              Text('BLESS Lab', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              SizedBox(height: 6),
              Text('초기화 중...', style: TextStyle(color: Colors.white70, fontSize: 13)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('BLESS Lab', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
            Text(
              _tabs[_currentIndex].label,
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          if (_currentIndex == 0)
            Row(
              children: [
                _SubTabBtn(
                  label: '일일',
                  selected: _submitSubTab == 0,
                  onTap: () => setState(() => _submitSubTab = 0),
                ),
                _SubTabBtn(
                  label: '주간',
                  selected: _submitSubTab == 1,
                  onTap: () => setState(() => _submitSubTab = 1),
                ),
                const SizedBox(width: 8),
              ],
            ),
        ],
      ),
      body: SafeArea(
        child: IndexedStack(
          index: _currentIndex,
          children: [
            // Submit tab: indexed stack for daily/weekly
            IndexedStack(
              index: _submitSubTab,
              children: const [
                DailyReportScreen(),
                WeeklyReportScreen(),
              ],
            ),
            const ViewAllScreen(),
            const TimetableScreen(),
            const CalendarScreen(),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFF2c3e50).withValues(alpha: 0.1),
        destinations: _tabs
            .map((t) => NavigationDestination(
                  icon: Icon(t.icon),
                  selectedIcon: Icon(t.activeIcon, color: const Color(0xFF2c3e50)),
                  label: t.label,
                ))
            .toList(),
      ),
    );
  }
}

class _TabItem {
  final String label;
  final IconData icon;
  final IconData activeIcon;
  const _TabItem({required this.label, required this.icon, required this.activeIcon});
}

class _SubTabBtn extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _SubTabBtn({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 3),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.white.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: selected ? const Color(0xFF2c3e50) : Colors.white,
          ),
        ),
      ),
    );
  }
}
