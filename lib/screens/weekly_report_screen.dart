import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/student.dart';
import '../models/weekly_report.dart';
import '../services/firestore_service.dart';
import '../utils/date_utils.dart' as du;

class WeeklyReportScreen extends StatefulWidget {
  const WeeklyReportScreen({super.key});

  @override
  State<WeeklyReportScreen> createState() => _WeeklyReportScreenState();
}

class _WeeklyReportScreenState extends State<WeeklyReportScreen> {
  final _formKey = GlobalKey<FormState>();
  final _summaryCtrl = TextEditingController();

  List<Student> _students = [];
  Student? _selectedStudent;
  DateTime _selectedDate = DateTime.now();
  bool _loading = false;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  @override
  void dispose() {
    _summaryCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadStudents() async {
    final svc = context.read<FirestoreService>();
    final list = await svc.getStudents();
    if (mounted) setState(() => _students = list);
  }

  Future<void> _loadExisting() async {
    if (_selectedStudent == null) return;
    setState(() => _loading = true);
    try {
      final svc = context.read<FirestoreService>();
      final wn = du.DateUtils.getWeekNumber(_selectedDate);
      final report = await svc.getWeeklyReport(
        _selectedStudent!.id,
        wn['year']!,
        wn['week']!,
      );
      if (report != null) {
        _summaryCtrl.text = report.weeklySummary;
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('기존 주간 요약을 불러왔습니다.'),
              backgroundColor: Colors.teal,
            ),
          );
        }
      } else {
        _summaryCtrl.clear();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('해당 주차에 저장된 요약이 없습니다.')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('불러오기 실패: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedStudent == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('구성원을 선택해 주세요.'), backgroundColor: Colors.orange),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      final svc = context.read<FirestoreService>();
      final wn = du.DateUtils.getWeekNumber(_selectedDate);
      final report = WeeklyReport(
        id: '',
        studentId: _selectedStudent!.id,
        studentName: _selectedStudent!.name,
        year: wn['year']!,
        week: wn['week']!,
        weekRange: du.DateUtils.getWeekRange(_selectedDate),
        weeklySummary: _summaryCtrl.text.trim(),
      );
      await svc.saveWeeklyReport(report);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('주간 보고서가 저장되었습니다.'),
            backgroundColor: Colors.teal,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('저장 실패: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
      if (_selectedStudent != null) _loadExisting();
    }
  }

  String get _weekInfo {
    final wn = du.DateUtils.getWeekNumber(_selectedDate);
    final range = du.DateUtils.getWeekRange(_selectedDate);
    return '${wn['year']}년 제${wn['week']}주 ($range)';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF2c3e50)))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _sectionHeader('주간 업무 보고서', Icons.date_range),
                    const SizedBox(height: 16),
                    _card([
                      _label('구성원 *'),
                      DropdownButtonFormField<Student>(
                        value: _selectedStudent,
                        isExpanded: true,
                        decoration: _inputDeco('구성원 선택'),
                        items: _students
                            .map((s) => DropdownMenuItem(
                                  value: s,
                                  child: Text(s.name, overflow: TextOverflow.ellipsis),
                                ))
                            .toList(),
                        onChanged: (s) {
                          setState(() => _selectedStudent = s);
                          _loadExisting();
                        },
                        validator: (v) => v == null ? '구성원을 선택해 주세요' : null,
                      ),
                      const SizedBox(height: 16),
                      _label('기준 날짜 *'),
                      InkWell(
                        onTap: _pickDate,
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey.shade400),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.calendar_today, size: 18, color: Color(0xFF2c3e50)),
                              const SizedBox(width: 8),
                              Text(
                                du.DateUtils.formatDisplayDate(du.DateUtils.formatDate(_selectedDate)),
                                style: const TextStyle(fontSize: 15),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2c3e50).withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.info_outline, size: 14, color: Color(0xFF2c3e50)),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                _weekInfo,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF2c3e50),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ]),
                    const SizedBox(height: 12),
                    _card([
                      _label('주간 업무 요약 *'),
                      TextFormField(
                        controller: _summaryCtrl,
                        maxLines: 8,
                        decoration: _inputDeco('이번 주에 수행한 주요 업무를 입력하세요'),
                        validator: (v) =>
                            (v == null || v.trim().isEmpty) ? '주간 업무 요약을 입력해 주세요' : null,
                      ),
                    ]),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _saving ? null : _save,
                            icon: _saving
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Icon(Icons.save),
                            label: Text(_saving ? '저장 중...' : '저장'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2c3e50),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _loading ? null : _loadExisting,
                            icon: const Icon(Icons.download),
                            label: const Text('이번 주 보고서 불러오기'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF2c3e50),
                              side: const BorderSide(color: Color(0xFF2c3e50)),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _sectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF2c3e50), size: 22),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2c3e50),
          ),
        ),
      ],
    );
  }

  Widget _card(List<Widget> children) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  Widget _label(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        text,
        style: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 13,
          color: Color(0xFF2c3e50),
        ),
      ),
    );
  }

  InputDecoration _inputDeco(String hint) => InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade400),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade400),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Color(0xFF2c3e50), width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        filled: true,
        fillColor: Colors.grey.shade50,
      );
}
