export function mapReportToIcon(report, type) {
  if (!report) return null;
  const lower = report.toLowerCase();

  if (lower.includes('activity')) return 'activity';
  if (lower.includes('medicine')) return 'medication';
  if (lower.includes('nutrition')) return 'nutrition';
  if (lower.includes('sleep') || lower.includes('wake')) {
    if (type === 'Going to Sleep') return 'sleepStart';
    if (type === 'Waking Up') return 'sleepEnd';
    return 'sleep';
  }
  return null;
}
