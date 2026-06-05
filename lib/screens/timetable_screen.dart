import 'package:flutter/material.dart';
import '../models/student.dart';
import '../services/firestore_service.dart';
import 'package:provider/provider.dart';

// ──────────────────────────────────────────────────────────────────
// Timetable data (same as web version)
// ──────────────────────────────────────────────────────────────────
class _ClassInfo {
  final String day;
  final String time;
  final String course;
  final String prof;
  final String room;
  const _ClassInfo({
    required this.day,
    required this.time,
    required this.course,
    required this.prof,
    required this.room,
  });
}

final Map<String, List<_ClassInfo>> _memberSchedules = {
  'Kim Dong-jin (김동진)': [
    _ClassInfo(day: 'Tue', time: '09:00-10:15', course: 'Climate-Environment Modeling', prof: 'Prof. Myong-In Lee', room: '110-1107'),
    _ClassInfo(day: 'Tue', time: '13:00-14:15', course: 'Wastewater Microbiology', prof: 'Prof. Changsoo Lee', room: '110-1105'),
    _ClassInfo(day: 'Thu', time: '09:00-10:15', course: 'Climate-Environment Modeling', prof: 'Prof. Myong-In Lee', room: '110-1107'),
    _ClassInfo(day: 'Thu', time: '13:00-14:15', course: 'Wastewater Microbiology', prof: 'Prof. Changsoo Lee', room: '110-1105'),
    _ClassInfo(day: 'Mon', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', prof: 'Prof. Sung-Deuk Choi', room: '110-1009'),
    _ClassInfo(day: 'Wed', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', prof: 'Prof. Sung-Deuk Choi', room: '110-1009'),
    _ClassInfo(day: 'Thu', time: '16:00-17:15', course: 'Seminar', prof: 'Prof. Myong-In Lee', room: '110-1007'),
  ],
  'Kim Dong-woo (김동우)': [
    _ClassInfo(day: 'Tue', time: '13:00-14:15', course: 'Wastewater Microbiology', prof: 'Prof. Changsoo Lee', room: '110-1105'),
    _ClassInfo(day: 'Thu', time: '13:00-14:15', course: 'Wastewater Microbiology', prof: 'Prof. Changsoo Lee', room: '110-1105'),
  ],
  'Saqib': [
    _ClassInfo(day: 'Mon', time: '10:30-11:45', course: 'Water Chemistry', prof: 'Prof. Young-Nam Kwon', room: '110-1105'),
    _ClassInfo(day: 'Tue', time: '13:00-14:15', course: 'Wastewater Microbiology', prof: 'Prof. Changsoo Lee', room: '110-1105'),
    _ClassInfo(day: 'Wed', time: '10:30-11:45', course: 'Water Chemistry', prof: 'Prof. Young-Nam Kwon', room: '110-1105'),
    _ClassInfo(day: 'Thu', time: '13:00-14:15', course: 'Wastewater Microbiology', prof: 'Prof. Changsoo Lee', room: '110-1105'),
    _ClassInfo(day: 'Mon', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', prof: 'Prof. Sung-Deuk Choi', room: '110-1009'),
    _ClassInfo(day: 'Wed', time: '16:00-17:15', course: 'Introduction to Environmental Analysis', prof: 'Prof. Sung-Deuk Choi', room: '110-1009'),
    _ClassInfo(day: 'Thu', time: '16:00-17:15', course: 'Seminar', prof: 'Prof. Myong-In Lee', room: '110-1007'),
  ],
  'Kim Su-jin (김수진)': [
    _ClassInfo(day: 'Tue', time: '14:30-17:15', course: 'Disaster Theory and Practice', prof: 'Prof. Jibum Chung', room: '110-1009'),
  ],
  'Jo Yu-kyung (조유경)': [
    _ClassInfo(day: 'Tue', time: '14:30-17:15', course: 'Disaster Theory and Practice', prof: 'Prof. Jibum Chung', room: '110-1009'),
    _ClassInfo(day: 'Thu', time: '09:00-11:45', course: 'Theory of Planning', prof: 'Prof. Gihyoug Cho', room: '110-1014'),
  ],
};

const _dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

class TimetableScreen extends StatefulWidget {
  const TimetableScreen({super.key});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  List<Student> _students = [];
  String _selectedMember = '';

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  Future<void> _loadStudents() async {
    final svc = context.read<FirestoreService>();
    final list = await svc.getStudents();
    if (mounted) setState(() => _students = list);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: Column(
        children: [
          // Header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'BLESS 시간표 - 2026년 1학기',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF2c3e50)),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: _selectedMember.isEmpty ? '' : _selectedMember,
                  isExpanded: true,
                  decoration: InputDecoration(
                    labelText: '구성원 선택',
                    labelStyle: const TextStyle(fontSize: 12),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    isDense: true,
                  ),
                  items: [
                    const DropdownMenuItem(value: '', child: Text('전체 시간표')),
                    ..._students
                        .where((s) => _memberSchedules.containsKey(s.name))
                        .map((s) => DropdownMenuItem(
                              value: s.name,
                              child: Text(s.name, overflow: TextOverflow.ellipsis),
                            )),
                  ],
                  onChanged: (v) => setState(() => _selectedMember = v ?? ''),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          // Timetable content
          Expanded(
            child: _selectedMember.isEmpty
                ? _buildFullTimetable()
                : _buildMemberTimetable(_selectedMember),
          ),
        ],
      ),
    );
  }

  Widget _buildMemberTimetable(String member) {
    final schedule = _memberSchedules[member] ?? [];
    if (schedule.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.event_busy, size: 48, color: Colors.grey.shade300),
            const SizedBox(height: 12),
            Text('등록된 수업이 없습니다.', style: TextStyle(color: Colors.grey.shade500)),
          ],
        ),
      );
    }

    final sorted = List<_ClassInfo>.from(schedule);
    sorted.sort((a, b) {
      final da = _dayOrder.indexOf(a.day);
      final db = _dayOrder.indexOf(b.day);
      if (da != db) return da - db;
      return a.time.compareTo(b.time);
    });

    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        Text(
          '$member의 시간표',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF2c3e50)),
        ),
        const SizedBox(height: 10),
        ...sorted.map((c) => _classCard(c)),
      ],
    );
  }

  Widget _classCard(_ClassInfo c) {
    final Color color = _dayColor(c.day);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4, offset: const Offset(0, 2)),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            Container(
              width: 5,
              decoration: BoxDecoration(
                color: color,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(10),
                  bottomLeft: Radius.circular(10),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(c.day, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 8),
                        Text(c.time, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(c.course, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.person_outline, size: 12, color: Colors.grey.shade500),
                        const SizedBox(width: 4),
                        Expanded(child: Text(c.prof, style: TextStyle(fontSize: 12, color: Colors.grey.shade600))),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Icon(Icons.room_outlined, size: 12, color: Colors.grey.shade500),
                        const SizedBox(width: 4),
                        Text(c.room, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFullTimetable() {
    // Collect all unique courses per day/time
    final Map<String, Map<String, List<String>>> timetable = {}; // day -> time -> students
    _memberSchedules.forEach((member, classes) {
      for (final c in classes) {
        timetable[c.day] ??= {};
        timetable[c.day]![c.time] ??= [];
        timetable[c.day]![c.time]!.add('${member.split('(').last.replaceAll(')', '')} - ${c.course}');
      }
    });

    final days = _dayOrder.where((d) => timetable.containsKey(d)).toList();
    final times = timetable.values
        .expand((v) => v.keys)
        .toSet()
        .toList()
      ..sort();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: times.map((time) {
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 4),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: const BoxDecoration(
                    color: Color(0xFF2c3e50),
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(10),
                      topRight: Radius.circular(10),
                    ),
                  ),
                  child: Text(
                    time,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),
                ...days.where((d) => timetable[d]!.containsKey(time)).map((day) {
                  final entries = timetable[day]![time]!;
                  return Padding(
                    padding: const EdgeInsets.fromLTRB(14, 8, 14, 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: _dayColor(day).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(day, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _dayColor(day))),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: entries.map((e) => Padding(
                              padding: const EdgeInsets.only(bottom: 2),
                              child: Text(e, style: const TextStyle(fontSize: 12)),
                            )).toList(),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Color _dayColor(String day) {
    switch (day) {
      case 'Mon': return const Color(0xFF3498db);
      case 'Tue': return const Color(0xFF27ae60);
      case 'Wed': return const Color(0xFFe67e22);
      case 'Thu': return const Color(0xFF9b59b6);
      case 'Fri': return const Color(0xFFe74c3c);
      default: return const Color(0xFF2c3e50);
    }
  }
}
