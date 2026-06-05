import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../models/daily_report.dart';
import '../models/student.dart';
import '../services/firestore_service.dart';
import '../utils/date_utils.dart' as du;

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});
  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _focusedDay  = DateTime.now();
  DateTime? _selectedDay;

  Map<DateTime, List<DailyReport>> _events      = {};
  Map<DateTime, Set<String>>       _submittedIds = {};

  List<DailyReport> _selectedEvents = [];
  List<Student>     _allStudents    = [];
  bool _loading = false;

  // 멤버별 고정 색상 (최대 9명)
  static const List<Color> _memberColors = [
    Color(0xFF3498db), // 파랑
    Color(0xFF27ae60), // 초록
    Color(0xFFe74c3c), // 빨강
    Color(0xFF9b59b6), // 보라
    Color(0xFFf39c12), // 주황
    Color(0xFF1abc9c), // 청록
    Color(0xFFe67e22), // 진주황
    Color(0xFF2980b9), // 진파랑
    Color(0xFF8e44ad), // 진보라
  ];

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now();
    _loadStudents().then((_) => _loadMonth(_focusedDay));
  }

  DateTime _norm(DateTime d) => DateTime(d.year, d.month, d.day);

  Future<void> _loadStudents() async {
    final list = await context.read<FirestoreService>().getStudents();
    if (mounted) setState(() => _allStudents = list);
  }

  Future<void> _loadMonth(DateTime month) async {
    setState(() => _loading = true);
    try {
      final svc   = context.read<FirestoreService>();
      final start = DateTime(month.year, month.month, 1);
      final end   = DateTime(month.year, month.month + 1, 0);
      final reports = await svc.getDailyReports(
        startDate: du.DateUtils.formatDate(start),
        endDate:   du.DateUtils.formatDate(end),
      );

      final Map<DateTime, List<DailyReport>> events    = {};
      final Map<DateTime, Set<String>>       submitted = {};

      for (final r in reports) {
        if (r.reportDate.isEmpty) continue;
        try {
          final dt = _norm(DateTime.parse(r.reportDate));
          events[dt]    ??= [];
          submitted[dt] ??= {};
          events[dt]!.add(r);
          submitted[dt]!.add(r.studentId);
        } catch (_) {}
      }

      if (mounted) {
        setState(() {
          _events       = events;
          _submittedIds = submitted;
          if (_selectedDay != null) {
            _selectedEvents = _events[_norm(_selectedDay!)] ?? [];
          }
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('데이터 로드 실패: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<DailyReport> _getEvents(DateTime day) => _events[_norm(day)] ?? [];

  /// 학생 ID → 색상 (등록 순서 기반 고정)
  Color _colorForStudent(String studentId) {
    final idx = _allStudents.indexWhere((s) => s.id == studentId);
    if (idx < 0) return Colors.grey;
    return _memberColors[idx % _memberColors.length];
  }

  /// 해당 날짜에 제출한 학생들의 색상 목록
  List<Color> _colorsForDay(DateTime day) {
    final ids = _submittedIds[_norm(day)] ?? {};
    // 등록 순서 유지
    return _allStudents
        .where((s) => ids.contains(s.id))
        .map((s) => _colorForStudent(s.id))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            child: TableCalendar<DailyReport>(
              firstDay: DateTime(2020),
              lastDay: DateTime(2030),
              focusedDay: _focusedDay,
              selectedDayPredicate: (d) => isSameDay(_selectedDay, d),
              eventLoader: _getEvents,
              rowHeight: 64, // 동그라미를 위한 충분한 높이
              calendarBuilders: CalendarBuilders(
                // ── 동그라미 마커 (인원수만큼) ──────────────────────────
                markerBuilder: (context, day, events) {
                  if (events.isEmpty) return const SizedBox.shrink();
                  final colors = _colorsForDay(day);
                  if (colors.isEmpty) return const SizedBox.shrink();
                  final total  = _allStudents.length;
                  final allDone = colors.length >= total && total > 0;

                  return Positioned(
                    bottom: 4,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: _DotRow(
                        colors: colors,
                        total: total,
                        allDone: allDone,
                      ),
                    ),
                  );
                },
              ),
              calendarStyle: CalendarStyle(
                selectedDecoration: const BoxDecoration(
                  color: Color(0xFF2c3e50), shape: BoxShape.circle,
                ),
                todayDecoration: BoxDecoration(
                  color: const Color(0xFF2c3e50).withValues(alpha: 0.25),
                  shape: BoxShape.circle,
                ),
                weekendTextStyle: const TextStyle(color: Color(0xFFe74c3c)),
                markersMaxCount: 0, // custom builder 사용하므로 기본 마커 숨김
              ),
              headerStyle: const HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
                titleTextStyle: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: Color(0xFF2c3e50),
                ),
              ),
              onDaySelected: (selected, focused) {
                setState(() {
                  _selectedDay    = selected;
                  _focusedDay     = focused;
                  _selectedEvents = _getEvents(selected);
                });
              },
              onPageChanged: (focused) {
                _focusedDay = focused;
                _loadMonth(focused);
              },
            ),
          ),

          // ── 범례: 멤버별 색상 ───────────────────────────────────────
          if (_allStudents.isNotEmpty)
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(10, 4, 10, 10),
              child: Wrap(
                spacing: 8,
                runSpacing: 4,
                children: List.generate(_allStudents.length, (i) {
                  final s     = _allStudents[i];
                  final color = _memberColors[i % _memberColors.length];
                  final short = _shortNameStr(s.name);
                  return Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 9, height: 9,
                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 3),
                      Text(short, style: const TextStyle(fontSize: 10, color: Color(0xFF555555))),
                    ],
                  );
                }),
              ),
            ),

          const Divider(height: 1),

          // ── 선택 날짜: 제출 현황 패널 ──────────────────────────────
          if (_selectedDay != null)
            _buildSubmissionPanel(_selectedDay!),

          // ── 보고서 목록 ────────────────────────────────────────────
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF2c3e50)))
                : _selectedEvents.isEmpty
                    ? _emptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _selectedEvents.length,
                        itemBuilder: (_, i) => _eventTile(_selectedEvents[i]),
                      ),
          ),
        ],
      ),
    );
  }

  // ── 제출 현황 패널 ─────────────────────────────────────────────────
  Widget _buildSubmissionPanel(DateTime day) {
    if (_allStudents.isEmpty) return const SizedBox.shrink();
    final norm       = _norm(day);
    final submitted  = _submittedIds[norm] ?? {};
    final notYet     = _allStudents.where((s) => !submitted.contains(s.id)).toList();
    final total      = _allStudents.length;
    final doneCount  = submitted.length;
    final allDone    = doneCount >= total && total > 0;

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(14, 8, 14, 10),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // 헤더
        Row(children: [
          Icon(
            allDone ? Icons.check_circle : Icons.pending,
            size: 15,
            color: allDone ? const Color(0xFF27ae60) : const Color(0xFFe67e22),
          ),
          const SizedBox(width: 6),
          Text(
            allDone
                ? '전원 제출 완료 ($doneCount/$total)'
                : '제출 현황 ($doneCount/$total)',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: allDone ? const Color(0xFF27ae60) : const Color(0xFFe67e22),
            ),
          ),
        ]),
        const SizedBox(height: 8),

        // 멤버별 동그라미 + 이름 (전원 표시)
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: _allStudents.map((s) {
            final idx      = _allStudents.indexOf(s);
            final color    = _memberColors[idx % _memberColors.length];
            final done     = submitted.contains(s.id);
            final shortN   = _shortNameStr(s.name);
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: done
                    ? color.withValues(alpha: 0.12)
                    : Colors.grey.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: done ? color.withValues(alpha: 0.4) : Colors.grey.shade300,
                ),
              ),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                Container(
                  width: 9, height: 9,
                  decoration: BoxDecoration(
                    color: done ? color : Colors.grey.shade400,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 5),
                Text(
                  shortN,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: done ? color : Colors.grey.shade500,
                  ),
                ),
                const SizedBox(width: 4),
                Icon(
                  done ? Icons.check : Icons.remove,
                  size: 11,
                  color: done ? color : Colors.grey.shade400,
                ),
              ]),
            );
          }).toList(),
        ),

        // 미제출자 강조
        if (notYet.isNotEmpty) ...[
          const SizedBox(height: 6),
          Text(
            '미제출: ${notYet.map((s) => _shortNameStr(s.name)).join(', ')}',
            style: const TextStyle(
              fontSize: 11,
              color: Color(0xFFe74c3c),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ]),
    );
  }

  String _shortName(Student s) => _shortNameStr(s.name);
  String _shortNameStr(String name) {
    final match = RegExp(r'\((.+)\)').firstMatch(name);
    if (match != null) return match.group(1)!;
    return name.split(' ').first;
  }

  Widget _emptyState() => Center(
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.event_note, size: 44, color: Colors.grey.shade300),
      const SizedBox(height: 10),
      Text(
        _selectedDay != null
            ? '${du.DateUtils.formatDisplayDate(du.DateUtils.formatDate(_selectedDay!))}\n제출된 보고서 없음'
            : '날짜를 선택하세요',
        textAlign: TextAlign.center,
        style: TextStyle(color: Colors.grey.shade400, fontSize: 14),
      ),
    ]),
  );

  Widget _eventTile(DailyReport r) {
    final idx   = _allStudents.indexWhere((s) => s.id == r.studentId);
    final color = idx >= 0 ? _memberColors[idx % _memberColors.length] : const Color(0xFF2c3e50);

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4, offset: const Offset(0, 2)),
        ],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          leading: CircleAvatar(
            backgroundColor: color,
            radius: 18,
            child: Text(
              r.studentName.isNotEmpty ? r.studentName[0] : '?',
              style: const TextStyle(
                color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold,
              ),
            ),
          ),
          title: Text(r.studentName,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          subtitle: Text(r.workHours,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Divider(),
                const Text('업무 내용',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                      color: Color(0xFF2c3e50),
                    )),
                const SizedBox(height: 4),
                Text(r.todayWork,
                    style: const TextStyle(fontSize: 13, height: 1.5)),
                if (r.notes.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  const Text('비고',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                        color: Color(0xFF2c3e50),
                      )),
                  const SizedBox(height: 4),
                  Text(r.notes,
                      style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
                ],
              ]),
            ),
          ],
        ),
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════
// 인원수만큼 동그라미를 렌더링하는 위젯
// 최대 9개 → 2줄까지 표시
// ══════════════════════════════════════════════════════════════════
class _DotRow extends StatelessWidget {
  final List<Color> colors;
  final int         total;
  final bool        allDone;

  const _DotRow({
    required this.colors,
    required this.total,
    required this.allDone,
  });

  @override
  Widget build(BuildContext context) {
    // 동그라미 크기: 인원이 많을수록 약간 작게
    const double dotSize = 6.0;
    const double spacing = 2.0;
    final int count = colors.length;

    // 최대 한 줄에 표시 (캘린더 칸이 작으므로 최대 5개까지 한 줄)
    const int maxPerRow = 5;
    final List<Widget> rows = [];
    for (int i = 0; i < count; i += maxPerRow) {
      final rowColors = colors.sublist(i, i + maxPerRow > count ? count : i + maxPerRow);
      rows.add(
        Row(
          mainAxisSize: MainAxisSize.min,
          children: rowColors.map((c) => Container(
            width: dotSize,
            height: dotSize,
            margin: const EdgeInsets.symmetric(horizontal: spacing / 2),
            decoration: BoxDecoration(
              color: c,
              shape: BoxShape.circle,
              // 전원 제출 시 테두리 강조
              border: allDone
                  ? Border.all(color: Colors.white, width: 0.5)
                  : null,
            ),
          )).toList(),
        ),
      );
      if (rows.length >= 2) break; // 최대 2줄
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: rows,
    );
  }
}
