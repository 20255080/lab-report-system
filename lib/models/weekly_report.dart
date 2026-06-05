class WeeklyReport {
  final String id;
  final String studentId;
  final String studentName;
  final int year;
  final int week;
  final String weekRange;
  final String weeklySummary;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  WeeklyReport({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.year,
    required this.week,
    required this.weekRange,
    required this.weeklySummary,
    this.createdAt,
    this.updatedAt,
  });

  factory WeeklyReport.fromFirestore(Map<String, dynamic> data, String docId) {
    return WeeklyReport(
      id: docId,
      studentId: data['student_id'] as String? ?? '',
      studentName: data['student_name'] as String? ?? '',
      year: (data['year'] as num?)?.toInt() ?? 0,
      week: (data['week'] as num?)?.toInt() ?? 0,
      weekRange: data['week_range'] as String? ?? '',
      weeklySummary: data['weekly_summary'] as String? ?? '',
      createdAt: data['created_at'] != null
          ? (data['created_at'] as dynamic).toDate()
          : null,
      updatedAt: data['updated_at'] != null
          ? (data['updated_at'] as dynamic).toDate()
          : null,
    );
  }

  Map<String, dynamic> toFirestore() => {
    'student_id': studentId,
    'student_name': studentName,
    'year': year,
    'week': week,
    'week_range': weekRange,
    'weekly_summary': weeklySummary,
  };
}
