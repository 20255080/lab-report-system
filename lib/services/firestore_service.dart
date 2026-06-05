import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/student.dart';
import '../models/daily_report.dart';
import '../models/weekly_report.dart';
import '../models/feedback.dart';

import '../utils/date_utils.dart' as du;

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // ─── Collections ───────────────────────────────────────────────
  CollectionReference get _students   => _db.collection('students');
  CollectionReference get _daily      => _db.collection('daily_reports');
  CollectionReference get _weekly     => _db.collection('weekly_summaries');
  CollectionReference get _feedbacks  => _db.collection('feedbacks');

  // ─── Students ──────────────────────────────────────────────────
  Future<List<Student>> getStudents() async {
    final snap = await _students.orderBy('id').get();
    return snap.docs
        .map((d) => Student.fromFirestore(d.data() as Map<String, dynamic>, d.id))
        .toList();
  }

  Future<void> initStudentsIfEmpty() async {
    final snap = await _students.limit(1).get();
    if (snap.docs.isNotEmpty) return;

    final initial = [
      {'id': 'STU001', 'name': 'Minkee Cho (조민기)',    'email': 'minki@lab.ac.kr',   'status': ''},
      {'id': 'STU002', 'name': 'Lee Hye-bin (이혜빈)',   'email': 'hyebin@lab.ac.kr',  'status': ''},
      {'id': 'STU003', 'name': 'Yoo Sung-il (유성일)',   'email': 'seongil@lab.ac.kr', 'status': ''},
      {'id': 'STU004', 'name': 'Kim Su-jin (김수진)',    'email': 'sujin@lab.ac.kr',   'status': ''},
      {'id': 'STU005', 'name': 'Kim Dong-woo (김동우)', 'email': 'dongwoo@lab.ac.kr', 'status': ''},
      {'id': 'STU006', 'name': 'Song Da-ye (송다예)',    'email': 'daye@lab.ac.kr',    'status': ''},
      {'id': 'STU007', 'name': 'Kim Dong-jin (김동진)', 'email': 'dongjin@lab.ac.kr', 'status': ''},
      {'id': 'STU008', 'name': 'Saqib',                  'email': 'saqib@lab.ac.kr',   'status': ''},
      {'id': 'STU009', 'name': 'Jo Yu-kyung (조유경)',  'email': 'yukyung@lab.ac.kr', 'status': ''},
    ];
    final batch = _db.batch();
    for (final s in initial) {
      batch.set(_students.doc(s['id']), s);
    }
    await batch.commit();
  }

  // ─── Daily Reports ─────────────────────────────────────────────
  Future<DailyReport?> getDailyReport(String studentId, String date) async {
    final snap = await _daily
        .where('student_id', isEqualTo: studentId)
        .where('report_date', isEqualTo: date)
        .limit(1)
        .get();
    if (snap.docs.isEmpty) return null;
    final doc = snap.docs.first;
    return DailyReport.fromFirestore(doc.data() as Map<String, dynamic>, doc.id);
  }

  Future<void> saveDailyReport(DailyReport report) async {
    final existing = await getDailyReport(report.studentId, report.reportDate);
    if (existing != null) {
      await _daily.doc(existing.id).update({
        ...report.toFirestore(),
        'updated_at': FieldValue.serverTimestamp(),
      });
    } else {
      await _daily.add({
        ...report.toFirestore(),
        'created_at': FieldValue.serverTimestamp(),
        'updated_at': FieldValue.serverTimestamp(),
      });
    }
  }

  Future<List<DailyReport>> getDailyReports({
    String? studentId,
    String? startDate,
    String? endDate,
  }) async {
    Query query = _daily;
    if (studentId != null && studentId.isNotEmpty) {
      query = query.where('student_id', isEqualTo: studentId);
    }
    final snap = await query.get();
    var reports = snap.docs
        .map((d) => DailyReport.fromFirestore(d.data() as Map<String, dynamic>, d.id))
        .toList();

    if (startDate != null && startDate.isNotEmpty) {
      reports = reports.where((r) => r.reportDate.compareTo(startDate) >= 0).toList();
    }
    if (endDate != null && endDate.isNotEmpty) {
      reports = reports.where((r) => r.reportDate.compareTo(endDate) <= 0).toList();
    }
    reports.sort((a, b) => b.reportDate.compareTo(a.reportDate));
    return reports;
  }

  /// 특정 날짜에 보고서를 제출한 student_id Set 반환
  Future<Set<String>> getSubmittedStudentIdsForDate(String date) async {
    final snap = await _daily.where('report_date', isEqualTo: date).get();
    return snap.docs
        .map((d) => (d.data() as Map<String, dynamic>)['student_id'] as String? ?? '')
        .where((id) => id.isNotEmpty)
        .toSet();
  }

  // ─── Weekly Reports ────────────────────────────────────────────
  Future<WeeklyReport?> getWeeklyReport(String studentId, int year, int week) async {
    final snap = await _weekly
        .where('student_id', isEqualTo: studentId)
        .where('year', isEqualTo: year)
        .where('week', isEqualTo: week)
        .limit(1)
        .get();
    if (snap.docs.isEmpty) return null;
    final doc = snap.docs.first;
    return WeeklyReport.fromFirestore(doc.data() as Map<String, dynamic>, doc.id);
  }

  Future<void> saveWeeklyReport(WeeklyReport report) async {
    final existing = await getWeeklyReport(report.studentId, report.year, report.week);
    if (existing != null) {
      await _weekly.doc(existing.id).update({
        ...report.toFirestore(),
        'updated_at': FieldValue.serverTimestamp(),
      });
    } else {
      await _weekly.add({
        ...report.toFirestore(),
        'created_at': FieldValue.serverTimestamp(),
        'updated_at': FieldValue.serverTimestamp(),
      });
    }
  }

  Future<List<WeeklyReport>> getWeeklyReports({String? studentId}) async {
    Query query = _weekly;
    if (studentId != null && studentId.isNotEmpty) {
      query = query.where('student_id', isEqualTo: studentId);
    }
    final snap = await query.get();
    final reports = snap.docs
        .map((d) => WeeklyReport.fromFirestore(d.data() as Map<String, dynamic>, d.id))
        .toList();
    reports.sort((a, b) {
      if (a.year != b.year) return b.year - a.year;
      return b.week - a.week;
    });
    return reports;
  }

  // ─── Feedbacks ─────────────────────────────────────────────────
  Future<List<LabFeedback>> getFeedbacks(String reportId, String reportType) async {
    try {
      final snap = await _feedbacks
          .where('report_id', isEqualTo: reportId)
          .where('report_type', isEqualTo: reportType)
          .get();
      final list = snap.docs
          .map((d) => LabFeedback.fromFirestore(d.data() as Map<String, dynamic>, d.id))
          .toList();
      list.sort((a, b) {
        final ta = a.createdAt?.millisecondsSinceEpoch ?? 0;
        final tb = b.createdAt?.millisecondsSinceEpoch ?? 0;
        return tb.compareTo(ta);
      });
      return list;
    } catch (_) {
      // Fallback: query without report_type filter
      final snap = await _feedbacks.where('report_id', isEqualTo: reportId).get();
      final list = snap.docs
          .map((d) => LabFeedback.fromFirestore(d.data() as Map<String, dynamic>, d.id))
          .where((f) => f.reportType == reportType)
          .toList();
      list.sort((a, b) {
        final ta = a.createdAt?.millisecondsSinceEpoch ?? 0;
        final tb = b.createdAt?.millisecondsSinceEpoch ?? 0;
        return tb.compareTo(ta);
      });
      return list;
    }
  }

  Future<LabFeedback> saveFeedback({
    required String reportId,
    required String reportType,
    required String feedbackBy,
    required String feedbackContent,
  }) async {
    final now = du.DateUtils.formatDate(DateTime.now());
    final data = {
      'report_id': reportId,
      'report_type': reportType,
      'feedback_by': feedbackBy,
      'feedback_content': feedbackContent,
      'feedback_date': now,
      'created_at': FieldValue.serverTimestamp(),
    };
    final ref = await _feedbacks.add(data);
    return LabFeedback(
      id: ref.id,
      reportId: reportId,
      reportType: reportType,
      feedbackBy: feedbackBy,
      feedbackContent: feedbackContent,
      feedbackDate: now,
    );
  }

  Future<void> deleteFeedback(String feedbackId) async {
    await _feedbacks.doc(feedbackId).delete();
  }
}
