class LabFeedback {
  final String id;
  final String reportId;
  final String reportType; // 'daily' | 'weekly'
  final String feedbackBy;
  final String feedbackContent;
  final String feedbackDate;
  final DateTime? createdAt;

  LabFeedback({
    required this.id,
    required this.reportId,
    required this.reportType,
    required this.feedbackBy,
    required this.feedbackContent,
    required this.feedbackDate,
    this.createdAt,
  });

  factory LabFeedback.fromFirestore(Map<String, dynamic> data, String docId) {
    return LabFeedback(
      id: docId,
      reportId: data['report_id'] as String? ?? '',
      reportType: data['report_type'] as String? ?? 'daily',
      feedbackBy: data['feedback_by'] as String? ?? '',
      feedbackContent: data['feedback_content'] as String? ?? '',
      feedbackDate: data['feedback_date'] as String? ?? '',
      createdAt: data['created_at'] != null
          ? (data['created_at'] as dynamic).toDate()
          : null,
    );
  }

  Map<String, dynamic> toFirestore() => {
    'report_id': reportId,
    'report_type': reportType,
    'feedback_by': feedbackBy,
    'feedback_content': feedbackContent,
    'feedback_date': feedbackDate,
  };
}
