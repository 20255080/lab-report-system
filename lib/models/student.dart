class Student {
  final String id;
  final String name;
  final String email;
  final String status;

  Student({
    required this.id,
    required this.name,
    required this.email,
    this.status = '',
  });

  factory Student.fromFirestore(Map<String, dynamic> data, String docId) {
    return Student(
      id: data['id'] as String? ?? docId,
      name: data['name'] as String? ?? '',
      email: data['email'] as String? ?? '',
      status: data['status'] as String? ?? '',
    );
  }

  Map<String, dynamic> toFirestore() => {
    'id': id,
    'name': name,
    'email': email,
    'status': status,
  };
}
