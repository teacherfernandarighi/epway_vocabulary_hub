export function formatContextString(val: any): string {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(', ');
  }
  if (typeof val === 'string') {
    return val
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ');
  }
  return String(val);
}

export function parseToList(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    return val
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [String(val).trim()].filter(Boolean);
}
