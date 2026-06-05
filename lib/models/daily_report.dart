class DailyReport {
  final String id;
  final String studentId;
  final String studentName;
  final String reportDate;
  final String todayWork;
  final String workHours;
  final String notes;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  DailyReport({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.reportDate,
    required this.todayWork,
    required this.workHours,
    this.notes = '',
    this.createdAt,
    this.updatedAt,
  });

  factory DailyReport.fromFirestore(Map<String, dynamic> data, String docId) {
    return DailyReport(
      id: docId,
      studentId: data['student_id'] as String? ?? '',
      studentName: data['student_name'] as String? ?? '',
      reportDate: data['report_date'] as String? ?? '',
      todayWork: data['today_work'] as String? ?? '',
      workHours: data['work_hours'] as String? ?? '',
      notes: data['notes'] as String? ?? '',
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
    'report_date': reportDate,
    'today_work': todayWork,
    'work_hours': workHours,
    'notes': notes,
  };
}
