class DateUtils {
  static String formatDate(DateTime date) {
    final y = date.year;
    final m = date.month.toString().padLeft(2, '0');
    final d = date.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  static Map<String, int> getWeekNumber(DateTime date) {
    final d = DateTime.utc(date.year, date.month, date.day);
    int dayNum = d.weekday; // Mon=1, Sun=7
    final thursday = d.add(Duration(days: 4 - dayNum));
    final yearStart = DateTime.utc(thursday.year, 1, 1);
    final weekNo = ((thursday.difference(yearStart).inDays) / 7).ceil() + 1;
    return {'year': thursday.year, 'week': weekNo};
  }

  static String getWeekRange(DateTime date) {
    int day = date.weekday; // Mon=1
    final monday = date.subtract(Duration(days: day - 1));
    final sunday = monday.add(const Duration(days: 6));
    return '${formatDate(monday)} ~ ${formatDate(sunday)}';
  }

  static String formatDisplayDate(String dateStr) {
    if (dateStr.isEmpty) return '';
    try {
      final dt = DateTime.parse(dateStr);
      return '${dt.year}.${dt.month.toString().padLeft(2, '0')}.${dt.day.toString().padLeft(2, '0')}';
    } catch (_) {
      return dateStr;
    }
  }
}
