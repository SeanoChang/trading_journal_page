export function getTimeColor(age: number): string {
  // Recent (0-7 days): bright green
  // Medium (7-30 days): blue
  // Old (30+ days): purple/gray
  if (age <= 7) return "#22c55e";
  if (age <= 30) return "#3b82f6";
  if (age <= 90) return "#8b5cf6";
  return "#64748b";
}

export function calculateAge(createdAt: string): number {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  return Math.max(0, (now - created) / (1000 * 60 * 60 * 24)); // days
}
