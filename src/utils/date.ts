const display = new Intl.DateTimeFormat('zh-CN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return display.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
