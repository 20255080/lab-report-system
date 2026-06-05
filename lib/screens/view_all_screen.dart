import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/student.dart';
import '../models/daily_report.dart';
import '../models/weekly_report.dart';
import '../models/feedback.dart';
import '../services/firestore_service.dart';
import '../utils/date_utils.dart' as du;

class ViewAllScreen extends StatefulWidget {
  const ViewAllScreen({super.key});
  @override
  State<ViewAllScreen> createState() => _ViewAllScreenState();
}

class _ViewAllScreenState extends State<ViewAllScreen> {
  List<Student> _students = [];
  String _selectedStudentId = '';
  String _viewType = 'daily';
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 7));
  DateTime _endDate = DateTime.now();

  List<DailyReport>  _dailyResults  = [];
  List<WeeklyReport> _weeklyResults = [];
  bool _loading = false;
  bool _searched = false;

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  Future<void> _loadStudents() async {
    final list = await context.read<FirestoreService>().getStudents();
    if (mounted) setState(() => _students = list);
  }

  Future<void> _search() async {
    setState(() { _loading = true; _searched = true; _dailyResults = []; _weeklyResults = []; });
    try {
      final svc = context.read<FirestoreService>();
      if (_viewType == 'daily') {
        final r = await svc.getDailyReports(
          studentId: _selectedStudentId.isEmpty ? null : _selectedStudentId,
          startDate: du.DateUtils.formatDate(_startDate),
          endDate:   du.DateUtils.formatDate(_endDate),
        );
        if (mounted) setState(() => _dailyResults = r);
      } else {
        final r = await svc.getWeeklyReports(
          studentId: _selectedStudentId.isEmpty ? null : _selectedStudentId,
        );
        if (mounted) setState(() => _weeklyResults = r);
      }
    } catch (e) {
      if (mounted) _snack('검색 실패: $e', Colors.red);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _pickDate(bool isStart) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isStart ? _startDate : _endDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = picked;
        } else {
          _endDate = picked;
        }
      });
    }
  }

  void _snack(String msg, [Color? color]) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: Column(
        children: [
          _buildFilterPanel(),
          const Divider(height: 1),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF2c3e50)))
                : !_searched
                    ? _empty('검색 조건을 설정하고 검색 버튼을 눌러주세요.', Icons.search)
                    : _viewType == 'daily'
                        ? _buildDailyList()
                        : _buildWeeklyList(),
          ),
        ],
      ),
    );
  }

  // ── Filter panel ───────────────────────────────────────────────
  Widget _buildFilterPanel() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(14),
      child: Column(
        children: [
          Row(children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                value: _selectedStudentId.isEmpty ? '' : _selectedStudentId,
                isExpanded: true,
                decoration: _inputDeco('구성원'),
                items: [
                  const DropdownMenuItem(value: '', child: Text('전체 구성원')),
                  ..._students.map((s) => DropdownMenuItem(
                        value: s.id,
                        child: Text(s.name, overflow: TextOverflow.ellipsis),
                      )),
                ],
                onChanged: (v) => setState(() => _selectedStudentId = v ?? ''),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: DropdownButtonFormField<String>(
                value: _viewType,
                decoration: _inputDeco('조회 유형'),
                items: const [
                  DropdownMenuItem(value: 'daily',  child: Text('일일 보고서')),
                  DropdownMenuItem(value: 'weekly', child: Text('주간 요약')),
                ],
                onChanged: (v) => setState(() => _viewType = v ?? 'daily'),
              ),
            ),
          ]),
          if (_viewType == 'daily') ...[
            const SizedBox(height: 10),
            Row(children: [
              Expanded(child: _datePicker('시작일', _startDate, () => _pickDate(true))),
              const SizedBox(width: 10),
              Expanded(child: _datePicker('종료일', _endDate,   () => _pickDate(false))),
            ]),
          ],
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _loading ? null : _search,
              icon: const Icon(Icons.search),
              label: const Text('검색'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2c3e50),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Daily list ─────────────────────────────────────────────────
  Widget _buildDailyList() {
    if (_dailyResults.isEmpty) return _empty('검색 결과가 없습니다.', Icons.inbox);
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: _dailyResults.length,
      itemBuilder: (_, i) => _DailyReportCard(report: _dailyResults[i]),
    );
  }

  // ── Weekly list ────────────────────────────────────────────────
  Widget _buildWeeklyList() {
    if (_weeklyResults.isEmpty) return _empty('검색 결과가 없습니다.', Icons.inbox);
    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: _weeklyResults.length,
      itemBuilder: (_, i) => _WeeklyReportCard(report: _weeklyResults[i]),
    );
  }

  // ── Helpers ────────────────────────────────────────────────────
  Widget _empty(String msg, IconData icon) => Center(
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(icon, size: 52, color: Colors.grey.shade300),
      const SizedBox(height: 14),
      Text(msg, style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
    ]),
  );

  Widget _datePicker(String label, DateTime date, VoidCallback onTap) =>
      InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade400),
            borderRadius: BorderRadius.circular(8),
            color: Colors.grey.shade50,
          ),
          child: Row(children: [
            Icon(Icons.calendar_today, size: 14, color: Colors.grey.shade600),
            const SizedBox(width: 6),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
              Text(du.DateUtils.formatDisplayDate(du.DateUtils.formatDate(date)),
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
            ]),
          ]),
        ),
      );

  InputDecoration _inputDeco(String label) => InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 12),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        isDense: true,
      );
}

// ══════════════════════════════════════════════════════════════════
// Daily Report Card with Feedback
// ══════════════════════════════════════════════════════════════════
class _DailyReportCard extends StatefulWidget {
  final DailyReport report;
  const _DailyReportCard({required this.report});
  @override
  State<_DailyReportCard> createState() => _DailyReportCardState();
}

class _DailyReportCardState extends State<_DailyReportCard> {
  List<LabFeedback> _feedbacks = [];
  bool _fbLoaded = false;
  bool _showFbForm = false;
  final _byCtrl      = TextEditingController();
  final _contentCtrl = TextEditingController();
  bool _saving = false;

  @override
  void dispose() {
    _byCtrl.dispose();
    _contentCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadFeedbacks() async {
    if (_fbLoaded) return;
    final list = await context.read<FirestoreService>()
        .getFeedbacks(widget.report.id, 'daily');
    if (mounted) setState(() { _feedbacks = list; _fbLoaded = true; });
  }

  Future<void> _saveFeedback() async {
    if (_byCtrl.text.trim().isEmpty || _contentCtrl.text.trim().isEmpty) return;
    setState(() => _saving = true);
    try {
      final fb = await context.read<FirestoreService>().saveFeedback(
        reportId:        widget.report.id,
        reportType:      'daily',
        feedbackBy:      _byCtrl.text.trim(),
        feedbackContent: _contentCtrl.text.trim(),
      );
      setState(() {
        _feedbacks.insert(0, fb);
        _showFbForm = false;
        _byCtrl.clear();
        _contentCtrl.clear();
      });
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('피드백이 저장되었습니다.'), backgroundColor: Colors.teal),
      );
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('저장 실패: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _deleteFeedback(LabFeedback fb) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('피드백 삭제'),
        content: const Text('이 피드백을 삭제하시겠습니까?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('취소')),
          TextButton(onPressed: () => Navigator.pop(context, true),
              child: const Text('삭제', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (ok != true) return;
    await context.read<FirestoreService>().deleteFeedback(fb.id);
    setState(() => _feedbacks.removeWhere((f) => f.id == fb.id));
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.report;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 6, offset: const Offset(0, 2))],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          onExpansionChanged: (open) { if (open) _loadFeedbacks(); },
          tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          leading: CircleAvatar(
            backgroundColor: const Color(0xFF2c3e50),
            radius: 18,
            child: Text(r.studentName.isNotEmpty ? r.studentName[0] : '?',
                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
          ),
          title: Text(r.studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          subtitle: Text(du.DateUtils.formatDisplayDate(r.reportDate),
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF27ae60).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(r.workHours,
                style: const TextStyle(color: Color(0xFF27ae60), fontSize: 11, fontWeight: FontWeight.w600)),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Divider(),
                // 업무 내용
                _sectionLabel('업무 내용'),
                const SizedBox(height: 4),
                Text(r.todayWork, style: const TextStyle(fontSize: 13, height: 1.5)),
                if (r.notes.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  _sectionLabel('비고'),
                  const SizedBox(height: 4),
                  Text(r.notes, style: TextStyle(fontSize: 13, color: Colors.grey.shade700)),
                ],
                const SizedBox(height: 14),
                // Feedback 헤더
                Row(children: [
                  _sectionLabel('교수님 피드백'),
                  const SizedBox(width: 6),
                  if (_feedbacks.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFf39c12).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('${_feedbacks.length}',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFe67e22))),
                    ),
                  const Spacer(),
                  TextButton.icon(
                    onPressed: () => setState(() => _showFbForm = !_showFbForm),
                    icon: Icon(_showFbForm ? Icons.close : Icons.add_comment, size: 16),
                    label: Text(_showFbForm ? '취소' : '피드백 작성', style: const TextStyle(fontSize: 12)),
                    style: TextButton.styleFrom(foregroundColor: const Color(0xFF2c3e50)),
                  ),
                ]),
                // 피드백 작성 폼
                if (_showFbForm) _buildFeedbackForm(),
                // 기존 피드백 목록
                if (!_fbLoaded && !_showFbForm)
                  const SizedBox.shrink()
                else
                  ..._feedbacks.map((fb) => _feedbackItem(fb)),
                if (_fbLoaded && _feedbacks.isEmpty && !_showFbForm)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: Text('아직 피드백이 없습니다.',
                        style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
                  ),
              ]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeedbackForm() {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF9E6),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFf39c12).withValues(alpha: 0.4)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        TextField(
          controller: _byCtrl,
          decoration: InputDecoration(
            hintText: '작성자 (예: Prof. Lee)',
            hintStyle: TextStyle(fontSize: 12, color: Colors.grey.shade400),
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            filled: true, fillColor: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _contentCtrl,
          maxLines: 3,
          decoration: InputDecoration(
            hintText: '피드백 내용을 입력하세요',
            hintStyle: TextStyle(fontSize: 12, color: Colors.grey.shade400),
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            filled: true, fillColor: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(
            child: ElevatedButton(
              onPressed: _saving ? null : _saveFeedback,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF27ae60),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
              ),
              child: _saving
                  ? const SizedBox(width: 14, height: 14,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                  : const Text('저장', style: TextStyle(fontSize: 13)),
            ),
          ),
        ]),
      ]),
    );
  }

  Widget _feedbackItem(LabFeedback fb) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F5E9),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF27ae60).withValues(alpha: 0.3)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Icon(Icons.person, size: 14, color: Color(0xFF1976d2)),
          const SizedBox(width: 4),
          Text(fb.feedbackBy,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF1976d2))),
          const Spacer(),
          Text(du.DateUtils.formatDisplayDate(fb.feedbackDate),
              style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: () => _deleteFeedback(fb),
            child: const Icon(Icons.delete_outline, size: 16, color: Colors.red),
          ),
        ]),
        const SizedBox(height: 6),
        Text(fb.feedbackContent, style: const TextStyle(fontSize: 13, height: 1.5)),
      ]),
    );
  }

  Widget _sectionLabel(String text) => Text(text,
      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Color(0xFF2c3e50)));
}

// ══════════════════════════════════════════════════════════════════
// Weekly Report Card with Feedback
// ══════════════════════════════════════════════════════════════════
class _WeeklyReportCard extends StatefulWidget {
  final WeeklyReport report;
  const _WeeklyReportCard({required this.report});
  @override
  State<_WeeklyReportCard> createState() => _WeeklyReportCardState();
}

class _WeeklyReportCardState extends State<_WeeklyReportCard> {
  List<LabFeedback> _feedbacks = [];
  bool _fbLoaded = false;
  bool _showFbForm = false;
  final _byCtrl      = TextEditingController();
  final _contentCtrl = TextEditingController();
  bool _saving = false;

  @override
  void dispose() {
    _byCtrl.dispose();
    _contentCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadFeedbacks() async {
    if (_fbLoaded) return;
    final list = await context.read<FirestoreService>()
        .getFeedbacks(widget.report.id, 'weekly');
    if (mounted) setState(() { _feedbacks = list; _fbLoaded = true; });
  }

  Future<void> _saveFeedback() async {
    if (_byCtrl.text.trim().isEmpty || _contentCtrl.text.trim().isEmpty) return;
    setState(() => _saving = true);
    try {
      final fb = await context.read<FirestoreService>().saveFeedback(
        reportId:        widget.report.id,
        reportType:      'weekly',
        feedbackBy:      _byCtrl.text.trim(),
        feedbackContent: _contentCtrl.text.trim(),
      );
      setState(() {
        _feedbacks.insert(0, fb);
        _showFbForm = false;
        _byCtrl.clear();
        _contentCtrl.clear();
      });
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('피드백이 저장되었습니다.'), backgroundColor: Colors.teal),
      );
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('저장 실패: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _deleteFeedback(LabFeedback fb) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('피드백 삭제'),
        content: const Text('이 피드백을 삭제하시겠습니까?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('취소')),
          TextButton(onPressed: () => Navigator.pop(context, true),
              child: const Text('삭제', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (ok != true) return;
    await context.read<FirestoreService>().deleteFeedback(fb.id);
    setState(() => _feedbacks.removeWhere((f) => f.id == fb.id));
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.report;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 6, offset: const Offset(0, 2))],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          onExpansionChanged: (open) { if (open) _loadFeedbacks(); },
          tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
          leading: CircleAvatar(
            backgroundColor: const Color(0xFF8e44ad),
            radius: 18,
            child: Text(r.studentName.isNotEmpty ? r.studentName[0] : '?',
                style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
          ),
          title: Text(r.studentName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          subtitle: Text('${r.year}년 제${r.week}주',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF2980b9).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(r.weekRange.replaceAll(' ', '\n'),
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF2980b9), fontSize: 10, fontWeight: FontWeight.w600)),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Divider(),
                _sectionLabel('주간 업무 요약'),
                const SizedBox(height: 4),
                Text(r.weeklySummary, style: const TextStyle(fontSize: 13, height: 1.5)),
                const SizedBox(height: 14),
                // Feedback 헤더
                Row(children: [
                  _sectionLabel('교수님 피드백'),
                  const SizedBox(width: 6),
                  if (_feedbacks.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFf39c12).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('${_feedbacks.length}',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFe67e22))),
                    ),
                  const Spacer(),
                  TextButton.icon(
                    onPressed: () => setState(() => _showFbForm = !_showFbForm),
                    icon: Icon(_showFbForm ? Icons.close : Icons.add_comment, size: 16),
                    label: Text(_showFbForm ? '취소' : '피드백 작성', style: const TextStyle(fontSize: 12)),
                    style: TextButton.styleFrom(foregroundColor: const Color(0xFF2c3e50)),
                  ),
                ]),
                if (_showFbForm) _buildFeedbackForm(),
                ..._feedbacks.map((fb) => _feedbackItemWidget(fb)),
                if (_fbLoaded && _feedbacks.isEmpty && !_showFbForm)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: Text('아직 피드백이 없습니다.',
                        style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
                  ),
              ]),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeedbackForm() {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF9E6),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFf39c12).withValues(alpha: 0.4)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        TextField(
          controller: _byCtrl,
          decoration: InputDecoration(
            hintText: '작성자 (예: Prof. Lee)',
            hintStyle: TextStyle(fontSize: 12, color: Colors.grey.shade400),
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            filled: true, fillColor: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _contentCtrl,
          maxLines: 3,
          decoration: InputDecoration(
            hintText: '피드백 내용을 입력하세요',
            hintStyle: TextStyle(fontSize: 12, color: Colors.grey.shade400),
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(6)),
            filled: true, fillColor: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _saving ? null : _saveFeedback,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF27ae60),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
            ),
            child: _saving
                ? const SizedBox(width: 14, height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Text('저장', style: TextStyle(fontSize: 13)),
          ),
        ),
      ]),
    );
  }

  Widget _feedbackItemWidget(LabFeedback fb) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F5E9),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF27ae60).withValues(alpha: 0.3)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Icon(Icons.person, size: 14, color: Color(0xFF1976d2)),
          const SizedBox(width: 4),
          Text(fb.feedbackBy,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF1976d2))),
          const Spacer(),
          Text(du.DateUtils.formatDisplayDate(fb.feedbackDate),
              style: TextStyle(fontSize: 10, color: Colors.grey.shade500)),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: () => _deleteFeedback(fb),
            child: const Icon(Icons.delete_outline, size: 16, color: Colors.red),
          ),
        ]),
        const SizedBox(height: 6),
        Text(fb.feedbackContent, style: const TextStyle(fontSize: 13, height: 1.5)),
      ]),
    );
  }

  Widget _sectionLabel(String text) => Text(text,
      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Color(0xFF2c3e50)));
}
